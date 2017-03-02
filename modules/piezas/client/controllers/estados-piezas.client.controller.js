(function () {
  'use strict';

  // Estados Piezas Controller
  angular
    .module('piezas')
    .controller('PiezasEstadosController', PiezasEstadosController);

  PiezasEstadosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'piezaResolve', 'firebase', 'angular.filter'];

  function PiezasEstadosController ($scope, $state, $window, Authentication, pieza, Upload) {
    var vm = this;

    vm.authentication = Authentication;
    var user = vm.authentication.user;
    vm.pieza = pieza;


    var ref = new Firebase("https://base64images.firebaseio.com/");

  var img = new Firebase("https://base64images.firebaseio.com/images");
  var algo = []

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
              var textAreaFileContents = document.getElementById(
                "textAreaFileContents"
              );


              algo.push({
                date: Firebase.ServerValue.TIMESTAMP,
                base64: fileLoadedEvent.target.result
              });
            };

            fileReader.readAsDataURL(fileToLoad);
          }
          break;
        }
      }

      if (!blnValid) {
        alert('File is not valid');
        return false;
      }
    }

    return true;
  }

  $scope.deleteimg = function(imgid) {
    var r = confirm("Do you want to remove this image ?");
    if (r == true) {
      $scope.imgs.forEach(function(childSnapshot) {
        if (childSnapshot.$id == imgid) {
            $scope.imgs.$remove(childSnapshot).then(function(ref) {
              ref.key() === childSnapshot.$id; // true
            });
        }
      });
    }
  }

/*
    console.log(vm.authentication);

    vm.pieza.estados.push({
      responsable: user.firstName + " " + user.lastName,
      observaciones: "probando",
      tipo: "transito",
      imagen: null
    })

    vm.pieza.$update(successCallback, errorCallback);
   

    function successCallback(res) {
      console.log("Carga de campaña ");
    }

    function errorCallback(res) {
      vm.error = res.data.message;
    }*/

  }
}());
