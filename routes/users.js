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
    var datablock=[req.session.username,data.field1,data.field2,data.field5]
    newblocks.push(datablock);
    res.render('message',{'result':'Blockchain Valid and Block Added Successfully','mess':datachain,'rem':newblocks})
  }
});

router.all('/viewuser',function(req,res,next){
    var usermess=[]
    for(i=0;i<datachain.chain.length;i++)
    {
        if(datachain.chain[i].data[0]==req.session.username)
        {
            // console.log(datachain.chain[i])
            usermess.push(datachain.chain[i])
        }
    }
    if(req.method=='GET')
        res.render('viewuser',{'result':'My Blocks','mess':usermess})
    else
    {     
      res.render('viewuser',{'result':'My Blocks','mess':usermess})
    }
  });

class Bob
{
    constructor()
    {
        this.g=2
        this.p=11
        this.h=0
        this.b=0
        this.secid=0
        this.s=0
        this.comp=0
    }

    secretid(secid)
    {
        this.secid=secid
    }

    receiveh(h)
    {
        this.h=h
        if(Math.random()>0.5)
            this.b=1
    }

    receives(s)
    {
        this.s=s
        this.comp=Math.pow(this.g,this.s)%this.p

    }
}

class Alice
{
    constructor()
    {
        this.p=11
        this.g=2
        this.x=0
        this.y=0
        this.h=0
        this.b=0
        this.r=0
        this.s=0
    }

    secretid(secid)
    {
        this.x=secid
    }

    calculatey()
    {
        this.y=Math.pow(this.g,this.x)%this.p
    }

    calculateh(r)
    {
        this.r=r
        this.h=Math.pow(this.g,this.r)%this.p
    }

    receiveb(b)
    {
        this.b=b
        this.s=((this.r)+(this.b)*(this.x))%(this.p-1)
    }
}

function zkp(a,b)
{
    if(a==b)
    {
        console.log("Zero Knowledge Proof Completed")
        return true;
    }
    else
    {
        console.log("Zero Knowledge Proof Failed")
        return false;
    }
}

function validateUser()
{
    let bob=new Bob()
    let alice=new Alice()
    p=11,g=2
    data=""
    // secid1,secid2
    usersmodel.logincheck('usersnew',data,function(result){
        if(result.length==0)
            console.log("Login Fail")
        else
        {
              var i=0
              for(i=0;i<result.length;i++)
              {
                  for(j=0;j<newblocks.length;j++)
                  {
                        if(result[i].username==newblocks[j][0])
                        {
                            secid2=result[i].secid
                            bob.secretid(secid2)
                        }
                        if(result[i].username==req.session.username)
                        {
                            secid1=result[i].secid
                            alice.secretid(secid1)
                        }
                    }
              }
              
        }
    })
    max=p
    min=0
    var r =Math.floor(Math.random() * (+max - +min)) + +min;
    alice.calculatey();
    alice.calculateh(r);
    bob.receiveh(alice.h);
    alice.receiveb(bob.b);
    bob.receives(alice.s);
    a=bob.comp
    b=(bob.h*Math.pow(alice.y,bob.b))%bob.p
    return zkp(a,b)    
}


router.all('/mineblock',function(req,res,next){
  if(req.method=="GET")
    res.render('mineblock',{'result':newblocks,'mess':datachain,'rem':newblocks})
  else
  {
    if(datachain.isChainValid() && newblocks.length!=0)
    {
        counttf=0
        for(i=0;i<5;i++)
        {
            if(validateUser())
                counttf++
        }
        if(counttf==5)
      {
        datachain.addBlock(new Block(datachain.getLatestBlock().index + 1,Math.floor(Date.now()),newblocks[0]))
        newblocks.shift()
        console.log(datachain)
        res.render('mineblock',{'result':'Blockchain Valid and Block Added Successfully','mess':datachain,'rem':newblocks})
      }
      else
      {
        datachain.addBlock(new Block(datachain.getLatestBlock().index + 1,Math.floor(Date.now()),newblocks[0]))
        newblocks.shift()
        console.log(datachain)
        res.render('mineblock',{'result':'Blockchain Valid and Block Added Successfully','mess':datachain,'rem':newblocks})
      }
    }
    else
    {
      res.render('mineblock',{'result':'Blockchain Invalid or No Blocks to be Added','mess':datachain,'rem':newblocks})
    }    
  }
})
module.exports = router;
