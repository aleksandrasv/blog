$(function(){

// LOGOUT FROM ACCOUNT
	$('#logOut').on('click', function(e){
		e.preventDefault();
		$.ajax({
			method:'POST',
			url: '/logout',
			data:{
				userName: $('input').val()
			},
			dataType:'json',
			success:function(data){
				console.log('ok')

            },
            error:function(res){
            	if(res.status==200){
            		location.reload();
            	}
            }		
		})

	})

// ADD NEW POST

	$('#addNew').on('click', function(e){
		e.preventDefault();
		location.reload();
	})
	$('form').on('submit', function(e){
		e.preventDefault();
		var titleEl = $('#title');
		var contentEl = $('#content');
		var title = titleEl.val().trim();
		var content = contentEl.val().trim();
		$.ajax({
			method: 'POST',
			url: '/account',
			data: { 
				likes: getRandomInt(10),
				picture: "https://picsum.photos/300/100/?random",
				title: title,
				content: content
			},
			dataType:'json',
			success:function(data){
				$('form').hide();
				$('.added').hide();
				$('.pEdits').show();
            },
            error:function(res){
            	console.log(res)
            }
		})

	})
	$('input').on('keydown', function () {
        cleanError();
    });
})

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function cleanError(){
	$('span').hide();
	$('.has-error').removeClass('has-error');
}