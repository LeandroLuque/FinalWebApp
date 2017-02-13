(function () {
  'use strict';

  angular
    .module('campanas')
    .controller('CampanasListController', CampanasListController);

  CampanasListController.$inject = ['CampanasService', 'uiGmapGoogleMapApi'];

  function CampanasListController(CampanasService, uiGmapApi) {
    var vm = this;
    var map, heatlayer;

    vm.campanas = CampanasService.query();
    
    function initMap () {
      var opt = { scrollwheel: true, 
                  zoom: 8, 
                  center: { lat: -43.263305, lng: -65.3830899 },
                };
      if ($('#map')[0]) {
        uiGmapApi.then(function(maps) {
          map = new maps.Map($('#map')[0], opt);
          map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        });
      }
    }

    $("#buscador").click(function(){
      var nombre = $("#nombre").val();
      var responsable = $("#responsable").val();
      var zona = $("#zona").val();

      for (var i = vm.campanas.length - 1; i >= 0; i++) {
        console.log(vm.campanas[i]);
      }

      console.log(nombre, responsable, zona);
    })

    initMap();
  }
}());
