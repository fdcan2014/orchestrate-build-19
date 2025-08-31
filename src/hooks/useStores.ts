import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStoreData {
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  description?: string;
}

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast to ensure proper status typing
      const typedData = (data || []).map(store => ({
        ...store,
        status: store.status as 'active' | 'inactive'
      }));
      
      setStores(typedData);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro ao carregar lojas",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStore = async (storeData: CreateStoreData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('stores')
        .insert([storeData]);

      if (error) throw error;

      toast({
        title: "Loja criada",
        description: "Nova loja criada com sucesso!",
      });

      fetchStores(); // Refresh the list
      return true;
    } catch (err: any) {
      toast({
        title: "Erro ao criar loja",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateStore = async (id: string, storeData: Partial<CreateStoreData>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('stores')
        .update(storeData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Loja atualizada",
        description: "Loja atualizada com sucesso!",
      });

      fetchStores(); // Refresh the list
      return true;
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar loja",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteStore = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Loja excluída",
        description: "Loja excluída com sucesso!",
      });

      fetchStores(); // Refresh the list
      return true;
    } catch (err: any) {
      toast({
        title: "Erro ao excluir loja",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return {
    stores,
    loading,
    error,
    createStore,
    updateStore,
    deleteStore,
    refetch: fetchStores,
  };
}