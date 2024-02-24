import Script from "next/script";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div className="flex justify-center">
          <div className="max-w-md">{children}</div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
