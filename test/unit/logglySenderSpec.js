'use strict';

/* jasmine specs for services go here */

var $httpBackend;

describe('logglyLogger Module:', function() {
  var logglyLoggerProvider,
      moduleTest = this,
      levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];

  beforeEach(function () {
    // Initialize the service provider
    // by injecting it to a fake module's config block
    var fakeModule = angular.module('testing.harness', ['logglyLogger'], function () {});
    fakeModule.config( function(LogglyLoggerProvider) {
      logglyLoggerProvider = LogglyLoggerProvider;
    });

    // Initialize test.app injector
    module('logglyLogger', 'testing.harness');

    // Kickstart the injectors previously registered
    // with calls to angular.mock.module
    inject(function() {});
  });

  describe( 'LogglyLogger', function() {

    var service, $log, message = "A test message";
    
    beforeEach(function () {
      inject(function ($injector) {
        service = $injector.get('LogglyLogger');
        service.attach();
        $httpBackend = $injector.get('$httpBackend');
        $log = $injector.get('$log');
      });
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should send a message object to the API', function() {
      
      var httpUrl = 'https://logs-01.loggly.com/inputs/test123456/tag/logglyLogger/';
      var token = 'test123456' ,userTag = 'logglyLogger';
      
      var promise, expected, actual;
      
      expected = /* Whatever is sent back */
      $httpBackend.whenPOST(httpUrl, message)
          .respond(expected);

      // act
      logglyLoggerProvider.inputToken(token);
      logglyLoggerProvider.inputTag(userTag);
      
      promise = service.sendMessage("A test message");
      promise.then(function(response) {
          actual = response.data;
      });

      $httpBackend.flush();

      // assert
      expect(actual).toEqual(expected);
    });
  });
});
