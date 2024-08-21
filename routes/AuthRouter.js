import { Router } from "express";
import { DeleteUser, GetUserDetails, LoginController, RegisterController, UpdateUserDetails } from "../controller/AuthController.js";
import { VerifyToken } from "../midllewear/AuthMidllewear.js";
import { upload } from "../midllewear/MulterMildelwear.js";

const route = Router();

route.post("/auth/signup",RegisterController);
route.post("/auth/login",LoginController);
route.get("/auth/userDetials",VerifyToken,GetUserDetails)
//delete
route.delete("/auth/delete-user",VerifyToken,DeleteUser)
//update userdetials
route.put("/auth/update-user", upload.single("avatar"),VerifyToken,UpdateUserDetails)
export default route;