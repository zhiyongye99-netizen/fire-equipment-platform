"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlatformAdminHomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/review");
  }, [router]);

  return (
    <main style={{ padding: 24, textAlign: "center" }}>
      <p>正在进入平台运营后台...</p>
    </main>
  );
}
