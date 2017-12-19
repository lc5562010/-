app.controller('addActivityCtrl',function ($scope,$http) {
	var ue = UE.getEditor('editor');
//	图片预览
	$("#ment_addactivity").change(function() {  
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
//  添加活动
	ue.ready(function() {
	    
		$scope.addActivity=function() {
			var spared3=ue.getAllHtml();
			console.log(spared3);
			var options_addactivity={
	            url:serviceURL+'/Activity/addActivity',
	            data:{spared3:spared3},
	            success:function(responseResult){
	                var res=JSON.parse(responseResult);
	                console.log(res);
	                if(res.code=='200'){
	                    window.location.href="#/activity";
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
	        $("#add_activityform").ajaxSubmit(options_addactivity);
	        return false;
		}
		
	});
})