/**
 * @ngInject
 */
function ProfileCtrl(DataService) {
    vm = this;

    vm.profiletest = "Profile Test";


    function onLoadImageCommentsSuccess(data) {
    	console.log("onLoadImageCommentsSuccess", data)
    }
    function onLoadImageCommentsError(error) {
    	console.log("onLoadImageCommentsError", error)
    }

    DataService.loadStuff('http://localhost:8080/sec/resources/comment?imageId=1')
        .then(angular.bind(this, onLoadImageCommentsSuccess), angular.bind(this, onLoadImageCommentsError));

}