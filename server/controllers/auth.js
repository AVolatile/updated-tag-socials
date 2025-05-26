import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation, 
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    console.log("🟡 Incoming login payload:", req.body); // 👈 log the request body

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ msg: "Email and password are required." });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ msg: "User does not exist." });
    }

    console.log("✅ User found:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    user.password = undefined; // safer than delete
    res.status(200).json({ token, user });

  } catch (err) {
    console.error("🚨 Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
