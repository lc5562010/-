app.controller('enterpriseCtrl',function ($scope,$http) {
//	图片预览
	$("#ment_addenterprise").change(function() {  
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
    $("#ment_editenterprise").change(function() {  
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
    	} else if(a.length >= 2) {
    		alert("您最多可以上传1张图片！");
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
        if(sessionStorage.getItem('enterprise_change')==null){
        	$scope.query_enterprise(4);
        	function firstVisit(rId,rValue){
                var rObj = document.getElementById(rId);
                for(var i = 0;i < rObj.options.length;i++){
                    if(rObj.options[i].value == rValue){
                        rObj.options[i].selected = 'selected';
                        break ;
                    }
                }
            }
            firstVisit('companyState_enterprise',4);
        } else {
	        var enterprise_change=sessionStorage.getItem("enterprise_change");
	        $scope.query_enterprise(enterprise_change);
	        function firstVisit(rId,rValue){
                var rObj = document.getElementById(rId);
                for(var i = 0;i < rObj.options.length;i++){
                    if(rObj.options[i].value == rValue){
                        rObj.options[i].selected = 'selected';
                        break ;
                    }
                }
            }
            firstVisit('companyState_enterprise',enterprise_change);
	    }
    })
//  添加企业
	$scope.addEnterprise=function() {
		var options_addenterprise={
            url:serviceURL+'/CompanyInfo/addCompanyInfo',
            success:function(responseResult){
                var res=JSON.parse(responseResult);
                console.log(res);
                if(res.code=='200'){
                    window.location.reload(true);
                }else if(res.code=='201'){
                    alert('无添加空间权限！');
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
        $("#add_enterpriseform").ajaxSubmit(options_addenterprise);
        return false;
	}
//	查询企业
	$scope.query_enterprise=function(x){
		var spaceId=sessionStorage.getItem("stor_spaceId");
		if(x == 4) {
			var data={pageNo:1,pageSize:10,spaceId:spaceId};
		} else if(x == 0) {
			var data={pageNo:1,pageSize:10,spaceId:spaceId,companyState:0};
		} else if(x == 1) {
			var data={pageNo:1,pageSize:10,spaceId:spaceId,companyState:1};
		} else if(x == 2) {
			var data={pageNo:1,pageSize:10,spaceId:spaceId,companyState:2};
		} else if(x == 3) {
			var data={pageNo:1,pageSize:10,spaceId:spaceId,companyState:3};
		}
		$http({
	        method:'post',          
	        url:serviceURL+'/CompanyInfo/find',
	        data:data,
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
		            if(res.data.msg.list[xx].companyState==0){
		                res.data.msg.list[xx].companyState='待审核';
		            }
		            if(res.data.msg.list[xx].companyState==1){
		                res.data.msg.list[xx].companyState='已通过';
		            }
		            if(res.data.msg.list[xx].companyState==2){
		                res.data.msg.list[xx].companyState='已拒绝';
		            }
		            if(res.data.msg.list[xx].companyState==3){
		                res.data.msg.list[xx].companyState='已搬出';
		            }
		            res.data.msg.list[xx].companyPicture=serviceURL+res.data.msg.list[xx].companyPicture;
		        }
		    }
	        $scope.enterpriseInfo=res.data.msg.list;
	        layui.use('laypage', function(){
			    var laypage = layui.laypage;
				laypage.render({
			        elem: 'test_enterprise' //注意，这里的 test1 是 ID，不用加 # 号
			        ,count: res.data.msg.totalRecords //数据总数，从服务端得到
			        ,limit: 10
			        ,jump: function(obj, first){
					    //obj包含了当前分页的所有参数，比如：
					    //首次不执行
					    if(x == 4) {
					    	var data1={pageNo:obj.curr,pageSize:obj.limit,spaceId:spaceId};
					    } else if(x == 0) {
					    	var data1={pageNo:obj.curr,pageSize:obj.limit,spaceId:spaceId,companyState:0};
					    } else if(x == 1) {
					    	var data1={pageNo:obj.curr,pageSize:obj.limit,spaceId:spaceId,companyState:1};
					    } else if(x == 2) {
					    	var data1={pageNo:obj.curr,pageSize:obj.limit,spaceId:spaceId,companyState:2};
					    } else if(x == 3) {
					    	var data1={pageNo:obj.curr,pageSize:obj.limit,spaceId:spaceId,companyState:3};
					    }
					    if(!first){
						    $http({
						        method:'post',          
						        url:serviceURL+'/CompanyInfo/find',
						        data:data1,
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
							            if(res.data.msg.list[xx].companyState==0){
							                res.data.msg.list[xx].companyState='待审核';
							            }
							            if(res.data.msg.list[xx].companyState==1){
							                res.data.msg.list[xx].companyState='已通过';
							            }
							            if(res.data.msg.list[xx].companyState==2){
							                res.data.msg.list[xx].companyState='已拒绝';
							            }
							            if(res.data.msg.list[xx].companyState==3){
							                res.data.msg.list[xx].companyState='已搬出';
							            }
							            res.data.msg.list[xx].companyPicture=serviceURL+res.data.msg.list[xx].companyPicture;
							        }
							    }
						        $scope.enterpriseInfo=res.data.msg.list;
						    })
					    }
					}
			    });
			})
	    })
	}
//	筛选条件改变请求
	$("#companyState_enterprise").change(function() {
		var enterprise_change=$('#companyState_enterprise option:selected').val();
		sessionStorage.setItem("enterprise_change",enterprise_change);
        $scope.query_enterprise(enterprise_change);
	})
//  修改企业请求
	$scope.edit_enterprise=function(e,x) {
		var companyId=x[e].companyId;
        sessionStorage.setItem('edit_enterprise_id',companyId);
        $http({
            method:'post',          
            url:serviceURL+'/CompanyInfo/findById',
            data:{companyId:companyId},
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
            $scope.edit_enterpriseInfo=res.data.msg;
            function firstVisit(rId,rValue){
                var rObj = document.getElementById(rId);
                for(var i = 0;i < rObj.options.length;i++){
                    if(rObj.options[i].value == rValue){
                        rObj.options[i].selected = 'selected';
                        break ;
                    }
                }
            }
            firstVisit('spaceId_editenterprise',res.data.msg.spaceId);
            firstVisit('companyType_edit',res.data.msg.companyType);
        })
	}
//	修改企业提交
	$scope.edit_enterprise_sub=function(){
        var options_editEnterprise={
			url:serviceURL+'/CompanyInfo/addCompanyInfo?companyId='+sessionStorage.getItem('edit_enterprise_id'),
            success:function (responseResult) {
                var res=JSON.parse(responseResult);
                if(res.code=='200'){
                    window.location.reload(true);
                }else if(res.code=='201'){
                    alert('无添加空间权限！');
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
        $("#edit_enterpriseform").ajaxSubmit(options_editEnterprise);
        return false;
    }
//	删除企业
	$scope.del_enterprise=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var companyId=x[e].companyId;
            $http({
                method:'post',          
                url:serviceURL+'/CompanyInfo/deleteCompanyInfo',
                data:{companyId:companyId},
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
//	通过企业
	$scope.sure_enterprise=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var companyId=x[e].companyId;
            $http({
                method:'post',          
                url:serviceURL+'/CompanyInfo/alterState',
                data:{companyId:companyId,companyState:1},
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
//	拒绝企业
	$scope.refuse_enterprise=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var companyId=x[e].companyId;
            $http({
                method:'post',          
                url:serviceURL+'/CompanyInfo/alterState',
                data:{companyId:companyId,companyState:2},
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
//	搬出企业
	$scope.move_enterprise=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var companyId=x[e].companyId;
            $http({
                method:'post',          
                url:serviceURL+'/CompanyInfo/alterState',
                data:{companyId:companyId,companyState:3},
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
	$("#spaceId_enterprise").change(function() {
		var spaceId_change=$('#spaceId_enterprise option:selected').val();
        sessionStorage.setItem("stor_spaceId",spaceId_change);
        $scope.number =sessionStorage.getItem('stor_spaceId');
        if(sessionStorage.getItem('enterprise_change')==null){
        	$scope.query_enterprise(4);
        	function firstVisit(rId,rValue){
                var rObj = document.getElementById(rId);
                for(var i = 0;i < rObj.options.length;i++){
                    if(rObj.options[i].value == rValue){
                        rObj.options[i].selected = 'selected';
                        break ;
                    }
                }
            }
            firstVisit('companyState_enterprise',4);
        } else {
	        var enterprise_change=sessionStorage.getItem("enterprise_change");
	        $scope.query_enterprise(enterprise_change);
	        function firstVisit(rId,rValue){
                var rObj = document.getElementById(rId);
                for(var i = 0;i < rObj.options.length;i++){
                    if(rObj.options[i].value == rValue){
                        rObj.options[i].selected = 'selected';
                        break ;
                    }
                }
            }
            firstVisit('companyState_enterprise',enterprise_change);
	    }
	})
})