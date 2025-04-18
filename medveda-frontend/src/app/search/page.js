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
      title: 'Tulsi Tea',
      description: 'Great for boosting immunity and relieving cold symptoms.',
      image_url: 'https://source.unsplash.com/featured/?herbal,tea',
      rating: 4.5,
      category: 'Immunity',
    },
    {
      id: 2,
      title: 'Ginger Honey Mix',
      description: 'Soothes sore throat and helps with digestion.',
      image_url: 'https://source.unsplash.com/featured/?ginger,honey',
      rating: 4.2,
      category: 'Digestive',
    },
    {
      id: 3,
      title: 'Aloe Vera Gel',
      description: 'Heals minor skin burns and reduces inflammation.',
      image_url: 'https://source.unsplash.com/featured/?aloe,skin',
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
      <SearchHeader query={q} />
      <SearchFilters
        filters={filters}
        categories={categories}
        onChange={handleFilterChange}
      />
      {loading ? (
        <SkeletonGrid />
      ) : (
        <>
          <SearchResults results={results} />
          <PaginationControls
            page={page}
            setPage={setPage}
            hasNextPage={hasNextPage}
          />
        </>
      )}
    </div>
    </>
  );
}
