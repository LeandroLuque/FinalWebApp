'use strict';

describe('Piezas E2E Tests:', function () {
  describe('Test Piezas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/piezas');
      expect(element.all(by.repeater('pieza in piezas')).count()).toEqual(0);
    });
  });
});
