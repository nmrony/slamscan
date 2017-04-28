var rewire = require('rewire');
var slamscan = rewire('../src/slamscan');
var sinon = require('sinon');

describe('download', function() {
  describe('when missing a bucket', function() {
    it('should callback with error', function(done) {
      var s3 = slamscan.getS3();
      var stub = sinon.stub(s3, 'getObject');
      stub.yields();
      slamscan.download(s3, '', '', function(err) {
        err.should.match(/Error/);
        done(err);
      });
    });
  });

  describe('when missing a key', function() {
    it('should callback with error', function(done) {
      var s3 = slamscan.getS3();
      var stub = sinon.stub(s3, 'getObject');
      stub.yields();
      slamscan.download(s3, 'bucket', '', function(err) {
        err.should.match(/Error/);
        done(err);
      });
    });
  });

  describe('when given a valid bucket and key', function() {
    it('should return a temp file', function(done) {
      var s3 = slamscan.getS3();
      var stub = sinon.stub(s3, 'getObject');
      slamscan.download(s3, 'bucket', 'key', function(err) {
        stub.calledWith({
          Bucket: 'bucket',
          Key: 'key',
        }).should.be.exactly(true);
        done(err);
      });
    });
  });
});

describe('scan', function() {
  describe('when given EICAR-AV-Test', function() {
    it('should return a virus', function(done) {
      var eicarAvTest = __dirname + '/samples/EICAR-AV-Test';
      var clamscan = slamscan.getClamscan();
      var stub = sinon.stub(clamscan, 'is_infected');
      slamscan.scan(stub, eicarAvTest, function(err, file, isInfected) {
        stub.yield(null, eicarAvTest, true);
        isInfected.should.be.exactly(true);
        done(err);
      });
    });
  });
});


describe('downloadClamscanDbFiles', function() {
  describe('when files do not exist', function() {
    it('should download files', function(done) {
      slamscan.downloadClamscanDbFiles(function(err) {
        done(err);
      });
    });
  });
});

