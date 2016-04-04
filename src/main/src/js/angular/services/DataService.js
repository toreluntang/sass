/**
 * @ngInject
 */

function DataService($q, $http) {
    
    var service = {
        loadStuff: loadStuff,
       
    };
    return service;

    // implementation
    function loadStuff(url) {
        var def = $q.defer();

        $http.get(url)
            .success(function(data) {
                def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to load " + url);
            });
        return def.promise;
    }
}