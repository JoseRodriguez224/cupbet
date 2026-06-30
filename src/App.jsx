import { useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TradeProvider, useTrade } from "./context/TradeContext";
import { WalletProvider, useWallet } from "./context/WalletContext";
import { LoginGate } from "./components/LoginGate";
import { AdminDashboard } from "./components/AdminDashboard";
import { TradeSlip } from "./components/TradeSlip";
import { FundWalletModal } from "./components/FundWalletModal";
import { MarketFilters } from "./components/MarketFilters";
import { MarketList } from "./components/MarketList";
import { TrendingMarkets } from "./components/TrendingMarkets";
import { PortfolioPanel } from "./components/PortfolioPanel";
import { BreakingFeed } from "./components/BreakingFeed";
import { WalletPanel } from "./components/WalletPanel";
import { Footer } from "./components/Footer";
import { useMatches } from "./hooks/useMatches";
import { filterMatches } from "./services/matchesApi";
import { getTrendingMarkets } from "./services/marketEngine";
import { getMatchStatus, STATUS } from "./utils/matchStatus";
import { formatCurrency } from "./utils/formatters";
import { SITE } from "./constants/config";

function useAdminRoute() {
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === "#admin");

  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash === "#admin");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return isAdmin;
}

function AppContent() {
  const { logout } = useAuth();
  const isAdminView = useAdminRoute();
  const { matches, loading, error, lastUpdated, refresh } = useMatches();
  const { setIsOpen: openTrade } = useTrade();
  const {
    connected,
    balance,
    connect,
    setShowDeposit,
    showConnect,
    setShowConnect,
    showDeposit,
  } = useWallet();
  const [filter, setFilter] = useState({ status: "all", group: "all", search: "" });

  const counts = useMemo(() => {
    const tallies = { all: matches.length, live: 0, upcoming: 0, finished: 0 };
    matches.forEach((m) => {
      const s = getMatchStatus(m);
      if (s === STATUS.LIVE) tallies.live += 1;
      else if (s === STATUS.UPCOMING) tallies.upcoming += 1;
      else tallies.finished += 1;
    });
    return tallies;
  }, [matches]);

  const filtered = useMemo(() => filterMatches(matches, filter), [matches, filter]);
  const trending = useMemo(() => getTrendingMarkets(matches), [matches]);

  if (isAdminView) {
    return (
      <AdminDashboard
        onBack={() => {
          window.location.hash = "";
        }}
      />
    );
  }

  return (
    <div className="pm-app">
      <header className="pm-header">
        <div className="pm-header__inner">
          <a className="pm-brand" href="#top">
            <span className="pm-brand__icon">◆</span>
            <span>
              <strong>{SITE.name}</strong>
              <small>Prediction Markets</small>
            </span>
          </a>

          <div className="pm-header__search">
            <input
              type="search"
              placeholder="Search World Cup markets…"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </div>

          <nav className="pm-header__nav">
            <a href="#markets">Markets</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#wallet">Wallet</a>
            <a href="#admin">Admin</a>
          </nav>

          <div className="pm-header__actions">
            <button type="button" className="btn btn-ghost desktop-only" onClick={() => openTrade(true)}>
              Trade
            </button>
            <button type="button" className="btn btn-ghost" onClick={logout} title="Logout">
              Logout
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => (connected ? setShowDeposit(true) : connect())}
            >
              {connected ? formatCurrency(balance) : "Connect"}
            </button>
          </div>
        </div>
      </header>

      <FundWalletModal open={showConnect} onClose={() => setShowConnect(false)} mode="connect" />
      <FundWalletModal open={showDeposit} onClose={() => setShowDeposit(false)} mode="deposit" />

      <main className="pm-main" id="top">
        <div className="pm-hero">
          <div>
            <p className="pm-hero__eyebrow">FIFA World Cup 2026 · {SITE.hosts}</p>
            <h1>Predict every match. Trade live probabilities.</h1>
            <p className="pm-hero__sub">
              Polymarket-style markets with live scores, portfolio tracking, and crypto funding.
              {lastUpdated && ` Updated ${lastUpdated.toLocaleTimeString()}.`}
            </p>
          </div>
          <div className="pm-hero__stats">
            <div><strong>{counts.all}</strong><span>Markets</span></div>
            <div><strong>{counts.live}</strong><span>Live</span></div>
            <div><strong>{counts.upcoming}</strong><span>Upcoming</span></div>
          </div>
        </div>

        <TrendingMarkets markets={trending} />

        <div className="pm-layout">
          <div className="pm-layout__main">
            <MarketFilters filter={filter} onChange={setFilter} counts={counts} />
            <MarketList matches={filtered} loading={loading} error={error} onRetry={refresh} />
            <div className="pm-mobile-side">
              <PortfolioPanel />
              <BreakingFeed matches={matches} />
            </div>
            <div id="wallet">
              <WalletPanel />
            </div>
          </div>

          <aside className="pm-layout__side desktop-only">
            <TradeSlip />
            <div id="portfolio">
              <PortfolioPanel />
            </div>
            <BreakingFeed matches={matches} />
          </aside>
        </div>
      </main>

      <TradeSlip mobile />
      <Footer />
    </div>
  );
}

function ProtectedApp() {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <LoginGate />;
  }

  return (
    <WalletProvider>
      <TradeProvider>
        <AppContent />
      </TradeProvider>
    </WalletProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  );
}
