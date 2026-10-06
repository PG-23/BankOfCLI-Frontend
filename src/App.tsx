import { useState } from "react";
import Navbar from "./components/Navbar";
import Deposit from "./components/Deposit";

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  return (
    <div>
      <Navbar activeView={activeView} onNavigate={setActiveView} />
      {activeView === "deposit" && <Deposit />}

      
      <Deposit />
    </div>
  );
}

export default App;