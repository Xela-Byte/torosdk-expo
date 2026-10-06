import {
  getProject as sdkGetProject,
  getProduct as sdkGetProduct,
  recordProduct as sdkRecordProduct,
  updateProduct as sdkUpdateProduct,
} from 'torosdk';
import { normalizeError } from './errors';

// ── Types ──────────────────────────────────────────────────────────────────

export interface ProductInput {
  productId: string;
  productName: string;
  description: string;
  productImage: string;
  admin: string;
  adminpwd: string;
}

// ── Product Operations ────────────────────────────────────────────────────

export const getProject = async (admin: string, getbalances: boolean = true): Promise<any> => {
  try {
    return await sdkGetProject({ admin, getbalances: getbalances ? 'true' : 'false' });
  } catch (error) {
    throw normalizeError(error, 'getProject');
  }
};

export const getProduct = async (productId: string, admin: string, adminpwd: string): Promise<any> => {
  try {
    return await sdkGetProduct({ productId, admin, adminpwd });
  } catch (error) {
    throw normalizeError(error, 'getProduct');
  }
};

export const createProduct = async (input: ProductInput): Promise<any> => {
  try {
    return await sdkRecordProduct(input);
  } catch (error) {
    throw normalizeError(error, 'createProduct');
  }
};

export const updateProduct = async (input: ProductInput): Promise<any> => {
  try {
    return await sdkUpdateProduct(input);
  } catch (error) {
    throw normalizeError(error, 'updateProduct');
  }
};
