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

   /* $('#btnDelete').click(function(){
alert ($(this).attr('class'));
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
    /*$('#btnEdit').click(function(){
        $.ajax({
                    url:"/editproject?key="+$(this).attr('class'),
                    type:"get",
                    contentType: "application/json; charset=utf-8",
                     error: function (xhr, error) {
                    if (xhr.status != 0) {
                        alert('Error! Status = ' + xhr.status + ' Message = ' + error);
                    }
                },
                success: function (response) {
                    alert(response);
                   // window.location=window.location;
                }
            })

    })*/
    var data=$('#pSub').text();
    if(data.length>250)
    {
        data=data.substring(0,250);
        $('#pSub').text(data);
        $('#aNew').show();
    }
    $('#aNew').click(function(){
        $('#pFull').show();
        $('#pSub').hide();
        $('#aNew').hide();
        $('#aHide').show();
    })
     $('#aHide').click(function(){
        $('#pFull').hide();
        $('#pSub').show();
        $('#aHide').hide();
        $('#aNew').show();
    })
});
