import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Bine ai venit la Transport App!</h1>
      <Link href="/auth/login">Login</Link> |{" "}
      <Link href="/auth/register">Register</Link>
    </div>
  );
}
