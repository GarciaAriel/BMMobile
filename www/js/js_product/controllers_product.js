angular.module('starter.productsController',['starter.constantsproduct','starter.productsServices'] )

// 
// CONTROLLER PRODUCT DETAIL
//
.controller('ProductDetail_Controller', function(service_product_detail,$state,PopupFactory,$scope,COLOR_VIEW,$stateParams,apiUrlLocal) {
  console.log('*******************************************************');
  console.log("==CONTROLLER PRODUCTS== detail product");
  console.log("state params product id",$stateParams.productId);
  console.log("state params product name",$stateParams.productName);
  
  $scope.myActiveSlide = 0;
  $scope.apiUrlLocal = apiUrlLocal;
  $scope.colorFont = COLOR_VIEW;

  // EXECUTE QUERY WITH (productId , productName)
  $scope.contact = service_product_detail.get({'productId': $stateParams.productId, "dto(productId)": $stateParams.productId, "dto(productName)": $stateParams.productName});

  // promise
  $scope.contact.$promise.then(function (results){
    
    // call factory to validate the response
    PopupFactory.getPopup($scope,results);

    console.log("results of request: ",results);

    $scope.entity = results.mainData.entity;

    $scope.productGroup = results.mainData.productGroupArray.filter(function ( obj ) {
      return obj.productGroup === $scope.entity.productGroup;
    })[0];

    $scope.productType = results.mainData.productTypeArray.filter(function ( obj ) {
      return obj.productTypeId === $scope.entity.productTypeId;
    })[0];

    $scope.vatType = results.mainData.vatArray.filter(function ( obj ) {
      return obj.vatId === $scope.entity.vatId;
    })[0];

    $scope.help = ['help'];
    $scope.iframeWidth = $(window).width();
    $scope.boolPicture = false;
    if (results.mainData.productPictureArray.length > 0) {
      $scope.productPictureArray = results.mainData.productPictureArray;
      $scope.productPictureDefault = $scope.productPictureArray[0];  
      $scope.boolPicture = true;
    }

  });
})

// 
// CONTROLLER PRODUCT LIST
//
.controller('productsCtrl', function(service_pruducts_list,$ionicHistory,PopupFactory,$filter,$ionicScrollDelegate,$scope,apiUrlLocal,$state,$ionicPopup) {
  console.log('*******************************************************');
  console.log("==CONTROLLER PRODUCTS==");

  $ionicHistory.clearHistory();   
  $scope.apiUrlLocal = apiUrlLocal;
  $scope.totalPages; 
  $scope.page = 1; 
  $scope.showSearchBar = false;
  $scope.products = [];
  $scope.asknext = false;
  
  // EXECUTE QUERY WITH ()
  $scope.newProducts = service_pruducts_list.query({'pageParam(pageNumber)':$scope.page});
  
  $scope.newProducts.$promise.then(function (results){
        
    // call factory to validate the response
    PopupFactory.getPopup($scope,results);
        
    console.log("results of request: ",results);
    
    $scope.products = (results['mainData'])['list'];
    $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
    $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
    console.log("page number: "+$scope.page+" total pages: "+$scope.totalPages);
    
    if ( $scope.totalPages > $scope.page ) {
      $scope.asknext = true;  
    };
  })

  $scope.hideSearch = function() {
    $scope.searchKey = "";
    $scope.showSearchBar = false;
  };    


  $scope.doRefresh = function() {
    console.log('*******************************************************');
    console.log("do refresh principal");
    $scope.page=1;
    $scope.searchKey = "";
    $scope.showSearchBar = false;
    $scope.asknext = false;
    $scope.$broadcast('scroll.infiniteScrollComplete');

    // EXECUTE QUERY WITH ()
    $scope.newProducts = service_pruducts_list.query({'pageParam(pageNumber)':$scope.page});

    // primise
    $scope.newProducts.$promise.then(function (results){

      // call factory to validate the response
      PopupFactory.getPopup($scope,results);

      console.log("results of request: ",results);

      $scope.products = results['mainData']['list'];
      $scope.page=parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
      $scope.$broadcast('scroll.refreshComplete'); 

      console.log("page number: "+$scope.page+" total pages: "+$scope.totalPages);
      
      if ( $scope.totalPages > $scope.page ) {
        $scope.asknext = true;
      };
      $ionicScrollDelegate.scrollTop();
    });
    $ionicScrollDelegate.scrollTop();
  };  

  $scope.getProductUrl = function(item){
    return '#/app/productDetail?productId='+item.productId+'&productName='+item.productName;
  };

  $scope.loadMore = function() {
    console.log('*******************************************************');
    console.log("loadMore principal");
  
    $scope.page = $scope.page + 1;
    
    // EXECUTE QUERY WITH ()
    $scope.newProducts = service_pruducts_list.query({'pageParam(pageNumber)':$scope.page});

    // promise
    $scope.newProducts.$promise.then(function(results){
    
      // call factory to validate the response
      PopupFactory.getPopup($scope,results);

      console.log("results of request: ",results);
    
      $scope.products = $scope.products.concat((results['mainData'])['list']);
      $scope.page=parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      
      console.log("page number: "+$scope.page+" total pages: "+$scope.totalPages);
      
      if ($scope.totalPages<$scope.page+1) {
        $scope.asknext = false;  
      };

    });
  };

  $scope.searchcon = function(){
    $scope.showSearchBar = !$scope.showSearchBar;
  }   
            
  $scope.search = function () {
    console.log('*******************************************************');
    console.log("search function");
    $scope.products = [];
    $scope.showSearchBar = !$scope.showSearchBar;
    $scope.asknext = false;
    $scope.page = 1;

    // EXECUTE QUERY WITH ()                        
    $scope.buscados = service_pruducts_list.query({'parameter(productName)':$scope.searchKey,'pageParam(pageNumber)':$scope.page});
    
    // PROMISE
    $scope.buscados.$promise.then(function (results){
          
      // call factory to validate the response
      PopupFactory.getPopup($scope,results);    

      console.log("results of request: ",results);

      $scope.products = (results['mainData'])['list'];
      $scope.page=parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
      
      console.log("page number: "+$scope.page+" total pages: "+$scope.totalPages);
          
      if ($scope.products.length > 0 && $scope.totalPages>$scope.page) {
        $scope.asknext = true;  
      }; 

      // if no exists items show message
      if ($scope.products.length == 0) {

        var message = $filter('translate')('NoItems');
        var messageRefresh = $filter('translate')('PulltoRefresh');
        // An alert dialog
        console.log("==CONTROLLER CONTACTS== alert if no exists items");
        var alertPopup = $ionicPopup.alert({
            title: message,
            template: messageRefresh
        });
      }
      $ionicScrollDelegate.scrollTop();

    });
        
    $scope.loadMore = function() {
      console.log('*******************************************************');
      console.log("loadMore dentro search");
      console.log("trying to load more of the search",$scope.page);
      $scope.page = $scope.page +1;
      $scope.asknext = false;

      // EXECUTE QUERY WITH ()
      $scope.buscados = service_pruducts_list.query({'parameter(productName)':$scope.searchKey,'pageParam(pageNumber)':$scope.page});

      // promise
      $scope.buscados.$promise.then(function(results){

        // call factory to validate the response
        PopupFactory.getPopup($scope,results);

        console.log("results of request: ",results);
        $scope.page=parseInt((results['mainData'])['pageInfo']['pageNumber']);
        $scope.totalPages=parseInt((results['mainData'])['pageInfo']['totalPages']);
        $scope.products = $scope.products.concat((results['mainData'])['list']);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
                 
      if ($scope.totalPages<$scope.page+1) {
        $scope.asknext = false;  
      };     
    };
  }
})