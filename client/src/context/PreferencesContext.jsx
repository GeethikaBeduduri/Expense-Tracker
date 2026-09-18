import { createContext, useContext, useState, useEffect } from 'react';

const PreferencesContext = createContext();

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
};

export const DATE_FORMATS = {
  'DD MMM YYYY': '18 Sep 2026',
  'YYYY-MM-DD': '2026-09-18',
  'MM/DD/YYYY': '09/18/2026',
};

export function PreferencesProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('et_currency') || 'INR';
  });

  const [dateFormat, setDateFormat] = useState(() => {
    return localStorage.getItem('et_date_format') || 'DD MMM YYYY';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('et_theme') || 'dark';
  });

  // Sync theme with DOM document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('et_theme', theme);
  }, [theme]);

  // Persist currency and date format
  useEffect(() => {
    localStorage.setItem('et_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('et_date_format', dateFormat);
  }, [dateFormat]);

  const activeCurrency = CURRENCIES[currency] || CURRENCIES.INR;

  const formatAmount = (val) => {
    const num = Number(val) || 0;
    return `${activeCurrency.symbol}${num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';

    if (dateFormat === 'YYYY-MM-DD') {
      return d.toISOString().split('T')[0];
    }
    if (dateFormat === 'MM/DD/YYYY') {
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${month}/${day}/${d.getFullYear()}`;
    }

    // Default: 'DD MMM YYYY'
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <PreferencesContext.Provider
      value={{
        currency,
        setCurrency,
        currencies: CURRENCIES,
        currentCurrency: activeCurrency,
        currencySymbol: activeCurrency.symbol,
        formatAmount,
        dateFormat,
        setDateFormat,
        dateFormats: DATE_FORMATS,
        formatDate,
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
