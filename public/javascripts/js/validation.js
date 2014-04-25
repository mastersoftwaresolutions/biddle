$(document).ready(function(){
	$("#txtTitle").blur(function(){	  
         el = $(this);
    	  if(el.val().length < 50){
		$(".title-error").show();
		$('.title-error').delay(4000).fadeOut();
	}
	});

	$("#txtShortDesc").blur(function(){	  
         el = $(this);
    	  if(el.val().length < 100){
		$(".desc-error").show();
		$('.desc-error').delay(4000).fadeOut();
	}
	});


$("#txtUrl").blur(function(){	  
	el = $(this);
         var cl=".url-error";
	validateurl(el,cl);
});

function validateurl(value,cls) {
    	  if(value.val().length < 0){
		$(cls).show();
		$(cls).delay(4000).fadeOut();
	}
	else {
		var url=value.val();
		var rurl= /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;	
		if ((rurl.test(url))){
                       process='true';
			test = true;
                }
                 else {
		$(cls).show();
		$(cls).delay(4000).fadeOut();
		}				
	}
}


});      






