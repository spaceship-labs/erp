jQuery(function(){
	jQuery('.chzn-select').chosen();
	jQuery('.userCreate').ajaxForm(function(data){
		jQuery('.userAlert p').text(data.msg).parent().show();
	});
});
