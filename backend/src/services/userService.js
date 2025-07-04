const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation function
const isValidPassword = (password) => {
  // Password must be at least 6 characters long
  if (password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  // Check for at least one digit
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one digit",
    };
  }

  return { valid: true, message: "Password is valid" };
};

const registerUser = async (name, email, password) => {
  // Validate email format
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  // Validate password strength
  const passwordValidation = isValidPassword(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.message);
  }

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await userModel.createUser({ name, email, passwordHash });

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Get user data without password
  const user = await userModel.findById(userId);

  return { token, user };
};

const authenticateUser = async (email, password) => {
  const user = await userModel.findByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Return user data without password
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  return { token, user: userData };
};

module.exports = {
  registerUser,
  authenticateUser,
};
