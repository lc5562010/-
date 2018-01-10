app.controller('accessCtrl',function ($scope,$http) {
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
        $scope.query_access();
        $scope.query_accessGroup();
    })
//  添加门禁
    $scope.addaccess=function() {
        var options_addaccess={
            url:serviceURL+'/Make/addDevice',
            success:function(responseResult){
                var res=JSON.parse(responseResult);
                console.log(res);
                if(res.statusCode=='1'){
                    window.location.reload(true);
                }else if(res.statusCode=='30001'){
                    alert('设备已被绑定！');
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
        $("#add_accessform").ajaxSubmit(options_addaccess);
        return false;
    }
//  添加门禁组
    $scope.addaccessGroup=function() {
        var options_addaccessGroup={
            url:serviceURL+'/LGrouping/AddLGrouping',
            data:{deviceId:""},
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
        $("#add_accessGroupForm").ajaxSubmit(options_addaccessGroup);
        return false;
    }
// 查询门禁组
    $scope.query_accessGroup=function(){
        var spaceId=sessionStorage.getItem("stor_spaceId");
        $http({
	        method:'post',          
	        url:serviceURL+'/LGrouping/find',
	        data:{pageNo:1,pageSize:1000,spaceId:spaceId},
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
            $scope.accessGroupInfo=res.data.msg.list;
        })
    }
//	查询门禁
    $scope.query_access=function(){
        // 时间戳转时间啦啦啦
        function add0(m){return m<10?'0'+m:m }
        function getLocalTime(now) {     
            var time = new Date(now);
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
        }
        var pageNo_access=sessionStorage.getItem("pageNo_access");
		if(pageNo_access == null) {
			var pageNo_access=1;
		}
		var spaceId=sessionStorage.getItem("stor_spaceId");
		$http({
	        method:'post',          
	        url:serviceURL+'/Make/find',
	        data:{pageNo:pageNo_access,pageSize:10,spaceId:spaceId},
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
		        for(var i=0;i<res.data.msg.list.length;i++){
		            if(res.data.msg.list[i].isOnline == "0") {
                        res.data.msg.list[i].isOnline ="离线";
                    }
                    if(res.data.msg.list[i].isOnline == "1") {
                        res.data.msg.list[i].isOnline ="在线";
                    }
                    if(res.data.msg.list[i].deviceType == "0") {
                        res.data.msg.list[i].deviceType ="进门门禁";
                    }
                    if(res.data.msg.list[i].deviceType == "1") {
                        res.data.msg.list[i].deviceType ="出门门禁";
                    }
                    if(res.data.msg.list[i].deviceType == "2") {
                        res.data.msg.list[i].deviceType ="普通门禁";
                    }
                    res.data.msg.list[i].makeTime=getLocalTime(res.data.msg.list[i].makeTime*1);
		        }
		    }
	        $scope.accessInfo=res.data.msg.list;
	        layui.use('laypage', function(){
			    var laypage = layui.laypage;
				laypage.render({
			        elem: 'test_access' //注意，这里的 test1 是 ID，不用加 # 号
					,count: res.data.msg.totalRecords //数据总数，从服务端得到
					,curr: pageNo_access
			        ,limit: 10
			        ,jump: function(obj, first){
					    //obj包含了当前分页的所有参数，比如：
					    //首次不执行
					    if(!first){
						    $http({
						        method:'post',          
						        url:serviceURL+'/Make/find',
						        data:{pageNo:obj.curr,pageSize:obj.limit,spaceId:spaceId},
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
								sessionStorage.setItem("pageNo_access",obj.curr);
						        if(res.data.result !== "查询为空") {
							        for(var i=0;i<res.data.msg.list.length;i++){
							            if(res.data.msg.list[i].isOnline == "0") {
                                            res.data.msg.list[i].isOnline ="离线";
                                        }
                                        if(res.data.msg.list[i].isOnline == "1") {
                                            res.data.msg.list[i].isOnline ="在线";
                                        }
                                        if(res.data.msg.list[i].deviceType == "0") {
                                            res.data.msg.list[i].deviceType ="进门门禁";
                                        }
                                        if(res.data.msg.list[i].deviceType == "1") {
                                            res.data.msg.list[i].deviceType ="出门门禁";
                                        }
                                        if(res.data.msg.list[i].deviceType == "2") {
                                            res.data.msg.list[i].deviceType ="普通门禁";
                                        }
                                        res.data.msg.list[i].makeTime=getLocalTime(res.data.msg.list[i].makeTime);
							        }
							    }
						        $scope.accessInfo=res.data.msg.list;
						    })
					    }
					}
			    });
			})
	    })
    }
//	点击侧导航查询门禁
    $scope.query_accessGrouptwo=function(e,x){
        var groupingId=x[e].groupingId;
        // 时间戳转时间啦啦啦
        function add0(m){return m<10?'0'+m:m }
        function getLocalTime(now) {     
            var time = new Date(now);
            var y = time.getFullYear();
            var m = time.getMonth()+1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
        }
        var pageNo_accessGroup=sessionStorage.getItem("pageNo_accessGroup");
        if(pageNo_accessGroup == null) {
            var pageNo_accessGroup=1;
        }
        $http({
            method:'post',          
            url:serviceURL+'/LGrouping/findD',
            data:{pageNo:pageNo_accessGroup,pageSize:10,groupingId:groupingId},
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
                for(var i=0;i<res.data.msg.list.length;i++){
                    if(res.data.msg.list[i].isOnline == "0") {
                        res.data.msg.list[i].isOnline ="离线";
                    }
                    if(res.data.msg.list[i].isOnline == "1") {
                        res.data.msg.list[i].isOnline ="在线";
                    }
                    if(res.data.msg.list[i].deviceType == "0") {
                        res.data.msg.list[i].deviceType ="进门门禁";
                    }
                    if(res.data.msg.list[i].deviceType == "1") {
                        res.data.msg.list[i].deviceType ="出门门禁";
                    }
                    if(res.data.msg.list[i].deviceType == "2") {
                        res.data.msg.list[i].deviceType ="普通门禁";
                    }
                    res.data.msg.list[i].makeTime=getLocalTime(res.data.msg.list[i].makeTime*1);
                }
            }
            $scope.accessInfo=res.data.msg.list;
            layui.use('laypage', function(){
                var laypage = layui.laypage;
                laypage.render({
                    elem: 'test_access' //注意，这里的 test1 是 ID，不用加 # 号
                    ,count: res.data.msg.totalRecords //数据总数，从服务端得到
                    ,curr: pageNo_accessGroup
                    ,limit: 10
                    ,jump: function(obj, first){
                        //obj包含了当前分页的所有参数，比如：
                        //首次不执行
                        if(!first){
                            $http({
                                method:'post',          
                                url:serviceURL+'/LGrouping/findD',
                                data:{pageNo:obj.curr,pageSize:obj.limit,groupingId:groupingId},
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
                                sessionStorage.setItem("pageNo_accessGroup",obj.curr);
                                if(res.data.result !== "查询为空") {
                                    for(var i=0;i<res.data.msg.list.length;i++){
                                        if(res.data.msg.list[i].isOnline == "0") {
                                            res.data.msg.list[i].isOnline ="离线";
                                        }
                                        if(res.data.msg.list[i].isOnline == "1") {
                                            res.data.msg.list[i].isOnline ="在线";
                                        }
                                        if(res.data.msg.list[i].deviceType == "0") {
                                            res.data.msg.list[i].deviceType ="进门门禁";
                                        }
                                        if(res.data.msg.list[i].deviceType == "1") {
                                            res.data.msg.list[i].deviceType ="出门门禁";
                                        }
                                        if(res.data.msg.list[i].deviceType == "2") {
                                            res.data.msg.list[i].deviceType ="普通门禁";
                                        }
                                        res.data.msg.list[i].makeTime=getLocalTime(res.data.msg.list[i].makeTime);
                                    }
                                }
                                $scope.accessInfo=res.data.msg.list;
                            })
                        }
                    }
                });
            })
        })
    }
// 修改时查询空间下所有门禁设备
    $scope.query_allDevides=function() {
        var spaceId=sessionStorage.getItem("stor_spaceId");
        $http({
            method:'post',          
            url:serviceURL+'/Make/find',
            data:{pageNo:1,pageSize:1000,spaceId:spaceId},
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
            $scope.deviceIdsInfo=res.data.msg.list;
        })
    }
//  修改门禁组请求
    $scope.edit_accessGroup=function(e,x) {
        $scope.query_allDevides();
        var groupingId=x[e].groupingId;
        sessionStorage.setItem('edit_accessGroup_id',groupingId);
        $http({
            method:'post',          
            url:serviceURL+'/LGrouping/findById',
            data:{groupingId:groupingId},
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
            $scope.edit_accessGroupInfo=res.data.msg; 
            setTimeout(function() {
                $("#deviceIds").val(res.data.msg.deviceId.split(",")).trigger("change");
            },500);
        })
        $('#myModal_accessGroup_edit').modal('show');
    }
//	修改门禁组提交
    $scope.edit_accessGroup_sub=function(){
        console.log($("#deviceIds").val());
        if($("#deviceIds").val() !== null) {
            var deviceId=$("#deviceIds").val().join(",");
        } else {
            var deviceId="";
        }
        var options_editaccessGroup={
            url:serviceURL+'/LGrouping/AddLGrouping',
            data:{groupingId:sessionStorage.getItem('edit_accessGroup_id'),deviceId:deviceId},
            success:function (responseResult) {
                var res=JSON.parse(responseResult);
                console.log(res);
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
        $("#edit_accessGroupform").ajaxSubmit(options_editaccessGroup);
        return false;
    }
//  修改门禁请求
    $scope.edit_access=function(e,x) {
        var deviceId=x[e].deviceId;
        sessionStorage.setItem('edit_access_id',deviceId);
    }
//	修改门禁提交
    $scope.edit_access_sub=function(){
        var options_editaccess={
            url:serviceURL+'/Make/updateDevice',
            data:{deviceId:sessionStorage.getItem('edit_access_id')},
            success:function (responseResult) {
                var res=JSON.parse(responseResult);
                console.log(res);
                if(res.statusCode=='1'){
                    window.location.reload(true);
                }else if(res.statusCode=='30001'){
                    alert('设备已被绑定！');
                } else {
                    alert("更新失败！");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        }
        $("#edit_accessform").ajaxSubmit(options_editaccess);
        return false;
    }
//	删除门禁组
    $scope.del_accessGroup=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var groupingId=x[e].groupingId;
            $http({
                method:'post',          
                url:serviceURL+'/LGrouping/deleteLGrouping',
                data:{groupingId:groupingId},
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
                } else {
                    alert("删除失败！");
                }
            })
        } 
    }
//	删除门禁
    $scope.del_access=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var deviceId=x[e].deviceId;
            $http({
                method:'post',          
                url:serviceURL+'/Make/delDevice',
                data:{deviceId:deviceId},
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
                if(res.data.statusCode=='1'){
                    window.location.reload(true);
                }
            })
        } 
    }
//	空间改变请求
    $("#spaceId_access").change(function() {
        var spaceId_change=$('#spaceId_access option:selected').val();
        sessionStorage.setItem("stor_spaceId",spaceId_change);
        $scope.number =sessionStorage.getItem('stor_spaceId');
        $scope.query_access();
        $scope.query_accessGroup();
    })
})