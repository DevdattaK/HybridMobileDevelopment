angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userInfo', '{}');
  $scope.reservation = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal= modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

      $localStorage.storeObject('userInfo', $scope.loginData);
      
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
    
   // Create the reservation modal
  $ionicModal.fromTemplateUrl('templates/reservation.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reservationModel = modal;
  });
    
    // Triggered in the reservation modal to close it
  $scope.closeReserve = function() {
    $scope.reservationModel.hide();
  };

  // Open the reservation modal
  $scope.reserve = function() {
    $scope.reservationModel.show();
  };
    
  $scope.doReserve = function(){
      console.log('Reservation in progress', $scope.reservation);
      //simulating processing time.
      $timeout(function(){
          $scope.closeReserve();
      }, 1000);
      };
  
})

        .controller('MenuController', ['$scope', 'dishes', 'menuFactory', 'baseURL', 'favouriteFactory', '$ionicListDelegate', '$localStorage', function($scope, dishes, menuFactory, baseURL, favouriteFactory, $ionicListDelegate, $localStorage) {
            
            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
            
                        
            $scope.dishes = dishes;
                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
            
            $scope.addFavourite = function(dishid){                
                favouriteFactory.addToFavourite(dishid);
                $localStorage.storeObject('favourite', {id: dishid});
                $ionicListDelegate.closeOptionButtons();
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory','baseURL', '$ionicPopover', 'favouriteFactory', '$ionicModal', 'integerRangeFilter', function($scope, $stateParams, menuFactory, baseURL, $ionicPopover, favouriteFactory, $ionicModal, integerRangeFilter) {
            
            $scope.baseURL = baseURL;
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message="Loading ...";            
            $scope.mycomment = {rating:5, comment:"", author:""};
            
            $ionicPopover.fromTemplateUrl('templates/dishDetailPopover.html',{
                                         scope : $scope
                                        }).then(function(popover){
                                            $scope.popover = popover;
                                        });
            
            
            $ionicModal.fromTemplateUrl('templates/dishComment.html',{
                                         scope : $scope
                                        }).then(function(modal){
                                            $scope.dishCommentModal = modal;
                                        });
            
            
            
            $scope.submitComment = function(){ 
                $scope.dish.comments.push($scope.mycomment);
                menuFactory.update({id:$scope.dish.id},$scope.dish);
                $scope.dishCommentModal.hide();
            };
            
            $scope.showComment = function(){
                $scope.popover.hide();
                $scope.dishCommentModal.show();
            };
            
            $scope.closeComment = function(){
                $scope.dishCommentModal.hide();
            };
             
            $scope.dish = menuFactory.get({id:parseInt($stateParams.id,10)})
            .$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
            );

            //popover -> add favourite 
            $scope.addFavourite = function(){
                favouriteFactory.addToFavourite($scope.dish.id);
                $scope.popover.hide();
            }
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.dish.comments.push($scope.mycomment);
                menuFactory.update({id:$scope.dish.id},$scope.dish);
                
                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])

        // implement the IndexController and About Controller here

        .controller('IndexController', ['$scope', 'dish', 'leader', 'promotion', 'baseURL', function($scope, dish, leader, promotion, baseURL) {
                                        
                        $scope.baseURL = baseURL;
                        $scope.leader = leader;//corporateFactory.get({id:3});
                        $scope.showDish = false;
                        $scope.message="Loading ...";
                        $scope.dish = dish; //menuFactory.get({id:0})
                        /*
                        .$promise.then(
                            function(response){
                                $scope.dish = response;
                                $scope.showDish = true;
                            },
                            function(response) {
                                $scope.message = "Error: "+response.status + " " + response.statusText;
                            }
                        );
                        */
                        $scope.promotion = promotion; //promotionFactory.get({id:0});
            
                    }])

        .controller('AboutController', ['$scope', 'leaders', 'corporateFactory', 'baseURL', function($scope, leaders, corporateFactory, baseURL) {
            
                    $scope.baseURL = baseURL;
                    $scope.leaders = leaders;
                    console.log($scope.leaders);
            
                    }])

        .controller('FavouritesController', ['$scope', 'dishes', 'favourites', 'favouriteFactory', 'baseURL', '$ionicListDelegate', 'favouriteFilterFilter', '$ionicPopup', '$ionicLoading' , '$timeout' ,  function($scope, dishes, favourites, favouriteFactory, baseURL, $ionicListDelegate, favouriteFilterFilter, $ionicPopup, $ionicLoading , $timeout){
            
            $scope.baseURL = baseURL;
            $scope.shouldShowDelete = false;
            
                                
            $scope.dishes = dishes;
            
            /*
            menuFactory.query(
                
                function (response){
                    
                    $scope.dishes = response;
                    $timeout(function(){
                        $ionicLoading.hide();
                    }, 2000);
                },
                function (response){
                    $scope.message("Error - Dishes empty");
                    $timeout(function(){
                        $ionicLoading.hide();
                    }, 2000);
            });
            */
            
            $scope.favourites = favourites;
            
            $scope.toggleDelete = function(){
                $scope.shouldShowDelete = !$scope.shouldShowDelete;
            };
            
            $scope.getDishURL = function(){
                return $scope.baseURL + "dishes/:";
            }
            
            $scope.deleteFavourite = function(dishID){
                var confirmPopup = $ionicPopup.confirm({
                    title: "Confirm Deleted",
                    template : "Are you sure you want to delete this item?"
                });
                
                confirmPopup.then(function(res){
                    if(res){
                        favouriteFactory.deleteFromFavourites(dishID);
                    }else{
                        console.log('Cancel Delete');
                    }
                })                
                
                $scope.shouldShowDelete = false;
            };

        }])


        
;
