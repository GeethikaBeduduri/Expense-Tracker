import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
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
    if (theme === 'dark') {
      toggleTheme();
    }
    showToast('Preferences restored to system defaults.');
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
        subtitle="Manage your personal finance currency, regional date formatting, appearance, and system status."
      />

      {/* Grid of Settings sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Regional & Financial Formatting */}
        <div className="card space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-100 dark:border-surface-800">
            <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Financial Formatting</h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">Default currency symbol and display standards</p>
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
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary-600 dark:border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 text-primary-900 dark:text-primary-200 ring-2 ring-primary-500/20'
                        : 'border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 text-surface-700 dark:text-surface-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{config.symbol} {code}</div>
                      <div className="text-[11px] text-surface-500 dark:text-surface-400">{config.name}</div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
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
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary-600 dark:border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 text-primary-900 dark:text-primary-200 ring-2 ring-primary-500/20'
                        : 'border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 text-surface-700 dark:text-surface-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-surface-400" />
                      <div>
                        <div className="text-xs font-semibold">{code}</div>
                        <div className="text-[11px] text-surface-500 dark:text-surface-400">Sample: {label}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Appearance & Theme */}
        <div className="card space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-100 dark:border-surface-800">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Interface Appearance</h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">Switch between light and high-contrast dark theme</p>
            </div>
          </div>

          <div>
            <label className="form-label mb-2 block">Theme Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') toggleTheme();
                  showToast('Switched to Light Mode');
                }}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'border-primary-600 bg-primary-50/40 text-primary-900 ring-2 ring-primary-500/20'
                    : 'border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 text-surface-600 dark:text-surface-400'
                }`}
              >
                <Sun className="w-6 h-6 text-amber-500" />
                <span className="text-xs font-bold">Light Mode</span>
                <span className="text-[10px] text-surface-400">Crisp & Modern</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') toggleTheme();
                  showToast('Switched to Dark Mode');
                }}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'border-primary-500 bg-primary-950/40 text-primary-200 ring-2 ring-primary-500/20'
                    : 'border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 text-surface-600 dark:text-surface-400'
                }`}
              >
                <Moon className="w-6 h-6 text-indigo-400" />
                <span className="text-xs font-bold">Dark Mode</span>
                <span className="text-[10px] text-surface-400">Deep Slate FinTech</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200 dark:border-surface-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-surface-800 dark:text-surface-200">
              <Zap className="w-4 h-4 text-primary-500" />
              Automated Persistence
            </div>
            <p className="text-[11px] text-surface-500 dark:text-surface-400 leading-relaxed">
              Your preferences for currency, date formats, and theme are stored in your browser's local state and persist across page reloads and sessions.
            </p>
          </div>
        </div>

        {/* Section 3: Data Management & Export */}
        <div className="card space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-100 dark:border-surface-800">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Data & Export</h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">Export financial records or view reports</p>
            </div>
          </div>

          <p className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed">
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
              className="btn-secondary text-xs justify-center text-surface-600 dark:text-surface-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Preferences
            </button>
          </div>
        </div>

        {/* Section 4: System Diagnostics */}
        <div className="card space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-surface-100 dark:border-surface-800">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100">System Diagnostics</h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">Core backend infrastructure telemetry</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-50 dark:bg-surface-800/40 border border-surface-100 dark:border-surface-800 text-xs">
              <span className="text-surface-600 dark:text-surface-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                API Gateway
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Online · Express.js</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-50 dark:bg-surface-800/40 border border-surface-100 dark:border-surface-800 text-xs">
              <span className="text-surface-600 dark:text-surface-400 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-surface-400" />
                Database Engine
              </span>
              <span className="font-semibold text-surface-900 dark:text-surface-100">MongoDB (Local Cluster)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-50 dark:bg-surface-800/40 border border-surface-100 dark:border-surface-800 text-xs">
              <span className="text-surface-600 dark:text-surface-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-surface-400" />
                Data Integrity
              </span>
              <span className="font-semibold text-surface-900 dark:text-surface-100">Mongoose Schema Validated</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
