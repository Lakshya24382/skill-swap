import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const { skill } = req.query;

    let filter = {};

    if (skill) {
      filter.skillsOffered = { $regex: skill, $options: "i" };
    }

    const users = await User.find(filter).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};