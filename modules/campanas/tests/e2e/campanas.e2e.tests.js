'use strict';

describe('Campanas E2E Tests:', function () {
  describe('Test Campanas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/campanas');
      expect(element.all(by.repeater('campana in campanas')).count()).toEqual(0);
    });
  });
});
