(function () {
  'use strict';

  // Campanas controller
  angular
    .module('campanas')
    .controller('CampanasPiezasController', CampanasPiezasController);

  CampanasPiezasController.$inject = ['$scope', '$state', '$window', 'Authentication', 'campanaResolve'];

  function CampanasPiezasController ($scope, $state, $window, Authentication, campana) {
    var vm = this;
    var map;

    vm.authentication = Authentication;
    vm.campana = campana;
    vm.error = null;
    vm.form = {};
    
    console.log(vm.campana._id);

    console.log(vm.campana.piezas);

  }
}());
