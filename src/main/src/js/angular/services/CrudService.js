/**
 * @ngInject
 */

function CrudService($q, $http, $state) {
    
    var service = {
        createItem: createItem,
        createItemAuth: createItemAuth,
        updateItem: updateItem,
        deleteItem: deleteItem,
        uploadFileToUrl: uploadFileToUrl
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
            alert(header.err);
            return null;
        }
        else
            return header;
    }

    // implementation
    function uploadFileToUrl(file, uploadUrl) {
        var def = $q.defer();
        var header = createAuthorizationHeader(uploadUrl,'POST');
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined,
                        'Authorization': header.field}
        })
        .success(function(){
            def.resolve();
        })
        .error(function(){
            def.reject("Failed to uploadFileToUrl");
        });

        return def.promise;
    }
    function createItem(objData, url, authObj) {
        var def = $q.defer();
        var header = createAuthorizationHeader(url,'POST');
       
        $http({
            method: 'POST',
            url: url,
            headers: { 
                'Content-Type' : 'application/x-www-form-urlencoded',
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
    function updateItem(objData, url) {
        var def = $q.defer();
        var header = createAuthorizationHeader(url,'POST');
        $http.post(url, objData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
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