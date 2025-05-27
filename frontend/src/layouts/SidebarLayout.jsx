// src/layouts/SidebarLayout.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import {
  Home, User, Shield, Ambulance, Banknote, LineChart
} from "lucide-react";

const PSO_ROLE_IDS = ["1372312806220890247", "1370878407856099408"];
const SAFR_ROLE_IDS = ["1372312806220890246", "1370878410364162058"];

const SidebarLayout = ({ children, roles }) => {
  const location = useLocation();
  const [showPSO, setShowPSO] = useState(false);
  const [showSAFR, setShowSAFR] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isPSO = roles.some((id) => PSO_ROLE_IDS.includes(id));
  const isSAFR = roles.some((id) => SAFR_ROLE_IDS.includes(id));

  return (
    <div className="flex h-screen text-white bg-gray-900">
      <aside className="w-60 bg-[#1f2937] px-4 py-5 overflow-y-auto border-r border-gray-700">
        <div className="flex justify-center mb-4">
          <img src="/prime-logo.png" alt="Prime RP Logo" className="h-14 object-contain" />
        </div>

        {/* MAIN */}
        <nav className="flex flex-col space-y-2 mb-3">
          <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium ${isActive("/dashboard") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}><Home className="w-4 h-4" /> Home</Link>
          <Link to="/dashboard/civilian" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium ${isActive("/dashboard/civilian") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}><User className="w-4 h-4" /> Civilian</Link>
        </nav>

        {/* PUBLIC SAFETY Dropdown */}
        {isPSO && (
          <div className="mb-3">
            <button onClick={() => setShowPSO(!showPSO)} className="flex items-center justify-between w-full px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Public Safety</span>
              {showPSO ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
            </button>
            {showPSO && (
              <nav className="flex flex-col space-y-1 mt-1 ml-3">
                <Link to="/dashboard/pso" className={`text-sm px-3 py-1.5 rounded-md ${isActive("/dashboard/pso") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>Dashboard</Link>
                <Link to="/dashboard/pso/search" className={`text-sm px-3 py-1.5 rounded-md ${isActive("/dashboard/pso/search") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>Search Database</Link>
                <Link to="/dashboard/pso/reports" className={`text-sm px-3 py-1.5 rounded-md ${isActive("/dashboard/pso/reports") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>Reports</Link>
                <Link to="/dashboard/pso/warrants" className={`text-sm px-3 py-1.5 rounded-md ${isActive("/dashboard/pso/warrants") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>Warrants</Link>
              </nav>
            )}
          </div>
        )}

        {/* SA FIRE RESCUE Dropdown */}
        {isSAFR && (
          <div className="mb-3">
            <button onClick={() => setShowSAFR(!showSAFR)} className="flex items-center justify-between w-full px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-md">
              <span className="flex items-center gap-2"><Ambulance className="w-4 h-4" /> SA Fire Rescue</span>
              {showSAFR ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
            </button>
            {showSAFR && (
              <nav className="flex flex-col space-y-1 mt-1 ml-3">
                <Link to="/dashboard/safr" className={`text-sm px-3 py-1.5 rounded-md ${isActive("/dashboard/safr") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>Dashboard</Link>
                <Link to="/dashboard/safr/search" className={`text-sm px-3 py-1.5 rounded-md ${isActive("/dashboard/safr/search") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>Search</Link>
                <Link to="/dashboard/safr/reports" className={`text-sm px-3 py-1.5 rounded-md ${isActive("/dashboard/safr/reports") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>Reports</Link>
              </nav>
            )}
          </div>
        )}

        {/* ECONOMY */}
        <div className="mt-4 border-t border-gray-600 pt-4">
          <nav className="flex flex-col space-y-2">
            <Link to="/bank" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium ${isActive("/bank") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
              <Banknote className="w-4 h-4" /> Maze Bank
            </Link>
            <Link to="/dashboard/stocks" className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium ${isActive("/dashboard/stocks") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}><LineChart className="w-4 h-4" /> Stock Market</Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 bg-gray-950 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
