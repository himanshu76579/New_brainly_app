import express from "express";
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { ContentModel, LinkModel, UserModel } from "./db";
import { usermiddleware } from "./middleware";
import { random } from "./util";
import cors from "cors";

const JWT_SECRET = "23145"

const app = express()
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup",async(req,res)=>{
//zod validation

const username = req.body.username
const password = req.body.password

//to do validate if the user is not duplicate
try{
    await UserModel.create({
        username:username,
        password:password
      })
        res.json({
          message:"user signed up"
        })
    }
    catch(e){
        res.json({
            "error":"duplicate user"
        })
    }
      
      
      

    })


app.post("/api/v1/signin",async(req,res)=>{

  const username = req.body.username
  const password = req.body.password

  const existingUser = await UserModel.findOne({
    username,
    password
  })

  if(existingUser){
   const token = jwt.sign({id:existingUser._id},JWT_SECRET)
   res.json({
  "token":token
   })
  }
  else{
    res.json({
      "incorrect":"result incorrect"
    })
  }

    
})

app.post("/api/v1/content",usermiddleware,async(req,res)=>{
const link = req.body.link
const type = req.body.type
const title = req.body.title

await ContentModel.create({
  link,
  type,
  title,
  //@ts-ignore
  userId:req.userId,
  tags:[]
})

res.json({
  "message":"content"
})

    
})

app.get("/api/v1/content",usermiddleware,async(req,res)=>{
 //@ts-ignore
  const userId = req.userId
  const content = await ContentModel.find({
    userId:userId
  }).populate("userId","username")
  res.json({
    content
  })

    
})
app.delete("/api/v1/content",usermiddleware,async(req,res)=>{

  const contentId = req.body.contentId
   await ContentModel.deleteOne({
    contentId:contentId,
    //@ts-ignore
    userId:req.userId
   })
    
})

app.post("/api/v1/brain/:shareLink",usermiddleware,async(req,res)=>{

  const share = req.body.share
  if(share){
   const existinglink = await LinkModel.findOne({
   // @ts-ignore
    userId:req.userId
   });

   if(existinglink){
    res.json({
      hash:existinglink.hash
     })
   }
    
      const hash = random(10)
      await LinkModel.create({
       //@ts-ignore
         userId:req.userId,
         hash:random(10)
       })
       res.json({
        hash:"/share/"+hash
       })
     
    
      }
   
   
  else{
    LinkModel.deleteOne({
      //@ts-ignore
      userId:req.userId
    });
    res.json({
      "message":"updated shareable link"
    })
  }


})

app.get("/api/v1/brain/:shareLink",async(req,res)=>{
const hash = req.params.shareLink

const link = await LinkModel.findOne({
  hash:hash
})

if(!link){
  res.status(404).json({
    "message":"incorrect credentials"
  })
  return;
}


  const content = await ContentModel.find({
    userId:link.userId
  })
  const user = await UserModel.findOne({
    _id:link.userId
  })
  if(!user){
    res.json({
      "message":"user can be null"
    })
    return;
  }
  res.json({
    username:user.username,
    content:content
  })






})

app.listen(3000)


