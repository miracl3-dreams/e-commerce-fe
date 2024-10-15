import React from "react";

const Button = ({ className, children, onClick }) => {
  return (
    <button
      className={`${className} bg-black text-sm px-2 py-1 font-poppins text-white`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
