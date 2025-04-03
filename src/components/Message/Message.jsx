import React from "react";

const Message = () => {
  return (
    <div className="flex justify-center items-center mt-16 mb-16">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
          Contact Us
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          Want to place an order? Feel free to message us, and we'll assist you
          with your order right away!
        </p>
        {/* Facebook Page Messenger link */}
        <a
          href="https://www.facebook.com/profile.php?id=61573162643583"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 duration-300"
        >
          Send a Message on Messenger
        </a>
      </div>
    </div>
  );
};

export default Message;
