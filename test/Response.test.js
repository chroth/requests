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

});
