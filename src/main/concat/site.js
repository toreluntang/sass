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
CrudService.$inject = ['$q', '$http'];
DataService.$inject = ['$q', '$http'];angular.element(document).ready(function (event) {
    console.log("angular is ready test");

    var modules = [];
    // modules.push('ngAnimate'); 
    modules.push('flux'); 
    modules.push('uiGmapgoogle-maps'); 
    modules.push('ui.router'); 
    modules.push('satellizer');

    angular
        .module('myCphMarathon', modules)
        .value('events', {
            'PINS_UPDATED' : 'pins_updated',
            'PINS_LOAD_ERROR' : 'pins_load_error',
            'PINS_ERROR' : 'pins_error',
            'USERS_UPDATED' : 'users_updated',
            'USERS_UPDATED_ERROR' : 'users_updated_error',
            'USERS_LOAD_ERROR' : 'users_load_error',
            'POSTS_UPDATED' : 'posts_updated',
            'POSTS_UPDATED_NEWEST' : 'posts_updated_newest',
            'POSTS_LOAD_ERROR' : 'posts_load_error',
            'COMMENTS_UPDATED' : 'comments_updated',
            'CATEGORIES_UPDATED' : 'categories_updated',

        })
        .value('actions', {
            'PINS_LOAD' : 'pins_load',
            'PINS_CREATE' : 'pin_create',
            'PINS_UPDATE' : 'pin_update',
            'PINS_DELETE' : 'pin_delete',
            'USERS_LOAD' : 'users_load',
            'USERS_CREATE' : 'user_create',
            'USERS_UPDATE' : 'user_update',
            'POSTS_LOAD' : 'posts_load',
            'POSTS_LOAD_NEWEST' : 'posts_load_newest',
            'COMMENTS_LOAD_NEWEST' : 'comments_load_newest',
            'POSTS_CREATE' : 'post_create',
            'POSTS_UPDATE' : 'post_update',
            'POSTS_DELETE' : 'post_delete',
            'COMMENTS_LOAD' : 'comments_load',
            'COMMENTS_CREATE' : 'comment_create',
            'COMMENTS_UPDATE' : 'comment_update',
            'COMMENTS_DELETE' : 'comment_delete',
            'COMMENTS_LOAD_FOR_POST': 'comments_load_for_post',
            'CATEGORIES_LOAD' : 'categories_load',
            'CATEGORIES_CREATE' : 'category_create',
            'CATEGORIES_UPDATE' : 'category_update',
            'CATEGORIES_DELETE' : 'category_delete',
        })
   
        .controller('MainCtrl', MainCtrl)
        .controller('HomeCtrl', HomeCtrl)
        .controller('DashboardCtrl', DashboardCtrl)
        .controller('GmapCtrl', GmapCtrl)
        .controller('FilterCtrl', FilterCtrl)
        .controller('PinsCtrl', PinsCtrl)
        .controller('PinsListCtrl', PinsListCtrl)
        .controller('AuthCtrl', AuthCtrl)
        .controller('UsersCtrl', UsersCtrl)
        .controller('PostCtrl', PostCtrl)
        .controller('CommentCtrl', CommentCtrl)
        .controller('CategoriesCtrl', CategoriesCtrl)
        .factory('DataService', DataService)
        .factory('CrudService', CrudService)
        .directive('tab', tab)
        .directive('rotateImage', rotateImage)
        .directive('pageAnimate', pageAnimate)
        .directive('animateFadeInOut', animateFadeInOut)
        .store('PinStore', PinStore)
        .store('UserStore', UserStore)
        .store('PostStore', PostStore)
        .store('CommentStore', CommentStore)
        .store('CategoryStore', CategoryStore)

        .config(config)        
        .run(run);
        
        
    // Bootstrap manually
    angular.bootstrap(angular.element('#ng-app'), ['myCphMarathon']);
});
/**
 * @ngInject
 */
function config ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/welcome');
    
    $stateProvider
        .state('welcome', {
            url: '/welcome',
            templateUrl: '../src/views/index.html',
            controller: 'AuthCtrl as auth'
        })
        .state('home', {
            url: '/home',
            templateUrl: '../src/views/home.html',
            controller: 'HomeCtrl as home'
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

function CrudService($q, $http) {
    
    var service = {
        createItem: createItem,
        updateItem: updateItem,
        deleteItem: deleteItem
    };
    return service;

    // implementation
     function createItem(objData, url) {
        var def = $q.defer();
        console.log(objData)
        $http({
            method: 'POST',
            url: url, //'/pins'
            headers: { 'Content-Type' : 'application/json' },
            data: objData
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
        $http({
            method: 'POST',
            url: url + '/' + objData.id,
            headers: { 'Content-Type' : 'application/json' },
            data: objData
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
        loadPins: loadPins,
        loadUsers: loadUsers,
        loadPosts: loadPosts,
        loadPostsNewest: loadPostsNewest,
        loadComments: loadComments,
        loadCategories: loadCategories,
        loadCommentsForPost: loadCommentsForPost
    };
    return service;

    // implementation
    function loadPins() {
        var def = $q.defer();

        $http.get("pins")
            .success(function(data) {
                def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to get pins");
            });
        return def.promise;
    }
    function loadUsers() {
        var def = $q.defer();

        $http.get("users")
            .success(function(data) {
                def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to get users");
            });
        return def.promise;
    }
    function loadPosts() {
        var def = $q.defer();

        $http.get("posts")
            .success(function(data) {
                def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to get posts");
            });
        return def.promise;
    }
    function loadPostsNewest(newestPost) {
        var def = $q.defer();

        $http.get("posts/" + newestPost.id)
            .success(function(data) {
                def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to get posts");
            });
        return def.promise;
    }
    function loadComments() {
        var def = $q.defer();

        $http.get("comments")
            .success(function(data) {
                def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to get comments");
            });
        return def.promise;
    }
    function loadCategories() {
        var def = $q.defer();

        $http.get("categories")
            .success(function(data) {
                def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to get categories");
            });
        return def.promise;
    }
    function loadCommentsForPost(postId) {
        var def = $q.defer();

        $http.get("comments/" + postId)
            .success(function(data) {
                def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to get comments");
            });
        return def.promise;
    }
}
})();
//# sourceMappingURL=site.js.map