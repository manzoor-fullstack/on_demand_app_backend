import { Response, Request } from "express";
import Booking from "../models/Booking";
import Service from "../models/Service";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

// USER creates booking
export const createBooking = asyncHandler(async (req: any, res: Response) => {
  const { service_id, date } = req.body;

  if (!service_id || !date) {
    throw new AppError("Service and date required", 400);
  }

  const booking = await Booking.create({
    user_id: req.user.id,
    service_id,
    date,
  });

  res.status(201).json({
    message: "Booking created",
    booking,
  });
});

// USER sees own bookings
export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await Booking.findAll({
    where: { user_id: req.user.id },
    include: [Service],
  });

  res.json(bookings);
});

// ADMIN updates status
export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await Booking.findByPk(id);
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  await booking.update({ status });

  res.json({
    message: "Status updated",
    booking,
  });
});