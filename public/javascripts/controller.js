// controllers for biddle app       
function bidCtrl($scope,$http){
     $http({method: 'POST', url: '/reportbid'}).
    	success(function(data, status, headers, config) {
    	//console.log("data",data);
    	$scope.biddingreport=data;
    }).
    error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });
	$scope.bid = {
        BidderName: '',
        JobUrl: '',
        protocol:'',
        host:'',
        Hostname: '',
        hash:'',
        search:'',
        path:'',
        parameters:'',
        JobId:'',
        JobPortal: '',
        Status: '',
        Isinvite: '',
        Comments: '',

    };


//  save the new bid to the database
    $scope.createBid = function() {



        var bid = $scope.bid;

        var newbids = [];
        var biddername=$scope.biddername;
        var joburl=$scope.url;
        var jobportal=$scope.jobportal;
        var status=$scope.status
        var isinvite=$scope.isinvite
        var comments=$scope.comments
        var parser = document.createElement('a');
        parser.href = joburl;
if (biddername && joburl && status){
    var url=joburl;
    var rurl= /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;  
    if ((rurl.test(url))){
//check for the url
var contains = (joburl.indexOf('odesk') > -1); //true
if (contains){
    var JobId = joburl.split('~');
    JobId=JobId[1];
}
else if (!contains) {
    var r = /\d+/;
    var s = joburl;
    var JobId = s.match(r);
    JobId = JobId;
}
        var newbids={
            BidderName: biddername,
            JobUrl: joburl,
            protocol:parser.protocol,
            Host:parser.host,
            Hostname: parser.hostname,
            hash:parser.hash,
            search:parser.search,
            path:parser.pathname,
            parameters:parser.search,
            JobId: JobId,
            JobPortal: jobportal,
            Status: status,
            Isinvite: isinvite,
            Comments: comments 

        };
        console.log(newbids);
    }
    else{
        $(".url-error").show();
        $('.url-error').delay(4000).fadeOut();
    }
}
else {
    if (!biddername){
        $(".name-error").show();
        $('.name-error').delay(4000).fadeOut();
    }
    if (!joburl){
         $(".urlempty-error").show();
         $('.urlempty-error').delay(4000).fadeOut();
    }
    if (!status){
        $(".status-error").show();
        $('.status-error').delay(4000).fadeOut();
    }
}
$(".success-msg").show();
$('success-msg').delay(4000).fadeOut();
$('#BidForm').each(function(){
            this.reset();   //Here form fields will be cleared.
        });
 $http({method: 'POST', url: '/bidsave',data:newbids}).
        success(function(data, status, headers, config) {
            console.log(data);
        $scope.biddata=data;
    }).
    error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });       
};
   

}

// Controller for creating a new bid
function Searchbid($scope,$http) {
    $scope.findbid= function() {
        var jobid= $scope.jobid
        var joburl=$scope.joburl
        var bids={
            Joburl: joburl,
            JobId: jobid,
            };
console.log(bids);

$http({method: 'POST', url: '/bidgetsearch',data:bids}).
        success(function(data, status, headers, config) {
            console.log(data.bids);
            $scope.bidsinfo = data.bids;
        //$scope.biddata=data;
    }).
    error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });       
};
};
