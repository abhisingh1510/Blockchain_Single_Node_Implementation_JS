var express = require('express');
var router = express.Router();
var usersmodel = require('../models/usersmodel')
const SHA256=require('crypto-js/sha256');

router.use(function(req,res,next){
	if(req.session.username==undefined)
	{
		console.log('Invalid User Please Login First')
		res.redirect('/logout')
	}
	next()
})

class Block
{
    constructor(index,timestamp,data,previousHash='')
    {
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
        this.noonce=0;  //Random number; Has nothing to do with block, just increases difficulty
    }

    calculateHash()
    {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)+this.noonce).toString();
    }

    mineBlock(difficulty)
    {
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0"))
        {
            this.noonce++;
            this.hash=this.calculateHash();
        }
        console.log("Block mined: "+this.hash);
    }
}

class Blockchain
{
    constructor()
    {
        this.chain=[this.createGenesisBlock()];
        this.difficulty=4;  //To control how fast new blocks can be added to the blockchain
    }

    createGenesisBlock()
    {
        var currtime = Math.floor(Date.now());
        return new Block(0,currtime,['0','0','Genesis Block'],"0");

    } 

    getLatestBlock()
    {
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock)
    {
        newBlock.previousHash=this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    
    isChainValid()
    {
        for(let i=1;i<this.chain.length;i++)
        {
            const currentBlock=this.chain[i];
            const previousBlock=this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash())
            {
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash)
            {
                return false;
            }
        }
        return true;
    }
}

let datachain=new Blockchain();
var newblocks=[];
// console.log('Initial '+newblocks.length)

router.get('/', function(req, res, next) {
  res.render('message',{'result':'','mess':datachain,'rem':newblocks});
});

router.all('/block',function(req,res,next){
  if(req.method=='GET')
	  res.render('message',{'result':'','mess':datachain,'rem':newblocks})
  else
  {
    var data=req.body
    var datablock=[data.field1,data.field2,data.field5]
    newblocks.push(datablock);
    res.render('message',{'result':'Blockchain Valid and Block Added Successfully','mess':datachain,'rem':newblocks})
  }
});

router.all('/mineblock',function(req,res,next){
  if(req.method=="GET")
    res.render('mineblock',{'result':newblocks,'mess':datachain,'rem':newblocks})
  else
  {
    if(datachain.isChainValid() && newblocks.length!=0)
    {
      datachain.addBlock(new Block(datachain.getLatestBlock().index + 1,Math.floor(Date.now()),newblocks[0]))
      newblocks.shift()
      console.log(datachain)
      res.render('mineblock',{'result':'Blockchain Valid and Block Added Successfully','mess':datachain,'rem':newblocks})
    }
    else
    {
      res.render('mineblock',{'result':'Blockchain Invalid or No Blocks to be Added','mess':datachain,'rem':newblocks})
    }    
  }
})
module.exports = router;
