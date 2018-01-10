app.controller('visitorCtrl',function ($scope,$http) {
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
            $scope.query_visitor();
        })
    //	查询访客
        $scope.query_visitor=function(){
            var pageNo_visitor=sessionStorage.getItem("pageNo_visitor");
            if(pageNo_visitor == null) {
                var pageNo_visitor=1;
            }
            var spaceId=sessionStorage.getItem("stor_spaceId");
            $http({
                method:'post',          
                url:serviceURL+'/Visitor/find',
                data:{pageNo:pageNo_visitor,pageSize:10,spaceId:spaceId},
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
                        if(res.data.msg.list[xx].accessType == "1"){
                            res.data.msg.list[xx].accessType='访问个人';
                        }
                        if(res.data.msg.list[xx].accessType == "2"){
                            res.data.msg.list[xx].accessType='预约参观';
                        }
                        if(res.data.msg.list[xx].infoState == "0"){
                            res.data.msg.list[xx].infoState='等待审核';
                        }
                        if(res.data.msg.list[xx].infoState == "1"){
                            res.data.msg.list[xx].infoState='审核未通过';
                        }
                        if(res.data.msg.list[xx].infoState == "2"){
                            res.data.msg.list[xx].infoState='审核通过';
                        }
                    }
                }
                $scope.visitorInfo=res.data.msg.list;
                layui.use('laypage', function(){
                    var laypage = layui.laypage;
                    laypage.render({
                        elem: 'test_visitor' //注意，这里的 test1 是 ID，不用加 # 号
                        ,count: res.data.msg.totalRecords //数据总数，从服务端得到
                        ,curr: pageNo_visitor
                        ,limit: 10
                        ,jump: function(obj, first){
                            //obj包含了当前分页的所有参数，比如：
                            //首次不执行
                            if(!first){
                                $http({
                                    method:'post',          
                                    url:serviceURL+'/Visitor/find',
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
                                    sessionStorage.setItem("pageNo_visitor",obj.curr);
                                    if(res.data.result !== "查询为空") {
                                        for(var xx=0;xx<res.data.msg.list.length;xx++){
                                            if(res.data.msg.list[xx].accessType == "1"){
                                                res.data.msg.list[xx].accessType='访问个人';
                                            }
                                            if(res.data.msg.list[xx].accessType == "2"){
                                                res.data.msg.list[xx].accessType='预约参观';
                                            }
                                            if(res.data.msg.list[xx].infoState == "0"){
                                                res.data.msg.list[xx].infoState='等待审核';
                                            }
                                            if(res.data.msg.list[xx].infoState == "1"){
                                                res.data.msg.list[xx].infoState='审核未通过';
                                            }
                                            if(res.data.msg.list[xx].infoState == "2"){
                                                res.data.msg.list[xx].infoState='审核通过';
                                            }
                                        }
                                    }
                                    $scope.visitorInfo=res.data.msg.list;
                                })
                            }
                        }
                    });
                })
            })
        }
    //	空间改变请求
        $("#spaceId_visitor").change(function() {
            var spaceId_change=$('#spaceId_visitor option:selected').val();
            sessionStorage.setItem("stor_spaceId",spaceId_change);
            $scope.number =sessionStorage.getItem('stor_spaceId');
            $scope.query_visitor();
        })
    })