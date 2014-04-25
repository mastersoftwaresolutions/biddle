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

    $('#btnDelete').click(function(){
        $.ajax({
                    url:"/deleteproject?key="+$(this).attr('class'),
                    type:"post",
                    contentType: "application/json; charset=utf-8",
                     error: function (xhr, error) {
                    if (xhr.status != 0) {
                        alert('Error! Status = ' + xhr.status + ' Message = ' + error);
                    }
                },
                success: function (response) {
                    window.location=window.location;
                }
            })

    })
});
