const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middlewares/auth.middleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.put('/profile', authMiddleware, authController.updateProfile);


// Step 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, name: req.user.name },
      process.env.JWT_SECRET || 'fallback_secret_key_for_development_purposes',
      { expiresIn: "7d" }
    );

    // Set JWT inside HttpOnly cookie — secure:true required for HTTPS in production
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('ecart_token', token, {
      httpOnly: true,
      secure: isProduction,           // true on HTTPS (Render), false on localhost
      sameSite: isProduction ? 'none' : 'lax',  // 'none' required for cross-origin on HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });

    // Only send user data in URL (no token exposed)
    const userData = { id: req.user._id, name: req.user.name, email: req.user.email, avatar: req.user.avatar };
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/success?user=${encodeURIComponent(JSON.stringify(userData))}`);
  }
);

module.exports = router;
