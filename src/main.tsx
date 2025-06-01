import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout.tsx";
import Welcome from "./components/Welcome.tsx";
import ChatWindow from "./components/ChatWindow.tsx";
import Settings from "./components/Settings.tsx";
import Profile from "./components/Profile.tsx";
import LoginPage from "./components/LoginPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Contacts } from "./components/Contacts.tsx";
import ContactsLayout from "./layouts/ContactsLayout.tsx";
import About from "./components/About.tsx";
import SignupPage from "./components/SignupPage.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Welcome />} />
              <Route path="chat/:chatId" element={<ChatWindow />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="/about/:userId" element={<About />} />{" "}
            </Route>
            <Route path="/contacts" element={<ContactsLayout />}>
              <Route index element={<Contacts />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
