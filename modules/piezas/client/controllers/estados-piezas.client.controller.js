(function () {
  'use strict';

  // Estados Piezas Controller
  angular
    .module('piezas')
    .controller('PiezasEstadosController', PiezasEstadosController);


  PiezasEstadosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'piezaResolve', 'PersonalsService'];

  function PiezasEstadosController ($scope, $state, $window, Authentication, pieza, PersonalsService) {
    var vm = this;

    vm.authentication = Authentication;
    var user = vm.authentication.user;
    vm.pieza = pieza;
    var img_resul = null;

    $scope.personal = PersonalsService.query();

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
                var img = new Image();
                img.src = img_resul
                if (img.width > 500 || img.height > 300){
                  alert("Imagen demasiado grande.");
                  return false;
                }

                vm.pieza.estados.push({
                  responsable: $("#responsable").val(),
                  observaciones: $("#observaciones").val() ,
                  tipo: $("#tipo").val(),
                  imagen: img_resul,
                  timestamp: new Date(),
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
        $("#observaciones").val("");
        $("#tipo").val("");
        $("#reponsable").val("");
        console.log("Nuevo estado generado");
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

      

      return true;
    }   

    $scope.quitarEstado = function(elemento){
       
        vm.pieza.estados.splice(elemento,1); //elimino un elemento en la ubicacion pasada por parametro
        vm.pieza.$update(successCallback, errorCallback);
        
      }
       function successCallback(res) {
        console.log("Nuevo estado generado");
      } 
      function errorCallback(res) {
       vm.error = res.data.message;
       
      }

    
    /*vm.open = function(){
      $("#myModal").modal('show');
    }*/

}


}());