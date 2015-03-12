describe('Request', function(){
  var server;

  before(function() {
    server = sinon.fakeServer.create();
  });

  after(function() {
    server.restore();
  });

  describe('Headers', function() {

  });

  describe('Params', function(){

    describe('#query()', function(){

      it('should generate query string', function(done){
        server.respondWith("GET", "/resource.json",
              [200, { "Content-Type": "application/json" },
               '[{ "id": 12, "comment": "Hey there" }]']);
        server.autoRespond = true;

        var request = requests.get('/resource');

        request.params({"x": 10, "y": 20});
        request.params.query("?").should.equal("?x=10&y=20");

        request.params.add("z", 40);
        request.params.query("?").should.equal("?x=10&y=20&z=40");

        request.params({"a": 100});
        request.params.query("?").should.equal("?a=100");

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
