(function() {
  var root = this;

  var Request = function(method, url) {
    var isComplete = false, onComplete = [], paramsData;
    var self = this;

    // Attributes
    self.url          = url;
    self.method       = method;
    self.response;

    // Response
    function Response(http) {
      return  {
        status_code: http.status,
        text       : http.responseText
      };
    };

    // Complete
    self.then = function(func) {
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

    // Params
    self.params = function Params(data) {
      paramsData = data;

      return self;
    };

    self.params.query = function(prefix) {
      var arr = [];
      for(var key in paramsData) {
        arr.push(key + "=" + paramsData[key]);
      }

      return arr.length > 0 ? prefix + arr.join("&") : "";
    };

    self.exec = function() {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
          self.response = new Response(xmlhttp);
          isComplete = true;
          self.then();
        }
      }

      if (self.method === 'GET') {
        console.log(self.url + self.params.query("?"));
        xmlhttp.open(self.method, self.url + self.params.query("?"), true);
        xmlhttp.send();
      } else {
        var data = self.params.query("");

        xmlhttp.open(self.method, self.url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

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
