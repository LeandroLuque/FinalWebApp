(function () {
  'use strict';

  // Campanas controller
  angular
    .module('campanas')
    .controller('CampanasController', CampanasController);

  CampanasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'campanaResolve','uiGmapGoogleMapApi', 'PersonalsService'];

  function CampanasController ($scope, $state, $window, Authentication, campana, uiGmapApi, PersonalsService) {
    var vm = this;
    var map;

    vm.authentication = Authentication;
    vm.campana = campana;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    var count_markers = 0;

    $scope.personas = PersonalsService.query();

    console.log($scope.personas);

    // Remove existing Campana
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.campana.$remove($state.go('campanas.list'));
      }
    }

    // Save Campana
    function save(isValid) {

      if (count_markers == 0 ){
        alert("Debe marcar una ubicación en el mapa");
        return false;
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.campanaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.campana._id) {
        vm.campana.$update(successCallback, errorCallback);
      } else {
        vm.campana.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        console.log("Carga de campaña ")
        $state.go('campanas.view', {
          campanaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }

    function initMap () {

      var opt = { scrollwheel: true, 
                  zoom: 8, 
                  center: { lat: -43.263305, lng: -65.3830899 },
                };


      function actualizar_location(location){
        $("#latitud").val(location.lat());
        $("#longitud").val(location.lng());
      }

      function placeMarker(location, map) {
          var marker = new google.maps.Marker({
              position: location, 
              draggable:true,
              map: map
          });

          actualizar_location(location);

          marker.addListener('dragend', function(e){
            actualizar_location(e.latLng);
          });

          count_markers++;
      }

      if ($('#map')[0]) {
        uiGmapApi.then(function(maps) {
          map = new maps.Map($('#map')[0], opt);
          map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
          map.addListener('click', function(e){
            if (count_markers == 0)
              placeMarker(e.latLng, map);
          });
        });
      }
    }

    initMap();
  }
}());
