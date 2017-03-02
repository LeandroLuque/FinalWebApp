(function () {
  'use strict';

  // Estados Piezas Controller
  angular
    .module('piezas')
    .controller('PiezasEstadosController', PiezasEstadosController);

  PiezasEstadosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'piezaResolve'];

  function PiezasEstadosController ($scope, $state, $window, Authentication, pieza) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pieza = pieza;

  }
}());
