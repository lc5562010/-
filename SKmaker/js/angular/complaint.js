app.controller('complaintCtrl',function ($scope,$http) {
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
        $scope.query_complaint();
    })
//	查询建议
	$scope.query_complaint=function(){
		var spaceId=sessionStorage.getItem("stor_spaceId");
		$http({
	        method:'post',          
	        url:serviceURL+'/Suggest/find',
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
		            if(res.data.msg.list[xx].state==0){
		                res.data.msg.list[xx].state='未查看'
		            }
		            if(res.data.msg.list[xx].state==1){
		                res.data.msg.list[xx].state='已查看'
		            }
		        }
		    }
	        $scope.complaintInfo=res.data.msg.list;
	        layui.use('laypage', function(){
			    var laypage = layui.laypage;
				laypage.render({
			        elem: 'test_complaint' //注意，这里的 test1 是 ID，不用加 # 号
			        ,count: res.data.msg.totalRecords //数据总数，从服务端得到
			        ,limit: 10
			        ,jump: function(obj, first){
					    //obj包含了当前分页的所有参数，比如：
					    //首次不执行
					    if(!first){
						    $http({
						        method:'post',          
						        url:serviceURL+'/Suggest/find',
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
							            if(res.data.msg.list[xx].state==0){
							                res.data.msg.list[xx].state='未查看'
							            }
							            if(res.data.msg.list[xx].state==1){
							                res.data.msg.list[xx].state='已查看'
							            }
							        }
							    }
						        $scope.complaintInfo=res.data.msg.list;
						    })
					    }
					}
			    });
			})
	    })
	}
	
//  修改建议状态
	$scope.edit_complaint=function(e,x) {
		var suggestId=x[e].suggestId;
        $http({
            method:'post',          
            url:serviceURL+'/Suggest/AddSuggest',
            data:{suggestId:suggestId,state:1},
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
            if(res.data.code == "200") {
            	window.location.reload(true);
            }
        })
	}
//	空间改变请求
	$("#spaceId_complaint").change(function() {
		var spaceId_change=$('#spaceId_complaint option:selected').val();
        sessionStorage.setItem("stor_spaceId",spaceId_change);
        $scope.number =sessionStorage.getItem('stor_spaceId');
        $scope.query_complaint();
	})
})