import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { FINANCE } from "../constants/config";
import { calculateTradePayout, calculateTradeProfit } from "../services/marketEngine";
import { clampStake } from "../utils/finance";

const TradeContext = createContext(null);

export function TradeProvider({ children }) {
  const [position, setPosition] = useState(null);
  const [stake, setStakeRaw] = useState(FINANCE.defaultStake);
  const [isOpen, setIsOpen] = useState(false);

  const setStake = useCallback((value) => {
    setStakeRaw(clampStake(value));
  }, []);

  const selectOutcome = useCallback((trade) => {
    setPosition({ ...trade, side: trade.side ?? "yes", addedAt: Date.now() });
    setIsOpen(true);
  }, []);

  const clearTrade = useCallback(() => {
    setPosition(null);
    setStakeRaw(FINANCE.defaultStake);
  }, []);

  const price = position?.side === "no" ? position?.noPrice : position?.price;

  const shares = useMemo(() => {
    if (!position || !price) return 0;
    return Math.round((stake / (price / 100)) * 100) / 100;
  }, [position, price, stake]);

  const potentialPayout = useMemo(
    () => (position ? calculateTradePayout(stake, price) : 0),
    [position, stake, price]
  );

  const potentialProfit = useMemo(
    () => (position ? calculateTradeProfit(stake, price) : 0),
    [position, stake, price]
  );

  const value = useMemo(
    () => ({
      position,
      stake,
      setStake,
      isOpen,
      setIsOpen,
      selectOutcome,
      clearTrade,
      shares,
      price,
      potentialPayout,
      potentialProfit,
      hasTrade: Boolean(position),
    }),
    [
      position,
      stake,
      isOpen,
      selectOutcome,
      clearTrade,
      shares,
      price,
      potentialPayout,
      potentialProfit,
    ]
  );

  return <TradeContext.Provider value={value}>{children}</TradeContext.Provider>;
}

export function useTrade() {
  const ctx = useContext(TradeContext);
  if (!ctx) throw new Error("useTrade must be used within TradeProvider");
  return ctx;
}

// Backward-compatible alias
export const BetSlipProvider = TradeProvider;
export const useBetSlip = useTrade;
