
eduCrudServices.factory('dataFactory', [ '$resource', function ( $resource) {
    return function (uri) {
    	console.log("dataFactory:"+uri)
    	return $resource(uri , {}, {
    		getAll: {method:'GET', params:{}, headers:{'Access-Control-Allow-Credentials': true}, isArray:true},
			getCount: {method:'GET', params:{}, headers:{'Access-Control-Allow-Credentials': true}, isArray:false},
    		get: {method:'GET', params:{}, headers:{'Access-Control-Allow-Credentials': true}, isArray:false},
    		insert: {method:'POST', params:{}, headers:{'Access-Control-Allow-Credentials': true}, isArray:false},
    		update: {method:'PUT', params:{}, headers:{'Access-Control-Allow-Credentials': true}, isArray:false},
    		remove: {method:'DELETE', params:{}, headers:{'Access-Control-Allow-Credentials': true}, isArray:false}
    	});        
    };
}]);





