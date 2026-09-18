import { PreferencesProvider } from './context/PreferencesContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <PreferencesProvider>
      <AppRoutes />
    </PreferencesProvider>
  );
}

export default App;
