(function () {
  'use strict';

  // Estados Piezas Controller
  angular
    .module('piezas')
    .controller('PiezasEstadosController', PiezasEstadosController);

  PiezasEstadosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'piezaResolve'];

  function PiezasEstadosController ($scope, $state, $window, Authentication, pieza) {
    var vm = this;

    vm.authentication = Authentication;
    var user = vm.authentication.user;
    vm.pieza = pieza;
    var img_resul = null;

    var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
    $scope.uploadFile = function() {
      var sFileName = $("#nameImg").val();
      if (sFileName.length > 0) {
        var blnValid = false;
        for (var j = 0; j < _validFileExtensions.length; j++) {
          var sCurExtension = _validFileExtensions[j];
          if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
            blnValid = true;
            var filesSelected = document.getElementById("nameImg").files;
            if (filesSelected.length > 0) {
              var fileToLoad = filesSelected[0];

              var fileReader = new FileReader();

              fileReader.onload = function(fileLoadedEvent) {

                img_resul = fileLoadedEvent.target.result;

                vm.pieza.estados.push({
                  responsable: user.firstName + " " + user.lastName,
                  observaciones: "probando",
                  tipo: "transito",
                  imagen: img_resul,
                })

                vm.pieza.$update(successCallback, errorCallback);

              };

              fileReader.readAsDataURL(fileToLoad);
            }
            break;
          }
        }

        if (!blnValid) {
          alert('Archivo no es valido');
          return false;
        }
      }

      
    

      function successCallback(res) {
        console.log("Nuevo estado generado");
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

      return true;
    }    

  }
}());
