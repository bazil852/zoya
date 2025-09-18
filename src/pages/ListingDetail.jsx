import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { format, differenceInDays, addDays } from 'date-fns'
import { 
  MapPin, Star, Calendar, User, ChevronLeft, ChevronRight, 
  MessageSquare, Shield, CheckCircle, X 
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingDates, setBookingDates] = useState({
    startDate: '',
    endDate: ''
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [existingBookings, setExistingBookings] = useState([])

  useEffect(() => {
    fetchListingDetails()
    fetchReviews()
    fetchExistingBookings()
  }, [id])

  const fetchListingDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          owner:users(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setListing(data)
    } catch (error) {
      console.error('Error fetching listing:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users(name, profile_pic)
        `)
        .eq('listing_id', id)
        .order('created_at', { ascending: false })

      if (!error) setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const fetchExistingBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('start_date, end_date')
        .eq('listing_id', id)
        .in('status', ['accepted', 'pending'])

      if (!error) setExistingBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleBooking = async () => {
    if (!user) {
      navigate('/auth')
      return
    }

    setBookingLoading(true)
    
    try {
      const days = differenceInDays(
        new Date(bookingDates.endDate), 
        new Date(bookingDates.startDate)
      ) + 1
      
      const totalPrice = listing.price * days

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          listing_id: listing.id,
          renter_id: user.id,
          start_date: bookingDates.startDate,
          end_date: bookingDates.endDate,
          total_price: totalPrice,
          status: 'pending'
        })
        .select()

      if (error) throw error

      // Send notification message to owner
      await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: listing.owner_id,
          booking_id: data[0].id,
          text: `New booking request for "${listing.title}" from ${format(new Date(bookingDates.startDate), 'MMM dd')} to ${format(new Date(bookingDates.endDate), 'MMM dd')}`
        })

      alert('Booking request sent successfully!')
      setShowBookingModal(false)
      navigate('/bookings')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const isDateAvailable = (date) => {
    const checkDate = new Date(date)
    return !existingBookings.some(booking => {
      const start = new Date(booking.start_date)
      const end = new Date(booking.end_date)
      return checkDate >= start && checkDate <= end
    })
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!listing) return null

  const images = listing.images?.length > 0 
    ? listing.images 
    : ['https://via.placeholder.com/800x600?text=No+Image']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-64 md:h-96 bg-gray-900">
        <img 
          src={images[currentImageIndex]} 
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Price */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{listing.location || 'Location not specified'}</span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {listing.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    PKR {listing.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    per {listing.price_unit || 'day'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-4">
                <h2 className="font-semibold text-lg mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {listing.description || 'No description provided'}
                </p>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">Listed by</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {listing.owner?.profile_pic ? (
                    <img 
                      src={listing.owner.profile_pic} 
                      alt={listing.owner.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{listing.owner?.name}</p>
                    {listing.owner?.rating > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{listing.owner.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                {user && user.id !== listing.owner_id && (
                  <Link
                    to={`/messages?user=${listing.owner_id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Message
                  </Link>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">
                Reviews ({reviews.length})
              </h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-start gap-3">
                        {review.reviewer?.profile_pic ? (
                          <img 
                            src={review.reviewer.profile_pic} 
                            alt={review.reviewer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{review.reviewer?.name}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {format(new Date(review.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-20">
              <h3 className="font-semibold text-lg mb-4">Book this item</h3>
              
              {listing.available_from && listing.available_to && (
                <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Available from {format(new Date(listing.available_from), 'MMM dd')} to {format(new Date(listing.available_to), 'MMM dd')}
                </div>
              )}

              <button
                onClick={() => setShowBookingModal(true)}
                disabled={user?.id === listing.owner_id}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                {user?.id === listing.owner_id ? 'This is your listing' : 'Request to Book'}
              </button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  Verified listing
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Secure payments
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                  24/7 support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Select Rental Dates</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  max={listing.available_to}
                  value={bookingDates.startDate}
                  onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  min={bookingDates.startDate || format(new Date(), 'yyyy-MM-dd')}
                  max={listing.available_to}
                  value={bookingDates.endDate}
                  onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {bookingDates.startDate && bookingDates.endDate && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">
                      PKR {listing.price.toLocaleString()} x {differenceInDays(new Date(bookingDates.endDate), new Date(bookingDates.startDate)) + 1} days
                    </span>
                    <span className="font-semibold">
                      PKR {(listing.price * (differenceInDays(new Date(bookingDates.endDate), new Date(bookingDates.startDate)) + 1)).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-primary-600">
                        PKR {(listing.price * (differenceInDays(new Date(bookingDates.endDate), new Date(bookingDates.startDate)) + 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  disabled={!bookingDates.startDate || !bookingDates.endDate || bookingLoading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}