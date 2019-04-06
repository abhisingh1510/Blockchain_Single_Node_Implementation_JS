var db=require('./conn.js')



function logincheck(tbl_nm,data,cb)
{
	str="'username'"+":'"+data.username+"', 'password' :"+"'"+data.password+"'"
	db.collection(tbl_nm).find().toArray(function(err,result){
		if(err)
			console.log(err)
		else
			cb(result)
	})	
}

function fetchalldata(tbl_nm,cb)
{
	db.collection(tbl_nm).count(function(err,count){
		if(err)
			console.log(err)
		else if(!err && count==0)
		{
			cb(null);
		}
		else
		{
			db.collection(tbl_nm).find().toArray(function(err,result){
				if(err)
					console.log(err)
				else
					cb(result)
			})		
		}
	})
}

function addblock(tbl_nm,data,cb)
{
	var query={}
	db.collection(tbl_nm).remove(query,function(err,res){
		if(err)
			console.log(err)
		else
		{
			db.collection(tbl_nm).insertOne(data,function(err,result){
				if(err)
					console.log(err)
				else
					cb(result)
			})
		}
	})
	
	// db.collection(tbl_nm).find().toArray(function(err,result){
	// 	if(err)
	// 		console.log(err)
	// 	else
	// 		datachain=result
	// });
	// let obj=new Blockchain()
	// obj.addBlock(new Block())
	// str="'username'"+":'"+data.username+"', 'password' :"+"'"+data.password+"'"
	// db.collection(tbl_nm).find().toArray(function(err,result){
	// 	if(err)
	// 		console.log(err)
	// 	else
	// 		cb(result)
	// })	
}
/*
function addcategory(cat_nm,cat_img_nm,cb)
{
	var query="insert into addcat values (NULL,'"+cat_nm+"','"+cat_img_nm+"')"
	con.query(query,function(err,result){
		if(err)
			console.log(err)
		else
			cb(result)
	})	
}
*/
module.exports={logincheck:logincheck,addblock:addblock,fetchalldata:fetchalldata}