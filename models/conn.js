/*

Default MongoDB(mongod server) client is mongoose client. It provides all the connection facilities once it is invoked.

*/
var mongoose=require("mongoose")
var url="mongodb://localhost:27017/blockchain"		//IP for an online server; Mentioning port is not necessary
mongoose.connect(url)
db=mongoose.connection

module.exports=db
