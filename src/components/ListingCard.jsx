import { Star, MapPin, User, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ListingCard({ listing, viewMode = 'grid' }) {
  const imageUrl = listing.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'
  
  if (viewMode === 'list') {
    return (
      <Link to={`/listing/${listing.id}`} className="block">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300">
          <div className="flex gap-4 p-4">
            <div className="flex-shrink-0">
              <img 
                src={imageUrl} 
                alt={listing.title}
                className="w-32 h-24 object-cover rounded-lg"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{listing.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{listing.description}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{listing.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{listing.owner?.name}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {listing.category}
                    </span>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-blue-600">
                    PKR {listing.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">/{listing.price_unit || 'day'}</div>
                  
                  {listing.owner?.rating > 0 && (
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{listing.owner.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }
  
  return (
    <Link to={`/listing/${listing.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 hover:-translate-y-1">
        <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={listing.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-xs font-medium text-gray-700">{listing.category}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{listing.title}</h3>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{listing.location || 'Location not specified'}</span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xl font-bold text-blue-600">
                PKR {listing.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">/{listing.price_unit || 'day'}</span>
            </div>
            
            {listing.owner?.rating > 0 && (
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-600">{listing.owner.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>{listing.owner?.name}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}