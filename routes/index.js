var express = require('express');
var router = express.Router();
var usersmodel = require('../models/usersmodel');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Health Insurers Club','result':'Login Page'});
});

router.all('/login', function(req, res, next) {
  if(req.method=='GET')
	  res.render('index',{'result':'Login Page'})
  else
  {
		var data=req.body
		console.log(data.username)
	  usersmodel.logincheck('users',data,function(result){
		  //console.log(result)
		  if(result.length==0)
			{
				res.render('index',{'result':'Login Failed'})
				console.log("Login Fail")
			}
		  else
		  {
				var i=0
				var flag=false
				for(i=0;i<result.length;i++)
				{
					if(result[i].username==data.username)
					{
						// req.session.username=result[i].username
						// res.redirect('/users')
						flag=true
						break
					}
				}
				if(flag)
				{
					req.session.username=result[i].username
					res.redirect('/users')
				}
				// }
				// req.session.username=result[0].username
				// console.log(req.session.username)
        // if(result[0].username!=undefined)
				//   res.redirect('/users')
				else
        	res.redirect('/')
		  }
	  })
  }
});

router.all('/logout',function(req,res,next){
	req.session.destroy()
	res.redirect('/')
})

module.exports = router;
