"use client";

import { useEffect, useState } from 'react';
// import API from '../utils/api';

import HeroSection from './components/HeroSection';       // hardcoded
import HowItWorks from './components/HowItWorks';         // hardcoded
import Footer from './components/Footer';                // hardcoded

import Testimonials from './components/Testimonials';     // from API
import TrendingRemedies from './components/TrendingRemedies'; // from API

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [remedies, setRemedies] = useState([]);

  // useEffect(() => {
  //   // Fetch testimonials
  //   API.get('/testimonials/')
  //     .then(res => setTestimonials(res.data))
  //     .catch(err => console.error("Failed to load testimonials:", err));

  //   // Fetch trending remedies
  //   API.get('/remedies/trending/')
  //     .then(res => setRemedies(res.data))
  //     .catch(err => console.error("Failed to load trending remedies:", err));
  // }, []);

  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <TrendingRemedies remedies={remedies} />
      <Testimonials testimonials={testimonials} />
      <Footer />
    </div>
  );
}
