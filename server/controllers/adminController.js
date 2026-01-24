const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Register Admin Only Once

exports.registerAdmin = async ( req, res ) => {
    try{
        const {name, email, password} = req.body;
        console.log("REGISTER BODY:", req.body);

        const existing = await Admin.findOne({ email });
        if(existing) {
            return res.status(400).json({message: "Admin Already Exists"});
        }

        const admin = await Admin.create({name, email, password});

        res.status(201).json({message: "Admin registered successfully"});
    }catch(error){
        console.error("REGISTER ADMIN ERROR:", error);
        res.status(500).json({message: "Server Error"});
    }
};


// Login Admin
exports.loginAdmin = async (req, res) => {
    try{
        const {email, password} = req.body;

        console.log("LOGIN BODY:", req.body);

        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role},
            process.env.JWT_SECRET,
            { expiresIn: "1d"}
        );

        res.json({message: "Login Successful", token});
    }catch(error){
        res.status(500).json({message: "Server Error"});
    }
};