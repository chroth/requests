describe('requests', function(){
  describe('#get()', function(){
    it('should complete with a status code', function(done){
      var request = requests.get('sample/sample.json');
      request.complete(function(){
        this.response.status_code.should.be.greaterThan(-1);
        done();
      });
    });
  });
  describe('#post()', function(){
    it('should complete with a status code', function(done){
      var request = requests.post('sample/sample.json');
      request.complete(function(){
        this.response.status_code.should.be.greaterThan(-1);
        done();
      });
    });
  });
  describe('#put()', function(){
    it('should complete with a status code', function(done){
      var request = requests.put('sample/sample.json');
      request.complete(function(){
        this.response.status_code.should.be.greaterThan(-1);
        done();
      });
    });
  });
  describe('#delete()', function(){
    it('should complete with a status code', function(done){
      var request = requests.delete('sample/sample.json');
      request.complete(function(){
        this.response.status_code.should.be.greaterThan(-1);
        done();
      });
    });
  });
  describe('#head()', function(){
    it('should complete with a status code', function(done){
      var request = requests.head('sample/sample.json');
      request.complete(function(){
        this.response.status_code.should.be.greaterThan(-1);
        done();
      });
    });
  });
  describe('#options()', function(){
    it('should complete with a status code', function(done){
      var request = requests.options('sample/sample.json');
      request.complete(function(){
        this.response.status_code.should.be.greaterThan(-1);
        done();
      });
    });
  });
  describe('#params()', function(){
    it('should return a Params object', function(){
      var params = requests.params({'x': 10, 'y': 20});
      params.should.be.a.Object;
    });
  });
  describe('#headers()', function(){
    it('should return a Headers', function(){
      var params = requests.headers();
      params.should.be.a.Object;
    });
  });
});
