import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Coins, 
  Calendar, 
  Moon, 
  Sun, 
  Database, 
  FileSpreadsheet, 
  RotateCcw, 
  CheckCircle2, 
  Server, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Toast from '../components/Toast.jsx';

export default function Settings() {
  const {
    currency,
    setCurrency,
    currencies,
    dateFormat,
    setDateFormat,
    dateFormats,
    theme,
    toggleTheme,
  } = usePreferences();

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  const handleReset = () => {
    setCurrency('INR');
    setDateFormat('DD MMM YYYY');
    if (theme === 'light') {
      toggleTheme();
    }
    showToast('Preferences restored to default dark fintech mode.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <PageHeader
        breadcrumb="Preferences"
        title="Settings & Workspace"
        subtitle="Manage your personal finance currency standards, regional date formatting, and system diagnostics."
      />

      {/* Grid of Settings sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Regional & Financial Formatting */}
        <div className="bg-[#0e111a] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Financial Standards</h2>
              <p className="text-xs text-surface-400">Display currency and ledger notation</p>
            </div>
          </div>

          <div>
            <label className="form-label mb-2 block">Display Currency</label>
            <div className="grid grid-cols-2 gap-2.5">
              {Object.entries(currencies).map(([code, config]) => {
                const isSelected = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setCurrency(code);
                      showToast(`Currency changed to ${config.name} (${config.symbol})`);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-500'
                        : 'border-white/[0.08] hover:bg-white/[0.04] text-surface-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-black font-mono">{config.symbol} {code}</div>
                      <div className="text-[11px] text-surface-400">{config.name}</div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="form-label mb-2 block">Date Format</label>
            <div className="space-y-2">
              {Object.entries(dateFormats).map(([code, label]) => {
                const isSelected = dateFormat === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setDateFormat(code);
                      showToast(`Date format set to ${code}`);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-500'
                        : 'border-white/[0.08] hover:bg-white/[0.04] text-surface-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-surface-400" />
                      <div>
                        <div className="text-xs font-bold font-mono">{code}</div>
                        <div className="text-[11px] text-surface-400">Sample: {label}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Appearance & Theme */}
        <div className="bg-[#0e111a] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Interface Theme</h2>
              <p className="text-xs text-surface-400">High-contrast dark fintech visual system</p>
            </div>
          </div>

          <div>
            <label className="form-label mb-2 block">Current Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') toggleTheme();
                  showToast('Dark Mode is the active default theme');
                }}
                className="p-4 rounded-2xl border border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-500 flex flex-col items-center justify-center gap-2 transition-all"
              >
                <Moon className="w-6 h-6 text-indigo-400" />
                <span className="text-xs font-bold">Dark Mode</span>
                <span className="text-[10px] text-indigo-300">Default Fintech</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') toggleTheme();
                  showToast('Switched to Light Mode');
                }}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-500'
                    : 'border-white/[0.08] hover:bg-white/[0.04] text-surface-400'
                }`}
              >
                <Sun className="w-6 h-6 text-amber-400" />
                <span className="text-xs font-bold">Light Mode</span>
                <span className="text-[10px] text-surface-500">Daytime Contrast</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Zap className="w-4 h-4 text-indigo-400" />
              Automated Persistence
            </div>
            <p className="text-[11px] text-surface-400 leading-relaxed">
              Your preferences for currency, date formats, and theme are stored in your browser's local state and persist across page reloads and sessions.
            </p>
          </div>
        </div>

        {/* Section 3: Data Management & Export */}
        <div className="bg-[#0e111a] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Data & Export</h2>
              <p className="text-xs text-surface-400">Export financial records or view reports</p>
            </div>
          </div>

          <p className="text-xs text-surface-400 leading-relaxed">
            Download your full transaction history anytime formatted as standardized CSV files compatible with Microsoft Excel, Apple Numbers, and Google Sheets.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Link
              to="/reports"
              className="btn-primary text-xs justify-center"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Open Reports & Export
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary text-xs justify-center text-surface-400 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Preferences
            </button>
          </div>
        </div>

        {/* Section 4: System Diagnostics */}
        <div className="bg-[#0e111a] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">System Telemetry</h2>
              <p className="text-xs text-surface-400">Core backend infrastructure status</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs">
              <span className="text-surface-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                API Gateway
              </span>
              <span className="font-bold text-emerald-400">Online · Express.js</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs">
              <span className="text-surface-400 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                Database Engine
              </span>
              <span className="font-bold text-white">MongoDB (Live Cluster)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs">
              <span className="text-surface-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Data Integrity
              </span>
              <span className="font-bold text-white">Mongoose Schema Validated</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
