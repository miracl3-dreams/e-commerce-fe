import React, { useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Footer from "./components/Footer/Footer";
import Message from "./components/Message/Message";
import AllProducts from "./components/AllProducts/AllProducts"; // Import AllProducts
import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  const allProductsRef = useRef(null); // Create a ref for AllProducts

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 1000,
    });
    AOS.refresh();
  }, []);

  // Function to scroll to the AllProducts section
  const scrollToAllProducts = () => {
    allProductsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Router>
      <div>
        <Navbar scrollToAllProducts={scrollToAllProducts} />{" "}
        {/* Pass function to Navbar */}
        <Hero />
        <Products />
        <div ref={allProductsRef}>
          {" "}
          {/* Ref attached to the AllProducts section */}
          <AllProducts />
        </div>
        <TopProducts />
        <Message />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
