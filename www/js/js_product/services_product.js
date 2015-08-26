angular.module('starter.productsServices', [])

.factory('service_product_detail', function ($resource,DETAIL_PRODUCT_URL,apiUrlLocal) {
  var url = apiUrlLocal+DETAIL_PRODUCT_URL;
  return $resource(url,{},{'query':{method:'GET', isArray:false} });
})

//SERVICE RESOURCE QUERY
.factory('service_pruducts_list', function($resource,apiUrlLocal,LIST_PRODUCTS_URL) {
  console.log('*******************************************************');
  console.log('==SERVICE PRODUCTS LIST==');
  var url = apiUrlLocal+LIST_PRODUCTS_URL;
  return $resource(url,{},{'query':{method:'GET', isArray:false}}); 
});