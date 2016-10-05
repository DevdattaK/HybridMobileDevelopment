angular.module('conFusion.filters', [])

    .filter('favouriteFilter', function(){
        return function(dishes, favourites){
            var faouriteDishes = [];
            //if(favourites != undefined){
                for(var fav = 0; fav < favourites.length; fav++){
                    for(var dishIndex = 0; dishIndex < dishes.length; dishIndex++){
                        if(dishIndex == favourites[fav].id){
                            faouriteDishes.push(dishes[dishIndex]);
                        }
                    }
                }
            //}
            
            
            return faouriteDishes;
        }})

    .filter('integerRange', function(){return function(range, limit){
    limit = parseInt(limit);
    
    for(var i=1;i<=limit;i++)
        range.push(i);
    
    return range;
}})
;