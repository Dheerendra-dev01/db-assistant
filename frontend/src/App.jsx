import React, { useState } from "react";
import Navigation from "./components/ui/navigation";
import Dashboard from "./components/page/dashboard";
import NaturalLanguageSQLQuery from "./components/page/sql";
import NaturalLanguageMongoQuery from "./components/page/mongo";
import Analytics from "./components/page/analytics";
import Workspace from "./components/page/workspace";
import QueryHistory from "./components/page/history";
import DatabaseManagement from "./components/page/manage";
import Enterprise from "./components/page/enterprise";
import SettingsPage from "./components/page/settings";
import HelpPage from "./components/page/help";

import "./index.css";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "sql":
        return <NaturalLanguageSQLQuery />;
      case "mongo":
        return <NaturalLanguageMongoQuery />;
      case "analytics":
        return <Analytics />;
      case "workspace":
        return <Workspace />;
      case "history":
        return <QueryHistory />;
      case "manage":
        return <DatabaseManagement />;
      case "enterprise":
        return <Enterprise />;
      case "settings":
        return <SettingsPage />;
      case "help":
        return <HelpPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
