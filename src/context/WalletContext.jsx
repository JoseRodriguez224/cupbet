import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fundAccount, hasWalletProvider } from "../services/web3";
import { FINANCE } from "../constants/config";
import { clampDeposit, getDepositBonus } from "../utils/finance";

function storageKey(address) {
  return `cupbet_account_${address?.toLowerCase() ?? "guest"}`;
}

function loadAccount(address) {
  if (!address) {
    return { balance: 0, totalDeposited: 0, totalWagered: 0, bets: [] };
  }
  try {
    const raw = localStorage.getItem(storageKey(address));
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { balance: 0, totalDeposited: 0, totalWagered: 0, bets: [] };
}

function saveAccount(address, data) {
  if (!address) return;
  localStorage.setItem(storageKey(address), JSON.stringify(data));
}

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [address, setAddress] = useState("");
  const [account, setAccount] = useState(loadAccount(""));
  const [connected, setConnected] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (address) saveAccount(address, account);
  }, [address, account]);

  const connectAndFund = useCallback(async (amount) => {
    const value = clampDeposit(amount);
    if (!value) return { ok: false, error: "Enter a valid amount." };
    if (!hasWalletProvider()) {
      return { ok: false, error: "Install MetaMask or another Web3 wallet." };
    }

    setBusy(true);
    setError(null);

    try {
      const result = await fundAccount(value);
      const credit = getDepositBonus(result.amount);

      setAddress(result.address);
      setConnected(true);
      setAccount((prev) => {
        const base =
          connected && address.toLowerCase() === result.address.toLowerCase()
            ? prev
            : loadAccount(result.address);
        return {
          ...base,
          balance: base.balance + credit.bonus + result.amount,
          totalDeposited: base.totalDeposited + result.amount,
        };
      });

      setShowConnect(false);
      setShowDeposit(false);

      return {
        ok: true,
        hash: result.hash,
        address: result.address,
        deposited: result.amount,
        bonus: credit.bonus,
        percent: credit.percent,
        label: credit.label,
        totalCredit: result.amount + credit.bonus,
      };
    } catch (err) {
      const message = err?.message ?? "Transaction failed. Please try again.";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setBusy(false);
    }
  }, [connected, address]);

  const deposit = useCallback(
    async (amount) => {
      if (!connected || !address) {
        setShowConnect(true);
        return { ok: false, error: "Connect your wallet first." };
      }
      return connectAndFund(amount);
    },
    [connected, address, connectAndFund]
  );

  const openConnect = useCallback(() => {
    setError(null);
    setShowConnect(true);
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setAddress("");
    setAccount({ balance: 0, totalDeposited: 0, totalWagered: 0, bets: [] });
    setError(null);
  }, []);

  const placeBet = useCallback(({ marketId, question, outcomeKey, outcomeLabel, side, price, shares, stake, potentialPayout }) => {
    if (!connected) return { ok: false, error: "Connect your wallet and fund your account first." };
    if (stake < FINANCE.minStake) {
      return { ok: false, error: `Minimum trade is ${FINANCE.minStake} USDT.` };
    }
    if (stake > FINANCE.maxStake) {
      return { ok: false, error: `Maximum trade is ${FINANCE.maxStake.toLocaleString()} USDT.` };
    }
    if (stake > account.balance) return { ok: false, error: "Insufficient balance." };
    if (potentialPayout > FINANCE.maxPayout) {
      return {
        ok: false,
        error: `Max payout is ${FINANCE.maxPayout.toLocaleString()} USDT. Lower your amount.`,
      };
    }

    const bet = {
      id: `bet-${Date.now()}`,
      marketId,
      question,
      outcomeKey,
      outcomeLabel,
      side,
      price,
      shares,
      stake,
      potentialPayout,
      placedAt: new Date().toISOString(),
      status: "open",
    };

    setAccount((prev) => ({
      ...prev,
      balance: prev.balance - stake,
      totalWagered: prev.totalWagered + stake,
      bets: [bet, ...prev.bets].slice(0, 100),
    }));

    return { ok: true, bet };
  }, [connected, account.balance]);

  const value = useMemo(
    () => ({
      connected,
      address,
      balance: account.balance,
      totalDeposited: account.totalDeposited,
      totalWagered: account.totalWagered,
      bets: account.bets,
      busy,
      error,
      finance: FINANCE,
      hasProvider: hasWalletProvider(),
      connect: openConnect,
      connectAndFund,
      disconnect,
      deposit,
      placeBet,
      showConnect,
      setShowConnect,
      showDeposit,
      setShowDeposit,
    }),
    [
      connected,
      address,
      account,
      busy,
      error,
      openConnect,
      connectAndFund,
      disconnect,
      deposit,
      placeBet,
      showConnect,
      showDeposit,
    ]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
