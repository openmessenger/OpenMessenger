import React from "react";
import { useRoutes, navigate } from "hookrouter";
import PublicNavBar from "../components/Navbars/PublicNavBar";
import LandingPage from "../components/common/LandingPage";
import Footer from "../components/common/Footer";
const routes = {
    "/": () => <LandingPage />,
};

const PublicRouter = () => {
    const pages = useRoutes(routes);
    !pages && navigate("/");
    return (
        <>
            <div className="relative bg-green-100 min-h-screen">
                <PublicNavBar />
                {pages}
                {!pages && (
                    <div className="flex justify-center">
                        Error 404: Page not found
                    </div>
                )}
                <Footer />
            </div>
        </>
    );
};

export default PublicRouter;
