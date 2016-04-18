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