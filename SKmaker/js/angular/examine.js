app.controller('examineCtrl',function ($scope,$http) { 
//	请求所有空间
	$http({
        method:'post',          
        url:serviceURL+'/Space/find',
        data:{pageNo:1,pageSize:10000},
        headers:{'Content-Type':'application/x-www-form-urlencoded'},  
        transformRequest: function(obj) {  
            var str = [];  
            for (var p in obj){  
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
            } 
            return str.join("&");
        }
    }).then(function(res){
        console.log(res);
        $scope.spaceInfo=res.data.msg.list;
        $scope.number =sessionStorage.getItem('stor_spaceId');
    })
//  请求审核列表
	$scope.query_examineference=function() {
		var spaceId=sessionStorage.getItem("stor_spaceId");
		if(sessionStorage.getItem('conferenceState')==null){
            sessionStorage.setItem("conferenceState",0);
            $scope.number_examineference =sessionStorage.getItem('conferenceState');
        }else{
            $scope.number_examineference =sessionStorage.getItem('conferenceState');
        }
        var conferenceState=sessionStorage.getItem("conferenceState");
        $http({
	        method:'post',          
	        url:serviceURL+'/Conferencedetails/find',
	        data:{pageNo:1,pageSize:10,spaceId:spaceId,conferenceState:conferenceState},
	        headers:{'Content-Type':'application/x-www-form-urlencoded'},  
	        transformRequest: function(obj) {  
	            var str = [];  
	            for (var p in obj){  
	                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
	            } 
	            return str.join("&");
	        }
	    }).then(function(res){
	        console.log(res);
	        $scope.examineferenceInfo=res.data.msg.list;
	    })
	}
	$scope.query_examineference();
})