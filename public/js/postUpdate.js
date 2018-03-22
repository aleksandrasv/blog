$(function(){
 
// DELETE POST
	$('#deletePost').on('click', function(e){
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/delete',
			data: { 
				_id: $('input').val()
			},
			dataType:'json',
			success:function(res){
				$('#deleted').hide();
				$('.comments').hide();
				$('.commentForm').hide();
				$('.completed').show();
            },
            error:function(res){
            	console.log(res)
            }
		})
	})


// UPDATE POST
	$('#makeEdit').on('click', function(e){
		e.preventDefault(e);
		$('.mEdits').hide();
		$('.pEdits').show();
	})
	$('#postEdit').on('click', function(e){
		e.preventDefault(e);
		var title = $("[name=title]").val().trim();
			content = $("[name=content]").val().trim();
			postId = $("input").val().trim();
		console.log(postId)
		$.ajax({
			method: 'POST',
			url: '/update',
			data: { 
				_id: postId,
				title:  title,
				content: content
			},
			dataType:'json',
			success:function(data){	
				$("#postTtl").text(title);
				$("#postCntnt").text(content);
				$('.mEdits').show();
				$('.pEdits').hide();
            },
            error:function(res){
            	console.log(res)
            }
		})

	})
})