'use client'
import TicketDetailPage from '@/components/Support/TicketDetailView'
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {

      const params = useParams();
      const ticketId = params.id;
  return (
    <div>
        <TicketDetailPage ticketId = {ticketId}/>
    </div>
  )
}

export default page