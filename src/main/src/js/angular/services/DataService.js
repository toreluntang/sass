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