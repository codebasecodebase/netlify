'use client';
import NextLink from "next/link";
import { usePathname } from 'next/navigation';

export default function LinkComponent() {
    const pathname = usePathname();
    return (
    <nav className="py-4 font-medium max-[550px]:hidden">
        <div className="space-x-6">
            <NextLink href="/" className={pathname === '/' ? 'text-blue-500' : ''}>
                Главная
            </NextLink>
            <NextLink href="/about" className={pathname === '/about' ? 'text-blue-500' : 'hover:text-gray-300'}>
                О нас
            </NextLink>
            <NextLink href="/contacts" className={pathname === '/contacts' ? 'text-blue-500' : 'hover:text-gray-300'}>
                Контакты
            </NextLink>
            <NextLink href="/blog" className={pathname.startsWith('/blog') ? 'text-blue-500' : 'hover:text-gray-300'}>
                Новости
            </NextLink>
            <NextLink href="/reviews" className={pathname === '/reviews' ? 'text-blue-500' : 'hover:text-gray-300'}>
                Отзывы
            </NextLink>
        </div>
    </nav>
    );
}