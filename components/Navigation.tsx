"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const Navigation = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white flex justify-center gap-5 p-4">
      <Link href="/">الرئيسية</Link>
      <Link href="/second-page">الصفحة الثانية</Link>
      {session?.user ? (
        <>
          {(session.user as any).isAdmin && (
            <>
              <Link href="/admin/users">إدارة المستخدمين</Link>
              <Link href="/admin">لوحة التحكم</Link>
            </>
          )}

         
        </>
      ) : (
        <Link href="/signin">تسجيل الدخول</Link>
      )}
    </nav>
  );
};

export default Navigation;
