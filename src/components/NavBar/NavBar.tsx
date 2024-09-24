"use client";
import Link from "next/link";
import styles from './Navbar.module.css';
import {usePathname} from "next/navigation";

const links = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Help",
        href: "/help",
    },
    {
        label: "About",
        href: "/about",
    }
];

export default function NavBar() {
    const pathname = usePathname();

    return (
        <nav className={"h-16 shadow-[inset_0_-1px_0_rgb(51,51,51)]"}>
            <div className={"container flex items-center h-full justify-between"}>
                {/* 导航栏左侧 */}
                <div className={"flex h-full items-center"}>
                    <div>
                        <Link href={"/"}>
                            TestpaperAuto
                        </Link>
                    </div>
                    <ul className={"flex ml-8 space-x-8"}>
                        {links.map((link) => (
                            <li key={link.label} className={"text-[#888888] hover:text-white transition-all"}>
                                <Link href={link.href}
                                      className={pathname === link.href ? `${styles.selected}` : ''}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* 导航栏右侧 */}
                <div>
                    <Link href={"/login"}
                          className={pathname === "/login" ? `${styles.selected}` : ''}>
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}