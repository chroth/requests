requests.js
===========
Readable requests for the browser.

## Example usage

    // Get
    var request = requests.get('/search', requests.params({'q': 'requests'}))
        .complete(function() {
            console.log(this.response);
        });

    // Post
    var request = requests.post('/search', requests.params({'q': 'requests'}))
        .complete(function() {
            console.log(this.response);
        });
