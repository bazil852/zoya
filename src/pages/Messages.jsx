import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import { Send, User, Search, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export default function Messages() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef(null)
  const [showMobileChat, setShowMobileChat] = useState(false)

  useEffect(() => {
    if (user) {
      fetchConversations()
      subscribeToMessages()
    }
  }, [user])

  useEffect(() => {
    const userId = searchParams.get('user')
    const bookingId = searchParams.get('booking')
    
    if (userId && conversations.length > 0) {
      const conversation = conversations.find(c => 
        c.other_user.id === userId
      )
      if (conversation) {
        selectConversation(conversation)
      }
    }
  }, [searchParams, conversations])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          // Update messages if in current conversation
          if (selectedConversation && 
              (payload.new.sender_id === selectedConversation.other_user.id ||
               payload.new.receiver_id === selectedConversation.other_user.id)) {
            setMessages(prev => [...prev, payload.new])
          }
          // Update conversation list
          fetchConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const fetchConversations = async () => {
    try {
      // Get all messages involving the current user
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id(*),
          receiver:users!receiver_id(*)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group messages by conversation
      const conversationMap = new Map()
      
      messages?.forEach(message => {
        const otherUserId = message.sender_id === user.id 
          ? message.receiver_id 
          : message.sender_id
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            other_user: message.sender_id === user.id 
              ? message.receiver 
              : message.sender,
            last_message: message,
            unread_count: 0
          })
        }
        
        // Count unread messages
        if (message.receiver_id === user.id && !message.is_read) {
          const conv = conversationMap.get(otherUserId)
          conv.unread_count++
        }
      })

      setConversations(Array.from(conversationMap.values()))
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation)
    setShowMobileChat(true)
    
    try {
      // Fetch all messages for this conversation
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${conversation.other_user.id}),and(sender_id.eq.${conversation.other_user.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      if (!error) {
        setMessages(data || [])
        
        // Mark messages as read
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('receiver_id', user.id)
          .eq('sender_id', conversation.other_user.id)
        
        // Update local conversation unread count
        setConversations(prev => prev.map(c => 
          c.other_user.id === conversation.other_user.id 
            ? { ...c, unread_count: 0 }
            : c
        ))
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    setSending(true)
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedConversation.other_user.id,
          text: newMessage.trim()
        })
        .select()
        .single()

      if (!error) {
        setMessages(prev => [...prev, data])
        setNewMessage('')
        fetchConversations()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.other_user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view messages</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Conversations List - Desktop always visible, Mobile conditionally */}
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map(conversation => (
              <button
                key={conversation.other_user.id}
                onClick={() => selectConversation(conversation)}
                className={`w-full p-4 hover:bg-gray-50 flex items-start gap-3 transition-colors ${
                  selectedConversation?.other_user.id === conversation.other_user.id 
                    ? 'bg-primary-50 hover:bg-primary-50' 
                    : ''
                }`}
              >
                {conversation.other_user.profile_pic ? (
                  <img
                    src={conversation.other_user.profile_pic}
                    alt={conversation.other_user.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">
                      {conversation.other_user.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {format(new Date(conversation.last_message.created_at), 'MMM d')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.last_message.sender_id === user.id && 'You: '}
                    {conversation.last_message.text}
                  </p>
                  {conversation.unread_count > 0 && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'No conversations found' : 'No messages yet'}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${showMobileChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => setShowMobileChat(false)}
                className="md:hidden text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              
              {selectedConversation.other_user.profile_pic ? (
                <img
                  src={selectedConversation.other_user.profile_pic}
                  alt={selectedConversation.other_user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              )}
              
              <div>
                <p className="font-semibold">{selectedConversation.other_user.name}</p>
                {selectedConversation.other_user.phone && (
                  <p className="text-sm text-gray-500">{selectedConversation.other_user.phone}</p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === user.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_id === user.id ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {format(new Date(message.created_at), 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}