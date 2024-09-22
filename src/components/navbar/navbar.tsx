import Link from "next/link";
import styles from './navbar.module.css';

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
    return (
        <nav className={"h-16 border-b-2 border-b-neutral-700"}>
            <div className={"container flex items-center h-full justify-between"}>
                {/* 导航栏左侧 */}
                <div className={"flex"}>
                    <Link href={"/"} className={styles.linkSpan}>
                        TestpaperAuto
                    </Link>
                    <ul className={"flex ml-8"}>
                        {links.map((link) => (
                            <li key={link.label} className={"mr-8"}>
                                <Link href={link.href} className={styles.linkSpan} legacyBehavior>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* 导航栏右侧 */}
                <div>
                    <Link href={"/login"} className={styles.linkSpan}>
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}