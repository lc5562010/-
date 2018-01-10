app.controller('contractCtrl',function ($scope,$http) {
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
        $scope.query_company();
        $scope.query_contract();
    })
//	请求空间下所有企业
    $scope.query_company=function () {
        var spaceId=sessionStorage.getItem('stor_spaceId');
        $http({
            method:'post',          
            url:serviceURL+'/CompanyInfo/find',
            data:{pageNo:1,pageSize:10000,spaceId:spaceId},
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
            $scope.companyInfo=res.data.msg.list;
        })
    }
// 添加合同
    $scope.Introduce_contract=function() {
        if($("#enterprise_contract option:selected").val() !== "") {
            sessionStorage.setItem("companyId_contract",$("#enterprise_contract option:selected").val());
            sessionStorage.setItem("companyName_contract",$("#enterprise_contract option:selected").text());
            if($("#contractType option:selected").val() == "1") {
                window.open("large_area.html"); 
            } else if($("#contractType option:selected").val() == "2") {
                window.open("small_area.html"); 
            } else {
                alert("请选择合同类型！");
            }
        } else {
            alert("请选择企业名称！");
        }
    }
//	查询会议室
    $scope.query_contract=function(){
        var pageNo_contract=sessionStorage.getItem("pageNo_contract");
        if(pageNo_contract == null) {
            var pageNo_contract=1;
        }
        var spaceId=sessionStorage.getItem("stor_spaceId");
        $http({
            method:'post',          
            url:serviceURL+'/Contract/find',
            data:{pageNo:pageNo_contract,pageSize:10,spaceId:spaceId},
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
                    if(res.data.msg.list[xx].contractState==1){
                        res.data.msg.list[xx].contractState='生效中';
                    }
                    if(res.data.msg.list[xx].contractState==2){
                        res.data.msg.list[xx].contractState='已结束';
                    }
                    if(res.data.msg.list[xx].contractState==3){
                        res.data.msg.list[xx].contractState='已解约';
                    }
                    if(res.data.msg.list[xx].contractType==1){
                        res.data.msg.list[xx].contractType='工位合同';
                    }
                    if(res.data.msg.list[xx].contractType==2){
                        res.data.msg.list[xx].contractType='大面积合同';
                    }
                    res.data.msg.list[xx].accessory=serviceURL+res.data.msg.list[xx].accessory;
                }
            }
            $scope.contractInfo=res.data.msg.list;
            layui.use('laypage', function(){
                var laypage = layui.laypage;
                laypage.render({
                    elem: 'test_contract' //注意，这里的 test1 是 ID，不用加 # 号
                    ,count: res.data.msg.totalRecords //数据总数，从服务端得到
                    ,curr: pageNo_contract
                    ,limit: 10
                    ,jump: function(obj, first){
                        //obj包含了当前分页的所有参数，比如：
                        //首次不执行
                        if(!first){
                            $http({
                                method:'post',          
                                url:serviceURL+'/Contract/find',
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
                                sessionStorage.setItem("pageNo_contract",obj.curr);
                                if(res.data.result !== "查询为空") {
                                    for(var xx=0;xx<res.data.msg.list.length;xx++){
                                        if(res.data.msg.list[xx].contractState==1){
                                            res.data.msg.list[xx].contractState='生效中';
                                        }
                                        if(res.data.msg.list[xx].contractState==2){
                                            res.data.msg.list[xx].contractState='已结束';
                                        }
                                        if(res.data.msg.list[xx].contractState==3){
                                            res.data.msg.list[xx].contractState='已解约';
                                        }
                                        if(res.data.msg.list[xx].contractType==1){
                                            res.data.msg.list[xx].contractType='工位合同';
                                        }
                                        if(res.data.msg.list[xx].contractType==2){
                                            res.data.msg.list[xx].contractType='大面积合同';
                                        }
                                        res.data.msg.list[xx].accessory=serviceURL+res.data.msg.list[xx].accessory;
                                    }
                                }
                                $scope.contractInfo=res.data.msg.list;
                            })
                        }
                    }
                });
            })
        })
    }
// 查看合同详情
    $scope.query_contractInfo=function(e,x) {
        window.open(x[e].accessory);
    }
//	空间改变请求
    $("#spaceId_contract").change(function() {
        var spaceId_change=$('#spaceId_contract option:selected').val();
        sessionStorage.setItem("stor_spaceId",spaceId_change);
        $scope.number =sessionStorage.getItem('stor_spaceId');
        $scope.query_company();
        $scope.query_contract();
    })
})