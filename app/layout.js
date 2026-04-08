import './globals.css';

export const metadata = {
  title: 'ChronoCanvas – A Living Calendar Experience',
  description: 'An immersive, cinematic calendar where each month is a living scene and every interaction tells a story.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
