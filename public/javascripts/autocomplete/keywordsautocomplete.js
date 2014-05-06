$(function(){
	$("#txtKeyWords").tokenInput('/keyautocomplete', {
            theme: "facebook",
            onResult: function (results) {   
                console.log(results);
                return results ;                
            },
            onAdd: function(item)
            {
             $("#hdKeyId").val(item.name);
            }
		});



});
	

