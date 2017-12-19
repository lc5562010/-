app.controller('addInformationCtrl',function ($scope,$http) {
	var ue_addinformation = UE.getEditor('editor_information');
//	图片预览
	$("#ment_addinformation").change(function() {  
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
//  添加喜讯
	ue_addinformation.ready(function() {
	    
		$scope.addInformation=function() {
			var spared3=ue_addinformation.getAllHtml();
			var options_addinformation={
	            url:serviceURL+'/Message/addMessageOrUpdate',
	            data:{spared3:spared3},
	            success:function(responseResult){
	                var res=JSON.parse(responseResult);
	                console.log(res);
	                if(res.code=='200'){
	                    window.location.href="#/information";
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
	        $("#add_informationform").ajaxSubmit(options_addinformation);
	        return false;
		}
		
	});
})