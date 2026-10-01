import React from 'react';

export const metadata = {
  title: 'Energy Portal CMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
