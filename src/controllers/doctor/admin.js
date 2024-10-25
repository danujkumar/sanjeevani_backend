// import asyncHandler from 'express-async-handler';
// import Doctor from '../models/user.js';
// import generateToken from '../utils/generateToken.js';
const asyncHandler=require("express-async-handler")
const Doctor=require("../../models/doctor/admin.js")
const generateToken=require("../../utils/generateToken.js")
const bcrypt=require("bcrypt")

const authDoctor = asyncHandler(async (req,res)=>{
    try {
        const { username, password } = req.body;
        const user = await Doctor.findOne({ username });
        if (!user) return res.status(404).json({ mssg: "Not found" });
    
        const isMatch = await user.matchPassword(password);
    
        console.log(isMatch);
    
        if (isMatch) {
          const token = generateToken(res, user._id);
          res.json({
            token,
          });
        } else {
          res.status(400).json({ error: "Password not matched" });
        }
      } catch (err) {
        res.status(401).json({ error: err.message });
      }
});

const signup = asyncHandler(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      await Doctor.findOne({ email });
      const user = await Doctor.create({
        username,
        email,
        password,
      });
      const token = generateToken(res, user._id);
      res.status(201).json({
        token,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

const logoutDoctor = asyncHandler(async(req,res)=>{
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

const getDoctorProfile = asyncHandler(async(req,res)=>{
    try {
        const userData = req.user;
        console.log(userData);
        return res.status(200).json(userData);
      } catch (err) {
        res.status(404).json({ error: err.message });
      }
});

const updateDoctorProfile = asyncHandler(async(req,res)=>{
  const updates = req.body;
  const doctorId = req.userID;
  console.log(req.body, doctorId.toString())
  try {
    const updatedDoctor = await Doctor.updateOne({ _id: doctorId.toString() }, {$set:{name:updates.name, 
      specialization: updates.specialization,
      workplace:updates.workplace,
      experience: updates.experience
    }});
    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

const getProfile = asyncHandler(async (req, res)=>{
  try {
    const {doctorId} = req.body; // Assuming doctorId is passed as a parameter in the route
  
    // Find the doctor by id
    const doctor = await Review.findOne({ doctorId: doctorId });
  
    if (doctor) {
      // If doctor exists, return the first 10 reviews
      const firstTenReviews = doctor.patients.slice(0, 10);
  
      res.status(200).json({ success: true, reviews: firstTenReviews });
    } else {
      res.status(404).json({ success: false, message: "Doctor not found." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to get reviews.", error });
  }
})

const getAppointmentD = asyncHandler(async (req, res)=>{
  const doctorId = req.doctorId; // Assuming you'll pass doctorId as a URL parameter

  try {
    const doctor = await Appointment.findOne({ doctor: doctorId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor.appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

const getDoctors = asyncHandler(async (req, res)=>{
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

module.exports={authDoctor,logoutDoctor,getDoctorProfile,updateDoctorProfile, signup, getProfile, getAppointmentD, getDoctors}