import { Router } from 'express';
import { getRecord, getRecords } from '../controllers/brandController';

const routes = Router();
routes.get('/', getRecords);
routes.get('/:id', getRecord);

export const brandRoutes = routes;
