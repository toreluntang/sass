/**
 * @ngInject
 */
function ProfileCtrl($rootScope, $scope, DataService, CrudService, fileUpload) {
    vm = this;

    vm.profiletest = "Profile Test";
    vm.myPic = "";
    vm.userId = '1';
    vm.imageId = '1';
    vm.mySharer = "Test mySharer";
    vm.myFile = "";
    // vm.showComments = false;


    
    function onLoadImagesSuccess(imagesData) {
    	console.log("onLoadImagsSuccess RIGHT ONE")
        _(imagesData).forEach(function(n) { 
            console.log(n)
            n.showComments = false;
            DataService.loadStuff('http://localhost:8080/sec/resources/comment?imageId=' + n.imageid)
            .then(angular.bind(this, onLoadImageCommentsSuccess), angular.bind(this, onLoadImageCommentsError));       

            function onLoadImageCommentsSuccess(data) {
                console.log("onLoadImageCommentsSuccess", data)
                n.imageComments = data
            }
            function onLoadImageCommentsError(error) {
                console.log("onLoadImageCommentsError: no comments found for this image", error)

            }
        });
        console.log("Images after adding comments are: ", imagesData)
        vm.pictures = imagesData;


        
        

    }
    function onLoadImagesError(error) {
    	console.log("onLoadImagsError", error)
    }
    function onUploadPicSuccess(data) {
        console.log("onUploadPicSuccess", data)
    }
    function onLoadImageCommentsError(error) {
        console.log("onLoadImageCommentsError", error)
    }
    function onCreateCommentSuccess(data) {
        console.log("onCreateCommentSuccess", data)
        getAllImages(vm.userId);
    }
    function onCreateCommentError(error) {
        console.log("onCreateCommentError", error)
    }


    function onLoadUsersSuccess(usersData) {
        console.log("onLoadUsersSuccess USEEEEERS", usersData)
        vm.users = usersData;
    }
    function onLoadUsersError(error) {
        console.log("onLoadUsersError", error)
    }

    vm.uploadPic = function uploadPic() {
        console.log("uploadPic clicked!!!")
        var file = vm.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "resources/file?userid=1";
        fileUpload.uploadFileToUrl(file, uploadUrl);
        // var fd = new FormData();
        // fd.append('file', vm.myPic);
        // CrudService.createItem(fd, '/resources/file?userid=1')
        //     .then(angular.bind(this, onUploadPicSuccess), angular.bind(this, onUploadPicError));
    }

    vm.addComment = function addComment(commBody, imageId) {
        commentData = {comment: commBody, userId: vm.userId, imageId: imageId};
        vm.commBody = "";
        // console.log("commentData to be added is: ", commentData);
        CrudService.createItem(commentData, 'http://localhost:8080/sec/resources/comment')
            .then(angular.bind(this, onCreateCommentSuccess), angular.bind(this, onCreateCommentError));
        
    }

    vm.shareWith = function shareWith(mySharer) {
        console.log("share with", mySharer)
    }

    // vm.toggleComments = function toggleComments() {
    //     vm.showComments = !vm.showComments;
    // }


    

    function getAllImages(userId) {
        DataService.loadStuff('http://localhost:8080/sec/resources/file/getallimages?id='+userId)
            .then(angular.bind(this, onLoadImagesSuccess), angular.bind(this, onLoadImagesError));
    }
    function getAllUsers() {
        DataService.loadStuff('http://localhost:8080/sec/resources/account/getallusers')
            .then(angular.bind(this, onLoadUsersSuccess), angular.bind(this, onLoadUsersError));
    }

   getAllImages(vm.userId);
   getAllUsers();

}