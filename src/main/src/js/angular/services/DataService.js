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