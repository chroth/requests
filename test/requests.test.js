describe('requests', function(){
  var server;

  before(function() {
    server = sinon.fakeServer.create();
  });

  after(function() {
    server.restore();
  });

  describe('#get()', function(){
    it('should complete with a status code', function(done){
      server.respondWith("GET", "/resource.json",
            [200, { "Content-Type": "application/json" },
             '[{ "id": 12, "comment": "Hey there" }]']);
      server.autoRespond = true;

      requests
        .get('/resource.json')
        .exec()
        .then(function(){
          this.response.status_code.should.be.exactly(200);
          done();
        });
    });

    it('should generate query string', function(done){
      var request = requests
        .get('/resource')
        .params({"x": 10, "y": 20});

      request.params.query("?").should.equal("?x=10&y=20");
      done();
    });

    it('should run all then functions in the right order', function(done){
      var request = requests.get('/resource').exec();

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
    });

    it('should run complete even after completed', function(done){
      var request = requests.get('/resource').exec();
      var completes = 0;
      request.then(function() {
        this.response.should.be.an.Object;
        done();
      });
    });

  });

  describe('#post()', function(){
    it('should complete with a status code', function(done){
      server.respondWith("POST", "/resource",
            [200, { "Content-Type": "application/json" },
             '[{ "id": 12, "comment": "Hey there" }]']);
      server.autoRespond = true;

      requests
          .post('/resource')
          .exec()
          .then(function(){
            this.response.status_code.should.be.exactly(200);
            done();
          });
    });
  });

  describe('#put()', function(){
    it('should complete with a status code', function(done){
      server.respondWith("PUT", "/resource",
            [200, { "Content-Type": "application/json" },
             '[{ "id": 12, "comment": "Hey there" }]']);
      server.autoRespond = true;

      requests
          .put('/resource')
          .exec()
          .then(function(){
            this.response.status_code.should.be.exactly(200);
            done();
          });
    });
  });

  describe('#delete()', function(){
    it('should complete with a status code', function(done){
      server.respondWith("DELETE", "/resource",
            [200, { "Content-Type": "application/json" },
             '[{ "id": 12, "comment": "Hey there" }]']);
      server.autoRespond = true;

      var request = requests
          .delete('/resource')
          .exec()
          .then(function(){
            this.response.status_code.should.be.exactly(200);
            this.response.text.should.be.eql('[{ "id": 12, "comment": "Hey there" }]');
            done();
          });
    });
  });

  describe('#head()', function(){
    it('should complete with a status code', function(done){
      server.respondWith("HEAD", "/resource",
            [200, { "Content-Type": "application/json" },
             '[{ "id": 12, "comment": "Hey there" }]']);
      server.autoRespond = true;

      requests
          .head('/resource')
          .exec()
          .then(function(){
            this.response.status_code.should.be.exactly(200);
            done();
          });
    });
  });

  describe('#options()', function(){
    it('should complete with a status code', function(done){
      server.respondWith("OPTIONS", "/resource",
            [200, { "Content-Type": "application/json" },
             '[{ "id": 12, "comment": "Hey there" }]']);
      server.autoRespond = true;

      requests
          .options('/resource')
          .exec()
          .then(function(){
            this.response.status_code.should.be.exactly(200);
            done();
          });
    });
  });

});
