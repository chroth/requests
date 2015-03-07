(function() {
  var root = this;

  function Params() {}
  function Headers() {}

  var Request = function(method, url, params, headers) {
    var isComplete = false, onComplete;
    var self = this;

    // Attributes
    self.request = {
      url: url,
      method: method,
      params: params
    };

    self.response = {
      status_code: -1,
      text: null
    };

    // Callbacks
    self.complete = function(func) {
      onComplete = func;
      if (isComplete) {
        onComplete.call(self);
      }

      return self;
    };

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4) {
        self.response.status_code = xmlhttp.status;
        self.response.text = xmlhttp.responseText;
        isComplete = true;
        if (typeof(onComplete) === 'function') {
          self.complete(onComplete);
        }
      }
    }

    xmlhttp.open(self.request.method, self.request.url, true);
    xmlhttp.send();

    return self;
  }

  var requests = {
    params: function() {
      return new Params(arguments);
    },
    headers: function() {
      return new Headers(arguments);
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
