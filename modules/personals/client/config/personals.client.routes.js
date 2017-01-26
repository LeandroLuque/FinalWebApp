(function () {
  'use strict';

  angular
    .module('personals')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('personals', {
        abstract: true,
        url: '/personals',
        template: '<ui-view/>'
      })
      .state('personals.list', {
        url: '',
        templateUrl: 'modules/personals/client/views/list-personals.client.view.html',
        controller: 'PersonalsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Personals List'
        }
      })
      .state('personals.create', {
        url: '/create',
        templateUrl: 'modules/personals/client/views/form-personal.client.view.html',
        controller: 'PersonalsController',
        controllerAs: 'vm',
        resolve: {
          personalResolve: newPersonal
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Personals Create'
        }
      })
      .state('personals.edit', {
        url: '/:personalId/edit',
        templateUrl: 'modules/personals/client/views/form-personal.client.view.html',
        controller: 'PersonalsController',
        controllerAs: 'vm',
        resolve: {
          personalResolve: getPersonal
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Personal {{ personalResolve.name }}'
        }
      })
      .state('personals.view', {
        url: '/:personalId',
        templateUrl: 'modules/personals/client/views/view-personal.client.view.html',
        controller: 'PersonalsController',
        controllerAs: 'vm',
        resolve: {
          personalResolve: getPersonal
        },
        data: {
          pageTitle: 'Personal {{ personalResolve.name }}'
        }
      });
  }

  getPersonal.$inject = ['$stateParams', 'PersonalsService'];

  function getPersonal($stateParams, PersonalsService) {
    return PersonalsService.get({
      personalId: $stateParams.personalId
    }).$promise;
  }

  newPersonal.$inject = ['PersonalsService'];

  function newPersonal(PersonalsService) {
    return new PersonalsService();
  }
}());
