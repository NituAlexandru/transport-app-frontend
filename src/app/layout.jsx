import Head from "next/head";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <head>
        <title>Transport App</title>
        <meta
          name="description"
          content="Aplicație pentru gestionarea transporturilor"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      {/* Încarcă API-ul Google Maps global, o singură dată */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        async
        defer
      />

      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
