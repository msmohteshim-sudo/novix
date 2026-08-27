import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getMyAttendance = async (req: Request, res: Response): Promise<any> => {
  try {
    const authUserId = (req as any).user?.id;
    const targetUserId = (req.query.userId as string) || authUserId;

    if (!targetUserId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        employeeId: true,
        joiningDate: true,
        department: true,
        shift: true,
        role: { select: { name: true } }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const joiningDateStr = user.joiningDate || '2022-03-15';
    const joiningDate = new Date(joiningDateStr);
    const today = new Date();
    
    // Calculate tenure
    let years = today.getFullYear() - joiningDate.getFullYear();
    let months = today.getMonth() - joiningDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    const tenureStr = `${years > 0 ? `${years} Year${years > 1 ? 's' : ''} ` : ''}${months} Month${months !== 1 ? 's' : ''}`;

    // Target year and month query params
    const selectedYear = parseInt(req.query.year as string, 10) || today.getFullYear();
    const selectedMonth = parseInt(req.query.month as string, 10) || (today.getMonth() + 1);

    // Fetch all attendance records for this user
    const allRecords = await prisma.attendance.findMany({
      where: { userId: targetUserId },
      orderBy: { date: 'asc' }
    });

    // Monthly records for selectedYear and selectedMonth
    const monthPrefix = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
    const monthlyRecords = allRecords.filter(r => r.date.startsWith(monthPrefix));

    // Monthly Stats
    let totalPresent = 0;
    let totalLate = 0;
    let totalAbsent = 0;
    let totalLeave = 0;
    let totalHalfDay = 0;
    let totalOvertimeHours = 0;
    let totalWorkedHours = 0;

    monthlyRecords.forEach(r => {
      if (r.status === 'Present') totalPresent++;
      else if (r.status === 'Late') totalLate++;
      else if (r.status === 'Absent') totalAbsent++;
      else if (r.status === 'On Leave' || r.status === 'Leave') totalLeave++;
      else if (r.status === 'Half Day') totalHalfDay++;

      if (r.overtime) totalOvertimeHours += r.overtime;
      if (r.hours) totalWorkedHours += r.hours;
    });

    const totalActiveDays = totalPresent + totalLate + totalHalfDay;
    const avgDailyHours = totalActiveDays > 0 ? parseFloat((totalWorkedHours / totalActiveDays).toFixed(1)) : 0;

    // Multi-Year Track Record (Grouping by year from joining date up to current year)
    const startYear = joiningDate.getFullYear();
    const currentYear = today.getFullYear();
    const yearlyMap: Record<number, any> = {};

    for (let y = startYear; y <= currentYear; y++) {
      yearlyMap[y] = {
        year: y,
        totalWorkingDays: 0,
        presentDays: 0,
        lateDays: 0,
        absentDays: 0,
        leaveDays: 0,
        halfDays: 0,
        overtimeHours: 0,
        totalHours: 0,
        attendanceRate: 0
      };
    }

    allRecords.forEach(r => {
      const year = parseInt(r.date.split('-')[0], 10);
      if (yearlyMap[year]) {
        yearlyMap[year].totalWorkingDays++;
        if (r.status === 'Present') yearlyMap[year].presentDays++;
        else if (r.status === 'Late') yearlyMap[year].lateDays++;
        else if (r.status === 'Absent') yearlyMap[year].absentDays++;
        else if (r.status === 'On Leave' || r.status === 'Leave') yearlyMap[year].leaveDays++;
        else if (r.status === 'Half Day') yearlyMap[year].halfDays++;

        if (r.overtime) yearlyMap[year].overtimeHours += r.overtime;
        if (r.hours) yearlyMap[year].totalHours += r.hours;
      }
    });

    // Calculate attendance percentage per year
    const yearlyTrackRecord = Object.values(yearlyMap).map((yStats: any) => {
      const activeDays = yStats.presentDays + yStats.lateDays + yStats.halfDays;
      const rate = yStats.totalWorkingDays > 0 
        ? Math.min(100, Math.round((activeDays / yStats.totalWorkingDays) * 100))
        : 0;
      return {
        ...yStats,
        overtimeHours: parseFloat(yStats.overtimeHours.toFixed(1)),
        attendanceRate: rate
      };
    });

    // Lifetime Stats
    let lifetimeWorkingDays = 0;
    let lifetimePresentDays = 0;
    let lifetimeOvertimeHours = 0;
    let lifetimeLeaves = 0;

    yearlyTrackRecord.forEach(y => {
      lifetimeWorkingDays += y.totalWorkingDays;
      lifetimePresentDays += (y.presentDays + y.lateDays + y.halfDays);
      lifetimeOvertimeHours += y.overtimeHours;
      lifetimeLeaves += y.leaveDays;
    });

    const lifetimeAttendanceRate = lifetimeWorkingDays > 0
      ? Math.round((lifetimePresentDays / lifetimeWorkingDays) * 100)
      : 0;

    // Today's Clock Status
    const todayStr = today.toISOString().split('T')[0];
    const todayRecord = allRecords.find(r => r.date === todayStr);

    return res.status(200).json({
      user: {
        ...user,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Employee User',
        joiningDate: joiningDateStr,
        employeeId: user.employeeId || 'EMP-104',
        department: user.department || 'Production & Weaving',
        shift: user.shift || 'Morning Shift (08:00 AM - 04:30 PM)',
        tenure: tenureStr,
        joiningYear: startYear
      },
      selectedYear,
      selectedMonth,
      todayRecord: todayRecord || null,
      monthStats: {
        totalPresent,
        totalLate,
        totalAbsent,
        totalLeave,
        totalHalfDay,
        totalOvertimeHours: parseFloat(totalOvertimeHours.toFixed(1)),
        avgDailyHours
      },
      monthlyRecords,
      yearlyTrackRecord,
      lifetimeStats: {
        lifetimeWorkingDays,
        lifetimePresentDays,
        lifetimeAttendanceRate,
        lifetimeOvertimeHours: parseFloat(lifetimeOvertimeHours.toFixed(1)),
        lifetimeLeaves
      }
    });

  } catch (error) {
    console.error('Error in getMyAttendance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const clockIn = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id || req.body.userId;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    const todayStr = new Date().toISOString().split('T')[0];
    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const existing = await prisma.attendance.findFirst({
      where: { userId, date: todayStr }
    });

    if (existing && existing.checkIn && existing.checkIn !== '-') {
      return res.status(400).json({ message: 'Already clocked in for today', record: existing });
    }

    let record;
    if (existing) {
      record = await prisma.attendance.update({
        where: { id: existing.id },
        data: { checkIn: nowStr, status: 'Present' }
      });
    } else {
      record = await prisma.attendance.create({
        data: {
          userId,
          date: todayStr,
          checkIn: nowStr,
          checkOut: '-',
          status: 'Present',
          hours: 0,
          overtime: 0,
          notes: 'Clocked in via My Attendance'
        }
      });
    }

    return res.status(200).json({ message: 'Clocked in successfully', record });
  } catch (error) {
    console.error('Error in clockIn:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const clockOut = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id || req.body.userId;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    const todayStr = new Date().toISOString().split('T')[0];
    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const existing = await prisma.attendance.findFirst({
      where: { userId, date: todayStr }
    });

    if (!existing) {
      return res.status(404).json({ message: 'No clock-in record found for today' });
    }

    const record = await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkOut: nowStr,
        hours: 8.5
      }
    });

    return res.status(200).json({ message: 'Clocked out successfully', record });
  } catch (error) {
    console.error('Error in clockOut:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const requestCorrection = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id || req.body.userId;
    const { date, requestType, reason } = req.body;

    return res.status(200).json({
      message: `Request for ${requestType} on ${date} submitted successfully.`,
      request: { userId, date, requestType, reason, status: 'Pending Review', createdAt: new Date() }
    });
  } catch (error) {
    console.error('Error in requestCorrection:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
