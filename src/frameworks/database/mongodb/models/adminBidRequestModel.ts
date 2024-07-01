import mongoose, { Schema } from "mongoose";

const adminBidRequestScema:Schema=new mongoose.Schema({

     bidderId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
     },
     bidProductId:{
        type:mongoose.Types.ObjectId,
        ref:'Product'
     }

},{timestamps:true})

const AdminBidRequest=mongoose.model('AdminBidRequest',adminBidRequestScema)

export default AdminBidRequest