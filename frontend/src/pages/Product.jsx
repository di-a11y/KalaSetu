import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Stars = ({ count = 5, filled = 5, size = 'sm' }) => {
  const px = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className={`${px} ${i < filled ? 'fill-black' : 'fill-gray-300'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const Accordion = ({ title, extra, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-sm font-semibold hover:opacity-70 transition-opacity"
      >
        <span>{title}</span>
        <div className="flex items-center gap-3">
          {extra}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="pb-5 text-sm text-gray-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

const DeliveryRow = ({ icon, text }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 cursor-pointer hover:opacity-70 transition-opacity">
    <span className="text-base mt-0.5">{icon}</span>
    <span className="flex-1 text-xs text-gray-600 leading-snug">{text}</span>
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </div>
);

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [selectedSize, setSelectedSize] = useState(''); // ✅ ONE size state only
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [craftExpanded, setCraftExpanded] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const scrollRef = useRef(null);

  // ✅ REMOVED: const [size, setSize] = useState(''); — was never updated

  useEffect(() => {
    const found = products.find((item) => item._id === productId);
    if (found) setProductData(found);
    setVideoPlaying(false);
    setCraftExpanded(false);
    setSelectedSize(''); // ✅ Reset size when product changes
  }, [productId, products]);

  const scrollLeft  = () => scrollRef.current?.scrollBy({ left: -280, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left:  280, behavior: 'smooth' });

  // ✅ FIXED: handleAddToCart now uses selectedSize correctly
  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    if (addToCart) addToCart(productData._id, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!productData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 animate-pulse">Loading product…</p>
      </div>
    );
  }

  const sizes = productData.sizes?.length ? productData.sizes : ['XS', 'S', 'M', 'L', 'XL', '2XL'];
  const images = productData.image || [];
  const visibleImages = showMore ? images : images.slice(0, 4);

  const relatedCrafts = products
    .filter((p) => p._id !== productData._id && p.category === productData.category)
    .slice(0, 8);

  const craftDescription = productData.craftDescription || productData.description || '';
  const PREVIEW_LENGTH = 140;
  const isLong = craftDescription.length > PREVIEW_LENGTH;
  const displayedCraft = craftExpanded || !isLong
    ? craftDescription
    : craftDescription.slice(0, PREVIEW_LENGTH) + '…';

  return (
    <div className="max-w-screen-xl mx-auto">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 px-4 sm:px-6 py-3 text-xs text-gray-500 flex-wrap">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 font-medium text-black hover:opacity-60 transition-opacity"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span>/</span>
        <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/')}>
          Home
        </span>
        <span>/</span>
        <span
          className="hover:text-black cursor-pointer transition-colors capitalize"
          onClick={() => navigate(`/${productData.category?.toLowerCase()}`)}
        >
          {productData.category}
        </span>
        <span>/</span>
        <span className="text-black font-medium">{productData.name}</span>
      </nav>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row">

        {/* LEFT: Image Grid */}
        <div className="flex-1 lg:max-w-[62%]">
          <div className="grid grid-cols-2 gap-0.5">
            {visibleImages.map((img, i) => (
              <div key={i} className="overflow-hidden bg-gray-50" style={{ aspectRatio: '3/4' }}>
                <img
                  src={img}
                  alt={`${productData.name} view ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          {images.length > 4 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="w-full mt-0.5 py-4 border border-gray-300 flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              {showMore ? 'Show less' : 'Show more'}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* RIGHT: Sticky Details Panel */}
        <div className="lg:w-[420px] lg:flex-shrink-0 px-5 sm:px-7 pt-5 pb-10 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">

          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              {productData.category}
              {productData.subCategory ? ` • ${productData.subCategory}` : ''}
            </p>
            <div className="flex items-center gap-1.5">
              <Stars filled={4} />
              <button className="text-xs underline text-gray-500 hover:text-black">(24)</button>
            </div>
          </div>

          {productData.bestseller && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-sm mb-3">
              Bestseller ⚡
            </span>
          )}

          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide leading-tight mb-2">
            {productData.name}
          </h1>

          <p className="text-xl font-semibold mb-0.5">
            ₹{Number(productData.price).toLocaleString('en-IN')}.00
          </p>
          <p className="text-xs text-gray-500 mb-5">MRP inclusive of all taxes</p>

          {productData.color && (
            <p className="text-sm text-gray-700 mb-5">{productData.color}</p>
          )}

          {/* Size Selection */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold">Sizes</p>
              <button className="text-xs underline text-gray-500 hover:text-black transition-colors">
                Size guide
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {/* ✅ FIXED: renamed map variable from `size` to `sizeOption` to avoid shadowing */}
              {sizes.map((sizeOption) => (
                <button
                  key={sizeOption}
                  onClick={() => { setSelectedSize(sizeOption); setSizeError(false); }}
                  className={`py-3 text-xs sm:text-sm border transition-all duration-150 font-medium
                    ${selectedSize === sizeOption
                      ? 'border-black bg-black text-white'
                      : sizeError
                        ? 'border-red-400 text-red-500 hover:border-black hover:text-black'
                        : 'border-gray-300 hover:border-black'
                    }`}
                >
                  {sizeOption}
                </button>
              ))}
            </div>

            {sizeError && (
              <p className="text-xs text-red-500 mb-2">Please select a size to continue.</p>
            )}

            <div className="border border-gray-200 rounded-sm p-3 flex items-start gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>True to size.</strong> We recommend ordering your usual size.</span>
            </div>
          </div>

          {/* Add to Bag + Wishlist */}
          <div className="flex gap-2 mb-6">
            {/* ✅ FIXED: calls handleAddToCart() instead of addToCart() directly */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200
                ${addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-black text-white hover:bg-gray-800 active:scale-[.98]'
                }`}
            >
              {addedToCart ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  Add to bag
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
                  </svg>
                </>
              )}
            </button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="border border-gray-300 px-4 py-4 hover:border-black transition-colors active:scale-95"
            >
              <svg
                className={`w-5 h-5 transition-colors duration-200 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-black'}`}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Delivery Info */}
          <div className="mb-4">
            <DeliveryRow icon="🚚" text="Free Delivery & Free Returns*" />
            <DeliveryRow icon="📦" text="Delivery: Delhi/NCR: 1–2 days · Metro cities: 2–3 days · Others: 3–5 days" />
            <DeliveryRow icon="💵" text="Cash on Delivery available for orders below ₹5,000" />
            <DeliveryRow icon="🔒" text="Secure checkout · Hassle-free 14-day exchange & returns*" />
          </div>

          {/* Accordions */}
          <Accordion title="Reviews (24)" extra={<Stars size="sm" filled={4} />}>
            <p>Customers love this product! Reviews are displayed here.</p>
          </Accordion>

          <Accordion title="Size & Fit">
            <p>This garment is true to size. For a relaxed look, size up. Measurements are based on a size M/38.</p>
          </Accordion>

          <Accordion title="Description">
            <p>{productData.description}</p>
          </Accordion>

          <Accordion title="Artisan & Craft Details">
            <div className="space-y-2">
              {productData.category && (
                <div className="flex gap-2">
                  <span className="font-medium text-gray-700 w-24 flex-shrink-0">Category</span>
                  <span>{productData.category}</span>
                </div>
              )}
              {productData.subCategory && (
                <div className="flex gap-2">
                  <span className="font-medium text-gray-700 w-24 flex-shrink-0">Type</span>
                  <span>{productData.subCategory}</span>
                </div>
              )}
              {productData.color && (
                <div className="flex gap-2">
                  <span className="font-medium text-gray-700 w-24 flex-shrink-0">Colour</span>
                  <span>{productData.color}</span>
                </div>
              )}
            </div>
          </Accordion>

          <div className="border-t border-gray-200" />
        </div>
      </div>

      {/* KNOW THE CRAFT SECTION */}
      <div className="border-t border-gray-200 mt-8 px-4 sm:px-10 py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Know the Craft
        </h2>

        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
          {displayedCraft}
          {isLong && (
            <button
              onClick={() => setCraftExpanded(!craftExpanded)}
              className="ml-1 text-[#b5883a] font-medium hover:underline focus:outline-none"
            >
              {craftExpanded ? ' Show less' : ' Read More...'}
            </button>
          )}
        </p>

        <div
          className="relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
          style={{ aspectRatio: '16/9' }}
          onClick={() => setVideoPlaying(true)}
        >
          {videoPlaying && productData.craftVideo ? (
            <iframe
              className="w-full h-full"
              src={
                productData.craftVideo.includes('youtube.com') || productData.craftVideo.includes('youtu.be')
                  ? `https://www.youtube.com/embed/${extractYoutubeId(productData.craftVideo)}?autoplay=1`
                  : productData.craftVideo
              }
              title="Craft video"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={productData.craftThumbnail || productData.image?.[0]}
                alt="Know the craft"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-[#2d86e0]/80 backdrop-blur-sm group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <svg className="w-7 h-7 sm:w-9 sm:h-9 fill-white translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>

        {!productData.craftVideo && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            Add a <code className="bg-gray-100 px-1 rounded">craftVideo</code> URL to your product data to enable playback.
          </p>
        )}
      </div>

      {/* EXPLORE MORE CRAFTS */}
      {relatedCrafts.length > 0 && (
        <div className="border-t border-gray-200 py-10 px-4 sm:px-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
              Explore More Crafts
            </h2>
            <div className="hidden sm:flex gap-2">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {relatedCrafts.map((craft) => (
              <div
                key={craft._id}
                onClick={() => navigate(`/product/${craft._id}`)}
                className="flex-shrink-0 w-40 sm:w-48 cursor-pointer group"
              >
                <div className="w-full aspect-square overflow-hidden bg-gray-100 mb-2">
                  <img
                    src={craft.image?.[0]}
                    alt={craft.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-sm font-medium text-center text-gray-800 group-hover:text-black transition-colors leading-snug">
                  {craft.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

function extractYoutubeId(url) {
  try {
    const u = new URL(url);
    return u.searchParams.get('v') || u.pathname.split('/').pop();
  } catch {
    return '';
  }
}

export default Product;