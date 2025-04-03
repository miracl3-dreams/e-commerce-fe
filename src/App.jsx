import React, { useRef, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Footer from "./components/Footer/Footer";
import Message from "./components/Message/Message";
import AllProducts from "./components/AllProducts/AllProducts";
import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  const allProductsRef = useRef(null);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 1000,
    });
    AOS.refresh();

    window.scrollTo(0, 0);
  }, []);

  // Function to scroll to the AllProducts section
  const scrollToAllProducts = () => {
    allProductsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Router>
      <div>
        <Navbar scrollToAllProducts={scrollToAllProducts} /> <Hero />
        <Products />
        <div ref={allProductsRef}>
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
