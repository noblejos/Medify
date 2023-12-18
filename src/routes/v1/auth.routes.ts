import express from "express";
import rateLimit from "express-rate-limit";

import schemas from "../../schemas/auth.schema";
import DoctorSchemas from "../../schemas/doctor.schema";
import controllers from "../../controllers/auth.controllers";

import { auth } from "../../middlewares/auth";
import { badRequest } from "../../helpers/responses";
import { validateRequest } from "../../middlewares/validateRequest";
import doctorSchema from "../../schemas/doctor.schema";

// import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

const loginLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 5, // Limit each IP to 5 login requests per `window`.
	message: "Too many login attempts, please try again after 5 minutes",
	standardHeaders: true,
	legacyHeaders: false,
	handler: (_, res, __, options) =>
		badRequest({ res, message: options.message }),
});

// GET Requests
router.get("/me", auth, controllers.currentUser);

router.get("/fetch-doctors", auth, controllers.fetchDoctors);

router.get("/check-availability", auth, controllers.checkAvailability);

// POST Requests
router.post(
	"/register",
	validateRequest(schemas.register),
	controllers.register,
);

router.post(
	"/login",
	validateRequest(schemas.login),
	loginLimiter,
	controllers.login,
);

router.post(
	"/apply-for-doctor-role",
	auth,
	validateRequest(doctorSchema.apply),
	controllers.applyForDoctorRole,
);

export default router;
