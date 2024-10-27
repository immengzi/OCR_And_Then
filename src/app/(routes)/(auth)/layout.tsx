export default function AuthLayout({children}: {
    children: React.ReactNode
}) {

    return (
        <div className="max-w-sm w-full gap-5 text-center">
            {children}
        </div>
    )
}