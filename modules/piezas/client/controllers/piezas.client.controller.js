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
      if ($window.confirm('¿Desea eliminar la pieza?')) {
        vm.pieza.$remove($state.go('piezas.list'));
      }
    }

    /**

      Función para convertir los grados sexagesimales
      en una representación decimal
    */
    function dms2dec(sexagesimal){
      // http://www.sunearthtools.com/dp/tools/conversion.php

      var x = ["°", "'", "\""];
      var temp = sexagesimal;
      var data = [];
      var hemisferio, decimal;

      for (var i in x){
        temp = temp.replace(/ /g, '');
        data.push(Number(temp.split(x[i])[0]));
        temp = temp.split(x[i])[1];
      }

      hemisferio = temp;

      decimal = data[0] + ((data[2] / 60 + data[1]) / 60);

      if (hemisferio == "S" || hemisferio == "W"){
        decimal = decimal * -1;
      }

      return decimal;
    }

    // Save Pieza
    function save(isValid) {
      
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.piezaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.pieza._id) {
        vm.pieza.$update(successCallback, errorCallback);
      } else {
        vm.pieza.latitud = dms2dec(vm.pieza.latitud);
        vm.pieza.longitud = dms2dec(vm.pieza.longitud);
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
