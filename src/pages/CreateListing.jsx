import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload, X, Plus, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'appliances', name: 'Appliances' },
  { id: 'tools', name: 'Tools' },
  { id: 'sports', name: 'Sports' },
  { id: 'party-event', name: 'Party/Event' },
  { id: 'other', name: 'Other' },
]

const priceUnits = [
  { id: 'hour', name: 'Per Hour' },
  { id: 'day', name: 'Per Day' },
  { id: 'week', name: 'Per Week' },
  { id: 'month', name: 'Per Month' },
]

export default function CreateListing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    price: '',
    price_unit: 'day',
    location: '',
    available_from: '',
    available_to: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    if (id) {
      fetchListing()
    }
  }, [id, user])

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single()

      if (error) throw error

      setFormData({
        title: data.title,
        description: data.description || '',
        category: data.category,
        price: data.price,
        price_unit: data.price_unit || 'day',
        location: data.location || '',
        available_from: data.available_from || '',
        available_to: data.available_to || ''
      })
      setImages(data.images || [])
    } catch (error) {
      console.error('Error fetching listing:', error)
      navigate('/profile')
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const newImageFiles = [...imageFiles]
    const newImages = [...images]

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        newImageFiles.push(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          newImages.push(e.target.result)
          setImages([...newImages])
        }
        reader.readAsDataURL(file)
      }
    })

    setImageFiles(newImageFiles)
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newImageFiles = imageFiles.filter((_, i) => i !== index)
    setImages(newImages)
    setImageFiles(newImageFiles)
  }

  const uploadImages = async () => {
    const uploadedUrls = [...images.filter(img => img.startsWith('http'))]
    
    for (const file of imageFiles) {
      if (file instanceof File) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage
          .from('listings')
          .upload(fileName, file)

        if (!error && data) {
          const { data: { publicUrl } } = supabase.storage
            .from('listings')
            .getPublicUrl(fileName)
          uploadedUrls.push(publicUrl)
        }
      }
    }

    return uploadedUrls
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let imageUrls = images

      if (imageFiles.some(file => file instanceof File)) {
        setUploadingImages(true)
        imageUrls = await uploadImages()
        setUploadingImages(false)
      }

      const listingData = {
        ...formData,
        price: parseFloat(formData.price),
        images: imageUrls,
        owner_id: user.id
      }

      if (id) {
        // Update existing listing
        const { error } = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', id)

        if (error) throw error
      } else {
        // Create new listing
        const { data, error } = await supabase
          .from('listings')
          .insert(listingData)
          .select()

        if (error) throw error
      }

      navigate('/profile')
    } catch (error) {
      console.error('Error saving listing:', error)
      setError('Failed to save listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6">
            {id ? 'Edit Listing' : 'Create New Listing'}
          </h1>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Max 5)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Listing ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Photo</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                First photo will be the main image
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Sony PlayStation 5"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Describe your item, its condition, and any important details..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">PKR</span>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pricing Unit *
                </label>
                <select
                  required
                  value={formData.price_unit}
                  onChange={(e) => setFormData({...formData, price_unit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {priceUnits.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="City or neighborhood"
              />
            </div>

            {/* Availability */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available From
                </label>
                <input
                  type="date"
                  value={formData.available_from}
                  onChange={(e) => setFormData({...formData, available_from: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available To
                </label>
                <input
                  type="date"
                  min={formData.available_from}
                  value={formData.available_to}
                  onChange={(e) => setFormData({...formData, available_to: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (uploadingImages ? 'Uploading images...' : 'Saving...') : (id ? 'Update Listing' : 'Create Listing')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}