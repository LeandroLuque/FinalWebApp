(function () {
  'use strict';

  describe('Piezas Route Tests', function () {
    // Initialize global variables
    var $scope,
      PiezasService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PiezasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PiezasService = _PiezasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('piezas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/piezas');
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
          PiezasController,
          mockPieza;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('piezas.view');
          $templateCache.put('modules/piezas/client/views/view-pieza.client.view.html', '');

          // create mock Pieza
          mockPieza = new PiezasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pieza Name'
          });

          // Initialize Controller
          PiezasController = $controller('PiezasController as vm', {
            $scope: $scope,
            piezaResolve: mockPieza
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:piezaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.piezaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            piezaId: 1
          })).toEqual('/piezas/1');
        }));

        it('should attach an Pieza to the controller scope', function () {
          expect($scope.vm.pieza._id).toBe(mockPieza._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/piezas/client/views/view-pieza.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PiezasController,
          mockPieza;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('piezas.create');
          $templateCache.put('modules/piezas/client/views/form-pieza.client.view.html', '');

          // create mock Pieza
          mockPieza = new PiezasService();

          // Initialize Controller
          PiezasController = $controller('PiezasController as vm', {
            $scope: $scope,
            piezaResolve: mockPieza
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.piezaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/piezas/create');
        }));

        it('should attach an Pieza to the controller scope', function () {
          expect($scope.vm.pieza._id).toBe(mockPieza._id);
          expect($scope.vm.pieza._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/piezas/client/views/form-pieza.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PiezasController,
          mockPieza;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('piezas.edit');
          $templateCache.put('modules/piezas/client/views/form-pieza.client.view.html', '');

          // create mock Pieza
          mockPieza = new PiezasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Pieza Name'
          });

          // Initialize Controller
          PiezasController = $controller('PiezasController as vm', {
            $scope: $scope,
            piezaResolve: mockPieza
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:piezaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.piezaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            piezaId: 1
          })).toEqual('/piezas/1/edit');
        }));

        it('should attach an Pieza to the controller scope', function () {
          expect($scope.vm.pieza._id).toBe(mockPieza._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/piezas/client/views/form-pieza.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
