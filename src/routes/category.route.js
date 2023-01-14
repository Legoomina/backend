import { Router } from "express";
import * as CategoryController from "../controllers/category.controller.js";

const router = Router();

router.post("/add", CategoryController.addCategory);
router.get("/", CategoryController.getAllCategories);
router.delete("/delete", CategoryController.deleteCategory);


export default router;