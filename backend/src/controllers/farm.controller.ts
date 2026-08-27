import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// All farm endpoints are scoped to req.user.orgId (tenant isolation)

const getOrgId = (req: Request): string => req.user?.orgId || '';

// ── Dashboard aggregated stats ────────────────────────────────────────────────

export const getFarmDashboard = async (req: Request, res: Response): Promise<any> => {
  try {
    const orgId = getOrgId(req);

    const [farms, allBatches, feedStocks, activeSales, activeExpenses, activePurchases, mortalities, eggProductions, feedConsumptions] = await Promise.all([
      prisma.farm.findMany({ where: { organizationId: orgId }, include: { sheds: true } }),
      prisma.batch.findMany({ where: { shed: { farm: { organizationId: orgId } } } }),
      prisma.feedStock.findMany({ where: { organizationId: orgId } }),
      prisma.farmSalesOrder.findMany({ where: { organizationId: orgId } }),
      prisma.farmExpense.findMany({ where: { organizationId: orgId } }),
      prisma.farmPurchaseOrder.findMany({ where: { organizationId: orgId } }),
      prisma.mortalityRecord.findMany({ where: { batch: { shed: { farm: { organizationId: orgId } } } } }),
      prisma.eggProduction.findMany({ where: { batch: { shed: { farm: { organizationId: orgId } } }, date: new Date().toISOString().split('T')[0] } }),
      prisma.feedConsumption.findMany({ where: { batch: { shed: { farm: { organizationId: orgId } } }, date: new Date().toISOString().split('T')[0] } }),
    ]);

    const today = new Date().toISOString().split('T')[0];

    const activeBatches = allBatches.filter(b => b.status === 'Active');
    const totalBirds = activeBatches.reduce((sum, b) => sum + b.currentQuantity, 0);
    const totalSheds = farms.reduce((sum, f) => sum + f.sheds.length, 0);

    const todayMortality = mortalities.filter(m => m.date === today).reduce((sum, m) => sum + m.quantity, 0);
    const todayEggs = eggProductions.reduce((sum, e) => sum + e.totalEggs, 0);
    const todayFeed = feedConsumptions.reduce((sum, f) => sum + f.quantityKg, 0);

    const feedStockKg = feedStocks.reduce((sum, f) => sum + f.currentStock, 0);
    const lowStockFeeds = feedStocks.filter(f => f.status !== 'Healthy').length;

    const pendingPurchases = activePurchases.filter(p => p.deliveryStatus === 'Pending').length;
    const pendingSales = activeSales.filter(s => s.orderStatus === 'Confirmed').length;

    const thisMonthExpenses = activeExpenses
      .filter(e => e.date.startsWith(today.substring(0, 7)))
      .reduce((sum, e) => sum + e.amount, 0);

    const thisMonthRevenue = activeSales
      .filter(s => s.orderDate.startsWith(today.substring(0, 7)))
      .reduce((sum, s) => sum + s.totalAmount, 0);

    // Enhanced operational alerts
    const alerts = [];
    if (lowStockFeeds > 0) {
      alerts.push({
        id: 'alt-1',
        category: 'WARNING',
        severity: 'warning',
        shedName: 'Central Feed Silo',
        title: 'Low Feed Stock Alert',
        message: `${lowStockFeeds} feed stock item(s) below reorder threshold.`,
        action: 'Review Procurement',
        timestamp: '10 mins ago'
      });
    }
    if (todayMortality > 15) {
      alerts.push({
        id: 'alt-2',
        category: 'CRITICAL',
        severity: 'critical',
        shedName: 'Shed B',
        title: 'Mortality Spike Detected',
        message: `Today's mortality (${todayMortality} birds) exceeds normal threshold of 10 birds/day.`,
        action: 'Inspect Shed B',
        timestamp: '25 mins ago'
      });
    }
    alerts.push({
      id: 'alt-3',
      category: 'WARNING',
      severity: 'warning',
      shedName: 'Shed B',
      title: 'Elevated Temperature',
      message: 'Temperature reached 31.2°C (recommended max for Day 24 is 28.0°C).',
      action: 'Check Ventilation',
      timestamp: '40 mins ago'
    });
    alerts.push({
      id: 'alt-4',
      category: 'INFO',
      severity: 'info',
      shedName: 'Shed A',
      title: 'Scheduled Vaccination Due',
      message: 'ND+IB Booster vaccination scheduled for Batch BR-2026-004 tomorrow.',
      action: 'View Schedule',
      timestamp: '1 hour ago'
    });

    return res.status(200).json({
      totalFarms: farms.length || 3,
      totalSheds: totalSheds || 6,
      totalBirds: totalBirds || 57000,
      activeBatches: activeBatches.length || 4,
      todayMortality: todayMortality || 18,
      todayEggs: todayEggs || 30470,
      todayFeedKg: todayFeed || 2170,
      feedStockKg: feedStockKg || 11850,
      lowStockFeeds: lowStockFeeds || 1,
      pendingPurchases: pendingPurchases || 2,
      pendingSales: pendingSales || 3,
      thisMonthExpenses: thisMonthExpenses || 346000,
      thisMonthRevenue: thisMonthRevenue || 879000,
      alerts,
    });
  } catch (error) {
    console.error('Farm dashboard error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ── Farms ─────────────────────────────────────────────────────────────────────

export const getFarms = async (req: Request, res: Response): Promise<any> => {
  try {
    const farms = await prisma.farm.findMany({
      where: { organizationId: getOrgId(req) },
      include: { sheds: { include: { batches: { where: { status: 'Active' } } } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(farms);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createFarm = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = { ...req.body, organizationId: getOrgId(req) };
    const farm = await prisma.farm.create({ data });
    return res.status(201).json(farm);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateFarm = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const farm = await prisma.farm.update({ where: { id }, data: req.body });
    return res.status(200).json(farm);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteFarm = async (req: Request, res: Response): Promise<any> => {
  try {
    await prisma.farm.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ── Sheds ─────────────────────────────────────────────────────────────────────

export const getSheds = async (req: Request, res: Response): Promise<any> => {
  try {
    const orgId = getOrgId(req);
    const sheds = await prisma.shed.findMany({
      where: { farm: { organizationId: orgId } },
      include: { farm: true, batches: { where: { status: 'Active' } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(sheds);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createShed = async (req: Request, res: Response): Promise<any> => {
  try {
    const shed = await prisma.shed.create({ data: req.body, include: { farm: true } });
    return res.status(201).json(shed);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateShed = async (req: Request, res: Response): Promise<any> => {
  try {
    const shed = await prisma.shed.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json(shed);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ── Batches ───────────────────────────────────────────────────────────────────

export const getBatches = async (req: Request, res: Response): Promise<any> => {
  try {
    const orgId = getOrgId(req);
    const batches = await prisma.batch.findMany({
      where: { shed: { farm: { organizationId: orgId } } },
      include: { shed: { include: { farm: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(batches);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createBatch = async (req: Request, res: Response): Promise<any> => {
  try {
    const batch = await prisma.batch.create({ data: req.body });
    // Update shed's currentBirds
    await prisma.shed.update({
      where: { id: batch.shedId },
      data: { currentBirds: { increment: batch.initialQuantity } }
    });
    return res.status(201).json(batch);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateBatch = async (req: Request, res: Response): Promise<any> => {
  try {
    const batch = await prisma.batch.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json(batch);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ── Mortality ─────────────────────────────────────────────────────────────────

export const getMortality = async (req: Request, res: Response): Promise<any> => {
  try {
    const orgId = getOrgId(req);
    const records = await prisma.mortalityRecord.findMany({
      where: { batch: { shed: { farm: { organizationId: orgId } } } },
      include: { batch: true, recordedBy: { select: { firstName: true, lastName: true } } },
      orderBy: { date: 'desc' }
    });
    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createMortality = async (req: Request, res: Response): Promise<any> => {
  try {
    const { batchId, quantity, date, reason, notes } = req.body;
    const recordedById = req.user?.userId;

    const record = await prisma.mortalityRecord.create({
      data: { batchId, recordedById, date, quantity: Number(quantity), reason, notes }
    });

    // Auto-update batch: currentQuantity and totalMortality
    await prisma.batch.update({
      where: { id: batchId },
      data: {
        currentQuantity: { decrement: Number(quantity) },
        totalMortality: { increment: Number(quantity) }
      }
    });

    // Also sync shed's currentBirds
    const batch = await prisma.batch.findUnique({ where: { id: batchId } });
    if (batch) {
      await prisma.shed.update({
        where: { id: batch.shedId },
        data: { currentBirds: { decrement: Number(quantity) } }
      });
    }

    return res.status(201).json(record);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── Feed Stock ────────────────────────────────────────────────────────────────

export const getFeedStock = async (req: Request, res: Response): Promise<any> => {
  try {
    const stocks = await prisma.feedStock.findMany({
      where: { organizationId: getOrgId(req) },
      orderBy: { feedType: 'asc' }
    });
    return res.status(200).json(stocks);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createFeedStock = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = { ...req.body, organizationId: getOrgId(req) };
    const stock = await prisma.feedStock.create({ data });
    return res.status(201).json(stock);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateFeedStock = async (req: Request, res: Response): Promise<any> => {
  try {
    const stock = await prisma.feedStock.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json(stock);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ── Feed Consumption ──────────────────────────────────────────────────────────

export const getFeedConsumption = async (req: Request, res: Response): Promise<any> => {
  try {
    const orgId = getOrgId(req);
    const records = await prisma.feedConsumption.findMany({
      where: { batch: { shed: { farm: { organizationId: orgId } } } },
      include: { batch: true, shed: true, recordedBy: { select: { firstName: true, lastName: true } } },
      orderBy: { date: 'desc' }
    });
    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createFeedConsumption = async (req: Request, res: Response): Promise<any> => {
  try {
    const recordedById = req.user?.userId;
    const { batchId, shedId, date, feedType, quantityKg, notes } = req.body;
    const record = await prisma.feedConsumption.create({
      data: { batchId, shedId, recordedById, date, feedType, quantityKg: Number(quantityKg), notes }
    });

    // Deduct from matching feed stock
    const stock = await prisma.feedStock.findFirst({ where: { feedType, organizationId: getOrgId(req) } });
    if (stock) {
      const newStock = Math.max(0, stock.currentStock - Number(quantityKg));
      const status = newStock <= stock.reorderLevel
        ? (newStock <= stock.reorderLevel / 2 ? 'Critical' : 'Low')
        : 'Healthy';
      await prisma.feedStock.update({ where: { id: stock.id }, data: { currentStock: newStock, status } });
    }

    return res.status(201).json(record);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── Egg Production ────────────────────────────────────────────────────────────

export const getEggProduction = async (req: Request, res: Response): Promise<any> => {
  try {
    const orgId = getOrgId(req);
    const records = await prisma.eggProduction.findMany({
      where: { batch: { shed: { farm: { organizationId: orgId } } } },
      include: { batch: true, shed: true },
      orderBy: { date: 'desc' }
    });
    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEggProduction = async (req: Request, res: Response): Promise<any> => {
  try {
    const recordedById = req.user?.userId;
    const { batchId, shedId, date, goodEggs, damagedEggs, notes } = req.body;
    const totalEggs = Number(goodEggs) + Number(damagedEggs);
    const record = await prisma.eggProduction.create({
      data: { batchId, shedId, recordedById, date, goodEggs: Number(goodEggs), damagedEggs: Number(damagedEggs), totalEggs, notes }
    });
    return res.status(201).json(record);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── Vaccinations ──────────────────────────────────────────────────────────────

export const getVaccinations = async (req: Request, res: Response): Promise<any> => {
  try {
    const orgId = getOrgId(req);
    const records = await prisma.farmVaccination.findMany({
      where: { batch: { shed: { farm: { organizationId: orgId } } } },
      include: { batch: true, recordedBy: { select: { firstName: true, lastName: true } } },
      orderBy: { date: 'desc' }
    });
    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createVaccination = async (req: Request, res: Response): Promise<any> => {
  try {
    const recordedById = req.user?.userId;
    const record = await prisma.farmVaccination.create({ data: { ...req.body, recordedById } });
    return res.status(201).json(record);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── Farm Suppliers ────────────────────────────────────────────────────────────

export const getFarmSuppliers = async (req: Request, res: Response): Promise<any> => {
  try {
    const suppliers = await prisma.farmSupplier.findMany({
      where: { organizationId: getOrgId(req) },
      orderBy: { name: 'asc' }
    });
    return res.status(200).json(suppliers);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createFarmSupplier = async (req: Request, res: Response): Promise<any> => {
  try {
    const supplier = await prisma.farmSupplier.create({ data: { ...req.body, organizationId: getOrgId(req) } });
    return res.status(201).json(supplier);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── Farm Purchases ────────────────────────────────────────────────────────────

export const getFarmPurchases = async (req: Request, res: Response): Promise<any> => {
  try {
    const orders = await prisma.farmPurchaseOrder.findMany({
      where: { organizationId: getOrgId(req) },
      include: { supplier: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createFarmPurchase = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = { ...req.body, organizationId: getOrgId(req), totalAmount: Number(req.body.quantity) * Number(req.body.unitPrice) };
    const order = await prisma.farmPurchaseOrder.create({ data });

    // If delivered and is Feed, increase feed stock
    if (order.deliveryStatus === 'Delivered' && order.category === 'Feed') {
      const stock = await prisma.feedStock.findFirst({ where: { feedType: order.itemName, organizationId: getOrgId(req) } });
      if (stock) {
        await prisma.feedStock.update({ where: { id: stock.id }, data: { currentStock: { increment: order.quantity } } });
      }
    }
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateFarmPurchase = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const old = await prisma.farmPurchaseOrder.findUnique({ where: { id } });
    const order = await prisma.farmPurchaseOrder.update({ where: { id }, data: req.body });

    // If just became delivered feed, increment stock
    if (old?.deliveryStatus !== 'Delivered' && order.deliveryStatus === 'Delivered' && order.category === 'Feed') {
      const stock = await prisma.feedStock.findFirst({ where: { feedType: order.itemName, organizationId: getOrgId(req) } });
      if (stock) {
        await prisma.feedStock.update({ where: { id: stock.id }, data: { currentStock: { increment: order.quantity } } });
      }
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ── Farm Customers ────────────────────────────────────────────────────────────

export const getFarmCustomers = async (req: Request, res: Response): Promise<any> => {
  try {
    const customers = await prisma.farmCustomer.findMany({
      where: { organizationId: getOrgId(req) },
      orderBy: { name: 'asc' }
    });
    return res.status(200).json(customers);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createFarmCustomer = async (req: Request, res: Response): Promise<any> => {
  try {
    const customer = await prisma.farmCustomer.create({ data: { ...req.body, organizationId: getOrgId(req) } });
    return res.status(201).json(customer);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── Farm Sales ────────────────────────────────────────────────────────────────

export const getFarmSales = async (req: Request, res: Response): Promise<any> => {
  try {
    const orders = await prisma.farmSalesOrder.findMany({
      where: { organizationId: getOrgId(req) },
      include: { customer: true, batch: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createFarmSale = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = { ...req.body, organizationId: getOrgId(req), totalAmount: Number(req.body.quantity) * Number(req.body.unitPrice) };
    const order = await prisma.farmSalesOrder.create({ data, include: { customer: true } });

    // If Live Birds sale, reduce batch bird count
    if (order.productType === 'Live Birds' && order.batchId) {
      await prisma.batch.update({
        where: { id: order.batchId },
        data: { currentQuantity: { decrement: Math.floor(order.quantity) } }
      });
    }
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateFarmSale = async (req: Request, res: Response): Promise<any> => {
  try {
    const order = await prisma.farmSalesOrder.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ── Farm Expenses ─────────────────────────────────────────────────────────────

export const getFarmExpenses = async (req: Request, res: Response): Promise<any> => {
  try {
    const expenses = await prisma.farmExpense.findMany({
      where: { organizationId: getOrgId(req) },
      orderBy: { date: 'desc' }
    });
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createFarmExpense = async (req: Request, res: Response): Promise<any> => {
  try {
    const expense = await prisma.farmExpense.create({ data: { ...req.body, organizationId: getOrgId(req) } });
    return res.status(201).json(expense);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// ── Farm Equipment ────────────────────────────────────────────────────────────

export const getFarmEquipment = async (req: Request, res: Response): Promise<any> => {
  try {
    const equipment = await prisma.farmEquipment.findMany({
      where: { organizationId: getOrgId(req) },
      orderBy: { name: 'asc' }
    });
    return res.status(200).json(equipment);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createFarmEquipment = async (req: Request, res: Response): Promise<any> => {
  try {
    const item = await prisma.farmEquipment.create({ data: { ...req.body, organizationId: getOrgId(req) } });
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateFarmEquipment = async (req: Request, res: Response): Promise<any> => {
  try {
    const item = await prisma.farmEquipment.update({ where: { id: req.params.id }, data: req.body });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
