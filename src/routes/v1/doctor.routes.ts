import express from "express";

import controllers from "../../controllers/doctor.controllers";

import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get("/doctor-profile", auth, controllers.fetchDoctor);

export default router;
