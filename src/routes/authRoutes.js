import { Router } from "express"
import { requireAuth } from "../middleware/auth.js"
import {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  logout,
  getProfile,
  postProfile,
} from "../controllers/authController.js"

const router = Router()

router.get("/register", getRegister)
router.post("/register", postRegister)

router.get("/login", getLogin)
router.post("/login", postLogin)

router.get("/logout", logout)

router.get("/profile", requireAuth, getProfile)
router.post("/profile", requireAuth, postProfile)

export default router