const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const fs = require('fs');
var cookieParser = require('cookie-parser');


const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('public'));


mongoClient.connect(url, (err,client)=>{
	if(err){
		console.log(err);
		client.close();
		return;
	}
	const db = client.db('blog');


// Home Page-------------------------------------------------------------
	app.get('/', (req,res)=>{
		db.collection('posts')
	  	  .find()
	  	  .sort({likes:-1})
	  	  .limit(10)
	      .toArray((err, result)=>{
	  	    if(err){
	  			console.log(err);
	  			client.close();
	  			return;
	  		}
	  		res.render('index', {posts:result, username:req.cookies.user_name})
	  	  })
	})


// All Posts Page--------------------------------------------------------
	app.get('/posts', (req,res)=>{
		db.collection('posts')
	  	  .find()
	      .toArray((err, result)=>{
	  	    if(err){
	  			console.log(err);
	  			client.close();
	  			return;
	  		}
	  		res.render('posts', {posts:result, username:req.cookies.user_name})
	  	  })
	})


// Single Post Page------------------------------------------------------
	app.get('/post/:id',(req,res)=>{
		db.collection('posts')
		  .find()
	      .toArray((err, result)=>{
	  	    if(err){
	  			console.log(err);
	  			client.close();
	  			return;
	  		}
	  		db.collection('posts')
	  		  .find()
	  		  .toArray((err,result)=>{
	  		  	if(err){
	  		  		console.log(err);
	  		  		client.close();
	  		  		return;
	  		  	}
	  		  	var single = result.find((post)=>{
	  		  		return post.title == req.params.id;
	  		  	})
	  			res.render('post', {post:single, username:req.cookies.user_name})
	  		  })
		  		  	
		})
	})


// Edit Post by Author---------------------------------------------------
	app.post('/update', (req, res)=>{
		if(!req.body.title || !req.body.content){
			res.status(400).json("Sorry there was a Mistake Try Again Later");
		}
		db.collection('posts')
		  .updateOne({
		  	_id: mongodb.ObjectId(req.body._id)
		  },{
		  	$set:{
		  		title: req.body.title,
		  		content: req.body.content
		  	}
		  },(err, result)=>{
		  	if(err){
		  		console.log(err);
		  		return;
		  	}
		  	res.json('ok');
		  	console.log(result);
		  })
	})

// Add new comment-------------------------------------------------------
	app.post('/comment', (req,res)=>{
		if(!req.body.name||!req.body.text){
			res.status(400).json("Bad Request");
		}
		console.log(mongodb.ObjectID(req.body._id))

		db.collection('posts')
		  .updateOne({
		  	_id: mongodb.ObjectID(req.body._id)
		  },{
		  	$push:{
		  		comments: {
		  			name: req.body.name,
		  			text: req.body.text
		  		}
		  	}
		  }, (err, result)=>{
		  	if(err){
		  		console.log(err);
		  		return;
		  	}
		  	console.log(result);
		  	res.json('ok');
		  })
	})


// Authorization Form----------------------------------------------------
	app.get('/auth', (req,res)=>{
		var cookie = req.cookies.user_name
		if(cookie){
			res.redirect('/account');
		}
		db.collection('posts')
	  	  .find()
	      .toArray((err, result)=>{
	  	    if(err){
	  			console.log(err);
	  			client.close();
	  			return;
	  		}
	  		res.render('authorization', {users:result})
	  	  })
	})	


// User Authorization----------------------------------------------------
	app.post('/auth', (req,res)=>{
		if(!req.body.username || !req.body.password){
			res.status(400).send('bad request');
			return
		}
		db.collection('users')
		  .find()
		  .toArray((err,result)=>{
		  	if(err){
  		  		console.log(err);
  		  		return;
	  		}
	  		function iterration (user){
				return user.username == req.body.username && user.password == req.body.password;
			}
			const user = result.find(iterration)

			if (user){
				res.cookie('user_name',req.body.username, {
					path: '/',
					maxAge: 1000*60*60*24*30
				});
				res.redirect('/account');
				return
			}
			res.status(401).redirect('/notAuth');
		  })
	})

// Unauthorized User-----------------------------------------------------
	app.get('/notAuth',(req,res)=>{
		res.render('unauth');
	})


// Personal Account Page-------------------------------------------------
	app.get('/account', (req,res)=>{
		var cookie = req.cookies.user_name
		if(!cookie){
			res.redirect('/auth');
			return
		}
		db.collection("users")
		  .find()
		  .toArray((err,result)=>{
		  	if(err){
  		  		console.log(err);
  		  		return;
	  		}
	  		function iterration (account){
				return account.username == cookie;
			}
			const account = result.find(iterration)

			if(account){
				db.collection('posts')
				  .find({
				  	author: cookie
				  })
				  .toArray((err, result)=>{
				  	if(err){
				  		console.log(err);
				  		return;
				  	}
				  	res.render('account', {userPosts:result, username:req.cookies.user_name})
				  })
			}
		  })
	})


// Add new Post from the Author------------------------------------------
	app.post('/account',(req,res)=>{
		if(!req.body.title || !req.body.content){
			res.status(400).send('bad request');
			return
		}
		var likes = parseInt(req.body.likes);

		var newPost = {
			picture: req.body.picture,
			likes: likes,
			author: req.cookies.user_name,
			title: req.body.title,
			username: req.cookies.user_name,
			content: req.body.content,
			comments:[],
			tags:[]
		}
		console.log(newPost);
		db.collection('posts')
		  .insertOne(newPost, (err, result)=>{
		  	if(err){
				console.log(err);
				return
			}
			console.log(result)
			res.json('ok')
		  })
		
	})


// Delete Post-----------------------------------------------------------
	app.post('/delete', (req,res)=>{
		if(!req.body._id){
			res.status(400).json('bad request');
        	return
		}
		db.collection('posts')
		  .remove({
		  	_id: mongodb.ObjectId(req.body._id)
		  },(err,result)=>{
		  	if(err){
		  		console.log(err);
		  		return;
		  	}
		  	res.json('ok')
		  })
	})


// Log out from account--------------------------------------------------
	app.post('/logout', (req,res)=>{
		if(req.cookies.user_name){
			res.clearCookie('user_name', { path: '/' });
			res.redirect('/auth')
		}
	})


// Regestaration Form--------------------------------------------------
	app.get('/reg', (req,res)=>{

		res.render('registration.ejs', {username:req.cookies.user_name})
	})


// Udd new User----------------------------------------------------------
	app.post('/req', (req,res)=>{
		if(!req.body.username || !req.body.password){
        	res.status(400).json('bad request');
        	return
    	}
    	var newUser = {
    		password: req.body.password,
    		picture: req.body.picture,
    		username: req.body.username,
    		email: req.body.email
    	}
    	db.collection('users')
    	  .find({
    	  	username: req.body.username
    	  })
    	  .toArray((err,result)=>{
    	  	if(err){
				console.log(err);
				return
			}
			if(result.length > 0 ){
				res.status(409).json('user exist')
				return
			}
			db.collection('users')
    	  	  .insertOne(newUser, (err,result)=>{
	    	  	if(err){
					console.log(err);
					return
				}
				res.json('ok')
    	  	  })
    	  })
    	
	})

})

app.listen(3000);













