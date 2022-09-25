import { Router } from "express";
import multer from "multer";

import { uploadConfig } from "../../../../config/uploadConfig";
import { CreateUserController } from "../../../../modules/accounts/useCases/createUser/CreateUserController";
import { ProfileUserController } from "../../../../modules/accounts/useCases/profileUser/ProfileUserController";
import { UpdateUserAvatarController } from "../../../../modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const usersRoutes = Router();
const uploadAvatar = multer(uploadConfig);

const profileUserController = new ProfileUserController();
usersRoutes.get("/me", ensureAuthenticated, profileUserController.handle);

const createUserController = new CreateUserController();
usersRoutes.post("/users", createUserController.handle);

const updateUserAvatarController = new UpdateUserAvatarController();
usersRoutes.patch(
  "/users/avatar",
  ensureAuthenticated,
  uploadAvatar.single("avatar"),
  updateUserAvatarController.handle
);

export { usersRoutes };
