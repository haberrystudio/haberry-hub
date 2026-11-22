"use client";

import { useState } from "react";
import { signOut } from "./sign-out";

interface MetricCard {
  title: string;
  subtitle: string;
  amount: string;
  change: string;
  changeType: "positive" | "negative";
  trend: "up" | "down";
}

interface WalletItem {
  id: string;
  currency: string;
  countryCode: string;
  symbol: string;
  amount: string;
  limit: string;
  status: "Active" | "Inactive";
}

interface ChartBar {
  month: string;
  height: number;
  value: number;
  active?: boolean;
}

interface ActivityItem {
  id: string;
  activity: string;
  icon: string;
  orderId: string;
  date: string;
  time: string;
  price: string;
  status: string;
}

interface DashboardProps {
  overview: {
    email: string;
    adminCount: number;
    metrics: {
      balance: MetricCard;
      savings: MetricCard;
      investments: MetricCard;
    };
    wallets: WalletItem[];
    cashFlow: {
      total: string;
      period: string;
      currency: string;
      highlight: {
        date: string;
        cashflow: string;
        inflow: string;
      };
      chartData: ChartBar[];
    };
    recentActivities: ActivityItem[];
  };
}

export function DashboardView({ overview }: DashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"Monthly" | "Yearly">("Yearly");
  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(2); // March by default
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("This Month");
  const [activeNav, setActiveNav] = useState("Dashboard");

  const filteredActivities = overview.recentActivities.filter(
    (act) =>
      act.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeBar = overview.cashFlow.chartData[activeMonthIndex] || overview.cashFlow.chartData[2];

  return (
    <div className="dashboard-container">
      {/* LEFT SIDEBAR */}
      <aside className="dashboard-sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo-glow">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="brand-title">Haberry</span>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="sidebar-search-input"
          />
          <kbd className="sidebar-kbd">⌘K</kbd>
        </div>

        {/* Main Nav */}
        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveNav("Dashboard")}
            className={`nav-item ${activeNav === "Dashboard" ? "nav-item-active" : ""}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveNav("Analytics")}
            className={`nav-item ${activeNav === "Analytics" ? "nav-item-active" : ""}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Analytics</span>
            <span className="nav-badge">20</span>
          </button>

          <button
            onClick={() => setActiveNav("Transactions")}
            className={`nav-item ${activeNav === "Transactions" ? "nav-item-active" : ""}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Transactions</span>
          </button>

          <button
            onClick={() => setActiveNav("Invoices")}
            className={`nav-item ${activeNav === "Invoices" ? "nav-item-active" : ""}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Invoices</span>
          </button>

          {/* Section: Features */}
          <div className="sidebar-section-label">FEATURES</div>

          <button
            onClick={() => setActiveNav("Recurring")}
            className={`nav-item ${activeNav === "Recurring" ? "nav-item-active" : ""}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Recurring</span>
            <span className="nav-badge">16</span>
          </button>

          <button
            onClick={() => setActiveNav("Subscriptions")}
            className={`nav-item ${activeNav === "Subscriptions" ? "nav-item-active" : ""}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Subscriptions</span>
          </button>

          <button
            onClick={() => setActiveNav("Feedback")}
            className={`nav-item ${activeNav === "Feedback" ? "nav-item-active" : ""}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Feedback</span>
          </button>
        </nav>

        {/* Upgrade Card at Bottom */}
        <div className="upgrade-card">
          <div className="flex items-center gap-1.5 font-semibold text-white text-sm">
            <span>Upgrade Pro!</span>
            <span>👑</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Higher productivity with better organization
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button className="upgrade-btn">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Upgrade</span>
            </button>
            <button className="text-xs text-zinc-400 hover:text-white transition">
              Learn more
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="dashboard-main">
        {/* TOP BAR */}
        <header className="dashboard-topbar">
          {/* Breadcrumb & History */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button className="topbar-icon-btn">
                <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="topbar-icon-btn">
                <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-zinc-400 flex items-center gap-1.5">
              <span>Haberry</span>
              <span className="text-zinc-600">&gt;</span>
              <span className="text-zinc-200 font-medium">Dashboard</span>
            </div>
          </div>

          {/* Right Topbar Icons */}
          <div className="flex items-center gap-3">
            <button title="Help & Documentation" className="topbar-circle-btn">
              <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button title="Messages" className="topbar-circle-btn">
              <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button title="Notifications" className="topbar-circle-btn relative">
              <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-2 right-2 border-2 border-zinc-900" />
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-1">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  {overview.email.charAt(0).toUpperCase()}
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-zinc-900" />
              </div>
            </div>

            {/* Share / Action Button */}
            <button className="share-btn">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </button>

            {/* Sign Out */}
            <form action={signOut}>
              <button
                type="submit"
                title="Sign out of Super Admin"
                className="topbar-circle-btn hover:text-red-400 hover:border-red-500/30 transition"
              >
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </form>
          </div>
        </header>

        {/* CONTENT BODY */}
        <main className="dashboard-content">
          {/* Overview Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
              <p className="text-xs text-zinc-400 mt-0.5">Here is the summary of overall data</p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <button
                  onClick={() => setTimeFilter(timeFilter === "This Month" ? "All Time" : "This Month")}
                  className="dropdown-pill"
                >
                  <span>{timeFilter}</span>
                  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => {
                  setActiveMonthIndex(2);
                  setSearchQuery("");
                }}
                className="reset-btn"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset Data</span>
              </button>
            </div>
          </div>

          {/* TOP 3 STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Card 1: Orange Gradient (My Balance) */}
            <div className="stat-card-orange">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="stat-icon-wrapper-orange">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{overview.metrics.balance.title}</h3>
                    <p className="text-[11px] text-orange-100/80">{overview.metrics.balance.subtitle}</p>
                  </div>
                </div>
                <button className="text-white/70 hover:text-white transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </div>

              <div className="mt-5 flex items-baseline gap-2.5">
                <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {overview.metrics.balance.amount}
                </span>
                <span className="stat-pill-orange">
                  {overview.metrics.balance.change} ↑
                </span>
              </div>

              <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/90 font-medium">
                <span>See details</span>
                <span>→</span>
              </div>
            </div>

            {/* Card 2: Savings Account */}
            <div className="stat-card-dark">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="stat-icon-wrapper-dark">
                    <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{overview.metrics.savings.title}</h3>
                    <p className="text-[11px] text-zinc-400">{overview.metrics.savings.subtitle}</p>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-zinc-300 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </div>

              <div className="mt-5 flex items-baseline gap-2.5">
                <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {overview.metrics.savings.amount}
                </span>
                <span className="stat-pill-dark text-amber-400">
                  {overview.metrics.savings.change} ↑
                </span>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 hover:text-zinc-200 transition font-medium">
                <span>View summary</span>
                <span>→</span>
              </div>
            </div>

            {/* Card 3: Investment Portfolio */}
            <div className="stat-card-dark">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="stat-icon-wrapper-dark">
                    <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{overview.metrics.investments.title}</h3>
                    <p className="text-[11px] text-zinc-400">{overview.metrics.investments.subtitle}</p>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-zinc-300 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </div>

              <div className="mt-5 flex items-baseline gap-2.5">
                <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {overview.metrics.investments.amount}
                </span>
                <span className="stat-pill-dark text-orange-400">
                  {overview.metrics.investments.change} ↑
                </span>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 hover:text-zinc-200 transition font-medium">
                <span>Analyze performance</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: 2 COLUMNS (My Wallet & Cash Flow) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
            {/* Left Column: My Wallet (5 cols) */}
            <div className="lg:col-span-5 panel-card">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-base font-bold text-white">My Wallet</h2>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Today 1 USD = 122.20 BDT</p>
                </div>
                <button className="add-wallet-btn">
                  <span>+ Add New</span>
                </button>
              </div>

              {/* 2x2 Wallet Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {overview.wallets.map((wallet) => (
                  <div key={wallet.id} className="wallet-mini-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">
                          {wallet.countryCode === "US" ? "🇺🇸" :
                           wallet.countryCode === "EU" ? "🇪🇺" :
                           wallet.countryCode === "AU" ? "🇦🇺" : "🇬🇧"}
                        </span>
                        <span className="text-xs font-semibold text-zinc-200">{wallet.currency}</span>
                      </div>
                      <button className="text-zinc-500 hover:text-zinc-300">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-3">
                      <div className="text-sm font-bold text-white tracking-tight">{wallet.amount}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{wallet.limit}</div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                      <span className={`text-[10px] font-medium ${wallet.status === "Active" ? "text-orange-400" : "text-zinc-500"}`}>
                        {wallet.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Cash Flow (7 cols) */}
            <div className="lg:col-span-7 panel-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xs font-medium text-zinc-400">Cash Flow</h2>
                    <div className="text-2xl font-extrabold text-white mt-1 tracking-tight">
                      {overview.cashFlow.total}
                    </div>
                  </div>
                  <div className="period-toggle">
                    <button
                      onClick={() => setSelectedPeriod("Monthly")}
                      className={`period-toggle-btn ${selectedPeriod === "Monthly" ? "period-toggle-active" : ""}`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setSelectedPeriod("Yearly")}
                      className={`period-toggle-btn ${selectedPeriod === "Yearly" ? "period-toggle-active" : ""}`}
                    >
                      • Yearly
                    </button>
                  </div>
                </div>

                {/* Bar Chart Container */}
                <div className="relative mt-8 pt-4 pb-2">
                  {/* Floating Tooltip over Active Bar */}
                  <div
                    className="chart-tooltip"
                    style={{
                      left: `${(activeMonthIndex / (overview.cashFlow.chartData.length - 1)) * 80 + 8}%`,
                    }}
                  >
                    <div className="text-[10px] font-semibold text-zinc-400">{overview.cashFlow.highlight.date}</div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      Cashflow <span className="text-zinc-200">{overview.cashFlow.highlight.cashflow}</span>
                    </div>
                    <div className="text-[10px] font-medium text-zinc-400">
                      Inflow <span className="text-zinc-300">{overview.cashFlow.highlight.inflow}</span>
                    </div>
                  </div>

                  {/* Bars */}
                  <div className="h-44 flex items-end justify-between px-3 gap-3">
                    {overview.cashFlow.chartData.map((item, idx) => {
                      const isCurrent = idx === activeMonthIndex;
                      return (
                        <div
                          key={item.month}
                          onClick={() => setActiveMonthIndex(idx)}
                          className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                        >
                          <div
                            style={{ height: `${item.height}%` }}
                            className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 relative ${
                              isCurrent
                                ? "bg-gradient-to-t from-orange-600 via-orange-500 to-amber-400 shadow-lg shadow-orange-500/30"
                                : "bg-zinc-800/80 group-hover:bg-zinc-700/80"
                            }`}
                          >
                            {/* Apex dot for active bar */}
                            {isCurrent && (
                              <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-orange-500 absolute -top-1.5 left-1/2 -translate-x-1/2 shadow" />
                            )}
                          </div>
                          <span
                            className={`text-[11px] mt-2 font-medium transition ${
                              isCurrent ? "text-orange-400 font-semibold" : "text-zinc-500 group-hover:text-zinc-300"
                            }`}
                          >
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: RECENT ACTIVITIES */}
          <div className="panel-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-bold text-white">Recent Activities</h2>
              <div className="flex items-center gap-2">
                <div className="table-search">
                  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="table-search-input"
                  />
                </div>
                <button className="table-filter-btn">
                  <span>Filter</span>
                  <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-medium">
                    <th className="py-2.5 px-3 w-8">
                      <input type="checkbox" className="table-checkbox" />
                    </th>
                    <th className="py-2.5 px-3">Activity</th>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((row) => (
                      <tr key={row.id} className="hover:bg-zinc-800/30 transition group">
                        <td className="py-3 px-3">
                          <input type="checkbox" className="table-checkbox" />
                        </td>
                        <td className="py-3 px-3 font-semibold text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="activity-icon-badge">
                              {row.icon === "adobe" && (
                                <span className="font-extrabold text-orange-400 text-xs">A</span>
                              )}
                              {row.icon === "plane" && (
                                <svg className="w-3.5 h-3.5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                              )}
                              {row.icon === "server" && (
                                <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                </svg>
                              )}
                              {row.icon === "monitor" && (
                                <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>
                            <span>{row.activity}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-zinc-400 font-mono">{row.orderId}</td>
                        <td className="py-3 px-3 text-zinc-300">{row.date}</td>
                        <td className="py-3 px-3 text-zinc-400">{row.time}</td>
                        <td className="py-3 px-3 font-semibold text-white">{row.price}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              row.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                row.status === "Completed" ? "bg-emerald-400" : "bg-amber-400"
                              }`}
                            />
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button className="text-zinc-500 hover:text-zinc-200">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-zinc-500">
                        No activities found matching &quot;{searchQuery}&quot;
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
