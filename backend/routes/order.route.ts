import express from "express";
import { authoriedRole, isAuthenticate } from "../middleware/auth";
import { createOrder, getAllOrderAdmin } from "../controller/order.controller";

const orderRouter = express.Router();

orderRouter.post("/createOrder", isAuthenticate, createOrder);

orderRouter.get(
  "/getAllOrders",
  isAuthenticate,
  authoriedRole("admin"),
  getAllOrderAdmin
);

export default orderRouter;
