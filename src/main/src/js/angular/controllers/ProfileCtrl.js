/**
 * @ngInject
 */
function ProfileCtrl($rootScope, $scope, $state, DataService, CrudService) {
    vm = this;

    vm.profiletest = "Profile Test";
    vm.myPic = "";
    vm.userId = '1';
    vm.imageId = '1';
    vm.mySharer = "Test mySharer";
    vm.myFile = "";
    // vm.loggedIn = "";
    // $rootScope.test = "####";
    // vm.onLoadImageCommentsSuccessERROR = false;
    // vm.showComments = false;
    // 


    
    function onLoadImagesSuccess(imagesData) {
    	console.log("onLoadImagsSuccess RIGHT ONE")
        _(imagesData).forEach(function(n) { 
            console.log(n)
            n.showComments = false;
            var kgjsh = JSON.parse(localStorage.getItem('kgjsh'));  
            DataService.loadStuff('http://localhost:8080/sec/resources/protected/comment?imageId=' + n.imageid, kgjsh)
            .then(angular.bind(this, onLoadImageCommentsSuccess), angular.bind(this, onLoadImageCommentsError));       

            function onLoadImageCommentsSuccess(data) {
                console.log("onLoadImageCommentsSuccess", data)
                if(data.error){
                    console.log("DATA ERROR onLoadImageCommentsSuccess")
                    // vm.onLoadImageCommentsSuccessERROR = true;
                 } else {
                    n.imageComments = data;
                    // vm.onLoadImageCommentsSuccessERROR = false;
                    
                 }
            }
            function onLoadImageCommentsError(error) {
                console.log("onLoadImageCommentsError: no comments found for this image", error)

            }
        });
        console.log("Images after adding comments are: ", imagesData)
        vm.pictures = imagesData;

        if(!$scope.$$phase) $scope.$digest();

        
        

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
    function onSharePicSuccess(data) {
        console.log("onSharePicSuccess", data)
    }
    function onSharePicError(error) {
        console.log("onSharePicError", error)
    }


    function onLoadUsersSuccess(usersData) {
        console.log("onLoadUsersSuccess USEEEEERS", usersData)
        vm.users = usersData;
    }
    function onLoadUsersError(error) {
        console.log("onLoadUsersError", error)
    }
    function onUploadSuccess() {
        console.log("onUploadSuccess: final from ProfileCtrl")
        getAllImages(vm.userId);
        if(!$scope.$$phase) $scope.$digest();
        console.log("### Tried to get all images ###")
    }
    function onUploadError(error) {
        console.log("onUploadError: final from ProfileCtrl", error)
    }

    vm.uploadPic = function uploadPic() { // USERID is HARDCODED
        console.log("uploadPic IRINA test onChange test", vm.myFile)
        var file = vm.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "resources/file?userid="+vm.userId;
        // Upload file to url start 
        CrudService.uploadFileToUrl(file, uploadUrl)
            .then(angular.bind(this, onUploadSuccess), angular.bind(this, onUploadError));
        // var fd = new FormData();
        // fd.append('file', file);
        // $http.post(uploadUrl, fd, {
        //     transformRequest: angular.identity,
        //     headers: {'Content-Type': undefined}
        // })
        // .success(function(){
        //     console.log("SUCCESS     NEW : uploadFileToUrl")
        // })
        // .error(function(){
        //     console.log("ERROR    NEW : uploadFileToUrl")
        // });
        // Upload file to url end 
        // fileUpload.uploadFileToUrl(file, uploadUrl);
        
    }

    vm.addComment = function addComment(commBody, imageId) {
        commentData = {comment: commBody, userId: vm.userId, imageId: imageId};
        vm.commBody = "";
        var kgjsh = JSON.parse(localStorage.getItem('kgjsh'));  
        // console.log("commentData to be added is: ", commentData);
        CrudService.createItem(commentData, 'http://localhost:8080/sec/resources/protected/comment', kgjsh)
            .then(angular.bind(this, onCreateCommentSuccess), angular.bind(this, onCreateCommentError));
        
    }

    vm.shareWith = function shareWith(mySharer, imageid) {
        console.log("share with", mySharer)
        var sharingObject = {imageId: imageid, author: vm.userId, victim: mySharer};
        console.log("sharingObject is: ", sharingObject)
        var kgjsh = JSON.parse(localStorage.getItem('kgjsh'));  
        CrudService.createItem(sharingObject, 'http://localhost:8080/sec/resources/protected/file/shareimage', kgjsh)
            .then(angular.bind(this, onSharePicSuccess), angular.bind(this, onSharePicError));
    }

    vm.logout = function logout() {
        localStorage.removeItem('LS');
        console.log("logout")
        // $rootScope.authenticated = false;
        $state.go('welcome'); // test
    }

    // vm.toggleComments = function toggleComments() {
    //     vm.showComments = !vm.showComments;
    // }


    

    function getAllImages(userId) {
        var kgjsh = JSON.parse(localStorage.getItem('kgjsh'));  
        DataService.loadStuff('http://localhost:8080/sec/resources/protected/file/getallimages?id='+userId, kgjsh)
            .then(angular.bind(this, onLoadImagesSuccess), angular.bind(this, onLoadImagesError));
    }
    function getAllUsers() {
        var kgjsh = JSON.parse(localStorage.getItem('kgjsh'));  
        DataService.loadStuff('http://localhost:8080/sec/resources/protected/account/getallusers', kgjsh)
            .then(angular.bind(this, onLoadUsersSuccess), angular.bind(this, onLoadUsersError));
    }

   getAllImages(vm.userId);
   getAllUsers();


   function stabilizeLoggedInUser (fromStateName) {
       console.log("stabilizeLoggedInUser")
      

       // if(fromStateName == "welcome") {
       //  console.log("fromStateName == welcome")
       //  $rootScope.authenticated = true;
       // } else {
       //  console.log("fromStateName == !!welcome")
       //  $state.go('welcome');
       // }
   }

   function onStateChangeSuccess(event, toState, toParams, fromState, fromParams) {
       console.log("ON STATE CHANGE SUCCESS!!!!!!!!!!!!!!!!!!", event, toState, toParams, fromState, fromParams, "!!!!!!!!!!!!!!!!")
       stabilizeLoggedInUser(fromState.name);
   }


   $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);

}