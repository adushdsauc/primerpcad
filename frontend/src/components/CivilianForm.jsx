import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import { useUser } from "../hooks/useUser";

const CivilianForm = ({ existingData, onSuccess }) => {
  const { discordId } = useUser();
  const [formData, setFormData] = useState(getInitialState());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setFormData(existingData || getInitialState());
    setError("");
    setSuccess("");
  }, [existingData]);

  function getInitialState() {
    return {
      firstName: "",
      lastName: "",
      middleInitial: "",
      dateOfBirth: "",
      age: "",
      sex: "",
      knownAliases: "",
      residence: "",
      zipCode: "",
      occupation: "",
      height: "",
      weight: "",
      skinTone: "",
      hairColor: "",
      eyeColor: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
    };
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        discordId, // 👈 include discord ID of logged-in user
        knownAliases: formData.knownAliases
          ? formData.knownAliases.split(",").map((a) => a.trim())
          : [],
      };

      if (existingData) {
        await api.put(`/api/civilians/${existingData._id}`, payload);
        setSuccess("✅ Civilian updated successfully.");
      } else {
        await api.post("/api/civilians", payload);
        setSuccess("✅ Civilian created successfully.");
        setFormData(getInitialState()); // clear form
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to submit form.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-4 bg-white border rounded shadow"
    >
      <h3 className="text-xl font-bold mb-4">
        {existingData ? "Edit Civilian" : "Register New Civilian"}
      </h3>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="p-2 border rounded" />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="p-2 border rounded" />
        <input name="middleInitial" placeholder="Middle Initial" value={formData.middleInitial} onChange={handleChange} className="p-2 border rounded" />
        <input name="dateOfBirth" placeholder="Date of Birth (YYYY-MM-DD)" value={formData.dateOfBirth} onChange={handleChange} required className="p-2 border rounded" />
        <input name="age" placeholder="Age" type="number" value={formData.age} onChange={handleChange} className="p-2 border rounded" />
        <input name="sex" placeholder="Sex" value={formData.sex} onChange={handleChange} className="p-2 border rounded" />
        <input name="knownAliases" placeholder="Known Aliases (comma-separated)" value={formData.knownAliases} onChange={handleChange} className="p-2 border rounded" />
        <input name="residence" placeholder="Residence" value={formData.residence} onChange={handleChange} className="p-2 border rounded" />
        <input name="zipCode" placeholder="Zip Code" value={formData.zipCode} onChange={handleChange} className="p-2 border rounded" />
        <input name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} className="p-2 border rounded" />
        <input name="height" placeholder="Height e.g., 5'11" value={formData.height} onChange={handleChange} className="p-2 border rounded" />
        <input name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} className="p-2 border rounded" />
        <input name="skinTone" placeholder="Skin Tone" value={formData.skinTone} onChange={handleChange} className="p-2 border rounded" />
        <input name="hairColor" placeholder="Hair Color" value={formData.hairColor} onChange={handleChange} className="p-2 border rounded" />
        <input name="eyeColor" placeholder="Eye Color" value={formData.eyeColor} onChange={handleChange} className="p-2 border rounded" />
        <input name="emergencyContactName" placeholder="Emergency Contact Name" value={formData.emergencyContactName} onChange={handleChange} className="p-2 border rounded" />
        <input name="emergencyContactRelation" placeholder="Emergency Contact Relation" value={formData.emergencyContactRelation} onChange={handleChange} className="p-2 border rounded" />
        <input name="emergencyContactPhone" placeholder="Emergency Contact Phone" value={formData.emergencyContactPhone} onChange={handleChange} className="p-2 border rounded" />
      </div>

      <button
        type="submit"
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {existingData ? "Update Civilian" : "Create Civilian"}
      </button>
    </form>
  );
};

export default CivilianForm;
