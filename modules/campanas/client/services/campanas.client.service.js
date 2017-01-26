// Campanas service used to communicate Campanas REST endpoints
(function () {
  'use strict';

  angular
    .module('campanas')
    .factory('CampanasService', CampanasService);

  CampanasService.$inject = ['$resource'];

  function CampanasService($resource) {
    return $resource('api/campanas/:campanaId', {
      campanaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
