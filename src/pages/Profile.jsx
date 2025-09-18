import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  User, Mail, Phone, Star, Edit2, Plus, Trash2, 
  Package, Camera, Save, X, LogOut 
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import ListingCard from '../components/ListingCard'

export default function Profile() {
  const { user, userProfile, updateProfile, signOut } = useAuth()
  const navigate = useNavigate()
  
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    profile_pic: ''
  })
  const [listings, setListings] = useState([])
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({
    totalListings: 0,
    activeBookings: 0,
    completedRentals: 0,
    averageRating: 0
  })

  useEffect(() => {
    if (user && userProfile) {
      setProfileData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        profile_pic: userProfile.profile_pic || ''
      })
      fetchUserData()
    }
  }, [user, userProfile])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      // Fetch user's listings
      const { data: listingsData } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      setListings(listingsData || [])

      // Fetch reviews about the user
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users(name, profile_pic),
          listing:listings(title)
        `)
        .eq('reviewee_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setReviews(reviewsData || [])

      // Fetch stats
      const { count: totalListings } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id)

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('status')
        .or(`renter_id.eq.${user.id},listing_id.in.(${listingsData?.map(l => l.id).join(',')})`)

      const activeBookings = bookingsData?.filter(b => ['pending', 'accepted'].includes(b.status)).length || 0
      const completedRentals = bookingsData?.filter(b => ['completed', 'returned'].includes(b.status)).length || 0

      setStats({
        totalListings: totalListings || 0,
        activeBookings,
        completedRentals,
        averageRating: userProfile?.rating || 0
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      const fileName = `${user.id}/profile-${Date.now()}.${file.name.split('.').pop()}`
      
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, { upsert: true })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName)

      setProfileData(prev => ({ ...prev, profile_pic: publicUrl }))
      
      // Auto-save profile picture
      await updateProfile({ profile_pic: publicUrl })
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Failed to upload photo')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      const { error } = await updateProfile(profileData)
      if (error) throw error
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    }
  }

  const handleDeleteListing = async (listingId) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      const { error } = await supabase
        .from('listings')
        .update({ is_active: false })
        .eq('id', listingId)

      if (error) throw error
      fetchUserData()
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('Failed to delete listing')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Please sign in to view your profile</p>
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
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              {profileData.profile_pic ? (
                <img
                  src={profileData.profile_pic}
                  alt={profileData.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 md:h-16 md:w-16 text-gray-400" />
                </div>
              )}
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="text-2xl font-bold px-3 py-1 border border-gray-300 rounded-lg"
                    placeholder="Your Name"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="px-2 py-1 border border-gray-300 rounded"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{userProfile?.name}</h1>
                  <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    {userProfile?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{userProfile.phone}</span>
                      </div>
                    )}
                    {userProfile?.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{userProfile.rating.toFixed(1)}</span>
                        <span className="text-gray-500">({reviews.length} reviews)</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleProfileUpdate}
                    disabled={uploadingPhoto}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300"
                  >
                    <Save className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setProfileData({
                        name: userProfile.name,
                        phone: userProfile.phone || '',
                        profile_pic: userProfile.profile_pic || ''
                      })
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
              <p className="text-sm text-gray-600">Listings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
              <p className="text-sm text-gray-600">Active Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.completedRentals}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
              </p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
          </div>
        </div>

        {/* My Listings */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Listings</h2>
            <Link
              to="/create-listing"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-5 w-5" />
              Add Listing
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map(listing => (
                <div key={listing.id} className="relative">
                  <ListingCard listing={listing} />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Link
                      to={`/edit-listing/${listing.id}`}
                      className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
                    >
                      <Edit2 className="h-4 w-4 text-gray-600" />
                    </Link>
                    <button
                      onClick={() => handleDeleteListing(listing.id)}
                      className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't listed any items yet</p>
              <Link
                to="/create-listing"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Create your first listing
              </Link>
            </div>
          )}
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
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
                        <div>
                          <span className="font-medium">{review.reviewer?.name}</span>
                          {review.listing && (
                            <span className="text-sm text-gray-500 ml-2">
                              for {review.listing.title}
                            </span>
                          )}
                        </div>
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
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}