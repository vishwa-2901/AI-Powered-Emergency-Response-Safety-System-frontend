import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, BellRing, ClipboardList, LayoutDashboard, LogOut, ShieldAlert, Users, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'ADMIN'
    ? [['/dashboard','Dashboard',LayoutDashboard],['/history','Incidents',ClipboardList],['/admin','Admin Panel',Users]]
    : user?.role === 'RESPONDER'
      ? [['/dashboard','Dashboard',LayoutDashboard],['/history','My Incidents',ClipboardList],['/responder','Responder',ShieldAlert]]
      : [['/dashboard','Dashboard',LayoutDashboard],['/history','My History',ClipboardList]];

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><ShieldAlert size={24}/></div><div><b>SafePulse</b><span>Emergency AI</span></div></div>
      <nav>{links.map(([to,label,Icon]) => <NavLink key={to} to={to} className={({isActive})=>isActive?'active':''}><Icon size={19}/>{label}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="user-mini"><div className="avatar"><UserRound size={17}/></div><div><strong>{user?.name || 'User'}</strong><span>{user?.role || 'USER'}</span></div></div><button className="logout" onClick={()=>{logout();navigate('/login')}}><LogOut size={18}/> Logout</button></div>
    </aside>
    <main className="main"><header className="topbar"><div><span className="eyebrow"><Activity size={14}/> LIVE SAFETY NETWORK</span><h1>Emergency Response Center</h1></div><div className="top-actions"><span className="online-dot">System online</span><BellRing size={20}/></div></header><div className="content"><Outlet/></div></main>
  </div>;
}
