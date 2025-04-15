import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import API from '../utils/api';

import SearchHeader from '../components/SearchHeader';
import SearchFilters from '../components/SearchFilters';
import SearchResults from '../components/SearchResults';
import SkeletonGrid from '../components/SkeletonGrid';
import PaginationControls from '../components/PaginationControls';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', min_rating: '' });
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [categories, setCategories] = useState([]);

  const fallbackCategories = [
    { name: 'Immunity', slug: 'immunity' },
    { name: 'Digestive', slug: 'digestive' },
    { name: 'Skin Care', slug: 'skin-care' },
  ];

  useEffect(() => {
    API.get('/remedies/categories/')
      .then(res => {
        if (res.data?.length) setCategories(res.data);
        else setCategories(fallbackCategories);
      })
      .catch(() => setCategories(fallbackCategories));
  }, []);

  useEffect(() => {
    if (!q) return;

    setLoading(true);
    API.get('/remedies/search/', {
      params: { q, ...filters, page },
    })
      .then((res) => {
        setResults(res.data.results);
        setHasNextPage(Boolean(res.data.next));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q, filters, page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div className="p-6">
      <SearchHeader query={q} />
      <SearchFilters filters={filters} categories={categories} onChange={handleFilterChange} />
      {loading ? (
        <SkeletonGrid />
      ) : (
        <>
          <SearchResults results={results} />
          <PaginationControls page={page} setPage={setPage} hasNextPage={hasNextPage} />
        </>
      )}
    </div>
  );
}
