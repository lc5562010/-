app.controller('editActivityCtrl',function ($scope,$http) {
	var ue_edit = UE.getEditor('editor_edit');
//	图片预览
	$("#ment_editactivity").change(function() {  
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
    	} else if(a.length >= 2) {
    		alert("您最多可以上传1张图片！");
    	}
    });
//  取消添加活动
	$("#cancel_activity").click(function() {
		window.location.href="#/activity";
	})
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
    })
//  修改活动请求
	ue_edit.ready(function() {
		$scope.edit_activity=function() {
			var activityId=sessionStorage.getItem("edit_activity_id");
	        $http({
	            method:'post',          
	            url:serviceURL+'/Activity/findById',
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
	            $scope.edit_activityInfo=res.data.msg;
	            var value = res.data.msg.spared3;
	            ue_edit.execCommand('insertHtml', value);
	        })
		}
		$scope.edit_activity();
	})
	
//  添加活动
	ue_edit.ready(function() {
	    
		$scope.edit_activity_sub=function() {
			var activityId=sessionStorage.getItem("edit_activity_id");
			var spared3=ue_edit.getAllHtml();
			var options_editactivity={
	            url:serviceURL+'/Activity/addActivity',
	            data:{spared3:spared3,activityId:activityId},
	            success:function(responseResult){
	                var res=JSON.parse(responseResult);
	                console.log(res);
	                if(res.code=='200'){
	                    window.location.href="#/activity";
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
	        $("#edit_activityform").ajaxSubmit(options_editactivity);
	        return false;
		}
		
	});
})