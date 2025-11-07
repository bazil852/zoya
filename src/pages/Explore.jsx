import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search, Smartphone, Gamepad2, Car, Home, Wrench, Dumbbell, Camera, Music,
  Star, MapPin, Filter, X
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const categories = [
  { id: 'electronics', name: 'Electronics', icon: Smartphone },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
  { id: 'automotive', name: 'Automotive', icon: Car },
  { id: 'home', name: 'Home & Garden', icon: Home },
  { id: 'tools', name: 'Tools', icon: Wrench },
  { id: 'sports', name: 'Sports', icon: Dumbbell },
  { id: 'photography', name: 'Photography', icon: Camera },
  { id: 'music', name: 'Music', icon: Music },
]

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    filterListings()
  }, [searchQuery, selectedCategory, priceRange, listings])

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          owner:users(name, rating, profile_pic)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setListings(data || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterListings = () => {
    let filtered = [...listings]

    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(listing => listing.category === selectedCategory)
    }

    if (priceRange.min) {
      filtered = filtered.filter(listing => listing.price >= parseFloat(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter(listing => listing.price <= parseFloat(priceRange.max))
    }

    setFilteredListings(filtered)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ search: searchQuery })
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    if (categoryId) {
      setSearchParams({ category: categoryId })
    } else {
      setSearchParams({})
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setPriceRange({ min: '', max: '' })
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src="/Logo.png" alt="Rentique" className="h-8" />
            </Link>

            <div className="flex items-center gap-4">
              <Link
                to="/auth"
                className="text-gray-700 hover:text-black font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Header */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-4">Explore Listings</h1>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for items..."
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white text-black px-4 py-4 rounded-lg hover:bg-gray-100 flex items-center gap-2 md:hidden"
            >
              <Filter className="h-5 w-5" />
            </button>
            <button
              type="submit"
              className="hidden md:block bg-white text-black px-8 py-4 rounded-lg hover:bg-gray-100 font-medium"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                !selectedCategory
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(category => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 md:hidden">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min PKR"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Max PKR"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="w-full text-sm text-black hover:text-gray-700"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Desktop Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-20">
              <h3 className="font-semibold mb-4">Filters</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min PKR"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Max PKR"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full text-sm text-black hover:text-gray-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            <div className="mb-4">
              <p className="text-gray-600">
                {filteredListings.length} items available
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100"></div>
                ))}
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(listing => (
                  <Link
                    key={listing.id}
                    to={`/listing/${listing.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                      <img
                        src={listing.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={listing.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          {listing.category}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{listing.title}</h4>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-black">
                          PKR {listing.price.toLocaleString()}<span className="text-sm text-gray-500">/{listing.price_unit || 'day'}</span>
                        </span>
                        {listing.owner?.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{listing.owner.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{listing.location || 'Location not specified'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No items found</p>
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your filters or search term
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
