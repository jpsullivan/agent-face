import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IntlProvider } from "react-intl";
import { markPageInteractive } from "@/face/renderer-loader";
import { App } from "./App";
import "./styles.css";

// The renderer loader otherwise waits up to 10s for the app's "interactive" mark.
markPageInteractive();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IntlProvider locale="en" defaultLocale="en">
      <App />
    </IntlProvider>
  </StrictMode>,
);
