import { Router } from "express"
import { requireAuth } from "../middleware/auth.js"
import {
  getEditReview,
  postEditReview,
  postDeleteReview,
} from "../controllers/reviewController.js"

const router = Router()

router.get("/:id/edit", requireAuth, getEditReview)
router.post("/:id/edit", requireAuth, postEditReview)
router.post("/:id/delete", requireAuth, postDeleteReview)

export default router