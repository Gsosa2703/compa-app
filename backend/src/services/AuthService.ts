// src/services/AuthService.ts
import { User } from "../entity/User";
import { AppDataSource } from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  static async signUp(name: string, email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepository.create({ name, email, password: hashedPassword });
    await userRepository.save(newUser);

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'your_secret_key');
    return { user: newUser, token };
  }

  static async login(email: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_secret_key');
    return { token, user };
  }
}
