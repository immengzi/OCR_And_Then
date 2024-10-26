'use client'
import Link from "next/link"
import {useTheme} from "@/context/ThemeContext"
import {useAuth} from "@/hooks/use-auth"
import {NAVIGATION_CONFIG} from "@/lib/config/routes";

export default function Navbar() {
    const {toggleTheme} = useTheme()
    const {user, isLoggingOut, logout} = useAuth()

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (!isLoggingOut) {
            await logout()
        }
    }

    const renderThemeDropdown = () => (
        <li className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
                Theme
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow">
                <li><a onClick={() => toggleTheme("light")}>Light</a></li>
                <li><a onClick={() => toggleTheme("dark")}>Dark</a></li>
            </ul>
        </li>
    )

    const renderNavigationLinks = () => (
        NAVIGATION_CONFIG.links.map(link => (
            <li key={link.label}>
                <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
                    <Link href={link.href}>{link.label}</Link>
                </div>
            </li>
        ))
    )

    const renderUserMenu = () => (
        <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-32 p-2 shadow">
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
                            {isLoggingOut ? (
                                <span className="loading loading-infinity loading-sm"/>
                            ) : (
                                <span>Logout</span>
                            )}
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
                        className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-32 p-2 shadow">
                        {renderNavigationLinks()}
                        {renderThemeDropdown()}
                    </ul>
                </div>
                <Link href={'/'} className="btn btn-ghost text-xl">TestpaperAuto</Link>
            </div>

            {/* PC */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {renderNavigationLinks()}
                    {renderThemeDropdown()}
                </ul>
            </div>

            {/* User Menu */}
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="User avatar"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                        </div>
                    </div>
                    {renderUserMenu()}
                </div>
            </div>
        </div>
    )
}