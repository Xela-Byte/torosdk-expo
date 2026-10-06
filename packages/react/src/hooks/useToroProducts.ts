import { useState, useCallback } from 'react';
import { 
  getProject, getProduct, createProduct, updateProduct, ProductInput
} from '@reactforge/sdk-adapter';

export const useToroProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async <T>(actionFn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await actionFn();
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getProject: (admin: string, getbalances?: boolean) => 
      execute(() => getProject(admin, getbalances)),
    getProduct: (productId: string, admin: string, adminpwd: string) => 
      execute(() => getProduct(productId, admin, adminpwd)),
    createProduct: (input: ProductInput) => 
      execute(() => createProduct(input)),
    updateProduct: (input: ProductInput) => 
      execute(() => updateProduct(input))
  };
};
