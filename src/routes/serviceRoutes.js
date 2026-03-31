import { Router } from "express"
import { requireRole } from "../middleware/auth.js"
import { postUpdateStatus, postUpdateNotes } from "../controllers/serviceController.js"

const router = Router()

router.post("/:id/status", requireRole("employee", "owner"), postUpdateStatus)
router.post("/:id/notes", requireRole("employee", "owner"), postUpdateNotes)

export default router