/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import AuthProvider from "./AuthProvider";
import { persistor, store } from "../redux/store";

const ReduxProvider = ({ children }) => {
  const [isRendering, setIsRendering] = useState(false);
  useEffect(() => {
    setIsRendering(true);
  }, []);
  if (!isRendering) {
    return "";
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster position="top-center" richColors={true} />
        <AuthProvider>{children}</AuthProvider>
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
