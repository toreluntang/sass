angular.element(document).ready(function (event) {
    console.log("angular is ready test");

    var modules = [];
    modules.push('ui.router'); 

    angular
        .module('mySASSFrontend', modules)
        .value('events', {

        })

        .controller('AuthCtrl', AuthCtrl)
        .controller('ProfileCtrl', ProfileCtrl)
        .directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;
                    
                    element.bind('change', function(){
                        console.log("UPLOAAAAAAD")
                        scope.$apply(function(){
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }])
        // .service('fileUpload', ['$http', function ($http) {
        //     this.uploadFileToUrl = function(file, uploadUrl){
        //         var fd = new FormData();
        //         fd.append('file', file);
        //         $http.post(uploadUrl, fd, {
        //             transformRequest: angular.identity,
        //             headers: {'Content-Type': undefined}
        //         })
        //         .success(function(){
        //             console.log("SUCCESS : uploadFileToUrl")
        //         })
        //         .error(function(){
        //             console.log("ERROR : uploadFileToUrl")
        //         });
        //     }
        // }])
        .factory('CrudService', CrudService)
        .factory('DataService', DataService)
   

        .config(config)        
        .run(run);
        
     
    angular.bootstrap(angular.element('#ng-app'), ['mySASSFrontend']);
});