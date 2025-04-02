"use client"

import LogoutButton from "@/components/logout-button";
import { withAuth } from "./hoc/withAuth";

export function HomePage() {
  return (
    <div>
      <LogoutButton />
    </div>
  );
}

export default withAuth(HomePage)
