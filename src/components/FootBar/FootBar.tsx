import Link from "next/link";

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

export default function FootBar() {
    return (
        <div className={"border-t-[0.8px] border-[#333333] h-16"}>
            <div className={"flex items-center justify-center container h-full"}>
                <ul className={"flex space-x-8"}>
                    {links.map((link) => (
                        <li key={link.label} className={"text-[#888888] hover:text-white transition-all"}>
                            <Link href={link.href} className={link.href}>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}