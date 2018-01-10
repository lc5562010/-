app.controller('ferenceCtrl',function ($scope,$http) {
//	时间选择器
	layui.use('laydate', function(){
	    var laydate = layui.laydate;
	    laydate.render({
	        elem: '#openTime' //指定元素
	        ,type: 'time'
    		,range: true
	    });
	    laydate.render({
	        elem: '#openTime_edit' //指定元素
	        ,type: 'time'
    		,range: true
	    });
	});
//	图片预览
	$("#ment_addference").change(function() {  
        var $file = $(this);  
        var a=[];
        var objUrl=$file[0].files;
        var windowURL = window.URL || window.webkitURL;  
        for (var i=0;i<objUrl.length;i++){
        	a.push(windowURL.createObjectURL(objUrl[i]));
        }
    	if(a.length == 1) {
    		$(".imgBox img").attr("src","");
    		$("#imageview").attr("src",a[0]);
    	} else if(a.length == 2) {
    		$(".imgBox img").attr("src","");
    		$("#imageview").attr("src",a[0]);
    		$("#imageview1").attr("src",a[1]);
    	} else if(a.length == 3) {
    		$(".imgBox img").attr("src","");
    		$("#imageview").attr("src",a[0]);
    		$("#imageview1").attr("src",a[1]);
    		$("#imageview2").attr("src",a[2]);
    	} else if(a.length == 4) {
    		$(".imgBox img").attr("src","");
    		$("#imageview").attr("src",a[0]);
    		$("#imageview1").attr("src",a[1]);
    		$("#imageview2").attr("src",a[2]);
    		$("#imageview3").attr("src",a[3]);
    	} else if(a.length >= 5) {
    		alert("您最多可以上传4张图片！");
    	}
    });
    $("#ment_editference").change(function() {  
        var $file = $(this);  
        var a=[];
        var objUrl=$file[0].files;
        var windowURL = window.URL || window.webkitURL;  
        for (var i=0;i<objUrl.length;i++){
        	a.push(windowURL.createObjectURL(objUrl[i]));
        }
    	if(a.length == 1) {
    		$(".imgBox img").attr("src","");
    		$("#imageview4").attr("src",a[0]);
    	} else if(a.length == 2) {
    		$(".imgBox img").attr("src","");
    		$("#imageview4").attr("src",a[0]);
    		$("#imageview5").attr("src",a[1]);
    	} else if(a.length == 3) {
    		$(".imgBox img").attr("src","");
    		$("#imageview4").attr("src",a[0]);
    		$("#imageview5").attr("src",a[1]);
    		$("#imageview6").attr("src",a[2]);
    	} else if(a.length == 4) {
    		$(".imgBox img").attr("src","");
    		$("#imageview4").attr("src",a[0]);
    		$("#imageview5").attr("src",a[1]);
    		$("#imageview6").attr("src",a[2]);
    		$("#imageview7").attr("src",a[3]);
    	} else if(a.length >= 5) {
    		alert("您最多可以上传4张图片！");
    	}
    });
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
        $scope.query_ference();
    })
//  添加会议室
	$scope.addFerence=function() {
		var options_addference={
            url:serviceURL+'/Conference/addConference',
            success:function(responseResult){
                var res=JSON.parse(responseResult);
                console.log(res);
                if(res.code=='200'){
                    window.location.reload(true);
                }else if(res.code=='500'){
                    alert('系统错误！');
                } else {
                	alert("添加失败！");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        }
        $("#add_ferenceform").ajaxSubmit(options_addference);
        return false;
	}
//	查询会议室
	$scope.query_ference=function(){
		var pageNo_ference=sessionStorage.getItem("pageNo_ference");
		if(pageNo_ference == null) {
			var pageNo_ference=1;
		}
		var spaceId=sessionStorage.getItem("stor_spaceId");
		$http({
	        method:'post',          
	        url:serviceURL+'/Conference/find',
	        data:{pageNo:pageNo_ference,pageSize:10,spaceId:spaceId,conferenceType:0},
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
		            if(res.data.msg.list[xx].conferenceState==0){
		                res.data.msg.list[xx].conferenceState='不可使用'
		            }
		            if(res.data.msg.list[xx].conferenceState==1){
		                res.data.msg.list[xx].conferenceState='需要审核'
		            }
		            if(res.data.msg.list[xx].conferenceState==2){
		                res.data.msg.list[xx].conferenceState='会员无需审核'
		            }
		            if(res.data.msg.list[xx].conferenceState==3){
		                res.data.msg.list[xx].conferenceState='对外开放'
		            }
		        }
		    }
	        $scope.ferenceInfo=res.data.msg.list;
	        layui.use('laypage', function(){
			    var laypage = layui.laypage;
				laypage.render({
			        elem: 'test_ference' //注意，这里的 test1 是 ID，不用加 # 号
					,count: res.data.msg.totalRecords //数据总数，从服务端得到
					,curr: pageNo_ference
			        ,limit: 10
			        ,jump: function(obj, first){
					    //obj包含了当前分页的所有参数，比如：
					    //首次不执行
					    if(!first){
						    $http({
						        method:'post',          
						        url:serviceURL+'/Conference/find',
						        data:{pageNo:obj.curr,pageSize:obj.limit,spaceId:spaceId,conferenceType:0},
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
								sessionStorage.setItem("pageNo_ference",obj.curr);
						        if(res.data.result !== "查询为空") {
							        for(var xx=0;xx<res.data.msg.list.length;xx++){
							            if(res.data.msg.list[xx].conferenceState==0){
							                res.data.msg.list[xx].conferenceState='不可使用'
							            }
							            if(res.data.msg.list[xx].conferenceState==1){
							                res.data.msg.list[xx].conferenceState='需要审核'
							            }
							            if(res.data.msg.list[xx].conferenceState==2){
							                res.data.msg.list[xx].conferenceState='会员无需审核'
							            }
							            if(res.data.msg.list[xx].conferenceState==3){
							                res.data.msg.list[xx].conferenceState='对外开放'
							            }
							        }
							    }
						        $scope.ferenceInfo=res.data.msg.list;
						    })
					    }
					}
			    });
			})
	    })
	}
	
//  修改会议室请求
	$scope.edit_ference=function(e,x) {
		var conferenceId=x[e].conferenceId;
        sessionStorage.setItem('edit_ference_id',conferenceId);
        $http({
            method:'post',          
            url:serviceURL+'/Conference/findById',
            data:{conferenceId:conferenceId},
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
			$scope.edit_ferenceInfo=res.data.msg;
			if(res.data.msg.conferencePicture !== "") {
                res.data.msg.conferencePicture=res.data.msg.conferencePicture.split(",");
                console.log(res.data.msg.conferencePicture.length);
                if(res.data.msg.conferencePicture.length == 1) {
                    $(".imgBox img").attr("src","");
    		        $("#imageview4").attr("src",serviceURL+res.data.msg.conferencePicture[0]);
                } else if(res.data.msg.conferencePicture.length == 2) {
                    $(".imgBox img").attr("src","");
                    $("#imageview4").attr("src",serviceURL+res.data.msg.conferencePicture[0]);
                    $("#imageview5").attr("src",serviceURL+res.data.msg.conferencePicture[1]);
                } else if(res.data.msg.conferencePicture.length == 3) {
                    $(".imgBox img").attr("src","");
                    $("#imageview4").attr("src",serviceURL+res.data.msg.conferencePicture[0]);
                    $("#imageview5").attr("src",serviceURL+res.data.msg.conferencePicture[1]);
                    $("#imageview6").attr("src",serviceURL+res.data.msg.conferencePicture[2]);
                } else if(res.data.msg.conferencePicture.length == 4) {
                    $(".imgBox img").attr("src","");
                    $("#imageview4").attr("src",serviceURL+res.data.msg.conferencePicture[0]);
                    $("#imageview5").attr("src",serviceURL+res.data.msg.conferencePicture[1]);
                    $("#imageview6").attr("src",serviceURL+res.data.msg.conferencePicture[2]);
                    $("#imageview7").attr("src",serviceURL+res.data.msg.conferencePicture[3]);
                }
            }
            function firstVisit(rId,rValue){
                var rObj = document.getElementById(rId);
                for(var i = 0;i < rObj.options.length;i++){
                    if(rObj.options[i].value == rValue){
                        rObj.options[i].selected = 'selected';
                        break ;
                    }
                }
            }
            firstVisit('spaceId_editference',res.data.msg.spaceId);
            firstVisit('conferenceState_edit',res.data.msg.conferenceState);
        })
	}
//	修改会议室提交
	$scope.edit_ference_sub=function(){
        var options_editFerence={
			url:serviceURL+'/Conference/addConference?conferenceId='+sessionStorage.getItem('edit_ference_id'),
            success:function (responseResult) {
                var res=JSON.parse(responseResult);
                if(res.code=='200'){
                    window.location.reload(true);
                }else if(res.code=='500'){
                    alert('系统错误！');
                } else {
                	alert("修改失败！");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        }
        $("#edit_ferenceform").ajaxSubmit(options_editFerence);
        return false;
    }
//	删除会议室
	$scope.del_ference=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var conferenceId=x[e].conferenceId;
            $http({
                method:'post',          
                url:serviceURL+'/Conference/deleteConference',
                data:{conferenceId:conferenceId},
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
	$("#spaceId_ference").change(function() {
		var spaceId_change=$('#spaceId_ference option:selected').val();
        sessionStorage.setItem("stor_spaceId",spaceId_change);
        $scope.number =sessionStorage.getItem('stor_spaceId');
        $scope.query_ference();
	})
})