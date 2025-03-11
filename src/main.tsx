import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { OktoProvider } from "@okto_web3/react-sdk";
import { OktoClientConfig } from '@okto_web3/core-js-sdk';

const config: OktoClientConfig = {
    environment: "sandbox",
    clientPrivateKey: import.meta.env.VITE_CLIENT_PRIV_KEY,
    clientSWA: import.meta.env.VITE_CLIENT_SWA,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <OktoProvider config={config}>
                <App />
            </OktoProvider>
        </GoogleOAuthProvider>
    </React.StrictMode>
);