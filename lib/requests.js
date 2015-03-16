(function() {
  var root = this;

  function splitHeaderInKeyValuePair(row) {
    var row = row.split(':');
    var key, value;
    if (row.length >= 2) {
      key = row.shift();
      value = row.join(':').trimLeft();
    }

    return key && value ? {key: key, value: value} : null;
  };

  // Response
  function Response(http) {
    var text = http.responseText;
    var status = http.status;
    var rawHeaders = http.getAllResponseHeaders(), headers;

    function parseJson() {
      try {
        return JSON.parse(text);
      } catch(e) {
        return null;
      }
    }

    function readHeaders(header) {
      // @todo: Needs more work...
      if (headers === undefined) {
        headers = {};
        if (rawHeaders) {
          var headerRows = rawHeaders.split('\r\n');
          for (var i in headerRows) {
            var row = splitHeaderInKeyValuePair(headerRows[i]);
            if (row) {
              if (headers.hasOwnProperty(row.key)) {
                if (headers[row.key] instanceof Array) {
                  headers[row.key].push(row.value);
                } else {
                  headers[row.key] = [headers[row.key], row.value];
                }
              } else {
                headers[row.key] = row.value;
              }
            }
          }
        }
      }

      if (header) {
        return headers && headers.hasOwnProperty(header) ? headers[header] : null;
      }

      return headers;
    }

    return  {
      headers: readHeaders,
      json   : parseJson,
      status : status,
      text   : text
    };
  };

  function Request(method, url) {
    var response, onComplete = [], paramsData, headersData;
    var self = this;

    // Attributes
    self.url          = url;
    self.method       = method;

    // Complete
    self.then = function(func) {
      if (typeof(func) === 'function') {
        onComplete.push(func);
      }

      if (response) {
        var actions = onComplete.slice(0);
        onComplete = [];
        for (var i in actions) {
          actions[i].call(response);
        }
      }

      return self;
    };

    // Headers
    self.headers = function Headers(data) {
      if (typeof(data) !== 'object') {
        throw new TypeError("Headers needs to be an object");
      }

      headersData = data;
      return self;
    };

    self.headers.add = function(key, value) {
      if (!headersData) headersData = [];
      headersData[key] = value;
    };

    self.headers.get = function(key) {
      return headersData.hasOwnProperty(key) ? headersData[key] : null;
    };

    self.headers.all = function() {
      return headersData || [];
    };

    // Params
    self.params = function Params(data) {
      if (typeof(data) !== 'object') {
        throw new TypeError("Params needs to be an object");
      }

      paramsData = data;

      return self;
    };

    self.params.query = function(prefix) {
      var arr = [];
      for(var key in paramsData) {
        arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(paramsData[key]));
      }

      return arr.length > 0 ? prefix + arr.join("&") : "";
    };

    self.params.add = function(key, value) {
      if (!paramsData) paramsData = [];
      paramsData[key] = value;
    };

    self.exec = function() {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
          response = new Response(xmlhttp);
          self.then();
        }
      }

      if (self.method === 'GET') {
        xmlhttp.open(self.method, self.url + self.params.query("?"), true);

        // Set headers
        for (var i in self.headers.all()) {
          xmlhttp.setRequestHeader(i, self.headers[i]);
        }

        xmlhttp.send();
      } else {
        var data = self.params.query("");

        xmlhttp.open(self.method, self.url, true);
        if (!self.headers['Content-type']) {
          xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }

        // Set headers
        for (var i in self.headers.all()) {
          xmlhttp.setRequestHeader(i, self.headers[i]);
        }

        xmlhttp.send(data);
      }

      return self;
    };

    return self;
  }

  var requests = {};

  // Make verbs callable
  var verbs = ['get', 'post', 'put', 'delete', 'head', 'options'];

  for (var x in verbs) {
    var verb = verbs[x];
    (function(requests, verb) {
      requests[verb] = function(url) {
        if (typeof url !== 'string') {
          throw new TypeError('requests: First parameter needs to be a string');
        }

        return new Request(verb, url);
      }
    })(requests, verb);
  }

  // Expose status codes (source: wikipedia.)
  requests.codes = {
    // 1xx Informational
    "continue": 100,
    "switching_protocol": 101,
    "processing": 102,
    // 2xx Success
    "ok": 200,
    "created": 201,
    "accepted": 202,
    "non_authoritative_information": 203,
    "no_content": 204,
    "reset_content": 205,
    "partial_content": 206,
    "multi_status": 207,
    "already_reported": 208,
    "im_used": 226,
    // 3xx Redirection
    "multiple_choices": 300,
    "moved_permanently": 301,
    "found": 302,
    "see_other": 303,
    "not_modified": 304,
    "use_proxy": 305,
    "switch_proxy": 306,
    "temporary_redirect": 307,
    "permanent_redirect": 308,
    // 4xx Client error
    "bad_request": 400,
    "unauthorized": 401,
    "payment_required": 402,
    "forbidden": 403,
    "not_found": 404,
    "method_not_allowed": 405,
    "not_acceptable": 406,
    "proxy_authentication_required": 407,
    "request_timeout": 408,
    "conflict": 409,
    "gone": 410,
    "length_required": 411,
    "precondition_failed": 412,
    "request_entity_too_large": 413,
    "request_uri_too_long": 414,
    "unsupported_media_type": 415,
    "requested_range_not_satisfiable": 416,
    "expectation_failed": 417,
    "im_a_teapot": 418,
    "authentication_timeout": 419,
    "method_failure": 420,
    "enhance_your_calm": 420,
    "unprocessable_entity": 422,
    "locked": 423,
    "failed_dependency": 424,
    "upgrade_required": 426,
    "precondition_required": 428,
    "too_many_requests": 429,
    "request_header_fields_too_large": 431,
    "login_timeout": 440,
    "no_response": 444,
    "retry_with": 449,
    "blocked_by_windows_parental_controls": 450,
    "unavailable_for_legal_reasons": 451,
    "redirect": 451,
    "request_header_too_large": 494,
    "cert_error": 495,
    "no_cert": 496,
    "http_to_https": 497,
    "token_expired_invalid": 498,
    "client_closed_request": 499,
    "token_required": 499,
    // 5xx Server error
    "internal_server_error": 500,
    "not_implemented": 501,
    "bad_gateway": 502,
    "service_unavailable": 503,
    "gateway_timeout": 504,
    "http_version_not_supported": 505,
    "variant_also_negotiates": 506,
    "insufficient_storage": 507,
    "loop_detected": 508,
    "bandwidth_limit_exceeded": 509,
    "not_extended": 510,
    "network_authentication_required": 511,
    "network_read_timeout_error": 598,
    "network_connect_timeout_error": 599
  };

  // AMD / RequireJS
  if (typeof define !== 'undefined' && define.amd) {
    define([], function () {
      return requests;
    });
  }
  // included directly via <script> tag
  else {
    root.requests = requests;
  }
}());
