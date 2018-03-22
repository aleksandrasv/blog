$(function(){
	$('form').on('submit', function(e){
		e.preventDefault();
		cleanError();
		var firstNameEL = $('#fname');
		var lastNameEl = $('#lname');
		var emailEl =  $('#email');
		var usernameEl =$('#username');
		var passwordEl = $('#pass');

		var firstName = firstNameEL.val().trim();
		var lastName = lastNameEl.val().trim();
		var username = usernameEl.val().trim();
		var email = emailEl.val().trim();
		var password = passwordEl.val().trim();
		$.ajax({
			method: 'POST',
			url: '/req',
			data: { 
				password: password,
    			picture: "https://picsum.photos/g/200/300",
    			username: username,
    			email: email
			},
			dataType:'json',
			success:function(res){
				console.log(res)
				if(res == "ok"){
					$('form').hide();
					$('.completed').show();
				}
				
            },
            error:function(res){
            	$('.existingUser').show();
            }
		})
	})
	$('input').on('keydown', function () {
        cleanError();
    });
})

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function cleanError(){
	$('span').hide();
	$('.has-error').removeClass('has-error');
}