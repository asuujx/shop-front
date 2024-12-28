import { createContext, useContext, useState } from "react";

interface StripeProviderProps {
  children: React.ReactElement;
}

interface StripeContextProps {
  clientSecret: string | null;
  changeClientSecret: (value: string) => void;
}

const defaultValue: StripeContextProps = {
  clientSecret: null,
  changeClientSecret: () => undefined,
};

const StripeContext = createContext<StripeContextProps>(defaultValue);

export function StripeProvider({ children }: StripeProviderProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const changeClientSecret = (value: string) => {
    setClientSecret(value);
  }

  return (
    <StripeContext.Provider value={{ clientSecret, changeClientSecret }}>
      {children}
    </StripeContext.Provider>
  );
}

export const useStripeContext = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error("useStripeContext must be used within a UserProvider");
  }
  return context;
};
