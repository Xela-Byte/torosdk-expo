import { useState, useCallback } from 'react';
import { 
  addSuperAdmin, addAdmin, removeAdmin, 
  getNumberOfAdmins, getAdminIndex, isAdmin, isSuperAdmin, isDebugger
} from '@reactforge/sdk-adapter';

export const useToroRoleMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeMutation = useCallback(async (mutationFn: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      return await mutationFn();
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
    addSuperAdmin: (adminStr: string, pwd: string, newAdmin: string) => 
      executeMutation(() => addSuperAdmin(adminStr, pwd, newAdmin)),
    addAdmin: (adminStr: string, pwd: string, newAdmin: string) => 
      executeMutation(() => addAdmin(adminStr, pwd, newAdmin)),
    removeAdmin: (adminStr: string, pwd: string, targetAdmin: string) => 
      executeMutation(() => removeAdmin(adminStr, pwd, targetAdmin)),
    getNumberOfAdmins: () => executeMutation(() => getNumberOfAdmins()),
    getAdminIndex: (address: string) => executeMutation(() => getAdminIndex(address)),
    isAdmin: (address: string) => executeMutation(() => isAdmin(address)),
    isSuperAdmin: (address: string) => executeMutation(() => isSuperAdmin(address)),
    isDebugger: (address: string) => executeMutation(() => isDebugger(address))
  };
};
