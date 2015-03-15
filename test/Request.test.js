describe('Request', function(){
  var server;

  before(function() {
    server = sinon.fakeServer.create();
  });

  after(function() {
    server.restore();
  });

  describe('Headers', function() {

    describe('#headers()', function() {

      it('should generate query string', function(done){
        var request = requests.get('/resource');

        request.headers({
          'Accept': 'text/plain',
          'Content-Length': 1234,
        });
        request.headers.get('Accept').should.eql('text/plain');
        request.headers.get('Content-Length').should.eql(1234);

        request.headers.add('Accept', 'text/html');
        request.headers.get('Accept').should.eql('text/html');

        request.headers.add('Accept-Encoding', 'gzip');
        Object.keys(request.headers.all()).length.should.be.exactly(3);

        done();
      });

    });

  });

  describe('Params', function(){

    describe('#query()', function(){

      it('should generate query string', function(done){
        var request = requests.get('/resource');

        request.params({"x": 10, "y": 20});
        request.params.query("?").should.equal("?x=10&y=20");

        request.params.add("z", 40);
        request.params.query("?").should.equal("?x=10&y=20&z=40");

        request.params({"a": 100});
        request.params.query("?").should.equal("?a=100");

        request.params({"a&bc": 100});
        request.params.query("?").should.equal("?a%26bc=100");

        done();
      });

      it('should generate an encoded query string', function(done){
        server.respondWith("GET", "/resource.json",
              [200, { "Content-Type": "application/json" },
               '[{ "id": 12, "comment": "Hey there" }]']);
        server.autoRespond = true;

        var request = requests.get('/resource');

        request.params({"a&bc": "y/x"});
        request.params.query("?").should.equal("?a%26bc=y%2Fx");

        request.params({"kött": "är mord"});
        request.params.query("?").should.equal("?k%C3%B6tt=%C3%A4r%20mord");

        done();
      });

    });

    describe('#add()', function(){

      it('should add key, value pair to the query string', function(done){
        server.respondWith("GET", "/resource.json",
              [200, { "Content-Type": "application/json" },
               '[{ "id": 12, "comment": "Hey there" }]']);
        server.autoRespond = true;

        var request = requests.get('/resource');

        request.params.add("z", 40);
        request.params.query("?").should.equal("?z=40");

        request.params({"x": 10, "y": 20});
        request.params.query("?").should.equal("?x=10&y=20");

        request.params.add("z", 40);
        request.params.query("?").should.equal("?x=10&y=20&z=40");

        done();
      });

    });

  });

  describe('#complete()', function() {

    it('should run all then functions in the right order', function(done){
      server.respondWith("GET", "/resource.json",
            [200, { "Content-Type": "application/json" },
             '[{ "id": 12, "comment": "Hey there" }]']);
      server.autoRespond = true;

      var request = requests.get('/resource');

      var completes = 0;
      request.then(function(){
        completes.should.be.exactly(0);
        completes++;
      }).then(function(){
        completes.should.be.exactly(1);
        completes++;
      }).then(function() {
        completes.should.be.exactly(2);
        done();
      });

      request.exec();
    });

    it('should run then even after completed', function(done){
      server.respondWith("GET", "/resource",
            [200, { "Content-Type": "application/json" },
             '[{ "id": 12, "comment": "Hey there" }]']);
      server.autoRespond = true;

      var request = requests.get('/resource').exec();
      var completes = 0;
      request.then(function() {
        this.status.should.be.exactly(200);
        done();
      });
    });

  });

});
