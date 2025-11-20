// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // أول ما يفتح على / يروح على /login
}
