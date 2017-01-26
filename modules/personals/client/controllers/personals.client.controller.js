(function () {
  'use strict';

  // Personals controller
  angular
    .module('personals')
    .controller('PersonalsController', PersonalsController);

  PersonalsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'personalResolve'];

  function PersonalsController ($scope, $state, $window, Authentication, personal) {
    var vm = this;

    vm.authentication = Authentication;
    vm.personal = personal;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Personal
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.personal.$remove($state.go('personals.list'));
      }
    }

    // Save Personal
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.personalForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.personal._id) {
        vm.personal.$update(successCallback, errorCallback);
      } else {
        vm.personal.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('personals.view', {
          personalId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
