import db from "../sequelize/models/index.js";
import jwt from "jsonwebtoken";

const { Admin } = db;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";

class AuthController {
  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ where: { email } });

      if (!admin) return res.status(404).json({ message: "Admin not found" });

      const valid = admin.validPassword(password);
      if (!valid)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.status(200).json({
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }

  // Logout
  static logout(req, res) {
    // Stateless JWT logout: client just deletes token
    return res.status(200).json({ message: "Logged out successfully" });
  }

  // Middleware to protect routes
  static authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err, admin) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.admin = admin;
      next();
    });
  }
}

export default AuthController;
