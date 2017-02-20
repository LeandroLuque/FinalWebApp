(function () {
  'use strict';

  angular
    .module('campanas')
    .config(routeConfig)

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('campanas', {
        abstract: true,
        url: '/campanas',
        template: '<ui-view/>'
      })
      .state('campanas.list', {
        url: '',
        templateUrl: 'modules/campanas/client/views/list-campanas.client.view.html',
        controller: 'CampanasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Listado de Campañas'
        }
      })
      .state('campanas.create', {
        url: '/create',
        templateUrl: 'modules/campanas/client/views/form-campana.client.view.html',
        controller: 'CampanasController',
        controllerAs: 'vm',
        resolve: {
          campanaResolve: newCampana
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crear Campaña'
        }
      })
      .state('campanas.edit', {
        url: '/:campanaId/edit',
        templateUrl: 'modules/campanas/client/views/form-campana.client.view.html',
        controller: 'CampanasController',
        controllerAs: 'vm',
        resolve: {
          campanaResolve: getCampana
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Editar Campaña {{ campanaResolve.name }}'
        }
      })
      .state('campanas.piezas', {
        url: '/:campanaId/piezas',
        templateUrl: 'modules/campanas/client/views/piezas-campana.client.view.html',
        controller: 'CampanasPiezasController',
        controllerAs: 'vm',
        resolve: {
          campanaResolve: getCampana
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Piezas Campaña {{ campanaResolve.name }}'
        }
      })
      .state('campanas.view', {
        url: '/:campanaId',
        templateUrl: 'modules/campanas/client/views/view-campana.client.view.html',
        controller: 'CampanasController',
        controllerAs: 'vm',
        resolve: {
          campanaResolve: getCampana
        },
        data: {
          pageTitle: 'Campaña {{ campanaResolve.name }}'
        }
      });
  }

  getCampana.$inject = ['$stateParams', 'CampanasService'];

  function getCampana($stateParams, CampanasService) {
    return CampanasService.get({
      campanaId: $stateParams.campanaId
    }).$promise;
  }

  newCampana.$inject = ['CampanasService'];

  function newCampana(CampanasService) {
    return new CampanasService();
  }
}());
