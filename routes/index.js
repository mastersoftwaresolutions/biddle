
/*
 * GET home page.
 */

 // to connect mysql
var connection = require('../db.js').localConnect();
connection.connect();

// to connect mongodb
var mongoose = require('mongoose');
var db;
if (process.env.VCAP_SERVICES) {
   var env = JSON.parse(process.env.VCAP_SERVICES);
   db = mongoose.createConnection(env['mongodb-2.2'][0].credentials.url);
} else {
   db = mongoose.createConnection('localhost', 'nodetest1');
}

// Get bidder schema 
var biddleSchema = require('../models/biddle.js').biddleSchema;
var Bids = db.model('biddle', biddleSchema);
//var ObjectId = require('mongoose').Schema.ObjectId;
var kitty = new Bids(biddleSchema);
kitty.save(function (err) {
  if (err) // ...
  console.log('meow');
});
//fetch bidders data from mysql
exports.reportbid = function(req, res){
    connection.query('SELECT * FROM employees WHERE Designation = "Bidding Manager"', function(error , response){
        if (!error){
            res.json({"biddingreport":response});
        }

    });
  
};



//Save bids information to database
exports.bidsave = function(req, res) {
    console.log(req.body);
    var BidderName=req.body.BidderName;
    var JobUrl=req.body.JobUrl;
    var JobPortal=req.body.JobPortal;
    var Status=req.body.Status;
    var Isinvite=req.body.Isinvite;
   // var Comments=req.body.Comments; 
    var bids = new Bids(req.body);
    bids.save(function (err, doc) {
        if(err || !doc) {
           res.json({err : "error"});
        } else {
          res.json({success : "saved successfully"});
        }
    });

};

//fetch latest bids
exports.latestbids = function(req, res) {
    //console.log("requestscdjdv",req.body.cookiename);
    var BidderName = req.body.cookiename;
    if (BidderName){ 
        var cat = { BidderName : BidderName };
    }
    console.log("addsfsaf",cat);
    //var Biddername = req.query.data
    Bids.find(cat,function(err, bids) {
    if (!err){
         res.json({'bids':bids});
        }else {
            res.json({'error':'error'});
        }

});
}

//Delete a bid
exports.deletebid = function(req, res) {
    //console.log("request",req.query.data);
    var JobId = req.query.data;
    if (JobId){ 
        var cat = { JobId : JobId };
    }
    console.log("addsfsaf",cat);
    Bids.remove(cat, function(err, bids) {
    if (!err){
         res.json({'bids':bids});
        }else {
            res.json({'error':'error'});
        }

});

}



//Change status for a bid
exports.changestatus = function(req, res) {
    var jobid = req.body.JobId;
    var stat=req.body.status;
    //console.log("statstat",stat);

    if (jobid){ 
        var cat = { JobId : jobid };
    }
    if (stat == "Applying"){
        stat = "Applied";
    }
    else{
        stat = "Applying";
    }
    Bids.update(cat,{ $set: { Status: stat }},function(err, bids) {
    if (!err){
         res.json({'bids':bids});
        }else {
            res.json({'error':'error'});
        }

    });

}



//search bid using jobid
exports.bidgetsearch = function(req, res) {
    //var joburl = req.body.Joburl;
    var JobId = req.body.JobId;
    console.log("hithere",JobId);
 

   /* if (jobid && !joburl){ 
     var cat = { JobId : jobid };
    }else if(joburl && !jobid) {
       var cat = { JobUrl : joburl };
    }else{
      var cat = { JobId : jobid };
    }*/

    if (JobId){ 
    var cat = { JobId : JobId };
}
    Bids.find(cat, function(err, bids) {
    if (!err){
         res.json({'bids':bids});
        }else {
            res.json({'error':'error'});
        }

});
}

// to render new bid form
exports.newbid = function(req, res){
  res.render('basic', { title: 'Add New Bid' });
};

//to render search bid form
exports.searchbid = function(req, res){
  res.render('basic', { title: 'Add New Bid' });
};

//to render login form
exports.login = function(req, res){
  res.render('basic', { title: 'Login' });
};

// to render addproject view
exports.addproject = function(req, res){
  res.render('addproject', { title: 'Add New Project' });
};

// to save and edit project info
exports.newproject = function(db) {
    return function(req, res) {
        var datetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        // Get our form values. These rely on the "name" attributes
        var title = req.body.txtTitle;
        var url = req.body.txtUrl;
        var giturl = req.body.txtgitUrl;
        var desc = req.body.txtShortDesc;
        var keys = req.body.hdKeyId;
        var developer = req.body.hdId;
        var modifyDate = datetime;
        var createdDate = datetime;
        var is_Active = req.body.chkActive;
        var _id=req.body.hdnId;
        if (title && url && desc && keys) {
        //var urlvalid= /(http(s)?:\\)?([\w-]+\.)+[\w-]+[.com|.in|.org]+(\[\?%&=]*)?/
        if (!url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/)){
            res.render('addproject', {title:'Add New Project', msg: 'Enter valid Url' });
            return true;
        }

        if(giturl != "") {
        if (!giturl.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/)){
            res.render('addproject', {title:'Add New Project', msg: 'Enter valid GITHubUrl' });
            return true;
        }
       }

        // add new keywords in db 
        var keyList=keys.split(',');
        
        var document_ids = [];
        var keyCollection=db.get('keywords');
       
        for(var k in keyList){
            (function(ky)
            {
                keyCollection.find({'name':ky},function(err,doc){   
                    if(doc.length>0){}else{
                    keyCollection.insert({'name':ky});
                }
               });
                })(keyList[k]);
          
        }

        // Set our collection
        var collection = db.get('newproject');
        // for new project
        if(_id =="0"){
        collection.insert({
            "TITLE" : title,
            "URL" : url,
            "GithubUrl": giturl,
            "DESC":desc,
            "KEYS":keys,
            "DEVELOPER":developer,
            "CREATEDDATE":createdDate,
            "MODIFYDATE":modifyDate,
            "ISACTIVE":is_Active
        }, function (err, doc) {
            if (err) {
                res.json({"error": "There was a problem adding the information to the database."});
            }
            else {
                // console.log("here");
                // res.location("addproject");
                // res.render('addproject', {title:'Add New Project', msg: 'Project added successfully.' });
                res.json({"success": "success"});
            }
        });
    }
    // to update project
    else
    {   
        // Set our collection
        collection.update({'_id':_id},{$set:{
            "TITLE" : title,
            "URL" : url,
            "GithubUrl": giturl,
            "DESC":desc,
            "KEYS":keys,
            "DEVELOPER":developer,
            "CREATEDDATE":createdDate,
            "MODIFYDATE":modifyDate,
            "ISACTIVE":is_Active
        }}, function (err, doc) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            }
            else {
                //res.location("editproject");
                res.render('addproject', {title:'Edit Project', msg: 'Project updated successfully.' });
                }
            });
        }

}
    else{
             res.render('addproject', {title:'Add Project', msg: 'Please fill all fields' });
        }

    }
}
    
// autocomplete for developers
exports.autocomplete = function(db) {
    return function(req, res) {
        // using mysql to get developers list
        var developer=req.query.q;
        connection.query('SELECT  Employee_ID as id,FullName as name FROM employees where FullName LIKE "%'+developer+'%"' , function(err , lot){
            if (err) console.log(err);
            console.log('lot',lot);
        res.json(lot);
        });
    }
}

// autocomplete for keywords with add new words
exports.keyautocomplete = function(db) {
    return function(req, res) {
        var key=req.query.q; // get query string
        var collection = db.get('keywords');
        collection.find({
            "name" :  new RegExp(key)
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem getting the information from the database.");
            }
            else {
                if(doc.length>0)
                {               
                res.json(doc);
            }
            else{
                //to add keyword if not exists in db
                res.json([{'id':'1','name':key}]);
            }
            }
        });

    }
}

// autocomplete for searchkeywords only for existing
exports.searchautocomplete = function(db) {
    return function(req, res) {
        var key=req.query.q; // get querystring
        var collection = db.get('keywords');
        collection.find({
            "name" :  new RegExp(key)
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem getting the information from the database.");
            }
            else {                            
               // res.json(doc);
            	if(doc.length>0){               
            		res.json(doc);
                }
            	else{
            		//to add keyword if not exists in db
            		res.json([{'id':'1','name':key}]);
            	}
            }
        });
    }
}

// to rendre search view
exports.search = function(req, res){
  res.render('search', { title: '' });
};

// to call projectlist page
exports.searchproject = function(db) {
    return function(req, res) {
    // get params by name
     res.location("projectlist?key="+req.body.hdKeyId);
     res.redirect("projectlist?key="+req.body.hdKeyId);
    };
}

// to render projectlist page 
exports.projectlist = function(db) {
    return function(req, res) {
        var key=req.query.key; // get querystring
        if(key=="undefined"){
        	res.render('projectlist', {
        		"projectlist" : docs,"msg":"No Project Found."
            });
        }
        else{
	        var collection = db.get('newproject');
	        collection.find({$query: {
	            $or:[ { DESC:  new RegExp(key)},{ KEYS:  new RegExp(key)}]
	        }, $orderby: { CREATEDDATE : -1 } },function(e,docs){ // for desc order
	        	
	        	
	            if(parseInt(docs.length)!=parseInt(0) || docs.length!='0'){
	            res.render('projectlist', {
	                "projectlist" : docs,"msg":""
	            });
	        }
	        else{
	        	console.log('Here');
	            res.render('projectlist', {
	            "projectlist" : docs,"msg":"No Project Found."
	                });
	            }
	        });    
        }
    };
};

// to delete project from list page
exports.deleteproject=function(db)
{

    return function(req,res){
//res.writeHead(200, {"Content-Type": "text/html"});
   //res.write("<script type='text/javascript'>var cont = confirm('Are you sure ?');</script>");
    var id=req.query.key; // get querystring
    var collection=db.get('newproject');
    collection.remove({'_id':id
     }, function (err, doc){ 
    if(err)
    res.json({'status':'0'});
    else {
    res.redirect("/projectlist");
    //res.json({'status':"1"})
}
      });
    //res.redirect("projectlist?key="+returnkey);
    };
};

// to render edit project view
exports.editproject=function(req, res)
{
  //  res.json('done');
    res.redirect('edit?key='+req.query.key);
};
exports.edit= function(db)
{
    return function(req,res)
    {
        var id=req.query.key;
        console.log('id',id)
        var collection=db.get('newproject');
        collection.find({'_id':id},
            function(err,doc){
                console.log('editproject',doc);
                if(!err)
                    console.log('editproject',doc);
                    res.render('editproject',{'title':'Edit Project','project':doc});
            });
    };
};
