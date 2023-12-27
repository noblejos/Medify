import express from "express";

import controllers from "../../controllers/doctor.controllers";

import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get("/doctor-profile", auth, controllers.fetchDoctor);

router.get("/fetch-appointments", auth, controllers.fetchAppointments);

router.patch("/update-doctor-profile", auth, controllers.updateDoctorProfile);

export default router;
