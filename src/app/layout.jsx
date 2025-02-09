import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <Head>
        <title>Transport App</title>
        <meta
          name="description"
          content="Aplicație pentru gestionarea transporturilor"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
