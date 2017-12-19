app.controller('activityCtrl',function ($scope,$http) {
//	添加跳转
	$("#add_activity").click(function() {
		window.location.href="#/addActivity";
	})
//	修改跳转
	$scope.edit_activity=function(e,x) {
		var activityId=x[e].activityId;
		sessionStorage.setItem('edit_activity_id',activityId);
		window.location.href="#/editActivity";
	}
//	请求所有空间
	$http({
        method:'post',          
        url:serviceURL+'/Space/find',
        data:{pageNo:1,pageSize:10000,staffId:staffId},
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
        if(sessionStorage.getItem('stor_spaceId')==null){
            sessionStorage.setItem("stor_spaceId",res.data.msg.list[0].spaceId);
            $scope.number =sessionStorage.getItem('stor_spaceId');
        }else{
            $scope.number =sessionStorage.getItem('stor_spaceId');
        }
        $scope.query_activity();
    })
//	查询活动
	$scope.query_activity=function(){
		var spaceId=sessionStorage.getItem("stor_spaceId");
		$http({
	        method:'post',          
	        url:serviceURL+'/Activity/find',
	        data:{pageNo:1,pageSize:10,spaceId:spaceId},
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
	        if(res.data.result !== "查询为空") {
		        for(var xx=0;xx<res.data.msg.list.length;xx++){
		            res.data.msg.list[xx].pictureSite=serviceURL+res.data.msg.list[xx].pictureSite;
		            res.data.msg.list[xx].htmlLocation=serviceURL+res.data.msg.list[xx].htmlLocation;
		        }
		    }
	        $scope.activityInfo=res.data.msg.list;
	        layui.use('laypage', function(){
			    var laypage = layui.laypage;
				laypage.render({
			        elem: 'test_activity' //注意，这里的 test1 是 ID，不用加 # 号
			        ,count: res.data.msg.totalRecords //数据总数，从服务端得到
			        ,limit: 10
			        ,jump: function(obj, first){
					    //obj包含了当前分页的所有参数，比如：
					    //首次不执行
					    if(!first){
						    $http({
						        method:'post',          
						        url:serviceURL+'/Activity/find',
						        data:{pageNo:obj.curr,pageSize:obj.limit,spaceId:spaceId},
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
						        if(res.data.result !== "查询为空") {
							        for(var xx=0;xx<res.data.msg.list.length;xx++){
							            res.data.msg.list[xx].pictureSite=serviceURL+res.data.msg.list[xx].pictureSite;
							            res.data.msg.list[xx].htmlLocation=serviceURL+res.data.msg.list[xx].htmlLocation;
							        }
							    }
						        $scope.activityInfo=res.data.msg.list;
						    })
					    }
					}
			    });
			})
	    })
	}
//查看活动详情
	$scope.query_activityInfo=function(e,x) {
		var activityUrl=x[e].htmlLocation;
		window.location.href=activityUrl;
	}
//	删除活动
	$scope.del_activity=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var activityId=x[e].activityId;
            $http({
                method:'post',          
                url:serviceURL+'/Activity/deleteActivity',
                data:{activityId:activityId},
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
                if(res.data.code=='200'){
                    window.location.reload(true);
                }
            })
        } 
    }
//	空间改变请求
	$("#spaceId_activity").change(function() {
		var spaceId_change=$('#spaceId_activity option:selected').val();
        sessionStorage.setItem("stor_spaceId",spaceId_change);
        $scope.number =sessionStorage.getItem('stor_spaceId');
        $scope.query_activity();
	})
})