app.controller('cardCtrl',function ($scope,$http) {
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
        $scope.query_card();
    })
// 请求空间下的所有门禁组
    $scope.query_access=function() {
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
        // 查询空间下的企业
        $http({
            method:'post',          
            url:serviceURL+'/CompanyInfo/find',
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
            $scope.companyInfo=res.data.msg.list;
        })
    }   
    // 企业改变请求会员
    $("#company").change(function() {
        var companyName=$("#company option:selected").val();
        $http({
            method:'post',          
            url:serviceURL+'/User/find',
            data:{pageNo:1,pageSize:1000,companyName:companyName},
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
            $scope.userNameInfo=res.data.msg.list;
        })
    })
    // 持卡人改变请求会员
    $("#userName").change(function() {
        var userNameName=$("#userName option:selected").val();
        if(userNameName == "") {
            $("#cardUids").attr("disabled",true);
        } else if(userNameName !== "") {
            $("#cardUids").attr("disabled",false);
        }
    })
// 批量添加门禁卡
    $scope.addMoreCard=function() {
        var cardNumber=$("#cardUids").val();
        var cardPerson=$("#userName option:selected").text();
        var cardPerson1=$("#userName option:selected").val();
        $("#cardBox").append("<p style='margin-left:80px;'><span>卡号：</span><span class='cardNo'>"+cardNumber+"</span><span style='margin-left:30px;'>持卡人：</span><span class='personNo' id='"+cardPerson1+"'>"+cardPerson+"</span></p>");
        $("#cardUids").val("");
        // setTimeout(function() {
        //     $("#userName").val("").trigger("change");
        // },500);
    }
//  添加门禁卡
    $scope.addcard=function() {
        function cardUidDesc(ascStr){
            var sb = "";
            var endIndex = ascStr.length;
            var str = ascStr;
            
            while(endIndex > 0){
                ascStr = str.substring(endIndex - 2, endIndex);
                endIndex -= 2;
                sb+=ascStr;
            }
            return sb;
        }
        var cardNo=$(".cardNo");
        var cardUids=[];
        for(var i=0;i<cardNo.length;i++) {
            cardUids.push(cardUidDesc(parseInt($(cardNo[i]).text(),10).toString(16)).toUpperCase());
        }
        var cardUids_new=cardUids.join(",");

        var personNo=$(".personNo");
        var userName=[];
        var userId=[];
        for(var i=0;i<personNo.length;i++) {
            userName.push($(personNo[i]).text());
            userId.push(personNo[i].id);
        }
        var userName_new=userName.join(",");
        var userId_new=userId.join(",");

        var groupId_new=$("#groupingIds").val().join(",");

        var groupName_new1=[];
        var llll=$("#groupingIds").select2('data');
        for(var i=0;i<llll.length;i++) {
            groupName_new1.push(llll[i].text);
        }
        var groupName_new=groupName_new1.join(",");
        var options_addcard={
            url:serviceURL+'/Make/addOpenDoorCard',
            data: {cardUids:cardUids_new,userName:userName_new,groupId:groupId_new,groupName:groupName_new,userIds:userId_new},
            success:function(responseResult){
                var res=JSON.parse(responseResult);
                console.log(res);
                if(res.statusCode=='1'){
                    window.location.reload(true);
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
        $("#add_cardform").ajaxSubmit(options_addcard);
        return false;
    }
//	查询门禁
    $scope.query_card=function(){
        var pageNo_card=sessionStorage.getItem("pageNo_card");
        if(pageNo_card == null) {
            var pageNo_card=1;
        }
        var spaceId=sessionStorage.getItem("stor_spaceId");
        $http({
            method:'post',          
            url:serviceURL+'/Make/findCard',
            data:{pageNo:pageNo_card,pageSize:10,spaceId:spaceId},
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
            $scope.cardInfo=res.data.msg.list;
            layui.use('laypage', function(){
                var laypage = layui.laypage;
                laypage.render({
                    elem: 'test_card' //注意，这里的 test1 是 ID，不用加 # 号
                    ,count: res.data.msg.totalRecords //数据总数，从服务端得到
                    ,curr: pageNo_card
                    ,limit: 10
                    ,jump: function(obj, first){
                        //obj包含了当前分页的所有参数，比如：
                        //首次不执行
                        if(!first){
                            $http({
                                method:'post',          
                                url:serviceURL+'/Make/findCard',
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
                                sessionStorage.setItem("pageNo_card",obj.curr);
                                $scope.cardInfo=res.data.msg.list;
                            })
                        }
                    }
                });
            })
        })
    }
    
//  修改门禁请求
    $scope.edit_card=function(e,x) {
        var cardId=x[e].cardId;
        sessionStorage.setItem('edit_card_id',cardId);
        $http({
            method:'post',          
            url:serviceURL+'/Make/findCard',
            data:{pageNo:1,pageSize:10,cardId:cardId},
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
            $scope.edit_cardInfo=res.data.msg.list[0];
            sessionStorage.setItem("deviceIds",res.data.msg.list[0].deviceIds);
            // 修改时请求会员
            var companyName=res.data.msg.list[0].company;
            $http({
                method:'post',          
                url:serviceURL+'/User/find',
                data:{pageNo:1,pageSize:1000,companyName:companyName},
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
                $scope.userNameInfo=res.data.msg.list;
                var HX=sessionStorage.getItem("deviceIds").split(",");
                function firstVisit1(rId,rValue){
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
                firstVisit1('deviceIds_edit',HX);
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
            firstVisit('company_edit',res.data.msg.list[0].company);
            setTimeout(function() {
                firstVisit('userName_edit',res.data.msg.list[0].userName);
            },1000);
        })
    }
//	修改门禁提交
    $scope.edit_card_sub=function(){
        var options_editcard={
            url:serviceURL+'/Make/updateOpenDoorCard?cardId='+sessionStorage.getItem('edit_card_id'),
            success:function (responseResult) {
                var res=JSON.parse(responseResult);
                console.log(res);
                if(res.statusCode=='1'){
                    window.location.reload(true);
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
        $("#edit_cardform").ajaxSubmit(options_editcard);
        return false;
    }
//	删除门禁
    $scope.del_card=function(e,x){
        function confirmAct() { 
            if(confirm('确定要执行此操作吗?')) 
            { 
                return true; 
            } 
            return false; 
        }
        if (confirmAct() == true) {
            var cardUids=x[e].cardUids;
            var cardId=x[e].cardId;
            // var deviceIds=x[e].deviceIds;
            $http({
                method:'post',          
                url:serviceURL+'/Make/delOpenDoorCard',
                data:{cardUids:cardUids,cardId:cardId},
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
                } else {
                    alert("删除失败！");
                }
            })
        } 
    }
//	空间改变请求
    $("#spaceId_card").change(function() {
        var spaceId_change=$('#spaceId_card option:selected').val();
        sessionStorage.setItem("stor_spaceId",spaceId_change);
        $scope.number =sessionStorage.getItem('stor_spaceId');
        $scope.query_card();
        $scope.query_access();
    }) 
})