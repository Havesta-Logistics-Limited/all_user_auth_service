// logout.controller.js
const logout = (req, res) => {
  try {
    res.clearCookie("accessToken", {
       httpOnly: false,
        secure: true,
        sameSite: "none",
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
};

module.exports = {logout}
