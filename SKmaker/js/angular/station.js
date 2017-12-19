app.controller('stationCtrl',function ($scope,$http) { 
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
        $scope.query_partitionone();
        $scope.query_allstation();
    })
//	请求空间底下所有工位
	$scope.query_allstation=function(){
		var spaceId=sessionStorage.getItem("stor_spaceId");
		$http({
	        method:'post',          
	        url:serviceURL+'/StationInfo/find',
	        data:{pageNo:1,pageSize:40,spaceId:spaceId},
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
	        $scope.stationInfo=res.data.msg.list;
	        if(res.data.result !== "查询为空") {
	        	for(var xx=0;xx<res.data.msg.list.length;xx++){
		            if(res.data.msg.list[xx].stationState==0){
		                res.data.msg.list[xx].stationState='未使用';
		            }
		            if(res.data.msg.list[xx].stationState==1){
		                res.data.msg.list[xx].stationState='已租用';
		            }
		            if(res.data.msg.list[xx].stationState==2){
		                res.data.msg.list[xx].stationState='维修中';
		            }
		        }
	        }
	        layui.use('laypage', function(){
			    var laypage = layui.laypage;
				laypage.render({
			        elem: 'test_station' //注意，这里的 test1 是 ID，不用加 # 号
			        ,count: res.data.msg.totalRecords //数据总数，从服务端得到
			        ,limit: 40
			        ,jump: function(obj, first){
					    //obj包含了当前分页的所有参数，比如：
					    //首次不执行
					    if(!first){
						    $http({
						        method:'post',          
						        url:serviceURL+'/StationInfo/find',
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
						        $scope.stationInfo=res.data.msg.list;
						        if(res.data.result !== "查询为空") {
						        	for(var xx=0;xx<res.data.msg.list.length;xx++){
							            if(res.data.msg.list[xx].stationState==0){
							                res.data.msg.list[xx].stationState='未使用';
							            }
							            if(res.data.msg.list[xx].stationState==1){
							                res.data.msg.list[xx].stationState='已租用';
							            }
							            if(res.data.msg.list[xx].stationState==2){
							                res.data.msg.list[xx].stationState='维修中';
							            }
							        }
						        }
						    })
					    }
					}
			    });
			})
	    })
	}
//  请求所有一级分区
	$scope.query_partitionone=function() {
		var spaceId=sessionStorage.getItem('stor_spaceId');
		$http({
	        method:'post',          
	        url:serviceURL+'/StationSubarea/find',
	        data:{pageNo:1,pageSize:10000,subareaGrade:1,spaceId:spaceId},
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
	        $scope.partitiononeInfo=res.data.msg.list;
	        if(res.data.result !== "查询为空") {
		        for(var i=0;i<res.data.msg.list.length;i++) {
		        	res.data.msg.list[i].superiorSubareaId=res.data.msg.list[i].subareaId;
		        }
		    }
	    })
	}
//点击左侧导航一级分区查询二级分区
	$scope.query_partitiontwo=function(e,x) {
		var superiorSubareaId=x[e].superiorSubareaId;
		$http({
	        method:'post',          
	        url:serviceURL+'/StationSubarea/find',
	        data:{pageNo:1,pageSize:10000,superiorSubareaId:superiorSubareaId},
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
	        $scope.partitiontwoInfo=res.data.msg.list;
	    })
		//	    请求一级分区底下工位
	    var oneSubareaId=x[e].subareaId;
	    $http({
	        method:'post',          
	        url:serviceURL+'/StationInfo/find',
	        data:{pageNo:1,pageSize:40,oneSubareaId:oneSubareaId},
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
	        $scope.stationInfo=res.data.msg.list;
	        if(res.data.result !== "查询为空") {
	        	for(var xx=0;xx<res.data.msg.list.length;xx++){
		            if(res.data.msg.list[xx].stationState==0){
		                res.data.msg.list[xx].stationState='未使用';
		            }
		            if(res.data.msg.list[xx].stationState==1){
		                res.data.msg.list[xx].stationState='已租用';
		            }
		            if(res.data.msg.list[xx].stationState==2){
		                res.data.msg.list[xx].stationState='维修中';
		            }
		        }
	        }
	        layui.use('laypage', function(){
			    var laypage = layui.laypage;
				laypage.render({
			        elem: 'test_station' //注意，这里的 test1 是 ID，不用加 # 号
			        ,count: res.data.msg.totalRecords //数据总数，从服务端得到
			        ,limit: 40
			        ,jump: function(obj, first){
					    //obj包含了当前分页的所有参数，比如：
					    //首次不执行
					    if(!first){
						    $http({
						        method:'post',          
						        url:serviceURL+'/StationInfo/find',
						        data:{pageNo:obj.curr,pageSize:obj.limit,oneSubareaId:oneSubareaId},
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
						        $scope.stationInfo=res.data.msg.list;
						        if(res.data.result !== "查询为空") {
						        	for(var xx=0;xx<res.data.msg.list.length;xx++){
							            if(res.data.msg.list[xx].stationState==0){
							                res.data.msg.list[xx].stationState='未使用';
							            }
							            if(res.data.msg.list[xx].stationState==1){
							                res.data.msg.list[xx].stationState='已租用';
							            }
							            if(res.data.msg.list[xx].stationState==2){
							                res.data.msg.list[xx].stationState='维修中';
							            }
							        }
						        }
						    })
					    }
					}
			    });
			})
	    })
	}
//	请求二级分区底下工位
	$scope.query_partitiontwostation=function(e,x){
		var twoSubareaId=x[e].subareaId;
		$http({
	        method:'post',          
	        url:serviceURL+'/StationInfo/find',
	        data:{pageNo:1,pageSize:40,twoSubareaId:twoSubareaId},
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
	        $scope.stationInfo=res.data.msg.list;
	        if(res.data.result !== "查询为空") {
	        	for(var xx=0;xx<res.data.msg.list.length;xx++){
		            if(res.data.msg.list[xx].stationState==0){
		                res.data.msg.list[xx].stationState='未使用';
		            }
		            if(res.data.msg.list[xx].stationState==1){
		                res.data.msg.list[xx].stationState='已租用';
		            }
		            if(res.data.msg.list[xx].stationState==2){
		                res.data.msg.list[xx].stationState='维修中';
		            }
		        }
	        }
	        layui.use('laypage', function(){
			    var laypage = layui.laypage;
				laypage.render({
			        elem: 'test_station' //注意，这里的 test1 是 ID，不用加 # 号
			        ,count: res.data.msg.totalRecords //数据总数，从服务端得到
			        ,limit: 40
			        ,jump: function(obj, first){
					    //obj包含了当前分页的所有参数，比如：
					    //首次不执行
					    if(!first){
						    $http({
						        method:'post',          
						        url:serviceURL+'/StationInfo/find',
						        data:{pageNo:obj.curr,pageSize:obj.limit,twoSubareaId:twoSubareaId},
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
						        $scope.stationInfo=res.data.msg.list;
						        if(res.data.result !== "查询为空") {
						        	for(var xx=0;xx<res.data.msg.list.length;xx++){
							            if(res.data.msg.list[xx].stationState==0){
							                res.data.msg.list[xx].stationState='未使用';
							            }
							            if(res.data.msg.list[xx].stationState==1){
							                res.data.msg.list[xx].stationState='已租用';
							            }
							            if(res.data.msg.list[xx].stationState==2){
							                res.data.msg.list[xx].stationState='维修中';
							            }
							        }
						        }
						    })
					    }
					}
			    });
			})
	    })
	}
//点击添加工位一级分区查询二级分区
	$("#oneSubareaId").change(function() {
		var superiorSubareaId=$("#oneSubareaId option:selected").val();
		$http({
	        method:'post',          
	        url:serviceURL+'/StationSubarea/find',
	        data:{pageNo:1,pageSize:10000,superiorSubareaId:superiorSubareaId},
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
	        $scope.partitiontwo_twoInfo=res.data.msg.list;
	    })
	})
	$("#oneSubareaId_edit").change(function() {
		var superiorSubareaId=$("#oneSubareaId_edit option:selected").val();
		$http({
	        method:'post',          
	        url:serviceURL+'/StationSubarea/find',
	        data:{pageNo:1,pageSize:10000,superiorSubareaId:superiorSubareaId},
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
	        $scope.partitiontwo_twoInfo=res.data.msg.list;
	    })
	})
	$("#oneSubareaId_batch").change(function() {
		var superiorSubareaId=$("#oneSubareaId_batch option:selected").val();
		$http({
	        method:'post',          
	        url:serviceURL+'/StationSubarea/find',
	        data:{pageNo:1,pageSize:10000,superiorSubareaId:superiorSubareaId},
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
	        $scope.partitiontwo_twoInfo=res.data.msg.list;
	    })
	})
//	点击下拉框选择分区
	$("#subareaGrade").change(function() {
		if($("#subareaGrade option:selected").val() == 2) {
			$("#superiorSubareaId_sel")[0].style.display="block";
		} else {
			$("#superiorSubareaId_sel")[0].style.display="none";
		}
	})
//  添加分区
	$scope.addPartition=function(){
		var options_addPartition={
            url:serviceURL+'/StationSubarea/addSubarea',
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
        $("#add_partitionform").ajaxSubmit(options_addPartition);
        return false;
	}
//  添加工位
	$scope.addStation=function(){
		var options_addStation={
            url:serviceURL+'/StationInfo/batchAddStation',
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
        $("#add_stationform").ajaxSubmit(options_addStation);
        return false;
	}
//	空间改变请求
	$("#spaceId_station").change(function() {
		var spaceId_change=$('#spaceId_station option:selected').val();
        sessionStorage.setItem("stor_spaceId",spaceId_change);
        $scope.number =sessionStorage.getItem('stor_spaceId');
        $scope.query_partitionone();
        $scope.query_allstation();
	})
//  修改分区请求
	$scope.edit_partition=function(e,x) {
		var subareaId=x[e].subareaId;
        sessionStorage.setItem('edit_partition_id',subareaId);
        $http({
            method:'post',          
            url:serviceURL+'/StationSubarea/findBySubareaId',
            data:{subareaId:subareaId},
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
            $scope.edit_partitionInfo=res.data.msg;
            function firstVisit(rId,rValue){
                var rObj = document.getElementById(rId);
                for(var i = 0;i < rObj.options.length;i++){
                    if(rObj.options[i].value == rValue){
                        rObj.options[i].selected = 'selected';
                        break ;
                    }
                }
            }
            firstVisit('spaceId_editpartition',res.data.msg.spaceId);
//          firstVisit('subareaGrade_edit',res.data.msg.subareaGrade);
        })
		$('#myModal_partition_edit').modal('show');
	}
//	修改分区提交
	$scope.edit_partition_sub=function(){
        var options_editPartition={
			url:serviceURL+'/StationSubarea/addSubarea?subareaId='+sessionStorage.getItem('edit_partition_id'),
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
        $("#edit_partitionform").ajaxSubmit(options_editPartition);
        return false;
    }
//  修改工位请求
	$scope.edit_station=function(e,x) {
		var stationId=x[e].stationId;
        sessionStorage.setItem('edit_station_id',stationId);
        $http({
            method:'post',          
            url:serviceURL+'/StationInfo/findById',
            data:{stationId:stationId},
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
            $scope.edit_stationInfo=res.data.msg;
            var superiorSubareaId=res.data.msg.oneSubareaId;
			$http({
		        method:'post',          
		        url:serviceURL+'/StationSubarea/find',
		        data:{pageNo:1,pageSize:10000,superiorSubareaId:superiorSubareaId},
		        headers:{'Content-Type':'application/x-www-form-urlencoded'},  
		        transformRequest: function(obj) {  
		            var str = [];  
		            for (var p in obj){  
		                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
		            } 
		            return str.join("&");
		        }
		    }).then(function(res1){
		        console.log(res1);
		        $scope.partitiontwo_twoInfo=res1.data.msg.list;
		    })
		    function firstVisit(rId,rValue){
                var rObj = document.getElementById(rId);
                for(var i = 0;i < rObj.options.length;i++){
                    if(rObj.options[i].value == rValue){
                        rObj.options[i].selected = 'selected';
                        break ;
                    }
                }
            }
            firstVisit('spaceId_editstation',res.data.msg.spaceId);
            firstVisit('oneSubareaId_edit',res.data.msg.oneSubareaId);
            firstVisit('stationType_edit',res.data.msg.stationType);
            firstVisit('onlineBooking_edit',res.data.msg.onlineBooking);
            firstVisit('stationState_edit',res.data.msg.stationState);
            setTimeout(function() {
            	firstVisit('twoSubareaId_edit',res.data.msg.twoSubareaId);
            },1000);
        })
	}
	//	取消修改事件
	$scope.cancel=function() {
		var pointsel_box=$("#oneSubareaId_edit")[0];
		for (var i=0;i<pointsel_box.options.length;i++) {
			pointsel_box.options[i].selected = '';
		}
	}
//	修改单个工位提交
	$scope.edit_station_sub=function(){
        var options_editStation={
			url:serviceURL+'/StationInfo/batchAlterStation?stationId='+sessionStorage.getItem('edit_station_id'),
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
        $("#edit_stationform").ajaxSubmit(options_editStation);
        return false;
    }
//	删除单个工位
	$scope.del_station=function(){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var stationId=sessionStorage.getItem('edit_station_id');
            $http({
                method:'post',          
                url:serviceURL+'/StationInfo/deleteStationInfo',
                data:{stationId:stationId},
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
//	删除分区
	$scope.del_partition=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var subareaId=x[e].subareaId;
            $http({
                method:'post',          
                url:serviceURL+'/StationSubarea/deleteSubarea',
                data:{subareaId:subareaId},
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
//	批量操作
	//	一级分区批量修改
	$scope.batch_station_one=function(e,x) {
		$('#myModal_stationbatch_edit').modal('show');
		$("#batch_one")[0].style.display="inline-block";
		var originalOneSubareaId=x[e].subareaId;
		$scope.batch_station_one_sub=function() {
			var options_editStation_one={
				url:serviceURL+'/StationInfo/batchAlterStation?originalOneSubareaId='+originalOneSubareaId,
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
	        $("#edit_stationform_batch").ajaxSubmit(options_editStation_one);
	        return false;
	    }
	}
	//	二级分区批量修改
	$scope.batch_station_two=function(e,x) {
		$('#myModal_stationbatch_edit').modal('show');
		$("#batch_two")[0].style.display="inline-block";
		var originalTwoSubareaId=x[e].subareaId;
		$scope.batch_station_two_sub=function() {
			var options_editStation_two={
				url:serviceURL+'/StationInfo/batchAlterStation?originalTwoSubareaId='+originalTwoSubareaId,
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
	        $("#edit_stationform_batch").ajaxSubmit(options_editStation_two);
	        return false;
		}
	}
	//	取消批量修改
	$scope.cancel_batch=function() {
		$("#batch_one")[0].style.display="none";
		$("#batch_two")[0].style.display="none";
	}
})