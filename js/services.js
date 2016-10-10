'use strict';

angular.module('conFusion.services', ['ngResource'])
        .constant("baseURL","http://192.168.1.132:3000/")
        .factory('menuFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    
                return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
                    
            }])
                   
        .factory('promotionFactory', ['$resource', 'baseURL', function($resource,baseURL) {
                    return $resource(baseURL+"promotions/:id");               
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
         
        .factory('$localStorage', ['$window', function($window){
            return {
                store : function(key, value){
                    $window.localStorage[key] = value;
                },
                
                get : function(key, defaultValue){
                    return $window.localStorage[key] || defaultValue;
                },
                
                storeObject : function(key, obj){
                    var tempStr;
                    
                    if(typeof $window.localStorage[key] != 'undefined'){
                        tempStr = $window.localStorage[key] + ", ";
                        tempStr += JSON.stringify(obj);
                    }else{
                        tempStr = JSON.stringify(obj);
                    }
                    
                    $window.localStorage[key] = tempStr;
                },
                
                getObject : function(key, defaultValue){
                    return JSON.parse($window.localStorage[key] || defaultValue);
                }
                
            }
        }])
;
