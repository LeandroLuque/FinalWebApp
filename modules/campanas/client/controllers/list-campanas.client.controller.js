(function () {
  'use strict';

  angular
    .module('campanas')
    .controller('CampanasListController', CampanasListController);

  CampanasListController.$inject = ['CampanasService', 'uiGmapGoogleMapApi'];

  function CampanasListController(CampanasService, uiGmapApi) {
    var vm = this;
    vm.campanas = CampanasService.query();

    function initMap () {
      var opt = { scrollwheel: false, zoom: 8, center: { lat: -43.263305, lng: -65.3830899 } };
      if ($('#map')[0]) {
        uiGmapApi.then(function(maps) {
          new maps.Map($('#map')[0], opt);
        });
      }
    }

    initMap();
  }
}());
