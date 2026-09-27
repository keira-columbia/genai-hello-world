import "./globals.css";

export const metadata = {
  title: "Largest Countries by Area",
  description: "Countries, authentication, and profiles with Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
