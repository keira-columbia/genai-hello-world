import "./globals.css";

export const metadata = {
  title: "Reading List",
  description: "Books from Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
