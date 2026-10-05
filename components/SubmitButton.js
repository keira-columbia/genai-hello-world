"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, pendingText = "Working…", className = "button primary" }) {
  const { pending } = useFormStatus();
  return <button className={className} disabled={pending}>{pending ? pendingText : children}</button>;
}
