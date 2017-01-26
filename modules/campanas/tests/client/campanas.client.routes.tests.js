(function () {
  'use strict';

  describe('Campanas Route Tests', function () {
    // Initialize global variables
    var $scope,
      CampanasService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CampanasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CampanasService = _CampanasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('campanas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/campanas');
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
          CampanasController,
          mockCampana;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('campanas.view');
          $templateCache.put('modules/campanas/client/views/view-campana.client.view.html', '');

          // create mock Campana
          mockCampana = new CampanasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Campana Name'
          });

          // Initialize Controller
          CampanasController = $controller('CampanasController as vm', {
            $scope: $scope,
            campanaResolve: mockCampana
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:campanaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.campanaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            campanaId: 1
          })).toEqual('/campanas/1');
        }));

        it('should attach an Campana to the controller scope', function () {
          expect($scope.vm.campana._id).toBe(mockCampana._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/campanas/client/views/view-campana.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CampanasController,
          mockCampana;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('campanas.create');
          $templateCache.put('modules/campanas/client/views/form-campana.client.view.html', '');

          // create mock Campana
          mockCampana = new CampanasService();

          // Initialize Controller
          CampanasController = $controller('CampanasController as vm', {
            $scope: $scope,
            campanaResolve: mockCampana
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.campanaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/campanas/create');
        }));

        it('should attach an Campana to the controller scope', function () {
          expect($scope.vm.campana._id).toBe(mockCampana._id);
          expect($scope.vm.campana._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/campanas/client/views/form-campana.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CampanasController,
          mockCampana;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('campanas.edit');
          $templateCache.put('modules/campanas/client/views/form-campana.client.view.html', '');

          // create mock Campana
          mockCampana = new CampanasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Campana Name'
          });

          // Initialize Controller
          CampanasController = $controller('CampanasController as vm', {
            $scope: $scope,
            campanaResolve: mockCampana
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:campanaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.campanaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            campanaId: 1
          })).toEqual('/campanas/1/edit');
        }));

        it('should attach an Campana to the controller scope', function () {
          expect($scope.vm.campana._id).toBe(mockCampana._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/campanas/client/views/form-campana.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
