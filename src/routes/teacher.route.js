import { Router } from "express";
import * as TecherController from "../controllers/teacher.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

/* router.get("/", verifyToken, UserController.getUser);
router.delete("/", verifyToken, UserController.deleteAccount);
router.put("/location", verifyToken, UserController.changeLocation);
router.put("/name", verifyToken, UserController.changeName);
router.put("/accountType", verifyToken, UserController.changeAccoutType); */

router.get("/", TecherController.getTeacher);
router.put("/bio", verifyToken, TecherController.changeBio);
router.put("/accessibility", verifyToken, TecherController.changeAccessibility);


export default router;