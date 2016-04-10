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