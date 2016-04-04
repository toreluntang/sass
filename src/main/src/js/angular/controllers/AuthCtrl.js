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