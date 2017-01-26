(function () {
  'use strict';

  angular
    .module('campanas')
    .controller('CampanasListController', CampanasListController);

  CampanasListController.$inject = ['CampanasService', 'uiGmapGoogleMapApi'];

  function CampanasListController(CampanasService, uiGmapApi) {
    var vm = this;

    vm.campanas = CampanasService.query();
  }
}());
