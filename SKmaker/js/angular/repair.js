app.controller('repairCtrl',function ($scope,$http) {
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
        $scope.query_repair();
    })
//	查询报修
    $scope.query_repair=function(){
        var pageNo_repair=sessionStorage.getItem("pageNo_repair");
        if(pageNo_repair == null) {
            var pageNo_repair=1;
        }
        var spaceId=sessionStorage.getItem("stor_spaceId");
        $http({
            method:'post',          
            url:serviceURL+'/MaintainInfo/findMaintainInfoByStatus',
            data:{pageNo:pageNo_repair,pageSize:10,spaceId:spaceId},
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

            }
            $scope.repairInfo=res.data.msg.list;
            layui.use('laypage', function(){
                var laypage = layui.laypage;
                laypage.render({
                    elem: 'test_repair' //注意，这里的 test1 是 ID，不用加 # 号
                    ,count: res.data.msg.totalRecords //数据总数，从服务端得到
                    ,curr: pageNo_repair
                    ,limit: 10
                    ,jump: function(obj, first){
                        //obj包含了当前分页的所有参数，比如：
                        //首次不执行
                        if(!first){
                            $http({
                                method:'post',          
                                url:serviceURL+'/MaintainInfo/findMaintainInfoByStatus',
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
                                sessionStorage.setItem("pageNo_repair",obj.curr);
                                if(res.data.result !== "查询为空") {
                                    
                                }
                                $scope.repairInfo=res.data.msg.list;
                            })
                        }
                    }
                });
            })
        })
    }
//	空间改变请求
    $("#spaceId_repair").change(function() {
        var spaceId_change=$('#spaceId_repair option:selected').val();
        sessionStorage.setItem("stor_spaceId",spaceId_change);
        $scope.number =sessionStorage.getItem('stor_spaceId');
        $scope.query_repair();
    })
})