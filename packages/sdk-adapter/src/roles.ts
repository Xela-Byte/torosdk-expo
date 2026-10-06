import {
  isAdmin as sdkIsAdmin,
  addAdmin as sdkAddAdmin,
  removeAdmin as sdkRemoveAdmin,
  isSuperAdmin as sdkIsSuperAdmin,
  addSuperAdmin as sdkAddSuperAdmin,
  isDebugger as sdkIsDebugger,
  getAdminIndex as sdkGetAdminIndex,
  getNumberOfAdmin as sdkGetNumberOfAdmin,
  getAdminByIndex as sdkGetAdminByIndex,
} from 'torosdk';
import { normalizeError } from './errors';

// ── Role Query Operations ─────────────────────────────────────────────────

export const isAdmin = async (address: string): Promise<boolean> => {
  try {
    const result = await sdkIsAdmin({ address });
    return Boolean(result?.isadmin ?? result);
  } catch (error) {
    throw normalizeError(error, 'isAdmin');
  }
};

export const isSuperAdmin = async (address: string): Promise<boolean> => {
  try {
    const result = await sdkIsSuperAdmin({ address });
    return Boolean(result?.issuperadmin ?? result);
  } catch (error) {
    throw normalizeError(error, 'isSuperAdmin');
  }
};

export const isDebugger = async (address: string): Promise<boolean> => {
  try {
    const result = await sdkIsDebugger({ address });
    return Boolean(result?.isdebugger ?? result);
  } catch (error) {
    throw normalizeError(error, 'isDebugger');
  }
};

export const getAdminIndex = async (address: string): Promise<number> => {
  try {
    return await sdkGetAdminIndex({ address });
  } catch (error) {
    throw normalizeError(error, 'getAdminIndex');
  }
};

export const getNumberOfAdmins = async (): Promise<number> => {
  try {
    return await sdkGetNumberOfAdmin();
  } catch (error) {
    throw normalizeError(error, 'getNumberOfAdmins');
  }
};

export const getAdminByIndex = async (index: number): Promise<string> => {
  try {
    return await sdkGetAdminByIndex({ index });
  } catch (error) {
    throw normalizeError(error, 'getAdminByIndex');
  }
};

// ── Role Write Operations (Super Admin) ───────────────────────────────────

export const addAdmin = async (
  superAdminAddress: string,
  superAdminPassword: string,
  adminAddress: string
): Promise<any> => {
  try {
    return await sdkAddAdmin({ address: superAdminAddress, password: superAdminPassword, adminAddress });
  } catch (error) {
    throw normalizeError(error, 'addAdmin');
  }
};

export const removeAdmin = async (
  superAdminAddress: string,
  superAdminPassword: string,
  adminAddress: string
): Promise<any> => {
  try {
    return await sdkRemoveAdmin({ address: superAdminAddress, password: superAdminPassword, adminAddress });
  } catch (error) {
    throw normalizeError(error, 'removeAdmin');
  }
};

export const addSuperAdmin = async (
  superAdminAddress: string,
  superAdminPassword: string,
  newSuperAdminAddress: string
): Promise<any> => {
  try {
    return await sdkAddSuperAdmin({ address: superAdminAddress, password: superAdminPassword, superAdminAddress: newSuperAdminAddress });
  } catch (error) {
    throw normalizeError(error, 'addSuperAdmin');
  }
};
