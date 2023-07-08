import express from "express";

import authResource from "./auth.routes";

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

export default router;
