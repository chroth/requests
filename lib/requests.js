(function() {
  var root = this;

  function Params(data) {
    this.data = data;

    this.query = function(prefix) {
      var arr = [];
      for(var key in data) {
        arr.push(key + "=" + data[key]);
      }

      return arr.length > 0 ? prefix + arr.join("&") : "";
    }
  }
  function Headers() {}

  var Request = function(method, url, params, headers) {
    var isComplete = false, onComplete = [];
    var self = this;

    params = params || new Params({});
    headers = headers || new Headers({});

    // Attributes
    self.url          = url;
    self.method       = method;
    self.params       = params;
    self.headers      = headers;
    self.response = {
      status_code: -1,
      text       : null
    };

    // Callbacks
    self.complete = function(func) {
      if (typeof(func) === 'function') {
        onComplete.push(func);
      }

      if (isComplete) {
        var actions = onComplete.slice(0);
        onComplete = [];
        for (var i in actions) {
          actions[i].call(self);
        }
      }

      return self;
    };

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        self.response.status_code = xmlhttp.status;
        self.response.text = xmlhttp.responseText;
        isComplete = true;
        self.complete();
      }
    }

    if (self.method === 'GET') {
      xmlhttp.open(self.method, self.url + self.params.query("?"), true);
      xmlhttp.send();
    } else {
      var data = self.params.query("");
      xmlhttp.open(self.method, self.url, true);
      xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xmlhttp.setRequestHeader("Content-length", data.length);
      xmlhttp.setRequestHeader("Connection", "close");

      xmlhttp.send(data);
    }

    return self;
  }

  var requests = {
    params: function(data) {
      return new Params(data);
    },
    headers: function(headers) {
      return new Headers(headers);
    },
  };

  // Make verbs callable
  var verbs = ['get', 'post', 'put', 'delete', 'head', 'options'];

  for (var x in verbs) {
    requests[verbs[x]] = function() {
      var url = arguments[0], params, headers, auth;

      if (typeof url !== 'string') {
        throw new Error('requests: First parameter needs to be a string');
      }

      for(var a in arguments) {
        if (arguments.hasOwnProperty(a)) {
          if (arguments[a] instanceof Params) {
            params = arguments[a];
          }
          if (arguments[a] instanceof Headers) {
            headers = arguments[a];
          }
        }
      }
      return new Request(verbs[x], url, params, headers, auth);
    }
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
