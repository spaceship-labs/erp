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
			$('.profilethumb img').attr('src','/uploads/users/'+data.data);
		}
	});

	$('.userEdit .taglist').on('click','.close',function(e){
		e.preventDefault();
		$(this).parent().parent().remove();
		updateApps();
	});

	$('.userEdit #addApps').on('submit',function(e){
		e.preventDefault();
		updateApps($(this).find('select').val());
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
		$.post('/users/editAjax',data,function(d){
			$('.alert').removeClass('unseen').find('p').text(data.msg);
			self.attr('href',d.data.activeN)
			self.text(d.data.active);
		});
	});

	var updateApps = function(addApp){
		var li = $('.taglist li'),
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
		$.post('/users/editAjax',data,function(data){
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
