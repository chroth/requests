describe('requests', function(){
  var server;

  before(function() {
    server = sinon.fakeServer.create();
  });

  after(function() {
    server.restore();
  });

  describe('.codes', function(){
    it('should show status code', function(done){
      server.respondWith("GET", "/resource",
            [200, { "Content-Type": "application/json" },
             '[{ "id": 12, "comment": "Hey there" }]']);
      server.autoRespond = true;

      requests.codes.ok.should.be.exactly(200);
      requests.codes.not_found.should.be.exactly(404);
      requests.codes.internal_server_error.should.be.exactly(500);
      requests.codes.not_implemented.should.be.exactly(501);

      done();
    });
  });

  describe('#get()', function(){
    it('should complete with a status code', function(done){
      server.respondWith("GET", "/resource",
            [200, { "Content-Type": "application/json" },
             '[{ "id": 12, "comment": "Hey there" }]']);
      server.autoRespond = true;

      requests
        .get('/resource')
        .exec()
        .then(function(){
          this.status.should.be.exactly(200);
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
            this.status.should.be.exactly(200);
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
            this.status.should.be.exactly(200);
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
            this.status.should.be.exactly(200);
            this.text.should.be.eql('[{ "id": 12, "comment": "Hey there" }]');
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
            this.status.should.be.exactly(200);
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
            this.status.should.be.exactly(200);
            done();
          });
    });
  });

});
