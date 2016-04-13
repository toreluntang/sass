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
AuthCtrl.$inject = ['$state', '$location', 'CrudService'];
ProfileCtrl.$inject = ['$rootScope', '$scope', '$state', '$location', 'DataService', 'CrudService'];
CrudService.$inject = ['$q', '$http', '$state'];
DataService.$inject = ['$q', '$http', '$state'];angular.element(document).ready(function (event) {
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
    // vm.showSignup = false;
    var requestUrl = $location.$$protocol + "://" + $location.$$host + ":" + $location.$$port + "/sec/";


    console.log(">>>> Request url is: >>>>>" , $location.$$protocol + "://" + $location.$$host + ":" + $location.$$port + "/sec" )
    console.log(">>>> Location obj >>>>>" , $location )

    vm.login = function login (username, password) {
        console.log("login clicked!!!", username, password)
        if(username != "" && password != "") {
            var authObj = {username: username, password: password};
            var loginRequestPath = requestUrl+'resources/account/login';
            CrudService.createItemAuth(authObj, loginRequestPath)
                .then(angular.bind(this, onLoginSuccess), angular.bind(this, onLoginError));
            
        } else {
            console.log("username and pass are required")
        }

    }

    vm.signup = function signup (username, password) {
        // vm.showSignup = true;
        console.log("signup")
        if(username != "" && password != "") {
            var authObj = {username: username, password: password, email: username};
            var signupRequestPath = requestUrl+'resources/account/create';
            CrudService.createItemAuth(authObj, signupRequestPath)
                .then(angular.bind(this, onSignupSuccess), angular.bind(this, onSignupError));
            
        } else {
            console.log("signup failed")
        }
    }

    function onLoginSuccess(data) {
        console.log("onLoginSuccess", data)

        // var newkgjsh = {"accountid":data.accountid,"Auth":data.Auth};

        localStorage.setItem('LS', JSON.stringify(data));

        

        $state.go('profile', "test from onLoginSuccess ###");
    }
    function onLoginError(error) {
        console.log("onLoginError", error)
    }
    function onSignupSuccess(data) {
        console.log("onSignupSuccess", data)
        var myLS = {keyid: data.keyid, accountId: data.accountId};
        localStorage.setItem("LS", JSON.stringify(myLS));
        $state.go('profile', "test from onSignupSuccess ###");

    }
    function onSignupError(error) {
        console.log("onSignupError", error)
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
function ProfileCtrl($rootScope, $scope, $state, $location, DataService, CrudService) {
    vm = this;

    vm.profiletest = "Profile Test";
    vm.myPic = "";
    vm.userId = JSON.parse(localStorage.getItem('LS')).accountId;
    if(vm.userId == null) {
        $state.go("welcome");
        return;
    }
    vm.imageId = '1';
    vm.mySharer = "Test mySharer";
    vm.myFile = "";
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

            DataService.loadStuff(requestUrl+'resources/protected/comment?imageId=' + n.imageid)
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
        getAllImages(vm.userId);
        if(!$scope.$$phase) $scope.$digest();
    }
    function onUploadError(error) {
    }

    vm.uploadPic = function uploadPic() {
        var file = vm.myFile;
        console.dir(file);
        var uploadUrl = "resources/protected/file?userid="+vm.userId;
        CrudService.uploadFileToUrl(file, uploadUrl)
            .then(angular.bind(this, onUploadSuccess), angular.bind(this, onUploadError));        
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

        DataService.loadStuff(requestUrl+'resources/protected/file/getallimages?id='+userId)
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

function CrudService($q, $http, $state) {
    
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
        var autourl = window.location.href
        var arr = autourl.split('/');
        autourl = arr[0] + '//' + arr[2];
        var header = hawk.client.header(uploadUrl, method, options);
        console.log("uploadUrl: "+uploadUrl)
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
        var header = createAuthorizationHeader(uploadUrl,'POST');
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined,
                        'Authorization': header.field}
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
        console.log(objData);
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
        console.log(objData+' '+url);
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
        console.log("### createAuthorizationHeader #####")
        var myLS = JSON.parse(localStorage.getItem('LS')); 
        if(myLS == null) {
            console.log("myLS is null -- from createAuthorizationHeader -- from DataService");
            $state.go("welcome");
            return;
        }
        console.log("### got myLS #####", myLS)
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
        console.log("uploadUrl: "+uploadUrl)
        if (header.err != null) {
            // alert(header.err);
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
            console.log("header == null -- from DataService -- from loadStuff")
            return;
        }

        $http({
            method: 'GET',
            url: url,
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization': header.field
                // 'ts' :  authObj.Auth.ts,
                // 'nonce' :  authObj.Auth.nonce,
                // 'mac' :  authObj.Auth.mac,
                // 'accountId' : authObj.accountid
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