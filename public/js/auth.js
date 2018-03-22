$(function(){
	$('form').on('submit', function(e){
		cleanError()

		var userEl = $('#username');
		var passwordEl = $('#password');
		var username = userEl.val().trim();
		var password = passwordEl.val().trim();

		// Validation
		if(!username){
			e.preventDefault();
			$('.userlRqr').show();
			userEl.addClass('has-error');
			return
		}
		if(!password){
			e.preventDefault();
			$('.passRqr').show();
			passwordEl.addClass('has-error');
			return
		}

		// $.ajax({
		// 	method: 'POST',
		// 	url: '/auth',
		// 	data: { 
		// 		username: $('[name=username]').val(),
		// 		password: $('[name=password]').val()
		// 	},
		// 	success:function(data){
		// 		location.reload();
  //           },
  //           error:function(){
  //           	$('form').hide();
  //           	$('.authForm').append('<p>Sorry! Error occured! Try again Later</p>');
  //           }
		// })
	})
	$('input').on('keydown', function () {
        cleanError();
    });
})

function cleanError(){
	$('span').hide();
	$('.has-error').removeClass('has-error');
}

