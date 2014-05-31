jQuery(function($){
	$('.chzn-select').chosen();

	$('.userCreate, .companyCreate').ajaxForm(function(data){
		var alt = $('.userAlert p');
		alt.text(data.msg).parent().show();
		$(window).scrollTop(alt.parent().position().top-10);
	});

	$('.change-icon-button').on('click',function(e){
		e.preventDefault();
		$('#change-icon').removeClass('hidden');
	});

	$('#change-icon').ajaxForm(function(data){
		if(data.status){	
			$('.profilethumb img').attr('src','/uploads/users/'+data.data);
		}
	});

	$('.profileEdit .taglist').on('click','.close',function(e){
		e.preventDefault();
		$(this).parent().parent().remove();
		updateApps(false,$('input[name="url"]').val());
	});

	$('.profileEdit #addApps').on('submit',function(e){
		e.preventDefault();
		updateApps($(this).find('select').val(),$(this).find('input[name="url"]').val());
	});

	$('.editprofileform').ajaxForm(function(data){
		$('.alert').removeClass('unseen').find('p').text(data.msg)
	});

	$('.editprofileform .confirmbutton').on('click',function(e){
		e.preventDefault();

		var self = $(this)
		, data = {
			active:self.attr('href')
			,userId:$('input[name="userId"]').val()
			,method:'info'
		}
		
		$.post(self.data('url')+'editAjax',data,function(d){
			$('.alert').removeClass('unseen').find('p').text(data.msg);
			self.attr('href',d.data.activeN)
			self.text(d.data.active);
		});
	});

	$('.fileupload').fileupload();


	var updateApps = function(addApp,url){
		var li = $('.profileEdit .taglist li'),
		apps = [];
		for(var i=0;i<li.length;i++){
			apps.push(li.eq(i).children().attr('href'));
		}
		data = {
			method:'apps'
			,apps:apps
			,userId:$('input[name="userId"]').val()
		}
		if(addApp){
			data.apps.push(addApp)
		}
		$.post(url+'editAjax',data,function(data){
			console.log(data);
			var taglist = $('.taglist')
			, template = ""
			, apps = data.data;
			taglist.find('li').remove();
			if(apps && apps.length){
				for(var i=0;i<apps.length;i++){
					template += '<li><a href="'+apps[i].controller+'">'+apps[i].name+'<span class="close">×</span></a></li';	
				}
				taglist.append(template);
			}
			
		});		
	}
});
