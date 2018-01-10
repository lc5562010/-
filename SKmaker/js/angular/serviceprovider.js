app.controller('serviceproviderCtrl',function ($scope,$http) {
//	图片预览
    $("#ment_addserviceprovider").change(function() {  
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
    $("#ment_editserviceprovider").change(function() {  
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
//  添加服务商
    $scope.addserviceprovider=function() {
        var facilitatorType=$("#facilitatorType").val().join(",");
        var options_addserviceprovider={
            url:serviceURL+'/Facilitator/addFacilitator',
            data: {facilitatorType:facilitatorType},
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
        $("#add_serviceproviderform").ajaxSubmit(options_addserviceprovider);
        return false;
    }
//	查询服务商
    $scope.query_serviceprovider=function(x){
        var pageNo_serviceprovider=sessionStorage.getItem("pageNo_serviceprovider");
        if(pageNo_serviceprovider == null) {
            var pageNo_serviceprovider=1;
        }
        var spaceId=sessionStorage.getItem("stor_spaceId");
        if(x == "全部") {
            var data={pageNo:pageNo_serviceprovider,pageSize:10};
        } else if(x == "待审核") {
            var data={pageNo:pageNo_serviceprovider,pageSize:10,facilitatorState:"待审核"};
        } else if(x == "已通过") {
            var data={pageNo:pageNo_serviceprovider,pageSize:10,facilitatorState:"已通过"};
        } else if(x == "已拒绝") {
            var data={pageNo:pageNo_serviceprovider,pageSize:10,facilitatorState:"已拒绝"};
        }
        $http({
            method:'post',          
            url:serviceURL+'/Facilitator/find',
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
                    res.data.msg.list[xx].firmLogo=serviceURL+res.data.msg.list[xx].firmLogo;
                }
            }
            $scope.serviceproviderInfo=res.data.msg.list;
            layui.use('laypage', function(){
                var laypage = layui.laypage;
                laypage.render({
                    elem: 'test_serviceprovider' //注意，这里的 test1 是 ID，不用加 # 号
                    ,count: res.data.msg.totalRecords //数据总数，从服务端得到
                    ,curr: pageNo_serviceprovider
                    ,limit: 10
                    ,jump: function(obj, first){
                        //obj包含了当前分页的所有参数，比如：
                        //首次不执行
                        if(x == "全部") {
                            var data={pageNo:pageNo_serviceprovider,pageSize:10};
                        } else if(x == "待审核") {
                            var data={pageNo:pageNo_serviceprovider,pageSize:10,facilitatorState:"待审核"};
                        } else if(x == "已通过") {
                            var data={pageNo:pageNo_serviceprovider,pageSize:10,facilitatorState:"已通过"};
                        } else if(x == "已拒绝") {
                            var data={pageNo:pageNo_serviceprovider,pageSize:10,facilitatorState:"已拒绝"};
                        }
                        if(!first){
                            $http({
                                method:'post',          
                                url:serviceURL+'/Facilitator/find',
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
                                sessionStorage.setItem("pageNo_serviceprovider",obj.curr);
                                if(res.data.result !== "查询为空") {
                                    for(var xx=0;xx<res.data.msg.list.length;xx++){
                                        res.data.msg.list[xx].firmLogo=serviceURL+res.data.msg.list[xx].firmLogo;
                                    }
                                }
                                $scope.serviceproviderInfo=res.data.msg.list;
                            })
                        }
                    }
                });
            })
        })
    }
// 第一次加载查询
    if(sessionStorage.getItem('serviceprovider_change')==null){
        $scope.query_serviceprovider("全部");
        function firstVisit(rId,rValue){
            var rObj = document.getElementById(rId);
            for(var i = 0;i < rObj.options.length;i++){
                if(rObj.options[i].value == rValue){
                    rObj.options[i].selected = 'selected';
                    break ;
                }
            }
        }
        firstVisit('companyState_serviceprovider',"全部");
    } else {
        var serviceprovider_change=sessionStorage.getItem("serviceprovider_change");
        $scope.query_serviceprovider(serviceprovider_change);
        function firstVisit(rId,rValue){
            var rObj = document.getElementById(rId);
            for(var i = 0;i < rObj.options.length;i++){
                if(rObj.options[i].value == rValue){
                    rObj.options[i].selected = 'selected';
                    break ;
                }
            }
        }
        firstVisit('companyState_serviceprovider',serviceprovider_change);
    }
//	筛选条件改变请求
    $("#companyState_serviceprovider").change(function() {
        var serviceprovider_change=$('#companyState_serviceprovider option:selected').val();
        sessionStorage.setItem("serviceprovider_change",serviceprovider_change);
        $scope.query_serviceprovider(serviceprovider_change);
    })
//  修改服务商请求
    $scope.edit_serviceprovider=function(e,x) {
        var facilitatorId=x[e].facilitatorId;
        sessionStorage.setItem('edit_serviceprovider_id',facilitatorId);
        $http({
            method:'post',          
            url:serviceURL+'/Facilitator/findById',
            data:{facilitatorId:facilitatorId},
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
            $scope.edit_serviceproviderInfo=res.data.msg;
            if(res.data.msg.firmLogo !== "") {
                $(".imgBox img").attr("src","");
                $("#imageview4").attr("src",serviceURL+res.data.msg.firmLogo);
            }
            setTimeout(function() {
                $("#facilitatorType_edit").val(res.data.msg.facilitatorType.split(",")).trigger("change");
            },500);
        })
    }
//	修改服务商提交
    $scope.edit_serviceprovider_sub=function(){
        var facilitatorType=$("#facilitatorType_edit").val().join(",");
        var options_editserviceprovider={
            url:serviceURL+'/Facilitator/addFacilitator?facilitatorId='+sessionStorage.getItem('edit_serviceprovider_id'),
            data: {facilitatorType:facilitatorType},
            success:function (responseResult) {
                var res=JSON.parse(responseResult);
                if(res.code=='200'){
                    window.location.reload(true);
                }else if(res.code=='500'){
                    alert('系统错误');
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
        $("#edit_serviceproviderform").ajaxSubmit(options_editserviceprovider);
        return false;
    }
//	删除服务商
    $scope.del_serviceprovider=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var facilitatorId=x[e].facilitatorId;
            $http({
                method:'post',          
                url:serviceURL+'/Facilitator/deleteFacilitator',
                data:{facilitatorId:facilitatorId},
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
//	通过服务商
    $scope.sure_serviceprovider=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var facilitatorId=x[e].facilitatorId;
            $http({
                method:'post',          
                url:serviceURL+'/Facilitator/addFacilitator',
                data:{facilitatorId:facilitatorId,facilitatorState:"已通过"},
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
//	拒绝服务商
    $scope.refuse_serviceprovider=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var facilitatorId=x[e].facilitatorId;
            $http({
                method:'post',          
                url:serviceURL+'/Facilitator/addFacilitator',
                data:{facilitatorId:facilitatorId,facilitatorState:"已拒绝"},
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
})