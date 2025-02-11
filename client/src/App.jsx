import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomeView from "./views/HomeView";
import LoginView from "./views/LoginView";
import RegistrationView from "./views/RegistrationView";
// import Dashboard from "./views/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ReduxProvider from "./components/ReduxProvider";
import Dashboard from "./views/Dashboard";

function App() {
  return (
    <ReduxProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/*" element={<HomeView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegistrationView />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ReduxProvider>
  );
}

export default App;
