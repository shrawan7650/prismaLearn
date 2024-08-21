import prisma from "../dbConfig/ConnectDataBase.js";
import vine from "@vinejs/vine";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
} from "../validation/AuthValidation.js";
import { errors } from "@vinejs/vine";
import {
  ComparePassword,
  CreateToken,
  Hasingpassword,
} from "../utils/AuthUtils.js";
import { uploadFileOnCloudinary } from "../utils/clodinary/AuthCloudinary.js";
// Define your models and create Prisma Client

export const RegisterController = async (req, res) => {
  try {
    const body = req.body;
    const validator = vine.compile(registerSchema);
    console.log("password", body);
    // Encrypt the password before saving it in the database
    const haspassword = await Hasingpassword(body.password);

    const payload = await validator.validate(body);
    console.log("payload", payload);
    payload.password = haspassword;

    //check validation user already exist
    const userExist = await prisma.users.findUnique({
      where: { email: payload.email },
    });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    //create schema in prisma
    const user = await prisma.users.create({ data: payload });
    console.log("user", user);
    // Return success response with user data and message
    // You can add more logic to handle user's role and other fields here
    // For example, you can set the user's role to "user" or "admin" based on the registration form data
    // and save other user details in the database as well.
    // In this example, we are just returning the user data without any additional information.
    return res.json({ user, msg: "Account Created Successfully" });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      console.log(errors.messages);
      return res.status(400).json({ errors: error.messages });
    } else {
      console.log(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
};

export const LoginController = async (req, res) => {
  try {
    const body = req.body;
    console.log("body", body);
    const validator = vine.compile(loginSchema);
    console.log("validator", validator);
    const payload = await validator.validate(body);
    console.log("payload", payload);
    //check user register or not
    const user = await prisma.users.findUnique({
      where: { email: payload.email },
      select: { email: true, password: true, id: true },
    });
    console.log("user", user);
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    //check password match or not
    const isMatch = await ComparePassword(payload.password, user.password);
    console.log("isMatch", isMatch);
    if (!isMatch) {
      return res.status(400).json({ msg: "email and password wrong" });
    }
    // Generate JWT token and send it to the client
    const token = CreateToken(user.id);

    //send token in cookies
    res.cookie("token", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    // Return success response with user data and message
    return res.json({ user, token, msg: "Logged In Successfully" });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      console.log(errors.messages);
      return res.status(400).json({ errors: error.messages });
    } else {
      console.log(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
};

//get user detials

export const GetUserDetails = async (req, res) => {
  try {
    const id = req.userId;
    console.log("id", id);
    //get user detials
    const userDetails = await prisma.users.findUnique({
      where: { id: id },
      select: { email: true, name: true, profile: true },
    });
    console.log("userDetails", userDetails);
    return res.json({ userDetails, msg: "User Details" });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      console.log(errors.messages);
      return res.status(400).json({ errors: error.messages });
    } else {
      console.log(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
};

//deleteUser

export const DeleteUser = async (req, res) => {
  try {
    const id = req.userId;
    console.log("id", id);
    //delete user
    await prisma.users.delete({
      where: { id: id },
    });
    return res.json({ msg: "User deleted successfully" });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      console.log(errors.messages);
      return res.status(400).json({ errors: error.messages });
    } else {
      console.log(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
};

//update user detials

export const UpdateUserDetails = async (req, res) => {
  try {
    const id = req.userId;
    const body = req.body;

    // If there's a file from Multer, get the file path
    if (req.file) {
      body.profile = req.file.path;
    }

    console.log("id", id);
    console.log("body", body);

    // Validate the request body using Vine
    const validator = vine.compile(updateUserSchema);
    const payload = await validator.validate(body);

    // Hash the password if it's provided
    if (payload.password) {
      payload.password = await Hasingpassword(payload.password);
    }

    // Update user details in the database
    const updatedUserDetails = await prisma.users.update({
      where: { id: id },
      data: {
        name: payload.name,
        email: payload.email,
        profile: body.profile,  // Temporary store the file path
      },
    });

    // If everything is successful, upload the profile image to Cloudinary
    if (req.file) {
      const avatarurl = await uploadFileOnCloudinary(body.profile);
      updatedUserDetails.profile = avatarurl;

      // Update the user's profile URL in the database with the Cloudinary URL
      await prisma.users.update({
        where: { id: id },
        data: {
          profile: avatarurl,
        },
      });
    }

    console.log("updatedUserDetails", updatedUserDetails);

    return res.json({
      updatedUserDetails,
      msg: "User Details updated successfully",
    });
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      console.log(errors.messages);
      return res.status(400).json({ errors: error.messages });
    } else {
      console.log(error);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
};
