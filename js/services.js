'use strict';

angular.module('conFusion.services', ['ngResource'])
        .constant("baseURL","http://localhost:3000/")
        .service('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {
        
                this.getDishes = function(){
                    
                    return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
                    
                };
    
                // implement a function named getPromotion
                // that returns a selected promotion.
                this.getPromotion = function() {
                    return   $resource(baseURL+"promotions/:id");;
                }
    
                        
        }])

        .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
    
            return $resource(baseURL+"leadership/:id");
    
        }])

        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
    
            return $resource(baseURL+"feedback/:id");
    
        }])

        .factory('favouriteFactory', ['$resource', 'baseURL', function($resource, baseURL) {
            var favFac = {};
            var favourites = [];
            
            favFac.addToFavourite = function(dishID){
                for(var curFavIndex = 0; curFavIndex < favourites.length; curFavIndex++)    {
                    if(favourites[curFavIndex].id == dishID)
                        return;                                        
                }
                favourites.push({id : dishID});
            }
            
            favFac.getFavourites = function(){
                return favourites;
            }
            
            favFac.deleteFromFavourites = function(dishIndex){
                for(var i = 0; i < favourites.length; i++){
                    if(dishIndex == favourites[i].id){
                        favourites.splice(i, 1);
                    }
                }
            }
            
            return favFac;
        }])
         

;
