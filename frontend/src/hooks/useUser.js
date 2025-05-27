// src/hooks/useUser.js
import { useEffect, useState } from "react";
import axios from "../utils/axios";

export const useUser = () => {
  const [discordTag, setDiscordTag] = useState("Loading...");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        const { username, discriminator, avatar, discordId, roles } = res.data;

        setDiscordId(discordId);
        setRoles(roles);
        setDiscordTag(`${username}#${discriminator}`);
        const avatarLink = avatar
          ? `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/0.png`;
        setAvatarUrl(avatarLink);
      } catch (err) {
        console.error("❌ Failed to fetch user info:", err);
        setDiscordTag("Unknown User");
        setAvatarUrl("https://cdn.discordapp.com/embed/avatars/0.png");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { discordId, discordTag, avatarUrl, roles, loading };
};
