"use client";
import Link from "next/link";
import {useTheme} from "@/context/ThemeContext";
import {useUser} from "@/context/UserContext";

const links = [
    {label: "Intro", href: "/"},
    {label: "Play", href: "/play"},
    {label: "Help", href: "/help"}
];

const userLinks = [
    {label: "Profile", href: "/profile"},
    {label: "Settings", href: "/settings"},
    {label: 'History', href: '/history'},
    {label: "Logout", href: "/logout"}
];

const loginLink = {label: "Login", href: "/login"};

export default function NavBar() {
    const {theme, setTheme} = useTheme();
    const {currentUser, setCurrentUser} = useUser();

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <div className="navbar bg-base-100">
            {/* Mobile */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"/>
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-32 p-2 shadow">
                        {/* Menu */}
                        {links.map(link => (
                            <li key={link.label}>
                                <Link href={link.href}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        {/* Theme */}
                        <li className="dropdown dropdown-right">
                            <a>Theme</a>
                            <ul className="p-2">
                                <li><a onClick={() => handleThemeChange("light")}>Light</a></li>
                                <li><a onClick={() => handleThemeChange("dark")}>Dark</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <Link href={'/'} className="btn btn-ghost text-xl">TestpaperAuto</Link>
            </div>
            {/* PC */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {/* Menu */}
                    {links.map(link => (
                        <li key={link.label}>
                            <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
                                <Link href={link.href}>
                                    {link.label}
                                </Link>
                            </div>
                        </li>
                    ))}
                    {/* Theme */}
                    <li className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
                            Theme
                        </div>
                        <ul tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow">
                            <li><a onClick={() => handleThemeChange("light")}>Light</a></li>
                            <li><a onClick={() => handleThemeChange("dark")}>Dark</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"/>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-32 p-2 shadow">
                        {currentUser ? (
                            userLinks.map(userLink => (
                                <li key={userLink.label}>
                                    <Link href={userLink.href}>
                                        {userLink.label}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li key={loginLink.label}>
                                <Link href={loginLink.href}>
                                    {loginLink.label}
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}