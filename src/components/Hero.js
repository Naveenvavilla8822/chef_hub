import React from 'react';
import './Hero.css';
import HeroImg from "./125852-ORV1HE-451.jpg"

function Hero() {
  return (
    <div className="hero">
      <div className="hero-text">
        <h1>Welcome to Chef Hub</h1>
        <p>Home-cooked meals made just for you by certified chefs.</p>
      </div>
      <img src={HeroImg} alt="Chef" className="hero-img" />
    </div>
  );
}

export default Hero;
