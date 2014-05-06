$(function(){
	$("#txtKeyWord").tokenInput('/searchautocomplete', {
            theme: "facebook",
            hintText:"",
            onResult: function (results) {   
                return results ;                
            },
            onAdd: function(item)
            {
             $("#hdKeyId").val(item.name);
            }
           
           
        });

    });
	
