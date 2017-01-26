(function () {
  'use strict';

  describe('Personals Route Tests', function () {
    // Initialize global variables
    var $scope,
      PersonalsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PersonalsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PersonalsService = _PersonalsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('personals');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/personals');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PersonalsController,
          mockPersonal;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('personals.view');
          $templateCache.put('modules/personals/client/views/view-personal.client.view.html', '');

          // create mock Personal
          mockPersonal = new PersonalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Personal Name'
          });

          // Initialize Controller
          PersonalsController = $controller('PersonalsController as vm', {
            $scope: $scope,
            personalResolve: mockPersonal
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:personalId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.personalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            personalId: 1
          })).toEqual('/personals/1');
        }));

        it('should attach an Personal to the controller scope', function () {
          expect($scope.vm.personal._id).toBe(mockPersonal._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/personals/client/views/view-personal.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PersonalsController,
          mockPersonal;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('personals.create');
          $templateCache.put('modules/personals/client/views/form-personal.client.view.html', '');

          // create mock Personal
          mockPersonal = new PersonalsService();

          // Initialize Controller
          PersonalsController = $controller('PersonalsController as vm', {
            $scope: $scope,
            personalResolve: mockPersonal
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.personalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/personals/create');
        }));

        it('should attach an Personal to the controller scope', function () {
          expect($scope.vm.personal._id).toBe(mockPersonal._id);
          expect($scope.vm.personal._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/personals/client/views/form-personal.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PersonalsController,
          mockPersonal;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('personals.edit');
          $templateCache.put('modules/personals/client/views/form-personal.client.view.html', '');

          // create mock Personal
          mockPersonal = new PersonalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Personal Name'
          });

          // Initialize Controller
          PersonalsController = $controller('PersonalsController as vm', {
            $scope: $scope,
            personalResolve: mockPersonal
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:personalId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.personalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            personalId: 1
          })).toEqual('/personals/1/edit');
        }));

        it('should attach an Personal to the controller scope', function () {
          expect($scope.vm.personal._id).toBe(mockPersonal._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/personals/client/views/form-personal.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
