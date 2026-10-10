import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

/* ── Design tokens ── */
const inputClass =
  'w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[#c4a270]'
const inputStyle = { background: '#f5eedc', border: '1px solid #c9a96e', color: '#2c1a0e' }

/* ── Reusable labelled field wrapper ── */
const FormField = ({ label, required, children }) => (
  <div className='flex flex-col gap-1'>
    <label className='text-xs font-semibold' style={{ color: '#2c1a0e' }}>
      {label}
      {required && <span style={{ color: '#8b0000' }}> *</span>}
    </label>
    {children}
  </div>
)

/* ── Section card ── */
const Card = ({ title, children }) => (
  <div className='rounded-2xl p-6' style={{ background: '#ffffff', border: '1px solid #c9a96e' }}>
    {title && (
      <p className='text-sm font-bold mb-4 pb-2' style={{ color: '#2c1a0e', borderBottom: '1px solid #e8d5a3' }}>
        {title}
      </p>
    )}
    {children}
  </div>
)

/* ── Single image upload box ── */
const ImageUpload = ({ id, image, setImage }) => (
  <label htmlFor={id} className='cursor-pointer'>
    <div
      className='w-24 h-24 rounded-xl flex flex-col items-center justify-center overflow-hidden transition-all duration-200 hover:shadow-md'
      style={{
        background: image ? 'transparent' : '#f5eedc',
        border: `2px dashed ${image ? '#8b6914' : '#c9a96e'}`,
      }}
    >
      {image ? (
        <img
          src={URL.createObjectURL(image)}
          alt='preview'
          className='w-full h-full object-cover'
        />
      ) : (
        <>
          <svg className='w-7 h-7 mb-1' fill='none' stroke='#c9a96e' strokeWidth={1.5} viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round'
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
          </svg>
          <span className='text-[10px] font-semibold' style={{ color: '#9a7d50' }}>Upload</span>
        </>
      )}
    </div>
    <input onChange={e => setImage(e.target.files[0])} type='file' id={id} hidden accept='image/*' />
  </label>
)

/* ════════════════════════════════════════
   ADD PRODUCT PAGE
════════════════════════════════════════ */
const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name,        setName]        = useState('')
  const [description, setDescription] = useState('')
  const [price,       setPrice]       = useState('')
  const [category,    setCategory]    = useState('Clothing')
  const [subCategory, setSubCategory] = useState('Kurtas & Sets')
  const [bestseller,  setBestseller]  = useState(false)
  const [sizes,       setSizes]       = useState([])
  const [loading,     setLoading]     = useState(false)

  const toggleSize = (size) =>
    setSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )

  const resetForm = () => {
    setName(''); setDescription(''); setPrice('')
    setCategory('Clothing'); setSubCategory('Kurtas & Sets')
    setBestseller(false); setSizes([])
    setImage1(false); setImage2(false); setImage3(false); setImage4(false)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name',        name)
      formData.append('description', description)
      formData.append('price',       price)
      formData.append('category',    category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller',  bestseller)
      formData.append('sizes',       JSON.stringify(sizes))
      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      const response = await axios.post(backendUrl + '/api/product/add', formData, {
        headers: { token },
      })

      if (response.data.success) {
        toast.success(response.data.message)
        resetForm()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6 max-w-3xl w-full'>

      {/* Page heading */}
      <div className='mb-6'>
        <h1 className='text-xl font-bold' style={{ color: '#2c1a0e' }}>Add New Product</h1>
        <p className='text-xs mt-0.5' style={{ color: '#7a5c3a' }}>
          List a new artisan product on KalaSetu
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5'>

        {/* ── 1. Images ── */}
        <Card title='Product Images'>
          <div className='flex gap-3 flex-wrap'>
            <ImageUpload id='image1' image={image1} setImage={setImage1} />
            <ImageUpload id='image2' image={image2} setImage={setImage2} />
            <ImageUpload id='image3' image={image3} setImage={setImage3} />
            <ImageUpload id='image4' image={image4} setImage={setImage4} />
          </div>
          <p className='text-[10px] mt-3' style={{ color: '#9a7d50' }}>
            Upload up to 4 images. The first image becomes the cover photo.
          </p>
        </Card>

        {/* ── 2. Core details ── */}
        <Card title='Product Details'>
          <div className='flex flex-col gap-4'>
            <FormField label='Product Name' required>
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                className={inputClass}
                style={inputStyle}
                type='text'
                placeholder='e.g., Blue Pottery Vase'
                required
              />
            </FormField>

            <FormField label='Product Description' required>
              <textarea
                onChange={e => setDescription(e.target.value)}
                value={description}
                className={inputClass}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                placeholder='Describe the craft, technique used, artisan story, materials…'
                required
              />
            </FormField>
          </div>
        </Card>

        {/* ── 3. Category + Price ── */}
        <Card title='Category & Pricing'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>

            <FormField label='Category' required>
              <select
                onChange={e => setCategory(e.target.value)}
                value={category}
                className={inputClass}
                style={{ ...inputStyle, appearance: 'none' }}
              >
                <option value='Clothing'>Clothing</option>
                <option value='Handicrafts'>Handicrafts</option>
                <option value='Accessories'>Accessories</option>
                <option value='Endangered'>Endangered Crafts</option>
              </select>
            </FormField>

            <FormField label='Sub Category' required>
              <select
                onChange={e => setSubCategory(e.target.value)}
                value={subCategory}
                className={inputClass}
                style={{ ...inputStyle, appearance: 'none' }}
              >
                {/* Clothing */}
                <option value='Kurtas & Sets'>Kurtas & Sets</option>
                <option value='Topwear'>Topwear</option>
                <option value='Bottomwear'>Bottomwear</option>
                <option value='Dresses'>Dresses</option>
                <option value='Tops & Blouses'>Tops & Blouses</option>
                <option value='Winterwear'>Winterwear</option>
                {/* Handicrafts */}
                <option value='Pottery'>Pottery</option>
                <option value='Paintings'>Paintings</option>
                <option value='Woodwork'>Woodwork</option>
                <option value='Metalwork'>Metalwork</option>
                <option value='Weaving'>Weaving</option>
                <option value='Sculpture'>Sculpture</option>
                {/* Accessories */}
                <option value='Jewellery'>Jewellery</option>
                <option value='Bags'>Bags</option>
                <option value='Footwear'>Footwear</option>
              </select>
            </FormField>

            <FormField label='Price (₹)' required>
              <input
                onChange={e => setPrice(e.target.value)}
                value={price}
                className={inputClass}
                style={inputStyle}
                type='number'
                placeholder='e.g., 2500'
                min={1}
                required
              />
            </FormField>
          </div>
        </Card>

        {/* ── 4. Sizes ── */}
        <Card title='Available Sizes'>
          <div className='flex gap-2 flex-wrap'>
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <button
                key={size}
                type='button'
                onClick={() => toggleSize(size)}
                className='px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95'
                style={{
                  background:  sizes.includes(size) ? '#d4b483' : '#f5eedc',
                  border:      `1.5px solid ${sizes.includes(size) ? '#8b6914' : '#c9a96e'}`,
                  color:       sizes.includes(size) ? '#2c1a0e' : '#7a5c3a',
                }}
              >
                {size}
              </button>
            ))}
          </div>
          <p className='text-[10px] mt-3' style={{ color: '#9a7d50' }}>
            Leave unselected for one-size or handicraft items.
          </p>
        </Card>

        {/* ── 5. Bestseller toggle + Submit ── */}
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <label className='flex items-center gap-2.5 cursor-pointer select-none'>
            <input
              onChange={() => setBestseller(prev => !prev)}
              checked={bestseller}
              type='checkbox'
              id='bestseller'
              className='w-4 h-4 accent-[#8b6914] cursor-pointer'
            />
            <span className='text-sm font-medium' style={{ color: '#2c1a0e' }}>
              Mark as Bestseller ⚡
            </span>
          </label>

          <button
            type='submit'
            disabled={loading}
            className='px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[.98] disabled:opacity-60'
            style={{ background: 'linear-gradient(135deg, #5c3d0a, #8b6914)', color: 'white' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            {loading ? 'Adding…' : '+ Add Product'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default Add
