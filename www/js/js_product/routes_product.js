
angular.module('starter.productRoutes', ['starter.productsController'])

.config(function($stateProvider, $urlRouterProvider) {

  // route product list
  $stateProvider.state('app.products', {
    url: '/products',
    cache: true,
    views: {
      'menuContent': {
       controller: 'productsCtrl',
       templateUrl: 'templates/views_product/productList.html'
      }
    }
  })

  // route detail product
  $stateProvider.state('app.productDetail', {
    url: "/productDetail?productId&productName",
    cache: true,
    views: {
      'menuContent': {
       controller: 'ProductDetail_Controller',
       templateUrl: 'templates/views_product/productDetail.html'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
  
});
