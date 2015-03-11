describe('requests', function(){

  describe('#get()', function(){
    it('should complete with a status code', function(done){
      requests
        .get('sample/sample.json')
        .exec()
        .then(function(){
          this.response.status_code.should.be.greaterThan(-1);
          done();
        });
    });

    it('should generate query string', function(done){
      var request = requests
        .get('sample/sample.json')
        .params({"x": 10, "y": 20});

      request.params.query("?").should.equal("?x=10&y=20");
      done();
    });

    it('should run all then functions in the right order', function(done){
      var request = requests.get('sample/sample.json').exec();

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
      var request = requests.get('sample/sample.json').exec();
      var completes = 0;
      request.then(function() {
        this.response.should.be.an.Object;
        done();
      });
    });

  });

  describe('#post()', function(){
    it('should complete with a status code', function(done){
      requests
          .post('sample/sample.json')
          .exec()
          .then(function(){
            this.response.status_code.should.be.greaterThan(-1);
            done();
          });
    });
  });

  describe('#put()', function(){
    it('should complete with a status code', function(done){
      requests
          .put('sample/sample.json')
          .exec()
          .then(function(){
            this.response.status_code.should.be.greaterThan(-1);
            done();
          });
    });
  });

  describe('#delete()', function(){
    it('should complete with a status code', function(done){
      requests
          .delete('sample/sample.json')
          .exec()
          .then(function(){
            this.response.status_code.should.be.greaterThan(-1);
            done();
          });
    });
  });

  describe('#head()', function(){
    it('should complete with a status code', function(done){
      requests
          .head('sample/sample.json')
          .exec()
          .then(function(){
            this.response.status_code.should.be.greaterThan(-1);
            done();
          });
    });
  });

  describe('#options()', function(){
    it('should complete with a status code', function(done){
      requests
          .options('sample/sample.json')
          .exec()
          .then(function(){
            this.response.status_code.should.be.greaterThan(-1);
            done();
          });
    });
  });

});
