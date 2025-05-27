// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SidebarLayout from "../layouts/SidebarLayout";
import api from "../utils/axios";

export default function Dashboard() {
  const [civilians, setCivilians] = useState([]);
  const [roleIds, setRoleIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const civRes = await api.get("/api/civilians", {
          withCredentials: true,
        });
        setCivilians(civRes.data?.civilians || []);

        const authRes = await api.get("/api/auth/me", {
          withCredentials: true,
        });
        setRoleIds(authRes.data?.roles || []);

        console.log("🧠 Loaded role IDs:", authRes.data?.roles || []);
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <SidebarLayout roles={roleIds}>
      <Outlet context={{ civilians }} />
    </SidebarLayout>
  );
}
