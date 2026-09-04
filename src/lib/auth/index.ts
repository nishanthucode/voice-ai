import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { dbRepo } from '../db/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'aura_voice_super_secret_demo_key_2026';

export interface UserSession {
  userId: string;
  email: string;
  name: string;
}

export const DEMO_USER: UserSession = {
  userId: 'user_demo_01',
  email: 'demo@auravoice.ai',
  name: 'Demo Admin User',
};

export function signToken(user: UserSession): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch (e) {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aura_auth_token')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export function verifyBusinessOwnership(userId: string, businessId: string): boolean {
  const business = dbRepo.getBusiness(businessId);
  if (!business) return false;
  // In demo mode or matching owner id, allow access
  return business.owner_id === userId || userId === 'user_demo_01';
}
