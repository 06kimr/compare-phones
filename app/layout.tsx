import { Apple } from "lucide-react";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <header className="container flex py-4">
          <div className="flex">
            <Apple className="w-8 h-8 mr-4" />
            <h1 className="text-3xl font-bold">아이폰 비교하기</h1>
          </div>
        </header>
        <main className=" flex-1 border-b border-t">{children}</main>
        <footer className="container flex  py-12">
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <Link
              href="https://github.com/06kimr"
              className="underline underline-offset-4"
            >
              Ricky!
            </Link>
          </p>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
