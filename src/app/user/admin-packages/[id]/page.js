import AdminPackageDetails from '@/components/AdminPackage/AdminPackageDetails';
import React, { Suspense } from 'react'


// Metadata generation
export async function generateMetadata(props) {
    const params = await props.params;
    const id = params.id;
    const adminPackageData = "jkhdkjh"
    // const adminPackageData = await getAdminPackageById(id);
    return {
        title: adminPackageData?.title || 'Super Package Details',
    };
}

const page = async (props) => {

        const params = await props.params;
        const id = params.id;
        // const initialData = await getAdminPackageById(id);

  return (
    <Suspense fallback={<div>Loading studio details...</div>}>
    <AdminPackageDetails adminPackageId={id}  />
</Suspense>
  )
}

export default page
