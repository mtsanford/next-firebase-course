import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

type Props = {
  fallback?: JSX.Element;
  children: React.ReactNode;
};

// Component's children only shown to logged-in users
export default function AuthCheck(props: Props) {
  const { username } = useContext(UserContext);

  return (
    <>
      {username
        ? props.children
        : props.fallback || <Link href="/enter">You must be signed in</Link>}
    </>
  );
}
