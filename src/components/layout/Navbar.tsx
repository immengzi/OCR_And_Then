'use client';
import Link from "next/link";
import {NAVIGATION_CONFIG} from "@/lib/config/routes";
import {User, Sun, Moon} from 'lucide-react';
import {useTheme} from "@/context/ThemeContext";
import {useAuth} from "@/hooks/use-auth";

export default function Navbar() {
    const {theme, toggleTheme} = useTheme();
    const {user, logout} = useAuth();

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        await logout();
    }

    const renderNavigationLinksMobile = () => (
        NAVIGATION_CONFIG.links.map(link => (
            <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
            </li>
        ))
    )

    const renderNavigationLinksPC = () => (
        NAVIGATION_CONFIG.links.map(link => (
            <li key={link.label}>
                <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
                    <Link href={link.href}>{link.label}</Link>
                </div>
            </li>
        ))
    )

    const renderUserMenu = () => (
        <ul tabIndex={0} className="menu dropdown-content rounded-box z-[1] mt-3 w-32 p-2 shadow bg-base-100">
            {user ? (
                <>
                    {NAVIGATION_CONFIG.userLinks.map(link => (
                        <li key={link.label}>
                            <Link href={link.href}>
                                <span>{link.label}</span>
                            </Link>
                        </li>
                    ))}
                    <li>
                        <a href={NAVIGATION_CONFIG.auth.logout.href} onClick={handleLogout}>
                            <span>Logout</span>
                        </a>
                    </li>
                </>
            ) : (
                <li>
                    <Link href={NAVIGATION_CONFIG.auth.login.href}>
                        <span>{NAVIGATION_CONFIG.auth.login.label}</span>
                    </Link>
                </li>
            )}
        </ul>
    )

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
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>
                    <ul tabIndex={0}
                        className="menu dropdown-content rounded-box z-[1] mt-3 w-32 p-2 shadow bg-base-100">
                        {renderNavigationLinksMobile()}
                    </ul>
                </div>
                <Link href={'/'} className="btn btn-ghost text-xl">
                    OCR And Then
                </Link>
            </div>

            {/* PC */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {renderNavigationLinksPC()}
                </ul>
            </div>

            {/* User Menu */}
            <div className="navbar-end space-x-2">
                <label className="swap swap-rotate">
                    <input
                        type="checkbox"
                        checked={theme === 'dark'}
                        onChange={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                    />
                    <Sun className="swap-off"/>
                    <Moon className="swap-on"/>
                </label>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost avatar">
                        <User/>
                    </div>
                    {renderUserMenu()}
                </div>
            </div>
        </div>
    )
}