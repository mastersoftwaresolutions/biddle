$(function(){
	$("#btnSearch").click(function(){

		var selectedKeyValues = $('#txtKeyWords').tokenInput("get");
		$("#hdKeyId").val("");		  
		   $.each(selectedKeyValues, function (i, item) {
            if ($("#hdKeyId").val() == "") {
                $("#hdKeyId").val(item.name);
            }
            else {
                $("#hdKeyId").val($("#hdKeyId").val() + ',' + item.name);
            }
        });
		
	});
});
