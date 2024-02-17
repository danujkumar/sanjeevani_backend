// import asyncHandler from 'express-async-handler';
// import User from '../models/user.js';
// import generateToken from '../utils/generateToken.js';
const asyncHandler=require("express-async-handler")
const User=require("../../models/patient/user.js")
const generateToken=require("../../utils/generateToken.js")
const bcrypt=require("bcrypt")


const authUser = asyncHandler(async (req,res)=>{
   try{
    const {username,password} = req.body;
    const user = await User.findOne({username});
    if(!user) return res.status(404).json({"mssg":"Not found"})
    
    await user.matchPassword(password);
    // const isPasswordMatch = await user.matchPassword(password);
    // if (!isPasswordMatch) {
    //     return res.status(401).json({ error: "Invalid credentials" });
    // }

    generateToken(res,user._id);
    res.json({
        _id:user._id,
        name:user.name,
        email:user.email
    });
   }catch(err){
    res.status(401).json({error:err.message});
   }
});

const signup=asyncHandler(async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        await User.findOne({email});
        const user = await User.create({
            username,
            email,
            password
        });
        generateToken(res, user._id);
        res.status(201).json({
            _id:user._id,
            username:user.username,
            email:user.email,
        });
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

const logoutUser = asyncHandler(async(req,res)=>{
    try{
        res.cookie('jwt','',{
            httpOnly:true,
            expires:new Date(0),
        });
        res.status(200).json({message:'logged out'});
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

const getUserProfile = asyncHandler(async(req,res)=>{
    const {email}=req.body
    const user = await User.findOne({email});
    try{
        if (user) {
            res.json({
              _id: user._id,
              username: user.username,
              email: user.email,
            });
        }
       else res.status(404).json({error:"User not found"});
        
    }catch(err){
        res.status(404).json({error:err.message});
    }
});

const updateUserProfile = asyncHandler(async(req,res)=>{
    const {email}=req.body

    try{
        const user = await User.findOne({email});
        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
        
            if (req.body.password) {
              user.password = req.body.password;
            }
        
            const updatedUser = await user.save();
        
            res.json({
              _id: updatedUser._id,
              username: updatedUser.username,
              email: updatedUser.email,
            });
        } 
    }catch(err){
        res.status(404).json({error:err.message});
    }
})

module.exports={authUser,signup,logoutUser,getUserProfile,updateUserProfile}