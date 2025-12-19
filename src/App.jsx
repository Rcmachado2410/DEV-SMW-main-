import AppRoutes from "./routes/AppRoutes";
import { WmsProvider } from "./components/contexts/WmsContext";

export default function App() {
  return (
    <WmsProvider>
      <AppRoutes />
    </WmsProvider>
  );
}
