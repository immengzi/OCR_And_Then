export const NAVIGATION_CONFIG = {
    links: [
        {label: "Intro", href: "/"},
        {label: "Play", href: "/play"},
        {label: "Help", href: "/help"}
    ],
    userLinks: [
        {label: "Profile", href: "/dashboard/profile"},
        {label: "History", href: "/dashboard/history"}
    ],
    auth: {
        login: {label: "Login", href: "/login"},
        logout: {label: "Logout", href: "/logout"}
    }
} as const