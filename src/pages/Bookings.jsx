import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar, Clock, Check, X, AlertCircle, Package, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export default function Bookings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('renter')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user, activeTab])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          listing:listings(*),
          renter:users(*),
          owner:listings(owner:users(*))
        `)
        .order('created_at', { ascending: false })

      if (activeTab === 'renter') {
        query = query.eq('renter_id', user.id)
      } else {
        query = query.eq('listing.owner_id', user.id)
      }

      const { data, error } = await query

      if (error) throw error
      
      // Flatten the owner data structure
      const formattedData = data?.map(booking => ({
        ...booking,
        owner: booking.owner?.owner
      })) || []
      
      setBookings(formattedData)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) throw error

      // Send notification message
      const booking = bookings.find(b => b.id === bookingId)
      if (booking) {
        const message = newStatus === 'accepted' 
          ? `Your booking for "${booking.listing.title}" has been accepted!`
          : newStatus === 'rejected'
          ? `Your booking for "${booking.listing.title}" has been declined.`
          : `Booking status updated to ${newStatus}`

        await supabase
          .from('messages')
          .insert({
            sender_id: user.id,
            receiver_id: booking.renter_id,
            booking_id: bookingId,
            text: message
          })
      }

      fetchBookings()
    } catch (error) {
      console.error('Error updating booking status:', error)
      alert('Failed to update booking status')
    }
  }

  const handlePaymentUpdate = async (bookingId, paymentStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: paymentStatus })
        .eq('id', bookingId)

      if (error) throw error
      fetchBookings()
    } catch (error) {
      console.error('Error updating payment status:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'returned': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600'
      case 'paid': return 'text-green-600'
      case 'refunded': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const filterBookingsByStatus = (status) => {
    const now = new Date()
    
    return bookings.filter(booking => {
      const endDate = new Date(booking.end_date)
      
      switch (status) {
        case 'active':
          return ['accepted', 'completed'].includes(booking.status) && endDate >= now
        case 'pending':
          return booking.status === 'pending'
        case 'past':
          return endDate < now || ['rejected', 'cancelled', 'returned'].includes(booking.status)
        default:
          return true
      }
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Please sign in to view your bookings</p>
          <Link
            to="/auth"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Bookings</h1>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('renter')}
              className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
                activeTab === 'renter'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              My Rentals
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
                activeTab === 'owner'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Rental Requests
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['active', 'pending', 'past'].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-full capitalize whitespace-nowrap ${
                filterBookingsByStatus(status).length > 0
                  ? 'bg-white text-gray-700 shadow'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {status} ({filterBookingsByStatus(status).length})
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-32 animate-pulse"></div>
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {['active', 'pending', 'past'].map(status => {
              const filteredBookings = filterBookingsByStatus(status)
              
              if (filteredBookings.length === 0) return null
              
              return (
                <div key={status}>
                  <h2 className="text-lg font-semibold capitalize mb-3">
                    {status} Bookings
                  </h2>
                  <div className="space-y-3">
                    {filteredBookings.map(booking => {
                      // Skip if listing is missing
                      if (!booking.listing) {
                        return (
                          <div key={booking.id} className="bg-white rounded-lg shadow p-4">
                            <div className="text-gray-500">
                              <p className="font-medium">Listing no longer available</p>
                              <div className="flex items-center gap-4 text-sm mt-2">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {format(new Date(booking.start_date), 'MMM dd')} - {format(new Date(booking.end_date), 'MMM dd, yyyy')}
                                </span>
                                <span className="font-medium">
                                  PKR {booking.total_price.toLocaleString()}
                                </span>
                              </div>
                              <div className="mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      
                      return (
                      <div key={booking.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Item Image */}
                          <Link
                            to={`/listing/${booking.listing.id}`}
                            className="flex-shrink-0"
                          >
                            <img
                              src={booking.listing.images?.[0] || 'https://via.placeholder.com/150'}
                              alt={booking.listing.title}
                              className="w-full md:w-32 h-24 md:h-24 object-cover rounded-lg"
                            />
                          </Link>

                          {/* Booking Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <Link
                                  to={`/listing/${booking.listing.id}`}
                                  className="font-semibold text-gray-900 hover:text-primary-600"
                                >
                                  {booking.listing.title}
                                </Link>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(booking.start_date), 'MMM dd')} - {format(new Date(booking.end_date), 'MMM dd, yyyy')}
                                  </span>
                                  <span className="font-medium">
                                    PKR {booking.total_price.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </span>
                                <span className={`text-xs font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                                  Payment: {booking.payment_status}
                                </span>
                              </div>
                            </div>

                            {/* Contact Info */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              {activeTab === 'renter' ? (
                                <>
                                  <span>Owner: {booking.owner?.name}</span>
                                  {booking.owner?.phone && (
                                    <span>• {booking.owner.phone}</span>
                                  )}
                                </>
                              ) : (
                                <>
                                  <span>Renter: {booking.renter?.name}</span>
                                  {booking.renter?.phone && (
                                    <span>• {booking.renter.phone}</span>
                                  )}
                                </>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              {activeTab === 'owner' && booking.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(booking.id, 'accepted')}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                  >
                                    <Check className="h-4 w-4" />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                    Decline
                                  </button>
                                </>
                              )}
                              
                              {activeTab === 'owner' && booking.status === 'accepted' && (
                                <>
                                  {booking.payment_status === 'pending' && (
                                    <button
                                      onClick={() => handlePaymentUpdate(booking.id, 'paid')}
                                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                    >
                                      Mark as Paid
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleStatusUpdate(booking.id, 'returned')}
                                    className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                                  >
                                    Mark as Returned
                                  </button>
                                </>
                              )}
                              
                              {activeTab === 'renter' && booking.status === 'pending' && (
                                <button
                                  onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                  className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700"
                                >
                                  Cancel Request
                                </button>
                              )}
                              
                              <Link
                                to={`/messages?booking=${booking.id}`}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                              >
                                <MessageSquare className="h-4 w-4" />
                                Message
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {activeTab === 'renter' 
                ? "You haven't made any bookings yet"
                : "You don't have any rental requests"}
            </p>
            {activeTab === 'renter' && (
              <Link
                to="/"
                className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Browse Listings
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}