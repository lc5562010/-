app.controller('spaceCtrl',function ($scope,$http) { 
//	时间选择器
	layui.use('laydate', function(){
	    var laydate = layui.laydate;
	    laydate.render({
	        elem: '#date_space' //指定元素
	        ,format: 'yyyy/MM/dd'
	    });
	    laydate.render({
	        elem: '#date_space_edit' //指定元素
	        ,format: 'yyyy/MM/dd'
	    });
	});
//	图片预览
	$("#ment").change(function() {  
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
    $("#ment_editspace").change(function() {  
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
//  图片显示
    $scope.show_img=function(x){
        $('#show_img').css('display','table');
        $('#show_img img').attr('src',x[0]);
        sessionStorage.setItem('show_img',x);
    }
    $('#show_img').click(function(){
        $('#show_img').css('display','none');
    })
    $('.right_btn').click(function(){
        var img=sessionStorage.getItem('show_img').split(',');
        var n= $('#show_img img').attr('src');
        for(var u=0;u<img.length;u++){
            if(n==img[u]){
                if(u==img.length-1){var h=0}else{var h=u+1}
                break;
            };
        }
        $('#show_img img').attr('src',img[h]);
        return false
    })
    $('.left_btn').click(function(){
        var img=sessionStorage.getItem('show_img').split(',');
        var n= $('#show_img img').attr('src');
        for(var u=0;u<img.length;u++){
            if(n==img[u]){
                if(u==0){var h=img.length-1}else{var h=u-1}
                break;
            };
        }
        $('#show_img img').attr('src',img[h]);
        return false
    })
//  查询空间
//	sessionStorage.setItem("pageNo_space",1);
	var pageNo_space=sessionStorage.getItem("pageNo_space");
	
	$http({
        method:'post',          
        url:serviceURL+'/Space/find',
        data:{pageNo:1,pageSize:5,staffId:staffId},
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
	            if(res.data.msg.list[xx].spaceState==0){
	                res.data.msg.list[xx].spaceState='运营中'
	            }
	            if(res.data.msg.list[xx].spaceState==1){
	                res.data.msg.list[xx].spaceState='未运营'
	            }
	            res.data.msg.list[xx].spacePicture=(res.data.msg.list[xx].spacePicture).split(',');
	            for(cc=0;cc<res.data.msg.list[xx].spacePicture.length;cc++){
	                res.data.msg.list[xx].spacePicture[cc]=serviceURL+res.data.msg.list[xx].spacePicture[cc];
	            }
	        }
	    }
        $scope.spaceInfo=res.data.msg.list;
        layui.use('laypage', function(){
		    var laypage = layui.laypage;
			laypage.render({
		        elem: 'test_space' //注意，这里的 test1 是 ID，不用加 # 号
		        ,count: res.data.msg.totalRecords //数据总数，从服务端得到
		        ,limit: 5
		        ,jump: function(obj, first){
				    //obj包含了当前分页的所有参数，比如：
				    //首次不执行
				    if(!first){
					    $http({
					        method:'post',          
					        url:serviceURL+'/Space/find',
					        data:{pageNo:obj.curr,pageSize:obj.limit,staffId:staffId},
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
					        sessionStorage.setItem("pageNo_space",obj.curr)
					        if(res.data.result !== "查询为空") {
						        for(var xx=0;xx<res.data.msg.list.length;xx++){
						            if(res.data.msg.list[xx].spaceState==0){
						                res.data.msg.list[xx].spaceState='运营中'
						            }
						            if(res.data.msg.list[xx].spaceState==1){
						                res.data.msg.list[xx].spaceState='未运营'
						            }
						            res.data.msg.list[xx].spacePicture=(res.data.msg.list[xx].spacePicture).split(',');
						            for(cc=0;cc<res.data.msg.list[xx].spacePicture.length;cc++){
						                res.data.msg.list[xx].spacePicture[cc]=serviceURL+res.data.msg.list[xx].spacePicture[cc];
						            }
						        }
						    }
					        $scope.spaceInfo=res.data.msg.list;
					    })
				    }
				}
		    });
		})
    })
//	添加空间  
	$scope.addSpace=function(){
		var creationTime = $("#date_space").val() + " 00:00:00";
		var options_addspace={
            url:serviceURL+'/Space/addSpace?creationTime='+creationTime,
            data:{staffId:staffId},
            success:function(responseResult){
                var res=JSON.parse(responseResult);
                console.log(res);
                if(res.code=='200'){
                    window.location.reload(true);
                }else if(res.code=='505'){
                    alert('无权限！');
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
        $("#add_spaceform").ajaxSubmit(options_addspace);
        return false;
	}
//	修改空间请求
	$scope.edit_space=function(e,x){
        var spaceId=x[e].spaceId;
        sessionStorage.setItem('edit_space_id',spaceId);
        $http({
            method:'post',          
            url:serviceURL+'/Space/findById',
            data:{spaceId:spaceId},
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
            $scope.edit_spaceInfo=res.data.msg;
            $scope.creationTime_edit=res.data.msg.creationTime.split(" ")[0];
            function firstVisit(rId,rValue){
                var rObj = document.getElementById(rId);
                for(var i = 0;i < rObj.options.length;i++){
                    if(rObj.options[i].value == rValue){
                        rObj.options[i].selected = 'selected';
                        break ;
                    }
                }
            }
            firstVisit('spaceState_edit',res.data.msg.spaceState);
        })
    }
//	修改空间提交
	$scope.edit_space_sub=function(){
		var creationTime = $("#date_space_edit").val() + " 00:00:00";
        var options_editSpace={
			url:serviceURL+'/Space/addSpace?spaceId='+sessionStorage.getItem('edit_space_id')+"&creationTime="+creationTime,
            success:function (responseResult) {
                var res=JSON.parse(responseResult);
                console.log(res);
                console.log(res.result);
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
        $("#edit_spaceform").ajaxSubmit(options_editSpace);
        return false;
    }
//	删除空间
	$scope.del_space=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var spaceId=x[e].spaceId;
            $http({
                method:'post',          
                url:serviceURL+'/Space/deleteSpace',
                data:{spaceId:spaceId,staffId:staffId},
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
                } else if(res.data.code=='505') {
                	alert("无操作权限！");
                } else {
                	alert("删除失败！");
                }
            })
        } 
    }
})