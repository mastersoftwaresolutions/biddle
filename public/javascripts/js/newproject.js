$(function(){
   
	$("#btnSubmit").click(function(){
         var errMes = [];
        var title=$('#txtTitle').val();
          if(title.length < 50){
            errMes .push("Title")
            //$(".title-error").show();
            //$('.title-error').delay(4000).fadeOut();
            //return true;
         }

        var description=$('#txtShortDesc').val();
        if(description.length < 100){
            errMes .push("Description")
            //$(".desc-error").show();
            //$('.desc-error').delay(4000).fadeOut();
            //return true;
         }

        var value=$('#txtUrl').val();
        var cl=".url-error";
        validateurl(value,cl,errMes);

		var value1=$('#txtgitUrl').val();
        var cl1=".giturl-error";
        validateurl(value1,cl1,errMes);


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
           if (selectedKeyValues.length == 0){
                errMes .push("key")
                //$(".key-error").show();
                //$('.key-error').delay(4000).fadeOut();
                //return true;
            }
           else {
		   $.each(selectedKeyValues, function (i, item) {
            if ($("#hdKeyId").val() == "") {
                $("#hdKeyId").val(item.name);
          
            }
            else {
                $("#hdKeyId").val($("#hdKeyId").val() + ',' + item.name);
            }
        });
    }
    console.log(errMes);
if (errMes.length>0){
    var arrayLength = errMes.length;
    for (var i = 0; i < arrayLength; i++) {
        if (errMes[i] == "Title"){
            $(".title-error").show();
            $('.title-error').delay(4000).fadeOut();
        } 
        else if (errMes[i] == "Description"){
            $(".desc-error").show();
            $('.desc-error').delay(4000).fadeOut();
        }
        else if (errMes[i] == "key"){
            $(".key-error").show();
            $('.key-error').delay(4000).fadeOut();
        }
        else if (errMes[i] == "EmptyURL"){
            if (value == ""){
                $('.urlempty-error').show();
                $('.urlempty-error').delay(4000).fadeOut();
            }
            if (value1 == ""){
                $('.giturlempty-error').show();
                $('.giturlempty-error').delay(4000).fadeOut();
            }
            // $('.url-error').show();
            //$('.url-error').delay(4000).fadeOut();
            
        }
        else if (errMes[i] == "valid url"){
            var rurl= /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;
            if ((!rurl.test(value))){
                $('.url-error').show();
                $('.url-error').delay(4000).fadeOut();
            }
            if ((!rurl.test(value1))){
                $('.giturl-error').show();
                $('.giturl-error').delay(4000).fadeOut();
            }
        }
    }

}
else{
    $.ajax({
        url :'/newproject',
        type :'POST',  
        error:function()
        {
            alert("There is some error");
        },     
        data:{"txtTitle":title,"txtUrl":value,"txtgitUrl":value1,"txtShortDesc":description,"hdKeyId":$("#hdKeyId").val(),"hdId":$("#hdId").val(), "chkActive": $("#chkActive").attr("checked") ? 1 : 0,"hdnId":$("#hdnId").val()},
        success : function(res)
        {
        console.log(res.success);
        $("#lblMsg").show();
        $('#lblMsg').delay(4000).fadeOut();
        $('#formAddProject').each(function(){
            this.reset();   //Here form fields will be cleared.
        });
        $(".token-input-token-facebook").remove();
        }
    });
}
		
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

// to validate the fields for url and Githuburl
function validateurl(value,cls,errMes) {
    if(value.length == 0){
        errMes .push("EmptyURL")
        //$(cls).show();
        //$(cls).delay(4000).fadeOut();
        //return true;
    }else {
        var url=value;
        var rurl= /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;  
        if ((rurl.test(url))){
            process=true;
        }else {
            process=false;
            errMes .push("valid url")
            //$(cls).show();
            //$(cls).delay(4000).fadeOut();

        }               
    }
}

});
