"use client";

import { useEffect, useState } from 'react';
import API from './utils/api';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

import Testimonials from './components/Testimonials';
import TrendingRemedies from './components/TrendingRemedies';

export default function Home() {
  const [testimonials, setTestimonials] = useState(null);
  const [remedies, setRemedies] = useState(null);

  useEffect(() => {
    // Fetch testimonials
    API.get('homepage/testimonials/')
      .then(res => setTestimonials(res.data))
      .catch(err => {
        console.warn("Testimonials API failed, using placeholder");
        setTestimonials(placeholderTestimonials);
      });

    // Fetch trending remedies
    API.get('/remedies/trending/')
      .then(res => setRemedies(res.data))
      .catch(err => {
        console.warn("Trending remedies API failed, using placeholder");
        setRemedies(placeholderRemedies);
      });
  }, []);

  return (
    <div>
      <Navbar/>
      <HeroSection />
      <TrendingRemedies remedies={remedies || placeholderRemedies} />
      <HowItWorks />
      <Testimonials testimonials={testimonials || placeholderTestimonials} />
      <Footer />
    </div>
  );
}

// 🟡 Fallback mock data

const placeholderTestimonials = [
  {
    name: 'Anjali Mehra',
    avatar: 'https://i.pravatar.cc/100?img=5',
    comment: 'MedVeda helped me discover remedies my grandmother used to talk about!',
    rating: 5,
  },
  {
    name: 'Ravi Kumar',
    avatar: 'https://i.pravatar.cc/100?img=12',
    comment: 'Clean, simple, and very helpful for common health problems.',
    rating: 4,
  },
 { name: 'Vijay Kumar',
  avatar: 'https://i.pravatar.cc/100?img=8',
  comment: 'Home remedies saved me a bunch of time and money.',
  rating: 4,
},
];

const placeholderRemedies = [
  {
    id: 1,
    title: 'Ginger Tea',
    description: 'Soothes sore throat and relieves congestion.',
    image_url: 'https://source.unsplash.com/featured/?ginger',
    rating: 4.5,
  },
  {
    id: 2,
    title: 'Tulsi Decoction',
    description: 'Strengthens immunity and calms the mind.',
    image_url: 'https://source.unsplash.com/featured/?tulsi,herb',
    rating: 5,
  },
  {
    id: 3,
    title: 'Honey Lemon Water',
    description: 'Boosts metabolism and aids digestion.',
    image_url: 'https://source.unsplash.com/featured/?lemon,honey',
    rating: 4,
  },
];
