import 'bootstrap-icons/font/bootstrap-icons.css';
function NavButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        isActive ? "bg-white text-primary" : "text-white hover:bg-white/20"
      }`}
    >
      {label}
    </button>
  );
}

const VIEWS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "deposit", label: "Deposit" },
  { id: "withdraw", label: "Withdraw" },
  { id: "transfer", label: "Transfer" },
  { id: "statements", label: "Statements" },
];

function Navbar({ activeView, onNavigate }: { activeView: string; onNavigate: (view: string) => void }) {
  return (
    


    <nav className="bg-primary text-white flex items-center justify-between px-4 py-2">
  {/* LEFT: logo */}
  <div className="flex items-center gap-3">
  <div className="bg-white text-primary w-12 h-12 rounded-xl flex items-center justify-center">
    <i className="bi bi-bank text-3xl"></i>
  </div>
  <p className="font-bold text-lg">BANK OF CLI</p>
</div>

  {/* CENTER: buttons */}
  <div className="flex items-center gap-1">
     {VIEWS.map((v) => (
    <NavButton key={v.id} label={v.label} isActive={activeView === v.id} onClick={() => onNavigate(v.id)} />
     ))}
    
    {/* your four/five buttons */}
  </div>

  {/* RIGHT: profile (later) */}
  <div>
    {/* profile dropdown goes here */}
  </div>
</nav>

  );
}
export default Navbar;
