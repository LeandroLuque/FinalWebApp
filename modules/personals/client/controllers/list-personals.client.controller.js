(function () {
  'use strict';

  angular
    .module('personals')
    .controller('PersonalsListController', PersonalsListController);

  PersonalsListController.$inject = ['PersonalsService'];

  function PersonalsListController(PersonalsService) {
    var vm = this;

    vm.personals = PersonalsService.query();
  }
}());
