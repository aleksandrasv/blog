$(function(){
		$('#addComment').on('click', function(e){
		e.preventDefault();
		
		$.ajax({
			method: 'POST',
			url: '/comment',
			data: {
				_id: $('[name=_id]').val(), 
				name: $('[name=name]').val(),
				text: $('[name=text]').val()
			},
			dataType:'json',
			success:function(data){
				$('.comments').append("<p>"+$('[name=name]').val()+"</p>").addClass("lead");
				$('.comments').append("<p>"+$('[name=text]').val()+"</p>");

            },
            error:function(){
            	$('form').hide();
            	$('.commentForm').append('<p>Sorry! Error occured! Try again Later</p>');
            }
		})
	})
})