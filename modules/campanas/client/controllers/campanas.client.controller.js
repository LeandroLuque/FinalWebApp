(function () {
  'use strict';

  // Campanas controller
  angular
    .module('campanas')
    .controller('CampanasController', CampanasController);

  CampanasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'campanaResolve'];

  function CampanasController ($scope, $state, $window, Authentication, campana) {
    var vm = this;

    vm.authentication = Authentication;
    vm.campana = campana;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Campana
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.campana.$remove($state.go('campanas.list'));
      }
    }

    // Save Campana
    function save(isValid) {
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
        $state.go('campanas.view', {
          campanaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
