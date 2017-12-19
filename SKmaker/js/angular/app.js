var app = angular.module('myApp',['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/space',{
    	templateUrl:'dist/space.html',
        controller:'spaceCtrl'
    })
    .when('/station',{
    	templateUrl:'dist/station.html',
        controller:'stationCtrl'
    })
    .when('/ference',{
    	templateUrl:'dist/ference.html',
        controller:'ferenceCtrl'
    })
    .when('/activity',{
    	templateUrl:'dist/activity.html',
        controller:'activityCtrl'
    })
    .when('/addActivity',{
    	templateUrl:'dist/addActivity.html',
        controller:'addActivityCtrl'
    })
    .when('/editActivity',{
    	templateUrl:'dist/editActivity.html',
        controller:'editActivityCtrl'
    })
    .when('/information',{
    	templateUrl:'dist/information.html',
        controller:'informationCtrl'
    })
    .when('/addInformation',{
    	templateUrl:'dist/addInformation.html',
        controller:'addInformationCtrl'
    })
    .when('/editInformation',{
    	templateUrl:'dist/editInformation.html',
        controller:'editInformationCtrl'
    })
    .when('/site',{
    	templateUrl:'dist/site.html',
        controller:'siteCtrl'
    })
    .when('/member',{
    	templateUrl:'dist/member.html',
        controller:'memberCtrl'
    })
    .when('/enterprise',{
    	templateUrl:'dist/enterprise.html',
        controller:'enterpriseCtrl'
    })
    .when('/department',{
    	templateUrl:'dist/department.html',
        controller:'departmentCtrl'
    })
    .when('/social',{
    	templateUrl:'dist/social.html',
        controller:'socialCtrl'
    })
    .when('/complaint',{
    	templateUrl:'dist/complaint.html',
        controller:'complaintCtrl'
    })
    .otherwise({redirectTo:'/space'});
}]);

var staffId=sessionStorage.getItem("staffId_login");
//判断登录信息
if(sessionStorage.getItem("staffId_login") == null) {
	window.location.href="login.html";
}
var jurisdiction_login=sessionStorage.getItem("jurisdiction_login").split(",");
for(var i=0;i<jurisdiction_login.length;i++) {
	if(jurisdiction_login[i] == "空间信息管理") {
		$("#space_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "工位管理") {
		$("#station_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "会议室管理") {
		$("#ference_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "场地管理") {
		$("#site_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "活动管理") {
		$("#activity_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "资讯管理") {
		$("#information_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "社交管理") {
		$("#social_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "员工管理") {
		$("#department_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "投诉建议") {
		$("#complaint_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "企业管理") {
		$("#enterprise_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "会员管理") {
		$("#member_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "销控管理") {
		$("#marketing_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "访客管理") {
		$("#visitor_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "活动用户信息") {
		$("#activeuser_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "合同管理") {
		$("#contract_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "账单管理") {
		$("#bill_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "订单管理") {
		$("#order_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "收益统计") {
		$("#profit_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "门禁管理") {
		$("#access_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "服务商管理") {
		$("#serviceprovider_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "报修管理") {
		$("#repair_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "APP管理") {
		$("#app_login")[0].style.display="block";
	} else if(jurisdiction_login[i] == "积分管理") {
		$("#integral_login")[0].style.display="block";
	}
}
// var serviceURL='http://www.yiliangang.net:8012/workSpace';
// var serviceURL='http://192.168.7.240:8012/workSpace'
//var serviceURL='http://219.143.170.98:10011/workSpace';
// var serviceURL='http://192.168.1.216:8080/workSpace';


    var serviceURL='http://192.168.34.80:8080/SKwork';
//  var serviceURL='http://219.143.170.98:10011/SKwork';
//  var serviceURL='http://192.168.38.93:8080/SKwork';
//  var serviceURL='http://192.168.1.216:8080/SKwork';