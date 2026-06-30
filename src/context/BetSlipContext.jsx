import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { FINANCE } from "../constants/config";
import { calculatePayout } from "../services/oddsEngine";
import { clampStake } from "../utils/finance";

const BetSlipContext = createContext(null);

export function BetSlipProvider({ children }) {
  const [selections, setSelections] = useState([]);
  const [stake, setStakeRaw] = useState(FINANCE.defaultStake);
  const [isOpen, setIsOpen] = useState(false);

  const setStake = useCallback((value) => {
    setStakeRaw(clampStake(value));
  }, []);

  const addSelection = useCallback((selection) => {
    setSelections((prev) => {
      const exists = prev.find((s) => s.matchId === selection.matchId);
      if (exists) {
        return prev.map((s) =>
          s.matchId === selection.matchId ? { ...selection, addedAt: Date.now() } : s
        );
      }
      return [...prev, { ...selection, addedAt: Date.now() }];
    });
    setIsOpen(true);
  }, []);

  const removeSelection = useCallback((matchId) => {
    setSelections((prev) => prev.filter((s) => s.matchId !== matchId));
  }, []);

  const clearSlip = useCallback(() => {
    setSelections([]);
    setStakeRaw(FINANCE.defaultStake);
  }, []);

  const totalOdds = useMemo(() => {
    if (!selections.length) return 0;
    return selections.reduce((acc, s) => acc * s.odds, 1);
  }, [selections]);

  const potentialPayout = useMemo(
    () => (selections.length ? calculatePayout(stake, totalOdds) : 0),
    [selections.length, stake, totalOdds]
  );

  const value = useMemo(
    () => ({
      selections,
      stake,
      setStake,
      isOpen,
      setIsOpen,
      addSelection,
      removeSelection,
      clearSlip,
      totalOdds,
      potentialPayout,
      count: selections.length,
    }),
    [
      selections,
      stake,
      isOpen,
      addSelection,
      removeSelection,
      clearSlip,
      totalOdds,
      potentialPayout,
    ]
  );

  return <BetSlipContext.Provider value={value}>{children}</BetSlipContext.Provider>;
}

export function useBetSlip() {
  const ctx = useContext(BetSlipContext);
  if (!ctx) throw new Error("useBetSlip must be used within BetSlipProvider");
  return ctx;
}
