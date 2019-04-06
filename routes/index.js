var express = require('express');
var router = express.Router();
var usersmodel = require('../models/usersmodel');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Health Insurers Club' });
});

router.all('/login', function(req, res, next) {
  if(req.method=='GET')
	  res.render('login',{'result':''})
  else
  {
	  var data=req.body
	  usersmodel.logincheck('users',data,function(result){
		  //console.log(result)
		  if(result.length==0)
			  res.render('login',{'result':'Login Failed'})
		  else
		  {
        req.session.username=result[0].username
        if(result[0].username!=undefined)
          res.redirect('/users')
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
