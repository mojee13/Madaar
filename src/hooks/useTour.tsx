import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
const TourContext = createContext<{ step: number | null; setStep: (s: number | null) => void }>({
  step: null,
  setStep: () => {},
});
export function TourProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<number | null>(null);
  return <TourContext.Provider value={{ step, setStep }}>{children}</TourContext.Provider>;
}
export const useTour = () => useContext(TourContext);
