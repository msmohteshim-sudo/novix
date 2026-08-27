import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// A dynamic generic CRUD controller for the prototype.
// This allows the frontend to hit /api/:model and perform CRUD operations.

export const getAll = async (req: Request, res: Response): Promise<any> => {
  try {
    const model = (req.params.model || '') as string;
    if (!(prisma as any)[model]) {
      return res.status(404).json({ message: `Model ${model} not found` });
    }
    
    // For relationships like WorkOrder -> Customer
    let include = {};
    if (model === 'workOrder') {
      include = { customer: true, machine: true, operator: true };
    } else if (model === 'purchaseOrder') {
      include = { supplier: true, material: true };
    } else if (model === 'salesOrder') {
      include = { customer: true };
    }

    const data = await (prisma as any)[model].findMany({ include });
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error in getAll ${req.params.model}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getById = async (req: Request, res: Response): Promise<any> => {
  try {
    const model = (req.params.model || '') as string;
    const { id } = req.params;
    if (!(prisma as any)[model]) {
      return res.status(404).json({ message: `Model ${model} not found` });
    }
    const data = await (prisma as any)[model].findUnique({ where: { id } });
    if (!data) {
      return res.status(404).json({ message: 'Record not found' });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error in getById ${req.params.model}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const create = async (req: Request, res: Response): Promise<any> => {
  try {
    const model = (req.params.model || '') as string;
    if (!(prisma as any)[model]) {
      return res.status(404).json({ message: `Model ${model} not found` });
    }
    
    const data = await (prisma as any)[model].create({
      data: req.body
    });
    
    // Quick demo side-effects based on requirements
    if (model === 'purchaseOrder' && data.status === 'Received') {
      // If we create a received PO, increase stock
      const material = await prisma.material.findUnique({ where: { id: data.materialId } });
      if (material) {
        await prisma.material.update({
          where: { id: material.id },
          data: { currentStock: material.currentStock + data.quantity }
        });
      }
    }
    
    return res.status(201).json(data);
  } catch (error) {
    console.error(`Error in create ${req.params.model}:`, error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const update = async (req: Request, res: Response): Promise<any> => {
  try {
    const model = (req.params.model || '') as string;
    const { id } = req.params;
    if (!(prisma as any)[model]) {
      return res.status(404).json({ message: `Model ${model} not found` });
    }
    
    // Check old data for side effects
    const oldData = await (prisma as any)[model].findUnique({ where: { id } });
    
    const data = await (prisma as any)[model].update({
      where: { id },
      data: req.body
    });
    
    // Mock inventory adjustment logic
    if (model === 'purchaseOrder' && oldData.status !== 'Received' && data.status === 'Received') {
      const material = await prisma.material.findUnique({ where: { id: data.materialId } });
      if (material) {
        await prisma.material.update({
          where: { id: material.id },
          data: { currentStock: material.currentStock + data.quantity }
        });
      }
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Error in update ${req.params.model}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const remove = async (req: Request, res: Response): Promise<any> => {
  try {
    const model = (req.params.model || '') as string;
    const { id } = req.params;
    if (!(prisma as any)[model]) {
      return res.status(404).json({ message: `Model ${model} not found` });
    }
    await (prisma as any)[model].delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    console.error(`Error in remove ${req.params.model}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
