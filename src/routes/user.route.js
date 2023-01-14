import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", verifyToken, UserController.getUser);
router.delete("/", verifyToken, UserController.deleteAccount);
router.put("/location", verifyToken, UserController.changeLocation);
router.put("/name", verifyToken, UserController.changeName);

export default router;