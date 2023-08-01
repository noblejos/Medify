import express from "express";

import authResource from "./auth.routes";
import notificationResource from "./notifications.routes";

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

export default router;
