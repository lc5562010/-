app.controller('departmentCtrl',function ($scope,$http) {
	var departmentId_login=sessionStorage.getItem("departmentId_login");
	var zTreeObj;  
	var setting = {  
	    view : {  
	        enable : true,  
	        showLine : true,  
	        showIcon : showIconForTreeRight,  
	        addHoverDom: addHoverDom,  
	        removeHoverDom: removeHoverDom,  
	    },   
	    data : {  
	        simpleData : {  
	            enable : true,
	            idKey : "departmentId",       // 结点的id,对应到Json中的id  
                pIdKey : "superiorId",// 结点的pId,对应到Json中的parentId  
                rootPId : 0         // 根节点设置为0
	        },
	    	key : {  
                name : "departmentName" // 结点显示的name属性，对应到Json中的departName  
            }  
	    },  
	    callback : {  
	        onClick : zTreeOnClickRight,  
	        beforeRemove: beforeRemove,  
	        onRename: zTreeOnRename,  
	        onRemove: zTreeOnRemove,  
	    },  
	    edit:{  
	        enable: true,  
	        showRemoveBtn :true,  
	        showRenameBtn :true,  
	        removeTitle :"删除",  
	        renameTitle :"修改"  
	    }  
	};  
	  
	function showIconForTreeRight(treeId, treeNode) {  
	    return !treeNode.isParent;  
	};  
//页面加载请求全部员工
	$http({
        method:'post',          
        url:serviceURL+'/Staff/find',
        data:{pageNo:1,pageSize:10},
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
	            if(res.data.msg.list[xx].staffType==0){
	                res.data.msg.list[xx].staffType='最高管理员';
	            }
	            if(res.data.msg.list[xx].staffType==1){
	                res.data.msg.list[xx].staffType='普通管理员';
	            }
	            if(res.data.msg.list[xx].staffType==2){
	                res.data.msg.list[xx].staffType='员工';
	            }
	        }
	    }
        $scope.staffInfo=res.data.msg.list;
        layui.use('laypage', function(){
		    var laypage = layui.laypage;
			laypage.render({
		        elem: 'test_staff' //注意，这里的 test1 是 ID，不用加 # 号
		        ,count: res.data.msg.totalRecords //数据总数，从服务端得到
		        ,limit: 10
		        ,jump: function(obj, first){
				    //obj包含了当前分页的所有参数，比如：
				    //首次不执行
				    if(!first){
					    $http({
					        method:'post',          
					        url:serviceURL+'/Staff/find',
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
					        if(res.data.result !== "查询为空") {
						        for(var xx=0;xx<res.data.msg.list.length;xx++){
						            if(res.data.msg.list[xx].staffType==0){
						                res.data.msg.list[xx].staffType='最高管理员';
						            }
						            if(res.data.msg.list[xx].staffType==1){
						                res.data.msg.list[xx].staffType='普通管理员';
						            }
						            if(res.data.msg.list[xx].staffType==2){
						                res.data.msg.list[xx].staffType='员工';
						            }
						        }
						    }
					        $scope.staffInfo=res.data.msg.list;
					    })
				    }
				}
		    });
		})
    })
	// 树的单击事件  
	function zTreeOnClickRight(event, treeId, treeNode) {  
	    var treeid = zTreeObj.getSelectedNodes()[0].departmentId;  
	    var treepid = zTreeObj.getSelectedNodes()[0].superiorId;  
	    var treename = zTreeObj.getSelectedNodes()[0].departmentName; 
	    sessionStorage.setItem("departmentId",treeid);
	    $http({
	        method:'post',          
	        url:serviceURL+'/Staff/find',
	        data:{pageNo:1,pageSize:10,departmentId:treeid},
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
		            if(res.data.msg.list[xx].staffType==0){
		                res.data.msg.list[xx].staffType='最高管理员';
		            }
		            if(res.data.msg.list[xx].staffType==1){
		                res.data.msg.list[xx].staffType='普通管理员';
		            }
		            if(res.data.msg.list[xx].staffType==2){
		                res.data.msg.list[xx].staffType='员工';
		            }
		        }
		    }
	        $scope.staffInfo=res.data.msg.list;
	        layui.use('laypage', function(){
			    var laypage = layui.laypage;
				laypage.render({
			        elem: 'test_staff' //注意，这里的 test1 是 ID，不用加 # 号
			        ,count: res.data.msg.totalRecords //数据总数，从服务端得到
			        ,limit: 10
			        ,jump: function(obj, first){
					    //obj包含了当前分页的所有参数，比如：
					    //首次不执行
					    if(!first){
						    $http({
						        method:'post',          
						        url:serviceURL+'/Staff/find',
						        data:{pageNo:obj.curr,pageSize:obj.limit,departmentId:treeid},
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
							            if(res.data.msg.list[xx].staffType==0){
							                res.data.msg.list[xx].staffType='最高管理员';
							            }
							            if(res.data.msg.list[xx].staffType==1){
							                res.data.msg.list[xx].staffType='普通管理员';
							            }
							            if(res.data.msg.list[xx].staffType==2){
							                res.data.msg.list[xx].staffType='员工';
							            }
							        }
							    }
						        $scope.staffInfo=res.data.msg.list;
						    })
					    }
					}
			    });
			})
	    })  
	}  
//	修改节点
	function zTreeOnRename(event, treeId, treeNode, isCancel) {  
	    $http({
	        method:'post',          
	        url:serviceURL+'/Framework/addFramework',
	        data:{departmentName:treeNode.departmentName,departmentId:treeNode.departmentId,registerDepartmentId:departmentId_login},
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
            }else if(res.data.code=='504'){
                alert('无权限！');
            }else if(res.data.code=='505'){
                alert('无权限！');
            } else {
            	alert("修改失败！");
            }
	    })  
	}  
//	删除操作确认
	function beforeRemove(treeId, treeNode) {         
	    return confirm("确认删除 节点 -- " + treeNode.departmentName + " 吗？");  
	}  
	function zTreeOnRemove(event, treeId, treeNode) {  
        $http({
	        method:'post',          
	        url:serviceURL+'/Framework/deleteFramework',
	        data:{departmentId:treeNode.departmentId,registerDepartmentId:departmentId_login},
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
            }else if(res.data.code=='504'){
                alert('无权限！');
            }else if(res.data.code=='505'){
                alert('无权限！');
            } else {
            	alert("删除失败！");
            }
	    })
	}  
//	添加子节点
	function addHoverDom(treeId, treeNode) {  
	    var sObj = $("#" + treeNode.tId + "_span");  
	    var addBtn = $("#addBtn_" + treeNode.tId);
	    if (treeNode.editNameFlag || addBtn.length > 0) return;  
	    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='新增' onfocus='this.blur();'></span>";  
	    sObj.after(addStr);  
	    var btn = $("#addBtn_" + treeNode.tId);  
	    if (btn) btn.bind("click", function() {  
	    	$http({
		        method:'post',          
		        url:serviceURL+'/Framework/findById',
		        data:{departmentId:treeNode.departmentId},
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
		        var grade=res.data.msg.grade+1;
		        $http({
			        method:'post',          
			        url:serviceURL+'/Framework/addFramework',
			        data:{departmentName:"下级部门",superiorId:treeNode.departmentId,registerDepartmentId:departmentId_login,grade:grade},
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
			        	var newID = res.data.msg.departmentId;  
			            zTreeObj.addNodes(null, {  
			                departmentId: newID,  
			                departmentName: res.data.msg.departmentName,
			                superiorId: treeNode.departmentId
			            });  
			            var node = zTreeObj.getNodeByParam("departmentId", newID, null); //根据新的id找到新添加的节点  
			            zTreeObj.selectNode(node); //让新添加的节点处于选中状态+ 
		                window.location.reload(true);
		            }else if(res.data.code=='504'){
		                alert('无权限！');
		            }else if(res.data.code=='505'){
		                alert('无权限！');
		            } else {
		            	alert("添加失败！");
		            }
			    })
		    })
	        return false;  
	    });  
	}  
//  用于当鼠标移出节点时，隐藏用户自定义控件
	function removeHoverDom(treeId, treeNode) {  
	    $("#addBtn_"+treeNode.tId).unbind().remove();  
	}  
	  
//	显示ztree方法 
	function treeShow(data) {  
	    zTreeObj = $.fn.zTree.init($("#ztree1"), setting, data);  
	    zTreeObj.expandAll(true);  
	}  
//  初始化节点 
	$(function(){  
		$http({
	        method:'post',          
	        url:serviceURL+'/Framework/find',
	        data:{pageNo:1,pageSize:1000},
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
	        var data=res.data.msg.list;
	        treeShow(data);
	    })
	}); 
//	添加根节点
	$("#addcla").click(function(){ 
		$('#myModal_rootnode').modal('show'); 
	}) 
	$scope.addRootnode=function() {
		var name = $("#departmentName").val();
		$http({
	        method:'post',          
	        url:serviceURL+'/Framework/addFramework',
	        data:{departmentName:name,superiorId:0,registerDepartmentId:departmentId_login,grade:0},
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
	        	var newID = res.data.msg.departmentId;  
	            zTreeObj.addNodes(null, {  
	                departmentId: newID,  
	                departmentName: res.data.msg.departmentName,
	                superiorId: 0
	            });  
	            var node = zTreeObj.getNodeByParam("departmentId", newID, null); //根据新的id找到新添加的节点  
	            zTreeObj.selectNode(node); //让新添加的节点处于选中状态+ 
                window.location.reload(true);
            }else if(res.data.code=='504'){
                alert('无权限！');
            }else if(res.data.code=='505'){
                alert('无权限！');
            } else {
            	alert("添加失败！");
            }
	    }) 
	}
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
    })
//  添加员工
	var staffId_login=sessionStorage.getItem("staffId_login");
	$scope.addStaff=function() {
		var departmentId=sessionStorage.getItem("departmentId");
		var password = hex_md5($("#tel").val().slice(3));
		var options_addstaff={
            url:serviceURL+'/Staff/addStaff',
            data:{departmentId:departmentId,password:password,registerStaffId:staffId_login},
            success:function(responseResult){
                var res=JSON.parse(responseResult);
                console.log(res);
                if(res.code=='200'){
                    window.location.reload(true);
                }else if(res.code=='504'){
                    alert('无权限！');
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
        $("#add_staffform").ajaxSubmit(options_addstaff);
        return false;
	}
//  修改员工请求
	$scope.edit_staff=function(e,x) {
		var staffId=x[e].staffId;
        sessionStorage.setItem('edit_staff_id',staffId);
        $http({
            method:'post',          
            url:serviceURL+'/Staff/findById',
            data:{staffId:staffId},
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
            $scope.edit_staffInfo=res.data.msg;
            sessionStorage.setItem('edit_department_id',res.data.msg.departmentId);
            function firstVisit1(rId,rValue){
                var rObj = document.getElementById(rId);
                for(var i = 0;i < rObj.options.length;i++){
                    if(rObj.options[i].value == rValue){
                        rObj.options[i].selected = 'selected';
                        break ;
                    }
                }
            }
            firstVisit1('staffType_edit',res.data.msg.staffType);
            var spaceId_list=res.data.msg.spaceList.split(",");
            var HX=res.data.msg.jurisdiction.split(",");
			function firstVisit(rId,rValue){
                var rObj = document.getElementById(rId);
                for(var i = 0;i < rObj.options.length;i++){
                	for(var j=0;j<rValue.length;j++) {
						if(rObj.options[i].value == rValue[j]){
	                        rObj.options[i].selected = 'selected';
	                        break ;
	                    }
					} 
                }
            }
            firstVisit('jurisdiction_edit',HX);
            firstVisit('spaceList_edit',spaceId_list);
        })
	}
	$scope.cancel=function() {
		var pointsel_box=$("#jurisdiction_edit")[0];
		for (var i=0;i<pointsel_box.options.length;i++) {
			pointsel_box.options[i].selected = '';
		}
		var pointsel_box1=$("#spaceList_edit")[0];
		for (var i=0;i<pointsel_box1.options.length;i++) {
			pointsel_box1.options[i].selected = '';
		}
	}
//	修改员工提交
	$scope.edit_staff_sub=function(){
        var options_editStaff={
			url:serviceURL+'/Staff/addStaff',
			data:{departmentId:sessionStorage.getItem('edit_department_id'),staffId:sessionStorage.getItem('edit_staff_id'),registerStaffId:staffId_login},
            success:function (responseResult) {
                var res=JSON.parse(responseResult);
                if(res.code=='200'){
                    window.location.reload(true);
                }else if(res.code=='504'){
                    alert('无权限！');
                }else if(res.code=='505'){
                    alert('无权限！');
                }else {
                	alert("修改失败！");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        }
        $("#edit_staffform").ajaxSubmit(options_editStaff);
        return false;
    }
//	删除员工
	$scope.del_staff=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var staffId=x[e].staffId;
            $http({
                method:'post',          
                url:serviceURL+'/Staff/deleteStaff',
                data:{staffId:staffId,registerStaffId:staffId_login},
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
                } else if(res.data.code=='504') {
                	alert("无权限！");
                } else if(res.data.code=='505') {
                	alert("无权限！");
                } else {
                	alert("删除失败！");
                }
            })
        } 
    }
})