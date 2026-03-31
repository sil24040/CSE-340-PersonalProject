import { Router } from "express"
import { requireAuth } from "../middleware/auth.js"
import { getVehicles, getVehicleDetail } from "../controllers/vehicleController.js"
import { postReview } from "../controllers/reviewController.js"
import { postServiceRequest } from "../controllers/serviceController.js"

const router = Router()

router.get("/", getVehicles)
router.get("/:id", getVehicleDetail)
router.post("/:id/reviews", requireAuth, postReview)
router.post("/:id/request", requireAuth, postServiceRequest)

export default router