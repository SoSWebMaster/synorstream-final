// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AudioProvider } from "./context/AudioContext.tsx";
import { store, persistorStore } from "./store/index.tsx";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
   // <React.StrictMode>

   <Provider store={store}>
      <PersistGate loading={null} persistor={persistorStore}>
         <ToastContainer />
         <AudioProvider>
            <App />
         </AudioProvider>
      </PersistGate>
   </Provider>

   // {/* </React.StrictMode> */}
);
