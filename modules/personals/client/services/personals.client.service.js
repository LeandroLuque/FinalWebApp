// Personals service used to communicate Personals REST endpoints
(function () {
  'use strict';

  angular
    .module('personals')
    .factory('PersonalsService', PersonalsService);

  PersonalsService.$inject = ['$resource'];

  function PersonalsService($resource) {
    return $resource('api/personals/:personalId', {
      personalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
