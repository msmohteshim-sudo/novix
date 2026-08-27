import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_in_production';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    
    // Handle demo token format (e.g., demo-token-admin-123456 or demo-token-manager)
    if (token.startsWith('demo-token-')) {
      const parts = token.split('-');
      const roleCapitalized = parts[2] ? parts[2].charAt(0).toUpperCase() + parts[2].slice(1) : 'Admin';
      req.user = {
        userId: 'demo-user-id',
        email: `${parts[2] || 'admin'}@demo.com`,
        role: roleCapitalized,
        orgId: 'demo-org-id'
      };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'User role not found' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    next();
  };
};
