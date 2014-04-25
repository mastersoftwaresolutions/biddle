$(function(){
	$("#txtKeyWords").tokenInput('/keyautocomplete', {
            theme: "facebook",
            onResult: function (results) {   
                return results ;                
            },
            onAdd: function(item)
            {
             $("#hdKeyId").val(item.name);
            }
           
           
        });

    });
	
