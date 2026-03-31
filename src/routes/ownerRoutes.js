import { Router } from "express"
import { requireRole } from "../middleware/auth.js"
import {
  getOwnerDashboard,
  postUpdateUserRole,
  postDeleteUser,
  postAddCategory,
  postEditCategory,
  postDeleteCategory,
  postAddVehicle,
  postEditVehicle,
  postDeleteVehicle,
  postAddVehicleImage,
  postDeleteVehicleImage,
} from "../controllers/ownerController.js"

const router = Router()

router.get("/", requireRole("owner"), getOwnerDashboard)
router.post("/users/:id/role", requireRole("owner"), postUpdateUserRole)
router.post("/users/:id/delete", requireRole("owner"), postDeleteUser)
router.post("/categories", requireRole("owner"), postAddCategory)
router.post("/categories/:id/edit", requireRole("owner"), postEditCategory)
router.post("/categories/:id/delete", requireRole("owner"), postDeleteCategory)
router.post("/vehicles", requireRole("owner"), postAddVehicle)
router.post("/vehicles/:id/edit", requireRole("owner"), postEditVehicle)
router.post("/vehicles/:id/delete", requireRole("owner"), postDeleteVehicle)
router.post("/vehicles/:id/images", requireRole("owner"), postAddVehicleImage)
router.post("/images/:id/delete", requireRole("owner"), postDeleteVehicleImage)

export default router