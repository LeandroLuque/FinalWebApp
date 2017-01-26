(function () {
  'use strict';

  angular
    .module('personals')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Personals',
      state: 'personals',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'personals', {
      title: 'List Personals',
      state: 'personals.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'personals', {
      title: 'Create Personal',
      state: 'personals.create',
      roles: ['user']
    });
  }
}());
