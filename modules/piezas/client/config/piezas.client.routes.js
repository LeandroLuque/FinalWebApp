(function () {
  'use strict';

  angular
    .module('piezas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('piezas', {
        abstract: true,
        url: '/piezas',
        template: '<ui-view/>'
      })
      .state('piezas.list', {
        url: '',
        templateUrl: 'modules/piezas/client/views/list-piezas.client.view.html',
        controller: 'PiezasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Piezas List'
        }
      })
      .state('piezas.create', {
        url: '/create',
        templateUrl: 'modules/piezas/client/views/form-pieza.client.view.html',
        controller: 'PiezasController',
        controllerAs: 'vm',
        resolve: {
          piezaResolve: newPieza
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Piezas Create'
        }
      })
      .state('piezas.edit', {
        url: '/:piezaId/edit',
        templateUrl: 'modules/piezas/client/views/form-pieza.client.view.html',
        controller: 'PiezasController',
        controllerAs: 'vm',
        resolve: {
          piezaResolve: getPieza
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Pieza {{ piezaResolve.name }}'
        }
      })
      .state('piezas.view', {
        url: '/:piezaId',
        templateUrl: 'modules/piezas/client/views/view-pieza.client.view.html',
        controller: 'PiezasController',
        controllerAs: 'vm',
        resolve: {
          piezaResolve: getPieza
        },
        data: {
          pageTitle: 'Pieza {{ piezaResolve.name }}'
        }
      });
  }

  getPieza.$inject = ['$stateParams', 'PiezasService'];

  function getPieza($stateParams, PiezasService) {
    return PiezasService.get({
      piezaId: $stateParams.piezaId
    }).$promise;
  }

  newPieza.$inject = ['PiezasService'];

  function newPieza(PiezasService) {
    return new PiezasService();
  }
}());
