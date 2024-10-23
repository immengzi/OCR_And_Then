import {redirect} from 'next/navigation';
import {auth} from "@/app/_helpers/server";

export default Layout;

function Layout({children}: { children: React.ReactNode }) {
    // if logged in redirect to home page
    if (auth.isAuthenticated()) {
        redirect('/');
    }

    return (
        <div className="max-w-sm w-full gap-5 text-center">
            {children}
        </div>
    );
}