(function () {
  'use strict';

  angular
    .module('campanas')
    .controller('CampanasListController', CampanasListController);

  CampanasListController.$inject = ['CampanasService', 'uiGmapGoogleMapApi'];

  function CampanasListController(CampanasService, uiGmapApi) {
    var vm = this;

    uiGmapApi.then(function(maps) {
     	new maps.Map($('#map')[0], {center: { lat: 0, lng: 0 }});
    });

    vm.campanas = CampanasService.query();
  }
}());
