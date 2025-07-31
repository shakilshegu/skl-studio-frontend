'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import OtpVerification from '@/components/Auth/Otp';

function OtpContent() {
    const searchParams = useSearchParams();
    const phoneNumber = searchParams.get('phoneNumber');
    const isPartnerLogin = searchParams.get('isPartnerLogin') === 'true';

    return <OtpVerification phoneNumber={phoneNumber} isPartnerLogin={isPartnerLogin} />;
}

export default function Otp() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtpContent />
        </Suspense>
    );
}
