import "./globals.css";

export const metadata = {
  title: "Campus Survival Map",
  description: "AI-captioned field notes from college life, judged by the people living it.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
