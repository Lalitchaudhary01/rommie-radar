"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user", err);
      }
    };

    fetchUser();
  }, [router]);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name} 👋</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
