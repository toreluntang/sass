/**
 * @ngInject
 */

function CrudService($q, $http) {
    
    var service = {
        createItem: createItem,
        createItemAuth: createItemAuth,
        updateItem: updateItem,
        deleteItem: deleteItem,
        uploadFileToUrl: uploadFileToUrl
    };
    return service;

    function createAuthorizationHeader(uploadUrl, method) {
        var myLS = JSON.parse(localStorage.getItem('myLS')); 
        var credentials = {
            id: myLS.accountId,
            algorithm: 'sha256',
            key: myLS.keyid
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
    function uploadFileToUrl(file, uploadUrl) {
        var def = $q.defer();

        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
            console.log("SUCCESS : uploadFileToUrl")
            def.resolve();
        })
        .error(function(){
            console.log("ERROR : uploadFileToUrl")
            def.reject("Failed to uploadFileToUrl");
        });

        return def.promise;
    }
    function createItem(objData, url, authObj) {
        var def = $q.defer();
        console.log(objData)
        var header = createAuthorizationHeader(url,'POST');
        // var ts = "";
        // var nonce = "";
        // var mac = "";
        // var accountid = "";
        // if(authObj.Auth.ts != "") ts = authObj.Auth.ts;
        // if(authObj.Auth.nonce != "") nonce = authObj.Auth.nonce;
        // if(authObj.Auth.mac != "") mac = authObj.Auth.mac;
        // if(authObj.accountid != "") mac = authObj.accountid;
        $http({
            method: 'POST',
            url: url,
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded',
                // 'ts' :  ts,
                // 'nonce' : nonce,
                // 'mac' :  mac,
                // 'accountId' : accountid,
                // 'XRequestHeaderToProtect': 'secret',
                'Authorization': header.field
            },
            data: $.param(objData)
        })
        .success(function(data) {
            def.resolve(data);
        })
        .error(function() {
            def.reject("Failed to create item");
        });
        return def.promise;
    }
    function createItemAuth(objData, url) {
        var def = $q.defer();
        console.log(objData)
        $http({
            method: 'POST',
            url: url,
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded'
            },
            data: $.param(objData)
        })
        .success(function(data) {
            def.resolve(data);
        })
        .error(function() {
            def.reject("Failed to create item");
        });
        return def.promise;
    }
    //  function createItem(objData, url) { // PAUL
    //     var def = $q.defer();
    //     console.log(objData)
    //     var header = createAuthorizationHeader(url,'POST');
    //     $http.post(url, objData, {
    //         transformRequest: angular.identity,
    //         headers: {
    //             'Content-Type': undefined,
    //             'XRequestHeaderToProtect': 'secret',
    //             'Authorization': header.field
    //         }
    //     })
    //     .success(function(data) {
    //         def.resolve(data);
    //     })
    //     .error(function() {
    //         def.reject("Failed to create item");
    //     });
    //     return def.promise;
    // }
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