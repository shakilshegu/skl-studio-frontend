// src/providers/TanstackProvider.js
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function TanstackProvider({ children }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}