import {redirect} from 'next/navigation';
import {auth} from "@/app/_helpers/server";
import {Alert} from "@/app/_components/Alert";


export default Layout;

function Layout({children}: { children: React.ReactNode }) {
    // if logged in redirect to home page
    if (auth.isAuthenticated()) {
        redirect('/');
    }

    return (
        <>
            <Alert/>
            <div className="col-md-6 offset-md-3 mt-5">
                {children}
            </div>
        </>
    );
}