// controllers for biddle app       
function bidCtrl($scope,$http){
    $http({method: 'POST', url: '/reportbid'}).
    	success(function(data, status, headers, config) {
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
            var JobId =  getid(url);  
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


// Controller for  bids 
function Searchbid($scope,$http,$cookies) {
    var user= $.cookie("cookiename");
    var cookie={
            cookiename : user
            };
    $http({method: 'POST', url: '/latestbids',data:cookie}).
    success(function(data, status, headers, config) {
    $scope.allbids = data;
    });
    // Clicking on Search button calls this function to search bids
    $scope.findbid= function() {
        $("#checkuser").hide();
        var joburl=$scope.joburl
        var url=joburl;
        var rurl= /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;  
        if ((rurl.test(url))){
          var JobId =  getid(url);          
        if (JobId){
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
    
        //to get bids data using job url and job id
        $http({method: 'POST', url: '/bidgetsearch',data:bids}).
            success(function(data, status, headers, config) {
                $scope.bidsinfo = data.bids;
                if ($scope.bidsinfo != ''){
                    $scope.st = $scope.bidsinfo[0].Status
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
            }).
            error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            });       
        };
    }
    // to show the section for applying for the job
    $scope.go= function() {
        $("#check").show();
        $(".new-msg").hide();
    }

    //view bids information
    $scope.viewbid= function(even) {
        if(typeof even == 'undefined') {
           var view = "form";
        }else{
          var view = "latest";
        }
        var joburl=$scope.joburl || $("."+ even.target.id).text();
        var JobId =  getid(joburl); 
        var data = $scope.joburl
        if (!data){
            var a = $("#"+ even.target.id).next().next().next().after($('#info').show());

        }

        var bids={
            JobId: JobId,
        };
        $http({method: 'POST', url: '/bidgetsearch',data:bids}).
        success(function(data, status, headers, config) {
            console.log(data.bids.length,"asdsads");
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
        //var JobId =  getid(joburl); 
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


    //change status for a particular job
    $scope.change= function(even) {
    var joburl = $scope.joburl || $("."+ even.target.id).text();
    var JobId =  getid(joburl);
    var data = $scope.joburl
    if (!data){
        var a = $("#"+ even.target.id).next().next().next().after("<span style='color:green'  class='stat-msg' >Status changed</span><br>");
        $('.stat-msg').delay(2000).fadeOut();
        $('#info').hide();
    }
    var bids={
            JobId: JobId,

            };
    $http({method: 'POST', url: '/bidgetsearch',data:bids}).
        success(function(data, status, headers, config) {
            var stat = data.bids[0].Status;
            var bids={
                Joburl: joburl,
                status: stat
            };
            $http({method: 'POST', url: '/changestatus',data:bids}).
                success(function(data, status, headers, config) {
                    console.log(data);
                    $(".status-msg").show();
                    $('.status-msg').delay(2000).fadeOut();
                    $('#bidinfo').hide();

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

        var data = $scope.joburl
        if (!data){
            var a = $("#"+ even.target.id).next().next().next().after("<span style='color:green'  class='remove-msg' >Data Deleated</span><br>");
            $("#"+ even.target.id).parent().remove();
            $('.remove-msg').delay(2000).fadeOut();
            $('#info').hide();
        }
        var bids={
            Joburl: joburl,

            };
        console.log(bids);
        $http({method: 'POST', url: '/bidgetsearch',data:bids}).
        success(function(data, status, headers, config) {
            var stat = data.bids[0].Status;

            $http({method: 'GET', url: '/deletebid?data='+joburl }).
            success(function(data, status, headers, config) {
                console.log(data);
                $(".delete-msg").show();
                $('.delete-msg').delay(2000).fadeOut();
                $("#bidinfo").hide();
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
function loginCtrl($scope,$http,$rootScope,$location,$cookies){
  $scope.userlogin = function() {
    var username = $scope.username;
    var password = $scope.password;
    var user={
            username: username,
            password: password,
            };


    $http({method: 'POST', url: '/checklogin',data:user}).
    success(function(data, status, headers, config) {
        //console.log(data.name[0].Username,"dataf");

        if (data){
            $rootScope.user = "done" ;
            $.cookie("cookiename", data.name[0].Username);
            $location.url('/searchbid');  
              
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

// function to Get JobId from JobUrl 
function getid(value) {
var tilt = value.split('~');
var splitslash = tilt[0].split('/');
var test = (splitslash[2])

if(test == "www.odesk.com"){
    var JobId = value.split('~');
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
else if (test == "www.elance.com"){
        var regex = /\/\d+\//;
            var url = value;
            var exist = url.match(regex);
            var strid = String(exist);
            var JobId = strid.replace(/\//g,'');
            JobId = JobId;
}

return JobId;
}
//ends here
   

