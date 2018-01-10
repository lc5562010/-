app.controller('informationCtrl',function ($scope,$http) {
//	添加跳转
	$("#add_information").click(function() {
		window.location.href="#/addInformation";
	})
//	修改跳转
	$scope.edit_information=function(e,x) {
		var messageId=x[e].messageId;
		sessionStorage.setItem('edit_information_id',messageId);
		window.location.href="#/editInformation";
	}
//	查询资讯
	$scope.query_information=function(){
		var pageNo_information=sessionStorage.getItem("pageNo_information");
		if(pageNo_information == null) {
			var pageNo_information=1;
		}
		$http({
	        method:'post',          
	        url:serviceURL+'/Message/find',
	        data:{pageNo:pageNo_information,pageSize:10},
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
	        $scope.informationInfo=res.data.msg.list;
	        layui.use('laypage', function(){
			    var laypage = layui.laypage;
				laypage.render({
			        elem: 'test_information' //注意，这里的 test1 是 ID，不用加 # 号
					,count: res.data.msg.totalRecords //数据总数，从服务端得到
					,curr: pageNo_information
			        ,limit: 10
			        ,jump: function(obj, first){
					    //obj包含了当前分页的所有参数，比如：
					    //首次不执行
					    if(!first){
						    $http({
						        method:'post',          
						        url:serviceURL+'/Message/find',
						        data:{pageNo:obj.curr,pageSize:obj.limit},
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
								sessionStorage.setItem("pageNo_information",obj.curr);
						        if(res.data.result !== "查询为空") {
							        for(var xx=0;xx<res.data.msg.list.length;xx++){
							            res.data.msg.list[xx].pictureSite=serviceURL+res.data.msg.list[xx].pictureSite;
							            res.data.msg.list[xx].htmlLocation=serviceURL+res.data.msg.list[xx].htmlLocation;
							        }
							    }
						        $scope.informationInfo=res.data.msg.list;
						    })
					    }
					}
			    });
			})
	    })
	}
	$scope.query_information();
//查看资讯详情
	$scope.query_informationInfo=function(e,x) {
		var informationUrl=x[e].htmlLocation;
		window.location.href=informationUrl;
	}
//	删除资讯
	$scope.del_information=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var messageId=x[e].messageId;
            $http({
                method:'post',          
                url:serviceURL+'/Message/deleteMessageById',
                data:{messageId:messageId},
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
})