import { Request, Response } from "express";
import Service from "../models/Service";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

export const createService = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, price, category } = req.body;

    if (!name || !price) {
      throw new AppError("Name and price are required", 400);
    }

    const service = await Service.create({
      name,
      description,
      price,
      category,
    });

    res.status(201).json(service);
  }
);

export const getAllServices = asyncHandler(
  async (req: Request, res: Response) => {
    const services = await Service.findAll();
    res.json(services);
  }
);

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = await Service.findByPk(id);
  if (!service) {
    throw new AppError("Service not found", 404);
  }

  await service.update(req.body);

  res.json({
    message: "Service updated",
    service,
  });
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = await Service.findByPk(id);
  if (!service) {
    throw new AppError("Service not found", 404);
  }

  await service.destroy();

  res.json({
    message: "Service deleted",
  });
});