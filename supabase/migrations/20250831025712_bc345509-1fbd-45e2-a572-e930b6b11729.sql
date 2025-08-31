-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Create policies for stores
CREATE POLICY "Stores are viewable by authenticated users" 
ON public.stores 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create stores" 
ON public.stores 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update stores" 
ON public.stores 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete stores" 
ON public.stores 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_stores_updated_at
BEFORE UPDATE ON public.stores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.stores (name, address, phone, email, status, description) VALUES
('Loja Centro', 'Rua Principal, 123 - Centro', '(11) 98765-4321', 'centro@empresa.com', 'active', 'Loja principal no centro da cidade'),
('Loja Shopping', 'Shopping Mall - Piso 2, Loja 205', '(11) 91234-5678', 'shopping@empresa.com', 'active', 'Loja no shopping com grande fluxo de clientes'),
('Loja Norte', 'Av. Norte, 456 - Zona Norte', '(11) 95555-7777', 'norte@empresa.com', 'inactive', 'Loja em expansão na zona norte');