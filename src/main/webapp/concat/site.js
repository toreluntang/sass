if (typeof File === 'undefined') {
    File = function() {
        return false;
    };
}
if (typeof console === 'undefined') {
  console = {
    log: function() {}
  };
}
(function() {

config.$inject = ['$stateProvider', '$urlRouterProvider'];
AuthCtrl.$inject = ['CrudService'];
ProfileCtrl.$inject = ['$rootScope', '$scope', 'DataService', 'CrudService'];
CrudService.$inject = ['$q', '$http'];
DataService.$inject = ['$q', '$http'];angular.element(document).ready(function (event) {
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
/**
 * @ngInject
 */
function config ($stateProvider, $urlRouterProvider) {

    var url = '';
	var apiPaths = {
    	login: url + '/login',
    	createAcc: url + '/account/create'
	};

    $urlRouterProvider.otherwise('/welcome');
    
    $stateProvider
        .state('welcome', {
            url: '/welcome',
            templateUrl: 'views/login.html',
            controller: 'AuthCtrl as auth'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl as profile'
        });
}
/**
 * @ngInject
 */
function run () {

}
/**
 * @ngInject
 */
function AuthCtrl(CrudService) {
    vm = this;
    vm.test = 'altceva';
    vm.username = "";
    vm.password = "";

    vm.login = function login(username, password) {
        console.log("login clicked!!!", username, password)
        if(username != "" && password != "") {
            var authObj = {username: username, password: password};
            var loginRequestPath = 'http://localhost:8080/sec/resources/account/login';
            CrudService.createItemAuth(authObj, loginRequestPath)
                .then(angular.bind(this, onLoginSuccess), angular.bind(this, onLoginError));
            
        } else {
            console.log("username and pass are required")
        }

    }

    function onLoginSuccess(data) {
        console.log("onLoginSuccess", data)

        var newkgjsh = {"accountid":data.accountid,"Auth":data.Auth};

        localStorage.setItem('kgjsh', JSON.stringify(newkgjsh));
    }
    function onLoginError(error) {
        console.log("onLoginError", error)
    }

    // vm.login = function login() {
    //     var username = 'test';
    //     var password = 'pass';
    //     var loginData = {
    //     	username: username,
    //     	password: password
    //     	};
    //     var promise = CrudService.createItem(loginData,apiPaths['login']);
    // }
}
/**
 * @ngInject
 */
function ProfileCtrl($rootScope, $scope, DataService, CrudService) {
    vm = this;

    vm.profiletest = "Profile Test";
    vm.myPic = "";
    vm.userId = '1';
    vm.imageId = '1';
    vm.mySharer = "Test mySharer";
    vm.myFile = "";
    // vm.onLoadImageCommentsSuccessERROR = false;
    // vm.showComments = false;


    
    function onLoadImagesSuccess(imagesData) {
    	console.log("onLoadImagsSuccess RIGHT ONE")
        _(imagesData).forEach(function(n) { 
            console.log(n)
            n.showComments = false;
            var kgjsh = JSON.parse(localStorage.getItem('kgjsh'));  
            DataService.loadStuff('http://localhost:8080/sec/resources/protected/comment?imageId=' + n.imageid, kgjsh)
            .then(angular.bind(this, onLoadImageCommentsSuccess), angular.bind(this, onLoadImageCommentsError));       

            function onLoadImageCommentsSuccess(data) {
                console.log("onLoadImageCommentsSuccess", data)
                if(data.error){
                    console.log("DATA ERROR onLoadImageCommentsSuccess")
                    // vm.onLoadImageCommentsSuccessERROR = true;
                 } else {
                    n.imageComments = data;
                    // vm.onLoadImageCommentsSuccessERROR = false;
                    
                 }
            }
            function onLoadImageCommentsError(error) {
                console.log("onLoadImageCommentsError: no comments found for this image", error)

            }
        });
        console.log("Images after adding comments are: ", imagesData)
        vm.pictures = imagesData;

        if(!$scope.$$phase) $scope.$digest();

        
        

    }
    function onLoadImagesError(error) {
    	console.log("onLoadImagsError", error)
    }
    function onUploadPicSuccess(data) {
        console.log("onUploadPicSuccess", data)
    }
    function onLoadImageCommentsError(error) {
        console.log("onLoadImageCommentsError", error)
    }
    function onCreateCommentSuccess(data) {
        console.log("onCreateCommentSuccess", data)
        getAllImages(vm.userId);
    }
    function onCreateCommentError(error) {
        console.log("onCreateCommentError", error)
    }
    function onSharePicSuccess(data) {
        console.log("onSharePicSuccess", data)
    }
    function onSharePicError(error) {
        console.log("onSharePicError", error)
    }


    function onLoadUsersSuccess(usersData) {
        console.log("onLoadUsersSuccess USEEEEERS", usersData)
        vm.users = usersData;
    }
    function onLoadUsersError(error) {
        console.log("onLoadUsersError", error)
    }
    function onUploadSuccess() {
        console.log("onUploadSuccess: final from ProfileCtrl")
        getAllImages(vm.userId);
        if(!$scope.$$phase) $scope.$digest();
        console.log("### Tried to get all images ###")
    }
    function onUploadError(error) {
        console.log("onUploadError: final from ProfileCtrl", error)
    }

    vm.uploadPic = function uploadPic() { // USERID is HARDCODED
        console.log("uploadPic IRINA test onChange test", vm.myFile)
        var file = vm.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "resources/file?userid="+vm.userId;
        // Upload file to url start 
        CrudService.uploadFileToUrl(file, uploadUrl)
            .then(angular.bind(this, onUploadSuccess), angular.bind(this, onUploadError));
        // var fd = new FormData();
        // fd.append('file', file);
        // $http.post(uploadUrl, fd, {
        //     transformRequest: angular.identity,
        //     headers: {'Content-Type': undefined}
        // })
        // .success(function(){
        //     console.log("SUCCESS     NEW : uploadFileToUrl")
        // })
        // .error(function(){
        //     console.log("ERROR    NEW : uploadFileToUrl")
        // });
        // Upload file to url end 
        // fileUpload.uploadFileToUrl(file, uploadUrl);
        
    }

    vm.addComment = function addComment(commBody, imageId) {
        commentData = {comment: commBody, userId: vm.userId, imageId: imageId};
        vm.commBody = "";
        var kgjsh = JSON.parse(localStorage.getItem('kgjsh'));  
        // console.log("commentData to be added is: ", commentData);
        CrudService.createItem(commentData, 'http://localhost:8080/sec/resources/protected/comment', kgjsh)
            .then(angular.bind(this, onCreateCommentSuccess), angular.bind(this, onCreateCommentError));
        
    }

    vm.shareWith = function shareWith(mySharer, imageid) {
        console.log("share with", mySharer)
        var sharingObject = {imageId: imageid, author: vm.userId, victim: mySharer};
        console.log("sharingObject is: ", sharingObject)
        var kgjsh = JSON.parse(localStorage.getItem('kgjsh'));  
        CrudService.createItem(sharingObject, 'http://localhost:8080/sec/resources/file/shareimage', kgjsh)
            .then(angular.bind(this, onSharePicSuccess), angular.bind(this, onSharePicError));
    }

    vm.logout = function logout() {
        console.log("logout")
    }

    // vm.toggleComments = function toggleComments() {
    //     vm.showComments = !vm.showComments;
    // }


    

    function getAllImages(userId) {
        var kgjsh = JSON.parse(localStorage.getItem('kgjsh'));  
        DataService.loadStuff('http://localhost:8080/sec/resources/file/getallimages?id='+userId, kgjsh)
            .then(angular.bind(this, onLoadImagesSuccess), angular.bind(this, onLoadImagesError));
    }
    function getAllUsers() {
        var kgjsh = JSON.parse(localStorage.getItem('kgjsh'));  
        DataService.loadStuff('http://localhost:8080/sec/resources/account/getallusers', kgjsh)
            .then(angular.bind(this, onLoadUsersSuccess), angular.bind(this, onLoadUsersError));
    }

   getAllImages(vm.userId);
   getAllUsers();

}
/**
 * @ngInject
 */

function CrudService($q, $http) {
    
    var service = {
        createItem: createItem,
        createItemAuth: createItemAuth,
        updateItem: updateItem,
        deleteItem: deleteItem,
        uploadFileToUrl: uploadFileToUrl
    };
    return service;

    function createAuthorizationHeader(uploadUrl, method) {
        var credentials = {
            id: 'd2b97532-e8c5-e411-8270-f0def103cfd0',
            algorithm: 'sha256',
            key: '7b76ae41-def3-e411-8030-0c8bfd2336cd'
        };
        var options = {
            credentials: credentials,
            ext: 'XRequestHeaderToProtect:secret'
        };
        var autourl = window.location.href
        var arr = autourl.split('/');
        autourl = arr[0] + '//' + arr[2];
        var header = hawk.client.header(autourl + uploadUrl, method, options);
        if (header.err != null) {
            alert(header.err);
            return null;
        }
        else
            return header;
    }

    // implementation
    function uploadFileToUrl(file, uploadUrl) {
        var def = $q.defer();

        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
            console.log("SUCCESS : uploadFileToUrl")
            def.resolve();
        })
        .error(function(){
            console.log("ERROR : uploadFileToUrl")
            def.reject("Failed to uploadFileToUrl");
        });

        return def.promise;
    }
    function createItem(objData, url, authObj) {
        var def = $q.defer();
        console.log(objData)
        $http({
            method: 'POST',
            url: url,
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded',
                'ts' :  authObj.Auth.ts,
                'nonce' :  authObj.Auth.nonce,
                'mac' :  authObj.Auth.mac,
                'accountId' : authObj.accountid
            },
            data: $.param(objData)
        })
        .success(function(data) {
            def.resolve(data);
        })
        .error(function() {
            def.reject("Failed to create item");
        });
        return def.promise;
    }
    function createItemAuth(objData, url) {
        var def = $q.defer();
        console.log(objData)
        $http({
            method: 'POST',
            url: url,
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded'
            },
            data: $.param(objData)
        })
        .success(function(data) {
            def.resolve(data);
        })
        .error(function() {
            def.reject("Failed to create item");
        });
        return def.promise;
    }
    //  function createItem(objData, url) { // PAUL
    //     var def = $q.defer();
    //     console.log(objData)
    //     var header = createAuthorizationHeader(url,'POST');
    //     $http.post(url, objData, {
    //         transformRequest: angular.identity,
    //         headers: {
    //             'Content-Type': undefined,
    //             'XRequestHeaderToProtect': 'secret',
    //             'Authorization': header.field
    //         }
    //     })
    //     .success(function(data) {
    //         def.resolve(data);
    //     })
    //     .error(function() {
    //         def.reject("Failed to create item");
    //     });
    //     return def.promise;
    // }
    function updateItem(objData, url) {
        var def = $q.defer();
        var header = createAuthorizationHeader(url,'POST');
        $http.post(url, objData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined,
                'XRequestHeaderToProtect': 'secret',
                'Authorization': header.field
            }
        })
        .success(function(data) {
            def.resolve(data);
        })
        .error(function() {
            def.reject("Failed to update item");
        });
        return def.promise;
    }
    function deleteItem(objData, url) {
        var def = $q.defer();
        $http.delete(url + '/' + objData.id)
            .success(function(data) {
                def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to delete item with id" + objData.id);
            });
            return def.promise;
    };

}
/**
 * @ngInject
 */

function DataService($q, $http) {
    
    var service = {
        loadStuff: loadStuff,
       
    };
    return service;

    // implementation
    function loadStuff(url, authObj) {
        var def = $q.defer();

        $http({
            method: 'GET',
            url: url,
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded',
                'ts' :  authObj.Auth.ts,
                'nonce' :  authObj.Auth.nonce,
                'mac' :  authObj.Auth.mac,
                'accountId' : authObj.accountid
            }
        })
        .success(function(data) {
            def.resolve(data);
        })
        .error(function() {
            def.reject("Failed to get stuff from url " + url);
        });
        // $http.get(url)
        // .success(function(data) {
        //     def.resolve(data);
        // })
        // .error(function() {
        //     def.reject("Failed to load " + url);
        // });
        return def.promise;
    }
}
})();
//# sourceMappingURL=site.js.map