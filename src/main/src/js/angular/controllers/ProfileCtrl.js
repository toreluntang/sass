/**
 * @ngInject
 */
function ProfileCtrl($rootScope, $scope, $state, $location, DataService, CrudService) {
    vm = this;
    vm.profiletest = "Profile Test";
    vm.myPic = "";
    vm.fileTypeError = false;
    if (localStorage.getItem('LS')!=null) {
        vm.userId = JSON.parse(localStorage.getItem('LS')).accountId;
        if(vm.userId == null) {
            $state.go("welcome");
            return;
            }
    } else {
         $state.go("welcome");
            return;
    }
    vm.imageId = '1';
    vm.mySharer = "Test mySharer";
    vm.myFile = null;
    var requestUrl = $location.$$protocol + "://" + $location.$$host + ":" + $location.$$port + "/sec/";
   
    
    function onLoadImagesSuccess(imagesData) {
        _(imagesData).forEach(function(n) {
            n.showComments = false;
            n.path = $location.$$protocol + "://" + $location.$$host + ":" + $location.$$port + "/img/" + n.path;
            var LS = JSON.parse(localStorage.getItem('LS'));
            if(LS == null) {
                $state.go("welcome");
                return;
            }

            DataService.loadStuff(requestUrl+'resources/protected/comment?imageId=' + n.imageid)
            .then(angular.bind(this, onLoadImageCommentsSuccess), angular.bind(this, onLoadImageCommentsError));       

            function onLoadImageCommentsSuccess(data) {
                if(data.error){
                 } else {
                    n.imageComments = data;
                 }
            }
            function onLoadImageCommentsError(error) {
            }
        });
        vm.pictures = imagesData;

        if(!$scope.$$phase) $scope.$digest();
    }
    function onLoadImagesError(error) {
    }
    function onUploadPicSuccess(data) {
    }
    function onLoadImageCommentsError(error) {
    }
    function onCreateCommentSuccess(data) {
        getAllImages(vm.userId);
    }
    function onCreateCommentError(error) {
    }
    function onSharePicSuccess(data) {
    }
    function onSharePicError(error) {
    }

    function onLoadUsersSuccess(usersData) {
        vm.users = usersData;
    }
    function onLoadUsersError(error) {
    }
    function onUploadSuccess() {
        vm.fileTypeError = false;
        getAllImages(vm.userId);
        if(!$scope.$$phase) $scope.$digest();
    }
    function onUploadError(error) {
        vm.fileTypeError = true;
    }

    vm.inputUpload = function inputUpload() {
        vm.fileTypeError = false;
    }

    vm.uploadPic = function uploadPic() {
        vm.fileTypeError = false;
        var file = vm.myFile;
        var uploadUrl = "resources/protected/file?userid="+vm.userId;
        CrudService.uploadFileToUrl(file, uploadUrl)
            .then(angular.bind(this, onUploadSuccess), angular.bind(this, onUploadError));
    }

    vm.addComment = function addComment(commBody, imageId) {
        commentData = {comment: commBody, userId: vm.userId, imageId: imageId};
        vm.commBody = "";
        var LS = JSON.parse(localStorage.getItem('LS'));

        CrudService.createItem(commentData, requestUrl+'resources/protected/comment', LS)
            .then(angular.bind(this, onCreateCommentSuccess), angular.bind(this, onCreateCommentError));
        
    }

    vm.shareWith = function shareWith(mySharer, imageid) {
        var sharingObject = {imageId: imageid, author: vm.userId, victim: mySharer};
        var LS = JSON.parse(localStorage.getItem('LS'));

        CrudService.createItem(sharingObject, requestUrl+'resources/protected/file/shareimage', LS)
            .then(angular.bind(this, onSharePicSuccess), angular.bind(this, onSharePicError));
    }

    vm.logout = function logout() {
        localStorage.removeItem('LS');
        $state.go('welcome'); 
    }


    function getAllImages(userId) {
        var LS = JSON.parse(localStorage.getItem('LS'));

        DataService.loadStuff(requestUrl+'resources/protected/file/getallimages?id='+userId)
            .then(angular.bind(this, onLoadImagesSuccess), angular.bind(this, onLoadImagesError));
    }
    function getAllUsers() {
        var LS = JSON.parse(localStorage.getItem('LS'));

        DataService.loadStuff(requestUrl+'resources/protected/account/getallusers')
            .then(angular.bind(this, onLoadUsersSuccess), angular.bind(this, onLoadUsersError));
    }

   getAllImages(vm.userId);
   getAllUsers();


   function stabilizeLoggedInUser (fromStateName) {

   }

   function onStateChangeSuccess(event, toState, toParams, fromState, fromParams) {
       stabilizeLoggedInUser(fromState.name);
   }


   $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);

}