const userService = require("../services/userService");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const { token, user } = await userService.registerUser(
      name,
      email,
      password
    );
    res.status(201).json({
      message: "User created successfully",
      token,
      user,
    });
  } catch (err) {
    const code =
      err.message.includes("already") ||
      err.message.includes("Invalid email") ||
      err.message.includes("Password must be")
        ? 400
        : 500;
    res.status(code).json({ message: err.message || "Signup failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const { token, user } = await userService.authenticateUser(email, password);
    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    const code = err.message.includes("Invalid") ? 401 : 500;
    res.status(code).json({ message: err.message || "Login failed" });
  }
};

module.exports = {
  signup,
  login,
};
