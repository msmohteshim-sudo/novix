import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { firstName, lastName, email, password, roleName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Accept industry from body; default to TEXTILE
    const { industry: industryInput } = req.body;
    const industry = ['TEXTILE', 'POULTRY_FARM'].includes(industryInput) ? industryInput : 'TEXTILE';

    // Get or create a default organization for registration purposes
    let org = await prisma.organization.findFirst({ where: { name: 'Default Organization' } });
    if (!org) {
      org = await prisma.organization.create({ data: { name: 'Default Organization', industry } });
    }

    // Get or create the requested role
    const targetRoleName = roleName || 'Employee';
    let role = await prisma.role.findFirst({ where: { name: targetRoleName } });
    if (!role) {
      role = await prisma.role.create({ data: { name: targetRoleName } });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        organizationId: org.id,
        roleId: role.id
      }
    });

    // Generate JWT — include industry
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: role.name, orgId: org.id, industry },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: role.name,
        industry,
        organizationId: org.id,
        organization: org.name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true, organization: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const industry = user.organization?.industry || 'TEXTILE';

    // Generate JWT — include industry so middleware can enforce it
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role.name, orgId: user.organizationId, industry },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        industry,
        organizationId: user.organizationId,
        organization: user.organization?.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Return 200 even if user doesn't exist for security (prevent email enumeration)
      return res.status(200).json({ message: 'If an account exists, a reset link was sent' });
    }

    // Generate random token
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set expiry to 1 hour from now
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    // Save token to DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Send email
    const { sendPasswordResetEmail } = require('../config/mailer');
    await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({ message: 'If an account exists, a reset link was sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Find user with this token and ensure it's not expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Must be strictly greater than current time (not expired)
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return res.status(200).json({ message: 'Password has been successfully reset' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const googleLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Fetch user info from Google using the access token
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!googleRes.ok) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const googleUser = await googleRes.json();
    const email = googleUser.email;
    const firstName = googleUser.given_name || 'Google';
    const lastName = googleUser.family_name || 'User';

    if (!email) {
      return res.status(400).json({ message: 'Email not provided by Google' });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
      include: { role: true, organization: true }
    });

    if (!user) {
      // User doesn't exist, create a new one automatically

      // Get or create a default organization
      let org = await prisma.organization.findFirst({ where: { name: 'Default Organization' } });
      if (!org) {
        org = await prisma.organization.create({ data: { name: 'Default Organization', industry: 'TEXTILE' } });
      }

      // Get or create a default role
      let role = await prisma.role.findFirst({ where: { name: 'Admin' } });
      if (!role) {
        role = await prisma.role.create({ data: { name: 'Admin' } });
      }

      // Generate a random password hash since they use Google
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const passwordHash = await bcrypt.hash(randomPassword, 10);

      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          organizationId: org.id,
          roleId: role.id
        },
        include: { role: true, organization: true }
      });
    }

    const industry = (user as any).organization?.industry || 'TEXTILE';

    // Generate our system JWT — include industry
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role.name, orgId: user.organizationId, industry },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Google Login successful',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        industry,
        organizationId: user.organizationId,
        organization: (user as any).organization?.name
      }
    });

  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
