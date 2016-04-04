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
ProfileCtrl.$inject = ['DataService'];
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

    vm.login = function login() {
    var username = 'test';
    var password = 'pass';
    var loginData = {
    	username: username,
    	password: password
    	};
    var promise = CrudService.createItem(loginData,apiPaths['login']);
    }
}
/**
 * @ngInject
 */
function ProfileCtrl(DataService) {
    vm = this;

    vm.profiletest = "Profile Test";


    function onLoadImageCommentsSuccess(data) {
    	console.log("onLoadImageCommentsSuccess", data)
    }
    function onLoadImageCommentsError(error) {
    	console.log("onLoadImageCommentsError", error)
    }

    DataService.loadStuff('http://localhost:8080/sec/resources/comment?imageId=1')
        .then(angular.bind(this, onLoadImageCommentsSuccess), angular.bind(this, onLoadImageCommentsError));

}
/**
 * @ngInject
 */

function CrudService($q, $http) {
    
    var service = {
        createItem: createItem,
        updateItem: updateItem,
        deleteItem: deleteItem
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
     function createItem(objData, url) {
        var def = $q.defer();
        console.log(objData)
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
    function loadStuff(url) {
        var def = $q.defer();

        $http.get(url)
            .success(function(data) {
                def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to load " + url);
            });
        return def.promise;
    }
}
})();
//# sourceMappingURL=site.js.map