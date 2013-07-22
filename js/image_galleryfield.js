function bind_upload(e){

	function t(e){
		'<div class="preview"><div class="delete"></div>'+'<span class="imageHolder">'+"<img />"+'<span class="uploaded"></span>'+"</span>"+
		'<div class="progressHolder">'+'<div class="progress"></div>'+"</div>"+"</div>"+'<br class="clear" />'
		var s = $('<div>').addClass('preview');
		$('<div>').addClass('delete').on('click',function(e){
			var $this = $(this);

			delete_file(e,$this);

		}).appendTo(s);
		var imageHolder = $('<span>').addClass('imageHolder');
		$('<img>').appendTo(imageHolder);
		$('<span>').addClass('uploaded').appendTo(imageHolder);
		imageHolder.appendTo(s);
		var progressHolder = $('<div>').addClass('progressHolder');
		$('<div>').addClass('progress').appendTo(progressHolder);
		progressHolder.appendTo(s);
		$('<br>').appendTo(s);
		var t=$(s),n=$("img",t);
		var o=new FileReader;
		n.width=100;
		n.height=100;
		o.onload=function(e){
			n.attr("src",e.target.result)
		};
		o.readAsDataURL(e);
		i.hide();
		r.find(".clear").remove();
		t.appendTo(r);
		$.data(e,t)
	}
	function n(e){
		i.html(e)
	}
	var r=$("#dropbox"),i=$(".message",r);
	maxsize=20,
	maxfile=50,
	queue=5,
	fallback="userfile";
	r.parent().append('<input type="file" name="'+fallback+'" id="'+fallback+'" multiple="multiple" style="display: none" />');
	$(document).bind("dragstart drag",function(e){
		r.addClass("dragging")
	}).bind("dragend",function(e){
		r.removeClass("dragging")
	});
	r.click(function(e){
		console.log(e);
		if($(e.target).parents('.preview').size()<=0){
			$("#"+fallback).click()
		}
	}).filedrop({
		fallback_id:fallback,
		paramname:"file",
		maxfilesize:maxsize,
		maxfiles:maxfile,
		queuefiles:queue,
		allowedfiletypes:["image/jpeg","image/png","image/gif"],
		url:SITE_URL+e,
		data:{
			csrf_hash_name:$.cookie(pyro.csrf_cookie_name),
			folder_id:$('#folder_id').val()
		},
		uploadFinished:function(e,t,n){
			if(n.status){
				$.data(t).addClass("done").attr('id',n.data.id);
			}else{
				$.data(t).addClass("error");
				alert(n.message.replace("<p>","").replace("</p>",""))
			}
		},
		error:function(e,t){
			switch(e){
				case"BrowserNotSupported":n("Your browser does not support HTML5 file uploads!");
				break;
				case"TooManyFiles":alert("Too many files! Please select "+maxfile+" at most.");
				break;
				case"FileTooLarge":alert(t.name+" is too large! Please upload files up to "+maxsize+"MB");
				break;
				default:
				break
			}
		},
		beforeEach:function(e){
			if(!e.type.match(/^image\//)){
				alert("Only images are allowed!");
				return false
			}
		},
		uploadStarted:function(e,n,r){
			t(n)
		},
		progressUpdated:function(e,t,n){
			$.data(t).find(".progress").width(n)
		},
		docEnter:function(){
			r.addClass("dragging")
		},
		docLeave:function(){
			r.removeClass("dragging")
		},
		drop:function(){
			r.removeClass("dragging")
		}
	});
}

$(function() {
	if( $('#dropbox').length > 0 ) { bind_upload('admin/files/upload'); }

	// Image reordering
	$('#dropbox').sortable({
		cursor: 'move',
		cancel: 'span.message',
		stop: function(event, ui) {
			var data = {};
			data['csrf_hash_name'] =  $.cookie(pyro.csrf_cookie_name);
			var i =0;
			
			$('#dropbox .preview').each(function(){ data['order[file][' + i + ']'] = $(this).attr('id'); i++; });
			$.post(SITE_URL+'admin/files/order', data, function(data) {
				if( data.status != true ) { alert(data.status); }
			},'json');
		}
	});

	$('#dropbox .preview .delete').on('click',function(e){
		var $this = $(this);

		delete_file(e,$this);

	});
});

function delete_file(e,file){
		e.preventDefault();
		var data = {};
		var $this = file;
		data['csrf_hash_name'] =  $.cookie(pyro.csrf_cookie_name);
		data['file_id'] = $this.parent().attr('id'); 

		$.post(SITE_URL+'admin/files/delete_file', data, function(data) {
			if( data.status != true ) { alert(data.status); }else{
				console.log('file_id: ' + $this.parent().attr('id') + 'deleted');
				$this.parent().hide();
			}
		},'json');

}