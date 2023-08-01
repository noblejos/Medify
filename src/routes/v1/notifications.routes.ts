import express from "express";

import controllers from "../../controllers/notifications.controllers";

import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get("/", auth, controllers.fetchNotification);

router.get("/mark-as-seen", auth, controllers.markAsSeen);

export default router;
