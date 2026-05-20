import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { userRole } from "./user.interface";

const router = Router();

router.post("/", userController.createUser);

router.get("/", auth(userRole.Admin, userRole.Agent, userRole.User), userController.getllUsers);

router.get("/:id", userController.getUserByID);

router.put("/:id", userController.updateUserByID);

router.delete("/:id", userController.deleteUserByID);

export const userRoute = router;
