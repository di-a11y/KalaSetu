import React, { useContext, useState, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import dropdown_icon from '../assets/frontend_assets/dropdown_icon.png'

// ── Defined OUTSIDE component ──
const FilterSection = ({ label, open, onToggle, children }) => (
  <div className="border-t py-4">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full text-sm font-semibold tracking-wide cursor-pointer"
    >
      {label}
      <img
        className={`h-3 transition-transform ${open ? 'rotate-180' : ''}`}
        src={dropdown_icon}
        alt=""
      />
    </button>
    {open && children}
  </div>
);

const CheckboxList = ({ items, selected, onToggle }) => (
  <div className="mt-4 space-y-3 text-sm text-gray-600">
    {items.map((item) => (
      <label key={item} className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          value={item}
          checked={selected.includes(item)}
          onChange={() => onToggle(item)}
          className="w-4 h-4 accent-black"
        />
        <span className="hover:text-black transition">{item}</span>
      </label>
    ))}
  </div>
);

const INITIAL_FILTERS = {
  types: [],
  sizes: [],
  genders: [],
  crafts: [],
  materials: [],
  fits: [],
  maxPrice: 30000,
};

const Clothing = ({ category, subCategory }) => {
  const { products = [] } = useContext(ShopContext);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sortOrder, setSortOrder] = useState('default');

  const [openSections, setOpenSections] = useState({
    price: false, type: false, size: false, gender: false,
    craft: false, material: false, fit: false,
  });

  const toggleSection = (key) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(i => i !== value)
        : [...prev[key], value],
    }));
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      const matchCategory    = category    ? item.category    === category    : true;
      const matchSubCategory = subCategory ? item.subCategory === subCategory : true;
      const matchType        = filters.types.length     > 0 ? filters.types.includes(item.subCategory)            : true;
      const matchSize        = filters.sizes.length     > 0 ? item.sizes?.some(s => filters.sizes.includes(s))    : true;
      const matchGender      = filters.genders.length   > 0 ? filters.genders.includes(item.category)             : true;
      const matchCraft       = filters.crafts.length    > 0 ? filters.crafts.includes(item.craft)                 : true;
      const matchMaterial    = filters.materials.length > 0 ? filters.materials.includes(item.material)           : true;
      const matchFit         = filters.fits.length      > 0 ? filters.fits.includes(item.fit)                     : true;
      const matchPrice       = item.price <= filters.maxPrice;

      return matchCategory && matchSubCategory && matchType && matchSize
          && matchGender && matchPrice && matchCraft && matchMaterial && matchFit;
    });
  }, [products, filters, category, subCategory]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortOrder === 'low-high') return a.price - b.price;
      if (sortOrder === 'high-low') return b.price - a.price;
      return 0;
    });
  }, [filteredProducts, sortOrder]);

  return (
    <div className='flex flex-col sm:flex-row gap-10 pt-10 border-t'>

      {/* ================= LEFT SIDEBAR ================= */}
      <div className='w-full sm:w-[260px] sm:sticky sm:top-20 h-fit px-4'>

        <div className='flex items-center justify-between mb-4'>
          <p className='text-lg font-semibold'>FILTERS</p>
          {JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS) && (
            <button
              onClick={resetFilters}
              className="text-xs text-gray-400 underline hover:text-black"
            >
              Clear all
            </button>
          )}
        </div>

        {/* PRICE */}
        <FilterSection label="PRICE" open={openSections.price} onToggle={() => toggleSection('price')}>
          <div className="mt-4">
            <input
              type="range" min="500" max="30000"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full accent-black"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>₹ 500</span>
              <span>₹ {filters.maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </FilterSection>

        {/* PRODUCT TYPE */}
        <FilterSection label="PRODUCT TYPE" open={openSections.type} onToggle={() => toggleSection('type')}>
          <CheckboxList
            items={["Kurtas and sets", "Dresses", "Tops and Blouses"]}
            selected={filters.types}
            onToggle={(val) => toggleFilter('types', val)}
          />
        </FilterSection>

        {/* SIZE */}
        <FilterSection label="SIZE" open={openSections.size} onToggle={() => toggleSection('size')}>
          <CheckboxList
            items={["XXS", "XS", "S", "M", "L", "XL"]}
            selected={filters.sizes}
            onToggle={(val) => toggleFilter('sizes', val)}
          />
        </FilterSection>

        {/* GENDER */}
        <FilterSection label="GENDER" open={openSections.gender} onToggle={() => toggleSection('gender')}>
          <CheckboxList
            items={["Women", "Men"]}
            selected={filters.genders}
            onToggle={(val) => toggleFilter('genders', val)}
          />
        </FilterSection>

        {/* CRAFT */}
        <FilterSection label="CRAFT" open={openSections.craft} onToggle={() => toggleSection('craft')}>
          <CheckboxList
            items={["Embroidery", "Mirror Work", "Block Printing", "Ikat", "Chikankari", "Weaving", "Ombre"]}
            selected={filters.crafts}
            onToggle={(val) => toggleFilter('crafts', val)}
          />
        </FilterSection>

        {/* MATERIAL */}
        <FilterSection label="MATERIAL" open={openSections.material} onToggle={() => toggleSection('material')}>
          <CheckboxList
            items={["Cotton", "Silk", "Wool", "Linen", "Polyester", "Rayon", "Chanderi"]}
            selected={filters.materials}
            onToggle={(val) => toggleFilter('materials', val)}
          />
        </FilterSection>

        {/* FIT */}
        <FilterSection label="FIT" open={openSections.fit} onToggle={() => toggleSection('fit')}>
          <CheckboxList
            items={["Relaxed", "Straight", "Fit and Flare", "A-line", "Fitted", "Anti Fit"]}
            selected={filters.fits}
            onToggle={(val) => toggleFilter('fits', val)}
          />
        </FilterSection>

      </div>

      {/* ================= RIGHT SIDE PRODUCTS ================= */}
      <div className='flex-1'>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 text-sm">{sortedProducts.length} Products</p>
          <select
            className="border px-3 py-1 text-sm"
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value="default">Sort</option>
            <option value="low-high">Low to High</option>
            <option value="high-low">High to Low</option>
          </select>
        </div>

        {sortedProducts.length === 0
          ? <p className="text-gray-400 text-sm mt-10">No products match your filters.</p>
          : (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {sortedProducts.map((item) => (
                <div key={item._id} className="group cursor-pointer">
                  <div className="overflow-hidden">
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-full h-auto group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <p className="text-sm mt-2 text-gray-700">{item.name}</p>
                  <p className="text-sm font-medium">₹ {item.price}</p>
                </div>
              ))}
            </div>
          )
        }

      </div>
    </div>
  );
};

export default Clothing;