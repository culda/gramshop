import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center bg-white">
      <div className="max-w-md">{children}</div>
    </div>
  );
};

export default Layout;
