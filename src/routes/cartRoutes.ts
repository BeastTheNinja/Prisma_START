import { Router } from 'express';
import { Authorize } from '../middleware/authMiddleware';
import { createRecord, deleteRecord, getRecords, updateRecord } from '../controllers/cartController';

const routes = Router();
routes.get('/', Authorize, getRecords);
routes.post('/', Authorize, createRecord);
routes.put('/:id', Authorize, updateRecord);
routes.delete('/:id', Authorize, deleteRecord);

export const cartRoutes = routes;