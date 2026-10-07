import 'bootstrap-icons/font/bootstrap-icons.css';
import { NavLink } from 'react-router';

// Each button goes to a URL; React Router knows which one is active
const VIEWS = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/deposit', label: 'Deposit' },
  { path: '/withdraw', label: 'Withdraw' },
  { path: '/transfer', label: 'Transfer' },
];

function Navbar() {
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
          <NavLink
            key={v.path}
            to={v.path}
            // NavLink passes isActive = true when the URL matches this link
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive ? 'bg-white text-primary' : 'text-white hover:bg-white/20'
              }`
            }
          >
            {v.label}
          </NavLink>
        ))}
      </div>

      {/* RIGHT: profile (later) */}
      <div>
        {/* profile dropdown goes here */}
      </div>
    </nav>
  );
}

export default Navbar;
