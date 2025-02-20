import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white flex justify-center gap-5 p-4">
      <Link href="/">الرئيسية</Link>
      <Link href="/second-page">الصفحة الثانية</Link>
      <Link href="/signin">تسجيل الدخول</Link>
    </nav>
  );
};

export default Navigation;