"use client"

import { useSearchParams } from 'next/navigation';


import { useEffect, useState } from 'react';
import API from '../utils/api';

import SearchNavbar from '../components/SearchNavbar';
import SearchHeader from '../components/SearchHeader';
import SearchFilters from '../components/SearchFilters';
import SearchResults from '../components/SearchResults';
import SkeletonGrid from '../components/SkeletonGrid';
import PaginationControls from '../components/PaginationControls';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', min_rating: '' });
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [categories, setCategories] = useState([]);


  
  // ✅ Fallback categories
  const fallbackCategories = [
    { name: 'Immunity', slug: 'immunity' },
    { name: 'Digestive', slug: 'digestive' },
    { name: 'Skin Care', slug: 'skin-care' },
    { name: 'Stress Relief', slug: 'stress-relief' },
  ];


  // ✅ Fallback remedies
  const fallbackRemedies = [
    {
      id: 1,
      title: 'Triphala Churna',
      description: 'Traditional digestive aid made from three fruits. Helps with digestion and detoxification.',
      image_url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/0461b06c78-28d93f7d631561f5f09e.png',
      rating: 4.5,
      category: 'Immunity',
    },
    {
      id: 2,
      title: 'Ashwagandha Root',
      description: 'Adaptogenic herb that helps reduce stress and anxiety while boosting energy levels.',
      image_url: '	https://storage.googleapis.com/uxpilot-auth.appspot.com/c0f597dfdb-0c3f600dff6d3622a011.png',
      rating: 4.2,
      category: 'Digestive',
    },
    {
      id: 3,
      title: 'Golden Milk Mix',
      description: 'Turmeric-based blend with black pepper and cardamom. Anti-inflammatory properties.',
      image_url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e438cf9a2a-2f4e83b82946233e9718.png',
      rating: 4.7,
      category: 'Skin Care',
    },
  ];

  // 🔁 Fetch categories
  useEffect(() => {


    
    API.get('/remedies/categories/')
      .then((res) => {
        if (res.data?.length > 0) {
          setCategories(res.data);
        } else {
          setCategories(fallbackCategories);
        }
      })
      .catch(() => {
        setCategories(fallbackCategories);
      });
  }, []);

  // 🔍 Fetch search results
  useEffect(() => {
    if (!q) return; // 👈 wait for router to load

    setLoading(true);

    API.get('/remedies/search/', {
      params: {
        q,
        category: filters.category,
        min_rating: filters.min_rating,
        page,
      },
    })
      .then((res) => {
        if (res.data?.results?.length > 0) {
          setResults(res.data.results);
          setHasNextPage(Boolean(res.data.next));
        } else {
          setResults(fallbackRemedies); // Use fallback if empty
          setHasNextPage(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setResults(fallbackRemedies); // Use fallback if error
        setHasNextPage(false);
        setLoading(false);
      });
  }, [q, filters, page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <>

    <SearchNavbar />
    <div className="p-6">
      <div className='flex gap-8'>
      <SearchFilters
        filters={filters}
        categories={categories}
        onChange={handleFilterChange}
      />
      {loading ? (
        <SkeletonGrid />
      ) : (
        <>  <div className='flex-1'>
             
          <SearchHeader query={q} />
          <SearchResults results={results} />
          <PaginationControls
            page={page}
            setPage={setPage}
            hasNextPage={hasNextPage}
          />
          </div> 
        </>
      )}
      </div>
    </div>
    </>
  );
}
