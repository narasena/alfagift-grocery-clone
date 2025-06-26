import { handleSignedupload } from "../controllers/cloudinary.controller";

const cloudinaryRouter = require("express").Router();

cloudinaryRouter.post('/signed-upload',handleSignedupload)

export default cloudinaryRouter;