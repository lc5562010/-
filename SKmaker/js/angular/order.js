app.controller('orderCtrl',function ($scope,$http) {
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
        $scope.query_order();
    })
//	查询订单
    $scope.query_order=function(){
        var pageNo_order=sessionStorage.getItem("pageNo_order");
        if(pageNo_order == null) {
            var pageNo_order=1;
        }
        var spaceId=sessionStorage.getItem("stor_spaceId");
        $http({
            method:'post',          
            url:serviceURL+'/Order/find',
            data:{pageNo:pageNo_order,pageSize:10,spaceId:spaceId},
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
                    if(res.data.msg.list[xx].orderState == "UNPAID"){
                        res.data.msg.list[xx].orderState='未支付';
                    }
                    if(res.data.msg.list[xx].orderState == "SUCCESS"){
                        res.data.msg.list[xx].orderState='支付成功';
                    }
                    if(res.data.msg.list[xx].orderState == "FAIL"){
                        res.data.msg.list[xx].orderState='支付失败';
                    }
                    if(res.data.msg.list[xx].commodityKind == "0"){
                        res.data.msg.list[xx].commodityKind='工位';
                    }
                    if(res.data.msg.list[xx].commodityKind == "1"){
                        res.data.msg.list[xx].commodityKind='会议室';
                    }
                    if(res.data.msg.list[xx].commodityKind == "2"){
                        res.data.msg.list[xx].commodityKind='场地';
                    }
                    if(res.data.msg.list[xx].commodityKind == "3"){
                        res.data.msg.list[xx].commodityKind='增值服务';
                    }
                }
            }
            $scope.orderInfo=res.data.msg.list;
            layui.use('laypage', function(){
                var laypage = layui.laypage;
                laypage.render({
                    elem: 'test_order' //注意，这里的 test1 是 ID，不用加 # 号
                    ,count: res.data.msg.totalRecords //数据总数，从服务端得到
                    ,curr: pageNo_order
                    ,limit: 10
                    ,jump: function(obj, first){
                        //obj包含了当前分页的所有参数，比如：
                        //首次不执行
                        if(!first){
                            $http({
                                method:'post',          
                                url:serviceURL+'/Order/find',
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
                                sessionStorage.setItem("pageNo_order",obj.curr);
                                if(res.data.result !== "查询为空") {
                                    for(var xx=0;xx<res.data.msg.list.length;xx++){
                                        if(res.data.msg.list[xx].orderState == "UNPAID"){
                                            res.data.msg.list[xx].orderState='未支付';
                                        }
                                        if(res.data.msg.list[xx].orderState == "SUCCESS"){
                                            res.data.msg.list[xx].orderState='支付成功';
                                        }
                                        if(res.data.msg.list[xx].orderState == "FAIL"){
                                            res.data.msg.list[xx].orderState='支付失败';
                                        }
                                        if(res.data.msg.list[xx].orderState == "0"){
                                            res.data.msg.list[xx].orderState='工位';
                                        }
                                        if(res.data.msg.list[xx].orderState == "1"){
                                            res.data.msg.list[xx].orderState='会议室';
                                        }
                                        if(res.data.msg.list[xx].orderState == "2"){
                                            res.data.msg.list[xx].orderState='场地';
                                        }
                                        if(res.data.msg.list[xx].orderState == "3"){
                                            res.data.msg.list[xx].orderState='增值服务';
                                        }
                                    }
                                }
                                $scope.orderInfo=res.data.msg.list;
                            })
                        }
                    }
                });
            })
        })
    }
//	空间改变请求
    $("#spaceId_order").change(function() {
        var spaceId_change=$('#spaceId_order option:selected').val();
        sessionStorage.setItem("stor_spaceId",spaceId_change);
        $scope.number =sessionStorage.getItem('stor_spaceId');
        $scope.query_order();
    })
})