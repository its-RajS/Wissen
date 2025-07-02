import express from "express";
import { authoriedRole, isAuthenticate } from "../middleware/auth";
import { createOrder } from "../controller/order.controller";

const orderRouter = express.Router();

orderRouter.post("/createOrder", isAuthenticate, createOrder);

export default orderRouter;
