'use strict';

describe('Personals E2E Tests:', function () {
  describe('Test Personals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/personals');
      expect(element.all(by.repeater('personal in personals')).count()).toEqual(0);
    });
  });
});
