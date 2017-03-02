(function () {
  'use strict';

  angular
    .module('piezas')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Piezas',
      state: 'piezas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'piezas', {
      title: 'Listado Piezas',
      state: 'piezas.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'piezas', {
      title: 'Alta Pieza',
      state: 'piezas.create',
      roles: ['user']
    });
  }
}());
