import "./globals.css";

export const metadata = {
  title: "Hello World",
  description: "Hello World",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
