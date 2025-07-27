import mongoose ,{model,Schema} from "mongoose"
mongoose.connect("mongodb+srv://himanshu6207744810:vV2fbEcscOFjIGRP@cluster0.nq95ceb.mongodb.net/brainly")
const UserSchema = new Schema({
    username:{type:String,unique:true},
    password:String
})

export const UserModel =  model("User",UserSchema)

const ContentSchema = new Schema({
    title:String,
    link:String,
    type:String,
    tags:[{type:mongoose.Types.ObjectId,ref:'Tag'}],
    userId:{type:mongoose.Types.ObjectId,ref:"User",required:true}
})

const LinkSchema = new Schema({
    hash:String,
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true}
})

export const LinkModel = model("Links",LinkSchema)

export const ContentModel = model("content",ContentSchema)