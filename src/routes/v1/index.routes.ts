import express from "express";

import authResource from "./auth.routes";
import notificationResource from "./notifications.routes";
import adminResource from "./admin.routes";
import doctorResource from "./doctor.routes";
import { auth } from "../../middlewares/auth";

export const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (_, res) => res.send("OK"));

/**
 *
 * GET v1/docs
 */

router.use("/auth", authResource);
router.use("/notifications", notificationResource);
router.use("/admin", adminResource);
router.use("/doctor", doctorResource);

export default router;
