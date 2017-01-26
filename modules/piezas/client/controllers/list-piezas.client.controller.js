(function () {
  'use strict';

  angular
    .module('piezas')
    .controller('PiezasListController', PiezasListController);

  PiezasListController.$inject = ['PiezasService'];

  function PiezasListController(PiezasService) {
    var vm = this;

    vm.piezas = PiezasService.query();
  }
}());
