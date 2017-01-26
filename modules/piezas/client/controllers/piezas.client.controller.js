(function () {
  'use strict';

  // Piezas controller
  angular
    .module('piezas')
    .controller('PiezasController', PiezasController);

  PiezasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'piezaResolve'];

  function PiezasController ($scope, $state, $window, Authentication, pieza) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pieza = pieza;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Pieza
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.pieza.$remove($state.go('piezas.list'));
      }
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
        vm.pieza.$save(successCallback, errorCallback);
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
