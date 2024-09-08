import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/db";  // Adjust the path as needed
import { User } from "../entity/User";  // Adjust the path as needed

// Route Handler: Login and generate JWT token
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Use TypeORM repository to find the user by email
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_secret_key', {
      expiresIn: "1h",
    });

    // Set token in cookies
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Error occurred during login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



