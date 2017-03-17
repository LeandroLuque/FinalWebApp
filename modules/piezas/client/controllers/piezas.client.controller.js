(function () {
  'use strict';

  // Piezas controller
  angular
    .module('piezas')
    .controller('PiezasController', PiezasController);

  PiezasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'piezaResolve', 'CampanasService'];

  function PiezasController ($scope, $state, $window, Authentication, pieza, CampanasService) {
    var vm = this;
    var id_campana;

    vm.authentication = Authentication;
    vm.pieza = pieza;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;


    $scope.states = CampanasService.query();

    $scope.onSelect = function($item, $model, $label){
      id_campana = $item._id;
    }

    // Remove existing Pieza
    function remove() {

      if ($window.confirm('Nombre de la campaña')) {
        var campana = CampanasService.get({
          campanaId: vm.pieza.idcampana
        }, function(){
            campana.piezas = $.grep(campana.piezas, function(value) {
              return value._id != vm.pieza._id;
            });
            campana.$update();   
        });
        vm.pieza.$remove($state.go('piezas.list'));
      }
    }

    // Save Pieza
    function save(isValid) {
      
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.piezaForm');
        return false;
      }

      
      if (vm.pieza._id) {
        vm.pieza.$update(successCallback, errorCallback);
      } else {
        //vm.pieza.latitud = dms2dec(vm.pieza.latitud);
        //vm.pieza.longitud = dms2dec(vm.pieza.longitud);
        //vm.pieza.namecampana = vm.pieza.campana;
        vm.pieza.idcampana = id_campana;
        vm.pieza.$save(successCallback, errorCallback);

        // Se agrega la pieza a la campana elegida
        var campana = CampanasService.get({
          campanaId: id_campana
        }, function(){
            campana.piezas.push(vm.pieza);
            campana.$update();
        });
      }

      function successCallback(res) {
        
        $state.go('piezas.view', {
          piezaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
