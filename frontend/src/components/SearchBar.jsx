import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Clothing from '../pages/Clothing';

const SearchBar = () => {
  const { products, search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const navigate  = useNavigate();
  const inputRef  = useRef(null);

  /*
    suggestions: unique keyword tokens derived from product names & categories
    matched against what the user is typing.

    Format: [{ label: 'Anarkali', count: 3 }, ...]
  */
  const [suggestions, setSuggestions] = useState([]);

  /*
    previewProducts: up to 4 products whose name/category contains the query.
    Shown in the right "Products" column exactly like Adidas.
  */
  const [previewProducts, setPreviewProducts] = useState([]);

  /* Auto-focus the input whenever the bar becomes visible */
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showSearch]);

  /* Recompute suggestions + preview products on every keystroke */
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      setPreviewProducts([]);
      return;
    }

    const q = search.trim().toLowerCase();

    /*
      Build a frequency map of every word in every product's
      name and category that STARTS WITH the query string.
      e.g. query "b" matches "Banarasi", "Block Print", "Bandhani" …
    */
    const freq = {};
    products.forEach((p) => {
      const tokens = `${p.name} ${p.category} ${p.subCategory ?? ''}`.split(/\s+/);
      tokens.forEach((token) => {
        const t = token.toLowerCase();
        if (t.startsWith(q) && t.length > 1) {
          // Capitalise first letter for display
          const display = token.charAt(0).toUpperCase() + token.slice(1);
          freq[display] = (freq[display] || 0) + 1;
        }
      });
    });

    /* Convert to sorted array — highest count first, max 8 items */
    const sorted = Object.entries(freq)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    setSuggestions(sorted);

    /* Products: name or category contains the full query string, max 4 */
    const matched = products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.subCategory?.toLowerCase().includes(q)
    ).slice(0, 4);

    setPreviewProducts(matched);
  }, [search, products]);

  /* ── Handlers ── */

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleClose = () => {
    setShowSearch(false);
    setSearch('');
  };

  // Clicking a suggestion fills the search bar and shows all results
  const handleSuggestionClick = (label) => {
    setSearch(label);
    navigate(`/clothing?search=${encodeURIComponent(label)}`);
    handleClose();
  };

  // Clicking a product goes straight to its page
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
    handleClose();
  };

  // "See all" or pressing Enter
  const handleSeeAll = () => {
    if (!search.trim()) return;
    navigate(`/clothing?search=${encodeURIComponent(search.trim())}`);
    handleClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSeeAll();
  };

  /* Bold the matching part of a suggestion label */
  const highlight = (label, query) => {
    const idx = label.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{label}</span>;
    return (
      <>
        <span className="font-bold">{label.slice(0, idx)}</span>
        <span className="font-normal text-gray-400">{label.slice(idx + query.length)}</span>
      </>
    );
  };

  if (!showSearch) return null;

  const hasResults = suggestions.length > 0 || previewProducts.length > 0;

  return (
    <>
      {/* ── Full-screen backdrop ── */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
        onClick={handleClose}
      />

      {/* ── Search bar container ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">

        {/* Input row */}
        <div className="max-w-screen-xl mx-auto flex items-center gap-3 px-4 sm:px-8 h-16 border-b border-gray-200">

          {/* Search icon */}
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search…"
            className="flex-1 text-sm sm:text-base bg-transparent focus:outline-none placeholder-gray-400"
          />

          {/* Clear button — shown only when there's text */}
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1 text-gray-400 hover:text-black transition-colors"
              title="Clear"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Close button */}
          <button
            onClick={handleClose}
            className="p-1 text-gray-500 hover:text-black transition-colors ml-1"
            title="Close search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Dropdown panel — only shown when user has typed something ── */}
        {search.trim() && hasResults && (
          <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row border-t border-gray-100">

            {/* ════ LEFT: Suggestions ════ */}
            <div className="sm:w-80 px-4 sm:px-8 py-5 border-r border-gray-100 flex-shrink-0">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">
                Suggestions
              </p>

              <ul className="space-y-1">
                {suggestions.map(({ label, count }) => (
                  <li key={label}>
                    <button
                      onClick={() => handleSuggestionClick(label)}
                      className="w-full flex items-center justify-between py-1.5 text-sm
                                 hover:opacity-60 transition-opacity text-left group"
                    >
                      {/* Highlighted label */}
                      <span>{highlight(label, search)}</span>
                      {/* Count badge */}
                      <span className="text-gray-400 text-xs ml-3 flex-shrink-0">{count}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* "See all" link */}
              {search.trim() && (
                <button
                  onClick={handleSeeAll}
                  className="mt-5 text-sm font-bold underline underline-offset-2 hover:opacity-60 transition-opacity"
                >
                  See all &ldquo;{search.trim()}&rdquo;
                </button>
              )}
            </div>

            {/* ════ RIGHT: Products ════ */}
            {previewProducts.length > 0 && (
              <div className="flex-1 px-4 sm:px-8 py-5">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">
                  Products
                </p>

                <div className="space-y-4">
                  {previewProducts.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      className="flex items-center gap-4 w-full text-left hover:opacity-70 transition-opacity group"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-20 flex-shrink-0 bg-gray-100 overflow-hidden">
                        <img
                          src={product.image?.[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        {product.subCategory && (
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                            {product.category} · {product.subCategory}
                          </p>
                        )}
                        <p className="text-sm font-semibold leading-snug truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          ₹{Number(product.price).toLocaleString('en-IN')}.00
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── Empty state — typed something but no matches ── */}
        {search.trim() && !hasResults && (
          <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-8 text-sm text-gray-400">
            No results found for &ldquo;<span className="text-black font-medium">{search}</span>&rdquo;.
            Try a different keyword.
          </div>
        )}

      </div>
    </>
  );
};

export default SearchBar;