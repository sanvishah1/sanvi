import { Link, Outlet } from "react-router-dom";
import { HomeIcon, CalendarIcon, CheckCircleIcon, AcademicCapIcon, SparklesIcon } from '@heroicons/react/24/outline';

function Layout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-48 bg-gradient-to-b from-pink-500 to-purple-500 text-white p-4 space-y-4 font-semibold text-lg">
        <div className="text-2xl font-bold mb-6">Sanvi OS 💖</div>
        <nav className="flex flex-col gap-4 text-lg">
            <Link to="/" className="flex items-center gap-2 hover:text-pink-400">
                <HomeIcon className="h-5 w-5" />
                To-do
            </Link>
            <Link to="/habits" className="flex items-center gap-2 hover:text-pink-400">
                <CheckCircleIcon className="h-5 w-5" />
                Habits
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 hover:text-pink-400">
                <AcademicCapIcon className="h-5 w-5" />
                Academics
            </Link>
            <Link to="/planner" className="flex items-center gap-2 hover:text-pink-400">
                <CalendarIcon className="h-5 w-5" />
                Planner
            </Link>
            <Link to="/vision-vault" className="flex items-center gap-2 hover:text-pink-400">
              <SparklesIcon className="h-5 w-5" />
              Vision Vault
            </Link>

        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-10 bg-pink-50 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
