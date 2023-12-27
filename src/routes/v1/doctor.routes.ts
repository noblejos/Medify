import express from "express";

import controllers from "../../controllers/doctor.controllers";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import schema from "../../schemas/doctor.schema";

const router = express.Router();

router.get("/doctor-profile", auth, controllers.fetchDoctor);

router.get("/fetch-appointments", auth, controllers.fetchAppointments);

router.patch("/update-doctor-profile", auth, controllers.updateDoctorProfile);

router.patch(
	"/change-appointment-status/:_id",
	auth,
	validateRequest(schema.updateAppointmentStatus),
	controllers.changeAppointmentStatus,
);

export default router;
