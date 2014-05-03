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

    // directive to change job portal on filling the job url automatically
    $scope.changeName = function() {
        var url = $scope.url;
        var containsodesk = (url.indexOf('odesk') > -1); //true
        var containselance = (url.indexOf('elance') > -1); //tru
    if (containsodesk){
         $scope.name = 'odesk';
    }
    else if (containselance) {
        $scope.name = 'elance';
    }
    else{
        $scope.name = '';
    } 
    };

    $scope.status = [
        { name: 'Applying', value: 'Applying' }, 
        { name: 'Applied', value: 'Applied' }, 
    ];
    
    $scope.workstat = $scope.status[0].value ;
        //  save the new bid to the database
        $scope.createBid = function() {
            var bid = $scope.bid;
            var newbids = [];
            var biddername=$scope.biddername;
            var joburl=$scope.url;
            var jobportal=$("#jobportal").val() ;
            var status = $scope.workstat
            var isinvite=$scope.isinvite
            var comments=$scope.comments
            var parser = document.createElement('a');
            parser.href = joburl;
            if (!isinvite){
                isinvite = 'no';
            }
            else{
                isinvite='yes'
            }
    if (biddername && joburl && status){
        var url=joburl;
        var rurl= /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;  
        if ((rurl.test(url))){
            //check for the url
            var contains = (joburl.indexOf('odesk') > -1); //true
            if (contains){
                var JobId = joburl.split('~');
                var id = JobId[1]
                var check1 =   (id.indexOf('?') > -1); //true
                var check2 =    (id.indexOf('/') > -1); //true
                if (check1){
                    var Id = id.split('?');
                    var JobId = Id[0];
                }
                if (check2){
                    var Id = id.split('/');
                    var JobId = Id[0];
                }
    
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
        $http({method: 'POST', url: '/bidsave',data:newbids}).
            success(function(data, status, headers, config) {
                console.log(data);
                $scope.biddata=data;
                $(".success-msg").show();
                $('success-msg').delay(4000).fadeOut();
                $('#BidForm').each(function(){
                    this.reset();   //Here form fields will be cleared.
                });
            }).
            error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            });       
        }
    else{
        $(".url-error").show();
        $('.url-error').delay(4000).fadeOut();
        return false;
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
            return false;
        }
        if (!status){
            $(".status-error").show();
            $('.status-error').delay(4000).fadeOut();
            return false;
        }
    }

};
   
};


// Controller for creating a new bid
function Searchbid($scope,$http,$cookies) {
    $scope.user= $.cookie("cookiename");
    $http({method: 'GET', url: '/latestbids'}).
    success(function(data, status, headers, config) {
    $scope.allbids = data;
    //console.log("datatsfdfsd",$scope.bidsinfo);
    });
    //console.log($scope.bidsinfo[0].Status,"adqdasf");
    $scope.findbid= function() {
        $("#checkuser").hide();
        var joburl=$scope.joburl
        var url=joburl;
        var rurl= /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;  
        if ((rurl.test(url))){
        //check for id
        var contains = (joburl.indexOf('odesk') > -1); //true
        if (contains){
            var JobId = joburl.split('~');
            var id = JobId[1]
            var check1 =   (id.indexOf('?') > -1); //true
            var check2 =    (id.indexOf('/') > -1); //true
            if (check1){
                var Id = id.split('?');
                var JobId = Id[0];
            }
            if (check2){
                var Id = id.split('/');
                var JobId = Id[0];
            }
            else {
                var JobId = JobId[1];
            }
        }
        else if (!contains) {
            var r = /\d+/;
            var s = joburl;
            var JobId = s.match(r);
            JobId = JobId;
        }
        //ends here
        
            var bids={
                Joburl: joburl,
                JobId: JobId,
            };
        }
        else{
            $(".invalid-msg").show();
            $('.invalid-msg').delay(4000).fadeOut();
            return false; 
        }
    

    $http({method: 'POST', url: '/bidgetsearch',data:bids}).
        success(function(data, status, headers, config) {
            $scope.bidsinfo = data.bids;
            //console.log($scope.bidsinfo[0].Status,"adqdasf");
            if ($scope.bidsinfo != ''){
                //console.log("here",$scope.bidsinfo[0].BidderName);
                $scope.st = $scope.bidsinfo[0].Status
                //console.log($scope.st);
                if ($scope.st == "Applied"){
                    $scope.st = "Applying"
                }
                else{
                    $scope.st = "Applied"
                }
                var username = $cookies.cookiename
                if ($scope.bidsinfo[0].BidderName == username){
                    $("#checkuser").show();
                }
                else{
                    $(".already-msg").show();
                    $('.already-msg').delay(4000).fadeOut();
                }
            }
            else{
                $(".new-msg").show();
                $(".go-btn").show();
            }
        //$scope.biddata=data;
        }).
        error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });       
    };
    $scope.abc= function() {
        $("#check").show();
        $(".new-msg").hide();
    }

    //view bidinfo
    $scope.viewbid= function(even) {
        //$('#bidinfo').empty();
        if(typeof even == 'undefined') {
           var view = "form";
        }else{
          var view = "latest";
        }
        var joburl=$scope.joburl || $("."+ even.target.id).text();
        



//check for jobid

        var contains = (joburl.indexOf('odesk') > -1); //true
        if (contains){
            var JobId = joburl.split('~');
            var id = JobId[1]
            var check1 =   (id.indexOf('?') > -1); //true
            var check2 =    (id.indexOf('/') > -1); //true
            if (check1){
                var Id = id.split('?');
                var JobId = Id[0];
            }
            if (check2){
                var Id = id.split('/');
                var JobId = Id[0];
            }
            else {
                var JobId = JobId[1];
            }
        }
        else if (!contains) {
            var r = /\d+/;
            var s = joburl;
            var JobId = s.match(r);
            JobId = JobId;
        }

//ends here

        var JobId = JobId

        var bids={
            JobId: JobId,
        };
        $http({method: 'POST', url: '/bidgetsearch',data:bids}).
        success(function(data, status, headers, config) {
        console.log(data.bids.length,"asdsads");
        //$("#bidinfo").html(' ');
        $scope.info=data;
        if (data.bids.length == 1){
          if(view == 'form'){
         $('#bidinfo').show();
        }else{
            $('#info').show();
        }
     }
    });
    }   


//save values to database using the search form
$scope.save= function() {
    var joburl = $scope.joburl;
    
    var contains = (joburl.indexOf('odesk') > -1); //true
    if (contains){
        var JobId = joburl.split('~');
        var id = JobId[1]
        var check1 =   (id.indexOf('?') > -1); //true
        var check2 =    (id.indexOf('/') > -1); //true
        if (check1){
            var Id = id.split('?');
            var JobId = Id[0];
        }
        if (check2){
            var Id = id.split('/');
            var JobId = Id[0];
        }
        else {
            var JobId = JobId[1];
        }
        JobPortal="odesk";
    }
    else if (!contains) {
        var r = /\d+/;
        var s = joburl;
        var JobId = s.match(r);
        JobId = JobId;
        JobPortal="elance"
}
status="Applying"
var parser = document.createElement('a');
parser.href = joburl;
isinvite=$scope.invite;
if (!isinvite){
    isinvite = 'no';
}
else{
    isinvite='yes'
    }
var newbids={
            BidderName:$cookies.cookiename,
            JobUrl: joburl,
            protocol:parser.protocol,
            Host:parser.host,
            Hostname: parser.hostname,
            hash:parser.hash,
            search:parser.search,
            path:parser.pathname,
            parameters:parser.search,
            JobId: JobId,
            JobPortal: JobPortal,
            Status: status,
            Isinvite: isinvite, 

        };
        console.log(newbids);
        $http({method: 'POST', url: '/bidsave',data:newbids}).
        success(function(data, status, headers, config) {
        console.log(data);
        $scope.biddata=data;
        $(".saved-msg").show();
        $('.saved-msg').delay(3000).fadeOut();
        $(".new-msg").hide();
        $("#check").hide();
        $('#searchbid').each(function(){
            this.reset();   //Here form fields will be cleared.
        });

    }).
    error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });        


}
// click on change button calls this function
$scope.change= function(even) {
//console.log("axasxs",even.target.id);
var a = $('#'+even.target.id).attr("data-stat")
alert (a);
var joburl = $scope.joburl || $("."+ even.target.id).text();
//check for jobid

        var contains = (joburl.indexOf('odesk') > -1); //true
        if (contains){
            var JobId = joburl.split('~');
            var id = JobId[1]
            var check1 =   (id.indexOf('?') > -1); //true
            var check2 =    (id.indexOf('/') > -1); //true
            if (check1){
                var Id = id.split('?');
                var JobId = Id[0];
            }
            if (check2){
                var Id = id.split('/');
                var JobId = Id[0];
            }
            else {
                var JobId = JobId[1];
            }
        }
        else if (!contains) {
            var r = /\d+/;
            var s = joburl;
            var JobId = s.match(r);
            JobId = JobId;
        }

//ends here





var bids={
            JobId: JobId,

           // JobId: jobid,
            };
 $http({method: 'POST', url: '/bidgetsearch',data:bids}).
        success(function(data, status, headers, config) {
        var stat = data.bids[0].Status;
        var bids={
            Joburl: joburl,
            status: stat
           // JobId: jobid,
            };
        $http({method: 'POST', url: '/changestatus',data:bids}).
            success(function(data, status, headers, config) {
            console.log(data);
            $(".status-msg").show();
            $('.status-msg').delay(2000).fadeOut();
            $('#bidinfo').hide();

            //$scope.biddata=data;

        }).
        error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });      

    }).
    error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });        

  


}
// delete a bid from database
$scope.delete= function(even) {
var cont = confirm('Are you sure ?');
if (cont){
var joburl=$scope.joburl || $("."+ even.target.id).text();

var bids={
            Joburl: joburl,

           // JobId: jobid,
            };
console.log(bids);
$http({method: 'POST', url: '/bidgetsearch',data:bids}).
        success(function(data, status, headers, config) {
        var stat = data.bids[0].Status;
   //     var bids={
     //       Joburl: joburl,
        //    };
        $http({method: 'GET', url: '/deletebid?data='+joburl }).
            success(function(data, status, headers, config) {
            console.log(data);

            $(".delete-msg").show();
            $('.delete-msg').delay(2000).fadeOut();
            $("#bidinfo").hide();
            //$("#change-btn").hide();
            //$scope.biddata=data;

        }).
        error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });      

    }).
    error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });        

 }
}
};


// check login details 
function loginCtrl($scope,$http,$location,$cookies){
  $scope.userlogin = function() {
    var username = $scope.username;
    var password = $scope.password;
 var user={
            username: username,
            password: password,
            };


$http({method: 'POST', url: '/checklogin',data:user}).
success(function(data, status, headers, config) {
//console.log(data.user);
// $scope.userinfo = data;
console.log(data.userinfo.length);

if (data.userinfo.length != 0){
$location.path('/searchbid');  
}
else{
    $(".error-msg").show();
    $('.error-msg').delay(2000).fadeOut();
}
}).
error(function(data, status, headers, config) {
// called asynchronously if an error occurs
// or server returns response with an error status.
 });


};
};