import React from "react";

const Modal = ({ isOpen, children, className }) => {
  return (
    <div
      className={`${
        isOpen ? "flex" : "hidden"
      } fixed top-0 left-0 w-full h-full justify-center items-center bg-black/50`}
    >
      <div className={`${className} border-2 border-black p-5 rounded-md`}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
