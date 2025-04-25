import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ChatProvider from "./context/ChatContext";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <ChatProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ChatProvider>
  );
};

export default App;