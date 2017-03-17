(function () {
  'use strict';

  angular
    .module('campanas')
    .controller('CampanasListController', CampanasListController);

  CampanasListController.$inject = ['$state', 'CampanasService', 'PiezasService', 'uiGmapGoogleMapApi'];

  function CampanasListController($state, CampanasService, PiezasService,uiGmapApi) {
    var vm = this;
    var map, heatmapData=[], markers=[];

    vm.campanas = CampanasService.query();

    /**
      Función para convertir los grados sexagesimales
      en una representación decimal
    */
    function dms2dec(sexagesimal){
      // http://www.sunearthtools.com/dp/tools/conversion.php

      var x = ["°", "'", "''"];
      var temp = sexagesimal;
      var data = [];
      var hemisferio, decimal;

      for (var i in x){
        temp = temp.replace(/ /g, '');
        data.push(Number(temp.split(x[i])[0]));
        temp = temp.split(x[i])[1];
      }
      
      hemisferio = sexagesimal.replace(/ /g, '').split("''")[1];

      decimal = data[0] + ((data[2] / 60 + data[1]) / 60);

      if (hemisferio == "S" || hemisferio == "W"){
        decimal = decimal * -1;
      }

      return decimal;
    }

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
              var lat = campanas[i].piezas[j].latitud;
              var lng = campanas[i].piezas[j].longitud;
              lat = dms2dec(lat);
              lng = dms2dec(lng);
              heatmapData.push(new google.maps.LatLng(lat, lng));
            }

            var myLatLng = {lat: campanas[i].latitud, lng: campanas[i].longitud};
            var marker = null
            marker = new google.maps.Marker({
              position: myLatLng,
              map: map,
              title: campanas[i].name,
              responsable: campanas[i].responsable,
              _id : campanas[i]._id
            }); 

            markers.push(marker);

          }

          heatMap(map);

          for (var m in markers){
            markers[m].addListener('click',function(){
              $state.go('campanas.view', {
                campanaId: this._id
              });
            });
          }

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

      for (var i = markers.length - 1; i >= 0; i--) {

        markers[i].setVisible(true);

        if ((responsable != "") && (markers[i].visible != false)){
          if (markers[i].responsable != responsable) 
            markers[i].setVisible(false);
          else
            markers[i].setVisible(true);
        }

        if ((nombre != "") &&  (markers[i].visible != false)) {
          if (markers[i].title != nombre){
            markers[i].setVisible(false);
          }else
            markers[i].setVisible(true);
        }
          
      }

    })

    initMap();
  }
}());
