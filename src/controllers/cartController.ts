import { Request, Response } from 'express';
import { prisma } from '../prisma.js';
import { toBoolean } from '../utils/formatter.js';

export const getRecords = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const data = await prisma.cart.findMany({
      where: {
        userId: userId
      },
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            createdAt: true
          }
        }
      }
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch carts' });
  }
};

export const createRecord = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const uid = Number(userId);
  const pid = Number(productId);
  const qty = Math.max(1, Number(quantity) || 1); // sikkerhed: min 1

  try {
    const data = await prisma.cart.upsert({
      // virker når du har @@unique([userId, productId])
      where: { userId_productId: { userId: uid, productId: pid } },
      update: { quantity: { increment: qty } },
      create: { userId: uid, productId: pid, quantity: qty },
      select: {
        id: true,
        quantity: true,
        product: { select: { id: true, name: true, price: true, createdAt: true } }
      }
    });

    return res.status(201).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create/update cart' });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity, delta } = req.body; // delta = +1 / -1

  try {
    const data = await prisma.cart.update({
      where: { id: Number(id) },
      data: typeof delta === 'number'
        ? { quantity: { increment: delta } }
        : { quantity: Math.max(0, Number(quantity) || 0) },
    });
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update cart' });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.cart.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: 'Cart deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete cart' });
  }
};
