// app/layout.js
import { HydrationBoundary } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import ClientLayout from "@/layout/ClientLayout";
import TanstackProvider from "@/provider/TanstackProvider";
import ReduxProvider from "@/provider/ReduxProvider";



export default function RootLayout({ children, dehydratedState }) {
  return (
    <html lang="en">
      <body>
        {/* <div style={{ transform: "scale(0.8)", transformOrigin: "top left", width: "125%" }}> */}

        <TanstackProvider>
          <HydrationBoundary state={dehydratedState}>
            <ReduxProvider>
              <ClientLayout>
                {children}

              </ClientLayout>
            </ReduxProvider>
          </HydrationBoundary>
        </TanstackProvider>
        {/* </div> */}
      </body>
    </html>
  );
}