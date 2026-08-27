import express from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import * as farm from '../controllers/farm.controller';

const router = express.Router();

// All farm routes require authentication
router.use(requireAuth);

// Dashboard
router.get('/dashboard', farm.getFarmDashboard);

// Farms
router.get('/farms', farm.getFarms);
router.post('/farms', requireRole(['Admin', 'Manager']), farm.createFarm);
router.put('/farms/:id', requireRole(['Admin', 'Manager']), farm.updateFarm);
router.delete('/farms/:id', requireRole(['Admin']), farm.deleteFarm);

// Sheds
router.get('/sheds', farm.getSheds);
router.post('/sheds', requireRole(['Admin', 'Manager']), farm.createShed);
router.put('/sheds/:id', requireRole(['Admin', 'Manager']), farm.updateShed);

// Batches
router.get('/batches', farm.getBatches);
router.post('/batches', requireRole(['Admin', 'Manager']), farm.createBatch);
router.put('/batches/:id', requireRole(['Admin', 'Manager']), farm.updateBatch);

// Mortality
router.get('/mortality', farm.getMortality);
router.post('/mortality', requireRole(['Admin', 'Manager', 'Employee']), farm.createMortality);

// Feed Stock
router.get('/feed-stock', farm.getFeedStock);
router.post('/feed-stock', requireRole(['Admin', 'Manager', 'Buyer']), farm.createFeedStock);
router.put('/feed-stock/:id', requireRole(['Admin', 'Manager', 'Buyer']), farm.updateFeedStock);

// Feed Consumption
router.get('/feed-consumption', farm.getFeedConsumption);
router.post('/feed-consumption', requireRole(['Admin', 'Manager', 'Employee']), farm.createFeedConsumption);

// Egg Production
router.get('/egg-production', farm.getEggProduction);
router.post('/egg-production', requireRole(['Admin', 'Manager', 'Employee']), farm.createEggProduction);

// Vaccinations
router.get('/vaccinations', farm.getVaccinations);
router.post('/vaccinations', requireRole(['Admin', 'Manager']), farm.createVaccination);

// Farm Suppliers
router.get('/suppliers', farm.getFarmSuppliers);
router.post('/suppliers', requireRole(['Admin', 'Manager', 'Buyer']), farm.createFarmSupplier);

// Farm Purchases
router.get('/purchases', farm.getFarmPurchases);
router.post('/purchases', requireRole(['Admin', 'Manager', 'Buyer']), farm.createFarmPurchase);
router.put('/purchases/:id', requireRole(['Admin', 'Manager', 'Buyer']), farm.updateFarmPurchase);

// Farm Customers
router.get('/customers', farm.getFarmCustomers);
router.post('/customers', requireRole(['Admin', 'Manager', 'Seller']), farm.createFarmCustomer);

// Farm Sales
router.get('/sales', farm.getFarmSales);
router.post('/sales', requireRole(['Admin', 'Manager', 'Seller']), farm.createFarmSale);
router.put('/sales/:id', requireRole(['Admin', 'Manager', 'Seller']), farm.updateFarmSale);

// Farm Expenses
router.get('/expenses', farm.getFarmExpenses);
router.post('/expenses', requireRole(['Admin', 'Manager']), farm.createFarmExpense);

// Equipment
router.get('/equipment', farm.getFarmEquipment);
router.post('/equipment', requireRole(['Admin', 'Manager']), farm.createFarmEquipment);
router.put('/equipment/:id', requireRole(['Admin', 'Manager']), farm.updateFarmEquipment);

export default router;
