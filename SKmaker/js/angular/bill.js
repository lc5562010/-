app.controller('billCtrl',function ($scope,$http) {
//	时间选择器
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        laydate.render({
            elem: '#openTime' //指定元素
            ,type: 'time'
            ,range: true
        });
        laydate.render({
            elem: '#openTime_edit' //指定元素
            ,type: 'time'
            ,range: true
        });
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
        $scope.query_bill();
    })
//	查询账单
    $scope.query_bill=function(){
        var pageNo_bill=sessionStorage.getItem("pageNo_bill");
        if(pageNo_bill == null) {
            var pageNo_bill=1;
        }
        var spaceId=sessionStorage.getItem("stor_spaceId");
        $http({
            method:'post',          
            url:serviceURL+'/Bill/findOneBill',
            data:{pageNo:pageNo_bill,pageSize:10,spaceId:spaceId},
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
            $scope.billInfo=res.data.msg.list;
            layui.use('laypage', function(){
                var laypage = layui.laypage;
                laypage.render({
                    elem: 'test_bill' //注意，这里的 test1 是 ID，不用加 # 号
                    ,count: res.data.msg.totalRecords //数据总数，从服务端得到
                    ,curr: pageNo_bill
                    ,limit: 10
                    ,jump: function(obj, first){
                        //obj包含了当前分页的所有参数，比如：
                        //首次不执行
                        if(!first){
                            $http({
                                method:'post',          
                                url:serviceURL+'/Bill/findOneBill',
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
                                sessionStorage.setItem("pageNo_bill",obj.curr);
                                $scope.billInfo=res.data.msg.list;
                            })
                        }
                    }
                });
            })
        })
    }
    
//  查看详情
    $scope.more_bill=function(e,x) {
        var contractId=x[e].contractId;
        var billType=x[e].billType;
        $http({
            method:'post',          
            url:serviceURL+'/Bill/find',
            data:{contractId:contractId,billType:billType,pageNo:1,pageSize:1000},
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
            $scope.more_billInfo=res.data.msg.list;
        })
    }
// 修改请求
    $scope.edit_bill=function(e,x) {
        var billId=x[e].billId;
        sessionStorage.setItem("edit_bill_id",billId)
    }
//	修改账单提交
    $scope.edit_bill_sub=function(){
        var options_editbill={
            url:serviceURL+'/Bill/alterBill',
            data: {billId:sessionStorage.getItem("edit_bill_id"),gatheringState:"已收款"},
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
        $("#edit_billform").ajaxSubmit(options_editbill);
        return false;
    }
//	更改开票状态
    $scope.edit_Billing=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var billId=x[e].billId;
            $http({
                method:'post',          
                url:serviceURL+'/Bill/alterBill',
                data:{billId:billId,invoice:"已开票"},
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
                    alert("修改失败！");
                }
            })
        } 
    }
//	空间改变请求
    $("#spaceId_bill").change(function() {
        var spaceId_change=$('#spaceId_bill option:selected').val();
        sessionStorage.setItem("stor_spaceId",spaceId_change);
        $scope.number =sessionStorage.getItem('stor_spaceId');
        $scope.query_bill();
    })
})