(function () {
  'use strict';

  angular
    .module('campanas')
    .controller('CampanasListController', CampanasListController);

  CampanasListController.$inject = ['CampanasService', 'PiezasService', 'uiGmapGoogleMapApi'];

  function CampanasListController(CampanasService, PiezasService,uiGmapApi) {
    var vm = this;
    var map, heatmapData=[];

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
          cargarCampanas(map);
        });
      }
    }

    function cargarCampanas(map){

      var campanas = CampanasService.query(function(){

          for (var i = campanas.length - 1; i >= 0; i--) {

            for (var j = campanas[i].piezas.length - 1; j >= 0; j--) {
              var lat = Number(campanas[i].piezas[j].latitud);
              var lng = Number(campanas[i].piezas[j].longitud);
              heatmapData.push(new google.maps.LatLng(lat, lng));
            }

            var myLatLng = {lat: campanas[i].latitud, lng: campanas[i].longitud};
            var marker = new google.maps.Marker({
              position: myLatLng,
              map: map,
              title: campanas[i].name
            });  
          }

          heatMap(map);
      });
    }


    function heatMap(map){
      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
      });
      heatmap.setMap(map);
    }


    $("#buscador").click(function(){
      var nombre = $("#nombre").val();
      var responsable = $("#responsable").val();
      var zona = $("#zona").val();

      console.log(nombre, responsable, zona);
    })

    initMap();
  }
}());
