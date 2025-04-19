import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ItemList from '../components/ItemList';

export default function Home() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Handle page query parameter on load
  useEffect(() => {
    if (router.query.page) {
      const pageNum = parseInt(router.query.page, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    }
  }, [router.query.page]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/items', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
        // Only reset to page 1 if no page query param
        if (!router.query.page) {
          setCurrentPage(1);
        }
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    }
  };

  // Filter items based on ClientName
  const filteredItems = items.filter(item =>
    item.ClientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate pagination
  const totalRecords = filteredItems.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Adjust currentPage if it exceeds totalPages after data change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Handle page navigation
  const handleFirst = () => {
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleLast = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div className="container">
      <h1>Client Portal</h1>
      <div className="search-container centered">
        <label htmlFor="search">Search by Client Name:</label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter Client Name..."
          className="search-input"
        />
      </div>
      <ItemList
        items={paginatedItems}
        onDelete={fetchItems}
        currentPage={currentPage}
      />
      <div className="pagination-container centered">
        <button
          onClick={handleFirst}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          First
        </button>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages} ({totalRecords} records)
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
        <button
          onClick={handleLast}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Last
        </button>
      </div>
    </div>
  );
}