(function() {
  var root = this;

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
            var row = headerRows[i].split(':');
            if (row.length >= 2) {
              var key = row.shift();
              var value = row.join(':').trimLeft();
              if (headers.hasOwnProperty(key)) {
                if (headers[key] instanceof Array) {
                  headers[key].push(value);
                } else {
                  headers[key] = [headers[key], value];
                }
              } else {
                headers[key] = value;
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
