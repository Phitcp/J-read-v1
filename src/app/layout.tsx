import type { Metadata } from "next";
import "./globals.css";

// Note: uses system/CSS-level font stacks instead of next/font/google.
// The build sandbox used to generate this POC has no network access to
// fonts.googleapis.com. If you have normal internet access, feel free to
// switch back to next/font/google (Noto_Serif_JP + Noto_Sans) for nicer,
// self-hosted Japanese typography — just restore the imports above and
// the font vars below.

export const metadata: Metadata = {
  title: "J-Read — đọc & học ngữ pháp tiếng Nhật",
  description: "Dán văn bản tiếng Nhật, tap vào câu để dịch và giải thích ngữ pháp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FBF9F4]" style={{ fontFamily: "var(--font-ui)" }}>
        {children}
      </body>
    </html>
  );
}
