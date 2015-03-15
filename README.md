requests.js
===========
Readable requests for the browser.

## Example usage

    // Get
    var request = requests
        .get('sample/sample.json')
        .params({'x': 10, 'y': 20})
        .headers({'Accept-Encoding': 'gzip', 'Accept': 'text/html'})
        .exec()
        .then(function(){
          console.log(this.status);
          console.log(this.text);
          console.log(this.headers());
          console.log(this.headers('Content-Type'));
          console.log(this.json());
        });

    // Post etc
    var request = requests
        .post('sample/sample.json')
        .params({'x': 10, 'y': 20})
        .headers({'Accept-Encoding': 'gzip', 'Accept': 'text/html'})
        .exec()
        .then(function(){
          console.log(this.status);
        });
