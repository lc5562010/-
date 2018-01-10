app.controller('editInformationCtrl',function ($scope,$http) {
	var ue_editor_editinformation = UE.getEditor('editor_editinformation');
//	图片预览
	$("#ment_editinformation").change(function() {  
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
//  取消添加资讯
	$("#cancel_information").click(function() {
		window.location.href="#/information";
	})
//  修改资讯请求
	ue_editor_editinformation.ready(function() {
		$scope.edit_information=function() {
			var messageId=sessionStorage.getItem("edit_information_id");
	        $http({
	            method:'post',          
	            url:serviceURL+'/Message/findMessageById',
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
				$scope.edit_informationInfo=res.data.msg;
				if(res.data.msg.spacePicture !== "") {
					$("#imageview").attr("src",serviceURL+res.data.msg.pictureSite);
				}
	            var value = res.data.msg.spared3;
	            ue_editor_editinformation.execCommand('insertHtml', value);
	        })
		}
		$scope.edit_information();
	})
	
//  修改资讯
	ue_editor_editinformation.ready(function() {
	    
		$scope.edit_information_sub=function() {
			var messageId=sessionStorage.getItem("edit_information_id");
			var spared3=ue_editor_editinformation.getAllHtml();
			var options_editinformation={
	            url:serviceURL+'/Message/addMessageOrUpdate',
	            data:{spared3:spared3,messageId:messageId},
	            success:function(responseResult){
	                var res=JSON.parse(responseResult);
	                console.log(res);
	                if(res.code=='200'){
	                    window.location.href="#/information";
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
	        $("#edit_informationform").ajaxSubmit(options_editinformation);
	        return false;
		}
		
	});
})