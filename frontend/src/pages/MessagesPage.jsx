import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, API } from "@/App";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function MessagesPage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/messages/conversations`);
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (partnerId) => {
    try {
      const response = await axios.get(`${API}/messages/${partnerId}`);
      setMessages(response.data);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  const fetchUserAndMessages = useCallback(async (partnerId) => {
    try {
      const userResponse = await axios.get(`${API}/users/${partnerId}`);
      setSelectedUser(userResponse.data);
      await fetchMessages(partnerId);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load conversation");
    }
  }, [fetchMessages]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (userId) {
      fetchUserAndMessages(userId);
    }
  }, [userId, fetchUserAndMessages]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await axios.get(`${API}/users/search/${searchQuery}`);
        setSearchResults(response.data.filter((u) => u.id !== currentUser.id));
      } catch (error) {
        console.error("Error searching users:", error);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, currentUser.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await axios.post(`${API}/messages`, {
        receiver_id: selectedUser.id,
        content: newMessage.trim(),
      });
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      // Update conversations list
      fetchConversations();
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const selectConversation = (conv) => {
    navigate(`/messages/${conv.user_id}`);
  };

  const selectSearchResult = (user) => {
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/messages/${user.id}`);
  };

  const getAvatarUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith("http")) return photoUrl;
    return `${API_BASE}${photoUrl}`;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-fight-charcoal border border-fight-concrete rounded-sm overflow-hidden" data-testid="messages-container">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-r border-fight-concrete flex flex-col ${userId ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-fight-concrete">
          <h2 className="font-anton text-xl text-white uppercase tracking-wide mb-3">Messages</h2>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fighters..."
              className="bg-black border-fight-concrete text-white pl-10"
              data-testid="search-users-input"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-fight-black border border-fight-concrete rounded-sm z-10 max-h-60 overflow-auto">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => selectSearchResult(user)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-fight-concrete transition-colors text-left"
                    data-testid={`search-result-${user.id}`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={getAvatarUrl(user.profile_photo)} />
                      <AvatarFallback className="bg-fight-charcoal text-white">
                        {user.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-white font-barlow font-medium">{user.first_name}</div>
                      <div className="text-gray-500 text-sm">@{user.username}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 font-barlow">
              No conversations yet. Search for fighters to start chatting!
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.user_id}
                onClick={() => selectConversation(conv)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-fight-concrete transition-colors text-left border-b border-fight-concrete/50 ${
                  userId === conv.user_id ? "bg-fight-concrete" : ""
                }`}
                data-testid={`conversation-${conv.user_id}`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={getAvatarUrl(conv.user_photo)} />
                    <AvatarFallback className="bg-fight-black text-fight-red font-anton">
                      {conv.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {conv.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-fight-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-barlow">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-barlow font-medium truncate">
                      {conv.username}
                    </span>
                    <span className="text-gray-500 text-xs font-barlow">
                      {formatDistanceToNow(new Date(conv.last_message_time), { addSuffix: false })}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm font-barlow truncate">{conv.last_message}</p>
                </div>
              </button>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!userId ? "hidden md:flex" : "flex"}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-fight-concrete flex items-center gap-3">
              <button
                onClick={() => navigate("/messages")}
                className="md:hidden text-gray-400 hover:text-white"
                data-testid="back-btn"
              >
                <ArrowLeft size={24} />
              </button>
              <Avatar className="h-10 w-10">
                <AvatarImage src={getAvatarUrl(selectedUser.profile_photo)} />
                <AvatarFallback className="bg-fight-black text-fight-red font-anton">
                  {selectedUser.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-white font-barlow font-medium">{selectedUser.first_name}</div>
                <div className="text-gray-500 text-sm">@{selectedUser.username}</div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 messages-scroll">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === currentUser.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-sm px-4 py-3 ${
                        msg.sender_id === currentUser.id
                          ? "message-sent text-white"
                          : "message-received text-white"
                      }`}
                      data-testid={`message-${msg.id}`}
                    >
                      <p className="font-barlow">{msg.content}</p>
                      <span className="text-xs opacity-60 mt-1 block">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-fight-concrete">
              <div className="flex gap-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-black border-fight-concrete text-white"
                  data-testid="message-input"
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-fight-red hover:bg-red-700 text-white px-6"
                  data-testid="send-message-btn"
                >
                  <Send size={18} />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 font-barlow">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
