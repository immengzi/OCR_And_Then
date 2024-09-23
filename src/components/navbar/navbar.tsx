"use client";
import Link from "next/link";
import styles from './navbar.module.css';
import {usePathname} from "next/navigation";

const links = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Help",
        href: "/help",
    }
];

export default function Navbar() {
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
                    <ul className={"flex ml-8"}>
                        {links.map((link) => (
                            <li key={link.label} className={"mr-8"}>
                                <Link href={link.href}
                                      className={pathname === link.href ? `${styles.linkSpan} ${styles.selected}` : styles.linkSpan}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* 导航栏右侧 */}
                <div>
                    <Link href={"/login"}
                          className={pathname === "/login" ? `${styles.linkSpan} ${styles.selected}` : styles.linkSpan}>
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}