describe('Response', function(){
  var server;

  before(function() {
    server = sinon.fakeServer.create();
  });

  after(function() {
    server.restore();
  });

  describe('#json()', function() {

    it('should return a javascript object if response is json', function(done){
      server.respondWith("GET", "/resource",
            [200, { "Content-Type": "application/json" },
             '[{ "id": 12, "comment": "Hey there" }]']);
      server.autoRespond = true;

      var request = requests
          .get('/resource')
          .exec()
          .then(function(){
            var json = this.json();
            json.length.should.be.exactly(1);
            json[0].id.should.be.exactly(12);
            json[0].comment.should.be.eql('Hey there');
            done();
          });
    });

    it('should return null if response is not json', function(done){
      server.respondWith("GET", "/resource",
            [200, { "Content-Type": "text/html" },
             'Something else']);
      server.autoRespond = true;

      var request = requests
          .get('/resource')
          .exec()
          .then(function(){
            var json = this.json();
            (json === null).should.be.true;
            done();
          });
    });

    it('should return null if response is malformed json', function(done){
      server.respondWith("GET", "/resource",
            [200, { "Content-Type": "application/json" },
             '[1,2,]']);
      server.autoRespond = true;

      var request = requests
          .get('/resource')
          .exec()
          .then(function(){
            var json = this.json();
            (json === null).should.be.true;
            done();
          });
    });

  });


  describe('#headers()', function() {

    it('should return a header that exists', function(done){
      server.respondWith("GET", "/resource",
            [200, { "Transfer-Encoding": "chunked",
            "Date": "Sat, 28 Nov 2009 04:36:25 GMT",
            "Server": "LiteSpeed",
            "Connection": "close",
            "X-Powered-By": "W3 Total Cache/0.8",
            "Pragma": "public",
            "Expires": "Sat, 28 Nov 2009 05:36:25 GMT",
            "Etag": '"pub1259380237;gz"',
            "Cache-Control": "max-age=3600, public",
            "Content-Type": "text/html; charset=UTF-8",
            "Last-Modified": "Sat, 28 Nov 2009 03:50:37 GMT",
            "X-Pingback": "http://www.example.org/xmlrpc.php",
            "Content-Encoding": "gzip",
            "Vary": "Accept-Encoding, Cookie, User-Agent" },
             'Hello, header world!']);
      server.autoRespond = true;

      var request = requests
          .get('/resource')
          .exec()
          .then(function(){
            this.headers('Content-Type').should.eql('text/html; charset=UTF-8');
            this.headers('Date').should.eql('Sat, 28 Nov 2009 04:36:25 GMT');
            this.headers('Server').should.eql('LiteSpeed');
            this.headers('Connection').should.eql('close');
            this.headers('X-Powered-By').should.eql('W3 Total Cache/0.8');
            this.headers('Pragma').should.eql('public');
            this.headers('Expires').should.eql('Sat, 28 Nov 2009 05:36:25 GMT');
            this.headers('Etag').should.eql('"pub1259380237;gz"');
            this.headers('Cache-Control').should.eql('max-age=3600, public');
            this.headers('Content-Type').should.eql('text/html; charset=UTF-8');
            this.headers('Last-Modified').should.eql('Sat, 28 Nov 2009 03:50:37 GMT');
            this.headers('X-Pingback').should.eql('http://www.example.org/xmlrpc.php');
            this.headers('Content-Encoding').should.eql('gzip');
            this.headers('Vary').should.eql('Accept-Encoding, Cookie, User-Agent');
            done();
          });
    });

  });

});
