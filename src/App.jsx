import React, { useRef, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Footer from "./components/Footer/Footer";
import Message from "./components/Message/Message";
import AllProducts from "./components/AllProducts/AllProducts";

const App = () => {
  const allProductsRef = useRef(null);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 1000,
    });
    window.scrollTo(0, 0);
  }, []);

  const scrollToAllProducts = () => {
    allProductsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Router>
      <div className="relative">
        <Navbar scrollToAllProducts={scrollToAllProducts} />
        <Hero />
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
