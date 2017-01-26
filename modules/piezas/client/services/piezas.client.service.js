// Piezas service used to communicate Piezas REST endpoints
(function () {
  'use strict';

  angular
    .module('piezas')
    .factory('PiezasService', PiezasService);

  PiezasService.$inject = ['$resource'];

  function PiezasService($resource) {
    return $resource('api/piezas/:piezaId', {
      piezaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
