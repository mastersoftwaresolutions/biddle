$(function(){
	$("#txtDeveloper").tokenInput('/autocomplete', {
            theme: "facebook",
            onResult: function (results) {   
                return results ;                
            },
            onAdd: function(item)
            {
             $("#hdId").val(item.name);
            }
           
           
        });

    });
	
