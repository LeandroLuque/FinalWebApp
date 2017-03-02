(function () {
  'use strict';

  angular
    .module('campanas')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Campañas',
      state: 'campanas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'campanas', {
      title: 'Listado Campañas',
      state: 'campanas.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'campanas', {
      title: 'Crear Campaña',
      state: 'campanas.create',
      roles: ['user']
    });
  }
}());
