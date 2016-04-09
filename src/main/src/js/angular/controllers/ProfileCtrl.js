/**
 * @ngInject
 */
function ProfileCtrl(DataService) {
    vm = this;

    vm.profiletest = "Profile Test";
    vm.myPic = "";
    vm.userId = '1';


    function onLoadImageCommentsSuccess(data) {
    	console.log("onLoadImageCommentsSuccess", data)
    }
    function onLoadImageCommentsError(error) {
    	console.log("onLoadImageCommentsError", error)
    }
    // function onUploadPicSuccess(data) {
    //     console.log("onUploadPicSuccess", data)
    // }
    // function onLoadImageCommentsError(error) {
    //     console.log("onLoadImageCommentsError", error)
    // }

    // vm.uploadPic = function uploadPic(myPic) {
    //     console.log("uploadPic clicked!!!", vm.myPic, myPic)
    //     var fd = new FormData();
    //     fd.append('file', vm.myPic);
    //     CrudService.createItem(fd, '/resources/file?userid=1')
    //         .then(angular.bind(this, onUploadPicSuccess), angular.bind(this, onUploadPicError));
    // }

    DataService.loadStuff('http://localhost:8080/sec/resources/comment?imageId=1')
        .then(angular.bind(this, onLoadImageCommentsSuccess), angular.bind(this, onLoadImageCommentsError));

}