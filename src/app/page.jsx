import Categories from "@/components/Home/Categories";
import Features from "@/components/Home/Features";
import HomeSection from "@/components/Home/HomeSection";
import AdminPackages from "@/components/Home/ServicePackage";
import Testimonial from "@/components/Home/Testimonial";
import { Suspense } from "react";

async function HomePage() {
    const TypeofStudio = []
    return (
        <>
            <Suspense fallback={<div>Loading.....</div>}>

                <HomeSection studioTypes={TypeofStudio} />
                <Categories/>
                <AdminPackages/>
                <Features/>
                <Testimonial/>
            </Suspense>

        </>
    );
}

export default HomePage;