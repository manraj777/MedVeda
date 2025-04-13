import { useEffect, useState } from 'react';
import API from '../utils/api';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import TrendingRemedies from '../components/TrendingRemedies';
import Footer from '../components/footer';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/homepage/')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div>
      <HeroSection hero={data.hero} />
      <HowItWorks steps={data.how_it_works} />
      <TrendingRemedies />
      <Testimonials testimonials={data.testimonials} />
      <Footer />
    </div>
  );
}
