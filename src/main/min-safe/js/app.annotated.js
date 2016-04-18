
config.$inject = ['$stateProvider', '$urlRouterProvider'];
AuthCtrl.$inject = ['$state', '$location', 'CrudService'];
ProfileCtrl.$inject = ['$rootScope', '$scope', '$state', '$location', 'DataService', 'CrudService'];
CrudService.$inject = ['$q', '$http', '$state', '$location'];
DataService.$inject = ['$q', '$http', '$state'];angular.element(document).ready(function (event) {

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
                        scope.$apply(function(){
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }])
 
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
function AuthCtrl($state, $location, CrudService) {
    vm = this;
    vm.test = 'altceva';
    vm.username = "";
    vm.password = "";
    vm.usernameSignup = "";
    vm.passwordSignup = "";
    vm.passwordError = false;
    vm.loginError = false;
    var requestUrl = $location.$$protocol + "://" + $location.$$host + ":" + $location.$$port + "/sec/";

    vm.login = function login (username, password) {
        if(username != "" && password != "") {
            var authObj = {username: username, password: password};
            var loginRequestPath = requestUrl+'resources/account/login';
            CrudService.createItemAuth(authObj, loginRequestPath)
                .then(angular.bind(this, onLoginSuccess), angular.bind(this, onLoginError));
            
        } else {
        }

    }

    vm.signup = function signup (username, password) {
        if(username != "" && password != "") {
            var authObj = {username: username, password: password, email: username};
            var signupRequestPath = requestUrl+'resources/account/create';
            CrudService.createItemAuth(authObj, signupRequestPath)
                .then(angular.bind(this, onSignupSuccess), angular.bind(this, onSignupError));
            
        } else {
        }
    }

    function onLoginSuccess(data) {
        localStorage.setItem('LS', JSON.stringify(data));
        vm.loginError = false;
        $state.go('profile');
    }
    function onLoginError(error) {
        vm.loginError = true;
        $state.go("welcome");
    }

    function onSignupSuccess(data) {
        var myLS = {keyid: data.keyid, accountId: data.accountId};
        localStorage.setItem("LS", JSON.stringify(myLS));
        vm.passwordError = false;
        $state.go('profile', "test from onSignupSuccess ###");

    }
    function onSignupError(error) {
        vm.passwordError = true;
        $state.go("welcome");
    }
}
/**
 * @ngInject
 */
function ProfileCtrl($rootScope, $scope, $state, $location, DataService, CrudService) {
    vm = this;
    vm.profiletest = "Profile Test";
    vm.myPic = "";
    vm.fileTypeError = false;
    if (localStorage.getItem('LS')!=null) {
        vm.userId = JSON.parse(localStorage.getItem('LS')).accountId;
        if(vm.userId == null) {
            $state.go("welcome");
            return;
            }
    } else {
         $state.go("welcome");
            return;
    }
    vm.imageId = '1';
    vm.mySharer = "Test mySharer";
    vm.myFile = "";
    vm.errorUpload = "";

    var requestUrl = $location.$$protocol + "://" + $location.$$host + ":" + $location.$$port + "/sec/";
   
    
    function onLoadImagesSuccess(imagesData) {
        _(imagesData).forEach(function(n) {
            n.showComments = false;
            n.path = $location.$$protocol + "://" + $location.$$host + ":" + $location.$$port + "/img/" + n.path;
            var LS = JSON.parse(localStorage.getItem('LS'));
            if(LS == null) {
                $state.go("welcome");
                return;
            }

            DataService.loadStuff(requestUrl+'resources/protected/comment/' + n.imageid)
            .then(angular.bind(this, onLoadImageCommentsSuccess), angular.bind(this, onLoadImageCommentsError));       

            function onLoadImageCommentsSuccess(data) {
                if(data.error){
                 } else {
                    n.imageComments = data;
                 }
            }
            function onLoadImageCommentsError(error) {
            }
        });
        vm.pictures = imagesData;

        if(!$scope.$$phase) $scope.$digest();
    }
    function onLoadImagesError(error) {
    }
    function onUploadPicSuccess(data) {
    }
    function onLoadImageCommentsError(error) {
    }
    function onCreateCommentSuccess(data) {
        getAllImages(vm.userId);
    }
    function onCreateCommentError(error) {
    }
    function onSharePicSuccess(data) {
    }
    function onSharePicError(error) {
    }

    function onLoadUsersSuccess(usersData) {
        vm.users = usersData;
    }
    function onLoadUsersError(error) {
    }
    function onUploadSuccess() {
        vm.fileTypeError = false;
        getAllImages(vm.userId);
        if(!$scope.$$phase) $scope.$digest();
    }
    function onUploadError(error) {
        console.log("upload errr", error)
        vm.fileTypeError = true;
    }

    vm.inputUpload = function inputUpload() {
        vm.fileTypeError = false;
    }

    vm.uploadPic = function uploadPic() {
        vm.fileTypeError = false;
        var file = vm.myFile;

 
        if(file != "") {
            var uploadUrl = "resources/protected/file";
            CrudService.uploadFileToUrl(file, uploadUrl, vm.userId)
                .then(angular.bind(this, onUploadSuccess), angular.bind(this, onUploadError));        
            vm.errorUpload = "";
        } else {
            console.log("file is empty, dude")
            vm.errorUpload = "Please make sure the picture is chosen. Your upload cannot be empty.";
        }

    }

    vm.addComment = function addComment(commBody, imageId) {
        commentData = {comment: commBody, userId: vm.userId, imageId: imageId};
        vm.commBody = "";
        var LS = JSON.parse(localStorage.getItem('LS'));

        CrudService.createItem(commentData, requestUrl+'resources/protected/comment', LS)
            .then(angular.bind(this, onCreateCommentSuccess), angular.bind(this, onCreateCommentError));
        
    }

    vm.shareWith = function shareWith(mySharer, imageid) {
        var sharingObject = {imageId: imageid, author: vm.userId, victim: mySharer};
        var LS = JSON.parse(localStorage.getItem('LS'));

        CrudService.createItem(sharingObject, requestUrl+'resources/protected/file/shareimage', LS)
            .then(angular.bind(this, onSharePicSuccess), angular.bind(this, onSharePicError));
    }

    vm.logout = function logout() {
        localStorage.removeItem('LS');
        $state.go('welcome'); 
    }


    function getAllImages(userId) {
        var LS = JSON.parse(localStorage.getItem('LS'));

        DataService.loadStuff(requestUrl+'resources/protected/file/getallimages/'+userId)
            .then(angular.bind(this, onLoadImagesSuccess), angular.bind(this, onLoadImagesError));
    }
    function getAllUsers() {
        var LS = JSON.parse(localStorage.getItem('LS'));

        DataService.loadStuff(requestUrl+'resources/protected/account/getallusers')
            .then(angular.bind(this, onLoadUsersSuccess), angular.bind(this, onLoadUsersError));
    }

   getAllImages(vm.userId);
   getAllUsers();


   function stabilizeLoggedInUser (fromStateName) {

   }

   function onStateChangeSuccess(event, toState, toParams, fromState, fromParams) {
       stabilizeLoggedInUser(fromState.name);
   }


   $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);

}
/**
 * @ngInject
 */

function CrudService($q, $http, $state, $location) {
    
    var service = {
        createItem: createItem,
        createItemAuth: createItemAuth,
        updateItem: updateItem,
        deleteItem: deleteItem,
        uploadFileToUrl: uploadFileToUrl
    };
    return service;

    function createAuthorizationHeader(uploadUrl, method) {        
        var myLS = JSON.parse(localStorage.getItem('LS')); 
        if(myLS == null) {
            $state.go("welcome");
            return;
        }
        var credentials = {
            id: myLS.accountId,
            algorithm: 'sha256',
            key: myLS.keyid
        };
        var options = {
            credentials: credentials
        };
        console.log("### from CrudService ###, uploadUrl", uploadUrl)
        var header = hawk.client.header(uploadUrl, method, options);
        if (header.err != null) {
            alert(header.err);
            return null;
        }
        else
        console.log("### from CrudService ###, header from the method itself", header)
            return header;
    }

    // implementation
    function uploadFileToUrl(file, uploadUrl, userId) {
        var def = $q.defer();
        var header = createAuthorizationHeader($location.$$protocol + "://" + $location.$$host + ":" + $location.$$port + '/sec/resources/protected/file','POST');
        console.log("### from CrudService ###, header from the uploadFileToUrl", header)
        var fd = new FormData();
        fd.append('file', file);
        fd.append('userid', userId);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': 'multipart/form-data',
                        'Authorization': header.field}
        })
        .success(function(){
            def.resolve();
        })
        .error(function(){
            def.reject("Failed to uploadFileToUrl");
        });

        return def.promise;
    }
    function createItem(objData, url, authObj) {
        var def = $q.defer();
        var header = createAuthorizationHeader(url,'POST');
       
        $http({
            method: 'POST',
            url: url,
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization': header.field
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
    function updateItem(objData, url) {
        var def = $q.defer();
        var header = createAuthorizationHeader(url,'POST');
        $http.post(url, objData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
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

function DataService($q, $http, $state) {
    
    var service = {
        loadStuff: loadStuff,
       
    };
    return service;
    function createAuthorizationHeader(uploadUrl, method) {
        var myLS = JSON.parse(localStorage.getItem('LS')); 
        if(myLS == null) {
            $state.go("welcome");
            return;
        }
        var credentials = {
            id: myLS.accountId,
            algorithm: 'sha256',
            key: myLS.keyid
        };
        var options = {
            credentials: credentials
        };
        var autourl = window.location.href
        var arr = autourl.split('/');
        autourl = arr[0] + '//' + arr[2];
        var header = hawk.client.header(uploadUrl, method, options);
        if (header.err != null) {
            return null;
        }
        else
            return header;
    }

    // implementation
    function loadStuff(url) {
        var def = $q.defer();
        var header = createAuthorizationHeader(url,'GET');
        if(header == null) {
            return;
        }

        $http({
            method: 'GET',
            url: url,
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization': header.field
            }
        })
        .success(function(data) {
            def.resolve(data);
        })
        .error(function() {
            def.reject("Failed to get stuff from url " + url);
        });
        return def.promise;
    }
}