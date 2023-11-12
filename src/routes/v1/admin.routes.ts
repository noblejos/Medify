import express from "express";

import controllers from "../../controllers/admin.controllers";

import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get("/users-list", auth, controllers.fetchUsers);
router.get("/doctors-list", auth, controllers.fetchDoctors);

router.post("/change-doctors-status", auth, controllers.changeDoctorStatus);

export default router;
