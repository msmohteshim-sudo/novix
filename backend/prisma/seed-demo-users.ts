import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data (optional, but good for resetting demo)
  // Need to clear in order of dependencies if we were to delete, but let's just use upsert/create safely.
  
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: { name: 'Global Textiles Ltd' }
    });
  } else {
    org = await prisma.organization.update({
      where: { id: org.id },
      data: { name: 'Global Textiles Ltd' }
    });
  }

  const roles = ['Admin', 'Manager', 'Seller', 'Buyer', 'Employee'];
  
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName }
    });
  }

  const passwordHash = await bcrypt.hash('password123', 10);

  const getRoleId = async (name: string) => {
    const r = await prisma.role.findUnique({ where: { name } });
    return r!.id;
  };

  const users = [
    { email: 'admin@globaltextiles.demo', role: 'Admin', first: 'Admin', last: 'User', empId: 'EMP-000', joining: '2020-01-10', dept: 'Executive', shift: 'General (09:00 AM - 05:00 PM)' },
    { email: 'manager@globaltextiles.demo', role: 'Manager', first: 'Manager', last: 'User', empId: 'MGR-001', joining: '2021-06-01', dept: 'Operations', shift: 'General (08:30 AM - 05:00 PM)' },
    { email: 'seller@globaltextiles.demo', role: 'Seller', first: 'Seller', last: 'User', empId: 'SEL-001', joining: '2022-01-15', dept: 'Sales & CRM', shift: 'Day Shift (09:00 AM - 05:30 PM)' },
    { email: 'buyer@globaltextiles.demo', role: 'Buyer', first: 'Buyer', last: 'User', empId: 'BUY-001', joining: '2022-04-10', dept: 'Procurement', shift: 'Day Shift (09:00 AM - 05:30 PM)' },
    { email: 'employee@globaltextiles.demo', role: 'Employee', first: 'Michael', last: 'Brown', empId: 'EMP-104', joining: '2022-03-15', dept: 'Production & Weaving', shift: 'Morning Shift (08:00 AM - 04:30 PM)' },
    { email: 'emp001@globaltextiles.demo', role: 'Employee', first: 'Raj', last: 'Patel', empId: 'EMP-105', joining: '2021-08-20', dept: 'Spinning Unit', shift: 'Morning Shift (08:00 AM - 04:30 PM)' },
    { email: 'emp002@globaltextiles.demo', role: 'Employee', first: 'Anita', last: 'Sharma', empId: 'EMP-106', joining: '2023-02-01', dept: 'Quality Assurance', shift: 'Day Shift (09:00 AM - 05:00 PM)' },
  ];

  for (const u of users) {
    const userRecord = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        passwordHash,
        roleId: await getRoleId(u.role),
        organizationId: org.id,
        firstName: u.first,
        lastName: u.last,
        employeeId: u.empId,
        joiningDate: u.joining,
        department: u.dept,
        shift: u.shift
      },
      create: {
        email: u.email,
        passwordHash,
        firstName: u.first,
        lastName: u.last,
        roleId: await getRoleId(u.role),
        organizationId: org.id,
        employeeId: u.empId,
        joiningDate: u.joining,
        department: u.dept,
        shift: u.shift
      }
    });

    // Seed historical multi-year attendance records for employees
    if (u.role === 'Employee') {
      const startYear = parseInt(u.joining.split('-')[0], 10);
      const endYear = 2026;
      
      for (let y = startYear; y <= endYear; y++) {
        const startMonth = (y === startYear) ? parseInt(u.joining.split('-')[1], 10) : 1;
        const endMonth = (y === 2026) ? 8 : 12;

        for (let m = startMonth; m <= endMonth; m++) {
          const daysInMonth = (y === 2026 && m === 8) ? 17 : new Date(y, m, 0).getDate();
          
          for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(y, m - 1, d);
            const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat
            
            // Skip Sundays
            if (dayOfWeek === 0) continue;

            const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            
            // Deterministic status pattern based on date
            let status = 'Present';
            let checkIn = '07:55 AM';
            let checkOut = '04:30 PM';
            let hours = 8.5;
            let overtime = 0.0;
            let notes = 'Regular Shift';

            if (dayOfWeek === 6) {
              // Saturday half day or overtime
              if ((d + m) % 3 === 0) {
                status = 'Half Day';
                checkIn = '08:00 AM';
                checkOut = '01:00 PM';
                hours = 5.0;
                notes = 'Half-day Saturday';
              } else {
                status = 'Present';
                hours = 8.0;
              }
            } else if ((d * 7 + m * 3) % 29 === 0) {
              status = 'Late';
              checkIn = '08:35 AM';
              checkOut = '05:00 PM';
              hours = 8.4;
              notes = 'Traffic Delay';
            } else if ((d + y + m) % 37 === 0) {
              status = 'On Leave';
              checkIn = '-';
              checkOut = '-';
              hours = 0.0;
              notes = 'Approved Casual Leave';
            } else if ((d * 11 + m) % 59 === 0) {
              status = 'Absent';
              checkIn = '-';
              checkOut = '-';
              hours = 0.0;
              notes = 'Unexcused Absence';
            } else if (d % 7 === 0) {
              // Overtime day
              status = 'Present';
              checkIn = '07:45 AM';
              checkOut = '06:30 PM';
              hours = 10.5;
              overtime = 2.0;
              notes = 'Production Overtime';
            }

            const existingAtt = await prisma.attendance.findFirst({
              where: { userId: userRecord.id, date: dateStr }
            });

            if (!existingAtt) {
              await prisma.attendance.create({
                data: {
                  userId: userRecord.id,
                  date: dateStr,
                  checkIn,
                  checkOut,
                  status,
                  hours,
                  overtime,
                  notes
                }
              });
            }
          }
        }
      }
    }
  }

  console.log('Users and multi-year attendance seeded.');

  // Customers
  const customersData = [
    { name: 'Mumbai Fashion House', email: 'contact@mumbaifashion.in' },
    { name: 'Urban Threads Pvt Ltd', email: 'orders@urbanthreads.com' },
    { name: 'Royal Garments', email: 'hello@royalgarments.in' }
  ];

  for (const c of customersData) {
    const existing = await prisma.customer.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.customer.create({ data: c });
    }
  }

  // Suppliers
  const suppliersData = [
    { name: 'Maharashtra Cotton Suppliers', email: 'sales@mahacotton.com' },
    { name: 'Prime Yarn Industries', email: 'orders@primeyarn.in' },
    { name: 'ColorChem Textiles', email: 'dyes@colorchem.com' }
  ];

  for (const s of suppliersData) {
    const existing = await prisma.supplier.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.supplier.create({ data: s });
    }
  }

  // Materials
  const materialsData = [
    { materialId: 'MAT-001', name: 'Raw Cotton Grade A', category: 'Raw Material', currentStock: 12500, unit: 'kg', minStock: 5000, warehouse: 'Warehouse A', status: 'Healthy' },
    { materialId: 'MAT-002', name: 'Raw Cotton Grade B', category: 'Raw Material', currentStock: 8000, unit: 'kg', minStock: 4000, warehouse: 'Warehouse A', status: 'Healthy' },
    { materialId: 'MAT-003', name: 'Polyester Yarn', category: 'Yarn', currentStock: 2500, unit: 'kg', minStock: 1000, warehouse: 'Warehouse B', status: 'Healthy' },
    { materialId: 'MAT-004', name: 'Reactive Dye Blue', category: 'Dye', currentStock: 120, unit: 'kg', minStock: 200, warehouse: 'Warehouse C', status: 'Low Stock' },
    { materialId: 'MAT-005', name: 'Packaging Rolls', category: 'Packaging', currentStock: 50, unit: 'rolls', minStock: 100, warehouse: 'Warehouse C', status: 'Low Stock' },
  ];

  for (const m of materialsData) {
    await prisma.material.upsert({
      where: { materialId: m.materialId },
      update: m,
      create: m
    });
  }

  // Machines
  const machinesData = [
    { machineId: 'M-01', name: 'Weaving Loom M-01', type: 'Weaving Loom', status: 'Running', runtime: 1200 },
    { machineId: 'M-02', name: 'Weaving Loom M-02', type: 'Weaving Loom', status: 'Idle', runtime: 1050 },
    { machineId: 'D-01', name: 'Dyeing Machine D-01', type: 'Dyeing Machine', status: 'Maintenance', runtime: 3400 },
    { machineId: 'S-01', name: 'Spinning Machine S-01', type: 'Spinning Machine', status: 'Running', runtime: 500 },
  ];

  for (const m of machinesData) {
    await prisma.machine.upsert({
      where: { machineId: m.machineId },
      update: m,
      create: m
    });
  }

  // Find IDs for relations
  const customer1 = await prisma.customer.findFirst({ where: { name: 'Urban Threads Pvt Ltd' } });
  const machine1 = await prisma.machine.findUnique({ where: { machineId: 'M-01' } });
  const operator1 = await prisma.user.findUnique({ where: { email: 'emp001@globaltextiles.demo' } });
  
  // Work Orders
  const woData = [
    { workOrderId: 'WO-102', customerId: customer1!.id, product: 'Cotton Premium', quantity: 2500, unit: 'm', machineId: machine1!.id, operatorId: operator1!.id, startDate: '2026-08-12', expectedCompletion: '2026-08-15', status: 'In Progress' },
    { workOrderId: 'WO-103', customerId: customer1!.id, product: 'Cotton Standard', quantity: 5000, unit: 'm', status: 'Pending' },
  ];

  for (const wo of woData) {
    await prisma.workOrder.upsert({
      where: { workOrderId: wo.workOrderId },
      update: wo,
      create: wo
    });
  }

  // Purchase Orders
  const supplier1 = await prisma.supplier.findFirst({ where: { name: 'ColorChem Textiles' } });
  const matDye = await prisma.material.findUnique({ where: { materialId: 'MAT-004' } });

  await prisma.purchaseOrder.upsert({
    where: { poId: 'PO-201' },
    update: {},
    create: {
      poId: 'PO-201',
      supplierId: supplier1!.id,
      materialId: matDye!.id,
      quantity: 500,
      unit: 'kg',
      expectedDelivery: '2026-08-20',
      status: 'Ordered'
    }
  });

  // Sales Orders
  await prisma.salesOrder.upsert({
    where: { soId: 'SO-301' },
    update: {},
    create: {
      soId: 'SO-301',
      customerId: customer1!.id,
      product: 'Denim Fabric',
      quantity: 10000,
      total: 45000,
      orderDate: '2026-08-10',
      deliveryDate: '2026-08-30',
      status: 'Confirmed'
    }
  });

  console.log('Seed completed successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
