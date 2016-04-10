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
        if(username != *)
        var authObj = {username: username, password: password};
        // CrudService.createItem(authObj, 'http://localhost:8080/sec/resources/account/login')
        //     .then(angular.bind(this, onLoginSuccess), angular.bind(this, onLoginError));

    }

    function onLoginSuccess() {
        console.log("onLoginSuccess")
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