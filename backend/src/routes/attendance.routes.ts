import express from 'express';
import { getMyAttendance, clockIn, clockOut, requestCorrection } from '../controllers/attendance.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(requireAuth);

router.get('/my-attendance', getMyAttendance);
router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);
router.post('/request-correction', requestCorrection);

export default router;
