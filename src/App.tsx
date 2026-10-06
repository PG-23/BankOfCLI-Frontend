import { useState } from "react";
import Navbar from "./components/Navbar";


function App() {
  const [activeView, setActiveView] = useState("dashboard");
  return (
    <div>
      <Navbar activeView={activeView} onNavigate={setActiveView} />
     

      
      
    </div>
  );
}

export default App;