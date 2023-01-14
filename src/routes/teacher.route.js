import { Router } from "express";
import * as TecherController from "../controllers/teacher.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/", TecherController.getTeacher);
router.put("/bio", verifyToken, TecherController.changeBio);
router.put("/accessibility", verifyToken, TecherController.changeAccessibility);
router.get("/all", TecherController.getAllTeachers);
router.put("/categories", verifyToken, TecherController.addCategories);
router.delete("/categories", verifyToken, TecherController.deleteCategories);

export default router;