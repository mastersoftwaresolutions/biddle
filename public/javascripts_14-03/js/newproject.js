$(function(){
	$("#btnSubmit").click(function(){
		var selectedValues = $('#txtDeveloper').tokenInput("get");
		var selectedKeyValues = $('#txtKeyWords').tokenInput("get");
		$("#hdId").val("");
		$("#hdKeyId").val("");
		  $.each(selectedValues, function (i, item) {
            if ($("#hdId").val() == "") {
                $("#hdId").val(item.name);
            }
            else {
                $("#hdId").val($("#hdId").val() + ',' + item.name);
            }
        });
		   $.each(selectedKeyValues, function (i, item) {
            if ($("#hdKeyId").val() == "") {
                $("#hdKeyId").val(item.name);
            }
            else {
                $("#hdKeyId").val($("#hdKeyId").val() + ',' + item.name);
            }
        });
		
	});
    $('#aNew').click(function(){
        $('#divNew').removeAttr('style');
    })
    $('#btnKeySubmit').click(function(){
        if($('#txtNew').val()=="")
        {
            alert('Please enter keyword.')
        }
        else
                {
            $.ajax({
                    url:"/newkeyword?key="+$('#txtNew').val(),
                    type:"post",
                    contentType: "application/json; charset=utf-8",
                     error: function (xhr, error) {
                    $('#imgopeninterest').hide();
                    if (xhr.status != 0) {
                        alert('Error! Status = ' + xhr.status + ' Message = ' + error);
                    }
                },
                success: function (response) {
                    $('#txtNew').val('');
                    $('#divNew').attr('style','display:none')
                }
            })
        }
    })
});
