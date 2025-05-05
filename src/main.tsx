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

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Welcome />} />
            <Route path="chat/:userId" element={<ChatWindow />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
