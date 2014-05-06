$( document ).ready(function() {
	keys = $("#hdKeys").val();
	splitted  = keys.split(',');
	  keys = [];
	  if(splitted.length > 0){
	    for(var ix = 0 ; ix < splitted.length; ix++){
	        keys.push({"name":splitted[ix]});
	        $("#hdKeyId").val(splitted[ix]);
	    }
	   }
            console.log("data", keys);
	$("#edittxtKeyWords").tokenInput('/keyautocomplete', {
            theme: "facebook",
            onResult: function (results) {   
                console.log(results);
                return results ;                
            },
            onAdd: function(item)
            {
             $("#hdKeyId").val(item.name);
            },
           prePopulate: keys
		});


	developer = $("#hddev").val();
	splitteddev  = developer.split(',');
	  developer = [];
	  if(splitteddev.length > 0){
	    for(var ix = 0 ; ix < splitteddev.length; ix++){
	        developer.push({"name":splitteddev[ix]});
	        $("#hdId").val(splitteddev[ix]);
	    }
	   }
            console.log("data", developer);
	$("#edittxtDeveloper").tokenInput('/autocomplete', {
            theme: "facebook",
            onResult: function (results) {   
                return results ;                
            },
            onAdd: function(item)
            {
             $("#hdId").val(item.name);
            },
           prePopulate: developer
		});

});