import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import store from './store/store.ts'
import { Provider } from 'react-redux'
import { ClerkProvider } from "@clerk/clerk-react";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log(PUBLISHABLE_KEY,'clerk publishable key');

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },

        variables: {
          colorPrimary: "#EC9700",
          colorText: "black",
        },
        signUp: {
          variables: {
            fontSize: "1rem",
            fontWeight: {
              bold: 700,
            },
          },
        },
        signIn: {
          variables: {
            fontSize: "1rem",
            fontWeight: {
              bold: 700,
            },
          },
        },
      }}
    >
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ClerkProvider>
  </StrictMode>
);
