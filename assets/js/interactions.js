jQuery(function($){
	$('.chzn-select').chosen();

	$('.userCreate').ajaxForm(function(data){
		$('.userAlert p').text(data.msg).parent().show();
	});

	$('.change-icon-button').on('click',function(e){
		e.preventDefault();
		$('#change-icon').removeClass('hidden');
	});

	$('#change-icon').ajaxForm(function(data){
		if(data.status){	
			$('.profilethumb img').attr('src','/uploads/users/'+data.img);
			console.log(data)
		}
	});
});
