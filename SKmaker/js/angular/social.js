app.controller('socialCtrl',function ($scope,$http) {
	//	请求所有朋友圈
	var pageNo_social=sessionStorage.getItem("pageNo_social");
	if(pageNo_social == null) {
        var pageNo_social=1;
    }
	$http({
        method:'post',          
        url:serviceURL+'/CircleFriends/find',
        data:{pageNo:pageNo_social,pageSize:5,focusPeopleid:0},
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
        	for(var i=0;i<res.data.msg.list.length;i++) {
        		if(res.data.msg.list[i].userUrl == "") {
	        		res.data.msg.list[i].userUrl="img/user.png";
	        	} else {
	        		res.data.msg.list[i].userUrl=serviceURL+res.data.msg.list[i].userUrl;
	        	}
	        	if(res.data.msg.list[i].imageMessage !== "") {
	        		res.data.msg.list[i].imageMessage=res.data.msg.list[i].imageMessage.split(",");
	        		for( var h=0; h<res.data.msg.list[i].imageMessage.length; h++) {
	        			res.data.msg.list[i].imageMessage[h]=serviceURL+res.data.msg.list[i].imageMessage[h];
	        		}
	        	}
	        	for(var j=0;j<res.data.msg.list[i].ReplyRecord.length;j++) {
	        		if(res.data.msg.list[i].ReplyRecord[j].byReplyname == "") {
	        			res.data.msg.list[i].ReplyRecord[j].byReplyname=res.data.msg.list[i].userName;
	        		}
	        	}
        	}
        }
        $scope.socialInfo=res.data.msg.list;
       	layui.use('laypage', function(){
		    var laypage = layui.laypage;
			laypage.render({
		        elem: 'test_social' //注意，这里的 test1 是 ID，不用加 # 号
				,count: res.data.msg.totalRecords //数据总数，从服务端得到
				,curr: pageNo_social
		        ,limit: 5
		        ,jump: function(obj, first){
				    //obj包含了当前分页的所有参数，比如：
				    //首次不执行
				    if(!first){
					    $http({
					        method:'post',          
					        url:serviceURL+'/CircleFriends/find',
					        data:{pageNo:obj.curr,pageSize:obj.limit,focusPeopleid:0},
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
							sessionStorage.setItem("pageNo_social",obj.curr);
					        if(res.data.result !== "查询为空") {
					        	for(var i=0;i<res.data.msg.list.length;i++) {
									if(res.data.msg.list[i].userUrl == "") {
										res.data.msg.list[i].userUrl="img/user.png";
									} else {
										res.data.msg.list[i].userUrl=serviceURL+res.data.msg.list[i].userUrl;
									}
									if(res.data.msg.list[i].imageMessage !== "") {
										res.data.msg.list[i].imageMessage=res.data.msg.list[i].imageMessage.split(",");
										for( var h=0; h<res.data.msg.list[i].imageMessage.length; h++) {
											res.data.msg.list[i].imageMessage[h]=serviceURL+res.data.msg.list[i].imageMessage[h];
										}
									}
									for(var j=0;j<res.data.msg.list[i].ReplyRecord.length;j++) {
										if(res.data.msg.list[i].ReplyRecord[j].byReplyname == "") {
											res.data.msg.list[i].ReplyRecord[j].byReplyname=res.data.msg.list[i].userName;
										}
									}
								}
					        }
					        $scope.socialInfo=res.data.msg.list;
					    })
				    }
				}
		    });
		})
    })
//	删除朋友圈
	$scope.del_social=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var friendId=x[e].friendId;
            $http({
                method:'post',          
                url:serviceURL+'/CircleFriends/del',
                data:{friendId:friendId},
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