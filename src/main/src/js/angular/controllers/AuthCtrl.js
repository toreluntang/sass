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