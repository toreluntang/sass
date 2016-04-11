/**
 * @ngInject
 */
function AuthCtrl($state, CrudService) {
    vm = this;
    vm.test = 'altceva';
    vm.username = "";
    vm.password = "";
    vm.usernameSignup = "";
    vm.passwordSignup = "";
    // vm.showSignup = false;

    vm.login = function login (username, password) {
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

    vm.signup = function signup (username, password) {
        // vm.showSignup = true;
        console.log("signup")
        if(username != "" && password != "") {
            var authObj = {username: username, password: password, email: username};
            var signupRequestPath = 'http://localhost:8080/sec/resources/account/create';
            CrudService.createItemAuth(authObj, signupRequestPath)
                .then(angular.bind(this, onSignupSuccess), angular.bind(this, onSignupError));
            
        } else {
            console.log("signup failed")
        }
    }

    function onLoginSuccess(data) {
        console.log("onLoginSuccess", data)

        // var newkgjsh = {"accountid":data.accountid,"Auth":data.Auth};

        localStorage.setItem('kgjsh', JSON.stringify(data));

        

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