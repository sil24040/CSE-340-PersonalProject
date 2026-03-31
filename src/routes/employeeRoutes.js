import { Router } from "express"
import { requireRole } from "../middleware/auth.js"
import {
  getEmployeeDashboard,
  postEditVehicle,
} from "../controllers/employeeController.js"

const router = Router()

router.get("/", requireRole("employee", "owner"), getEmployeeDashboard)
router.post("/vehicles/:id/edit", requireRole("employee", "owner"), postEditVehicle)

export default router