import * as referralController from '../controllers/referral.controller/referral.controller';

const referralRouter = require('express').Router();

referralRouter.get("/find/:referralCode", referralController.findReferral);

export default referralRouter;
