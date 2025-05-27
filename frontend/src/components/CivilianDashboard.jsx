import React, { useState, useEffect } from "react";
import CivilianEditForm from "./CivilianEditForm";
import api from "../utils/axios";
import { useUser } from "../hooks/useUser";

export default function CivilianDashboard() {
  const [civilians, setCivilians] = useState([]);
  const [selected, setSelected] = useState(null);
  const { discordId } = useUser();

  useEffect(() => {
    if (!discordId) return;
  
    (async () => {
      try {
        const res = await api.get("/api/civilians", { withCredentials: true });
        const allCivilians = res.data.civilians || [];
  
        const userCivilians = allCivilians.filter(c => c.discordId === discordId);
        setCivilians(userCivilians);
      } catch (err) {
        console.error("❌ Failed to fetch civilians:", err);
      }
    })().catch((err) => {
      console.error("⚠️ Unhandled error in fetchCivilians effect:", err);
    });
  }, [discordId]);
  

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Civilian Dashboard</h2>

      {civilians.length === 0 ? (
        <p>No civilians found for your account.</p>
      ) : (
        civilians.map((civ) => (
          <div key={civ._id} className="mb-2">
            {civ.firstName} {civ.lastName}
            <button
              onClick={() => setSelected(civ)}
              className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              View / Edit
            </button>
          </div>
        ))
      )}

      {selected ? (
        <div className="mt-6">
          <CivilianEditForm civilian={selected} />
        </div>
      ) : (
        <p className="mt-4 text-gray-400">No civilian selected.</p>
      )}
    </div>
  );
}
