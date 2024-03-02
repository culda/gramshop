import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center mx-auto">
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
    </div>
  );
};

export default Spinner;
