import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { Home, User, MessageCircle, LogOut, Plus, ShoppingBag, Heart, MapPin, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import CreatePostModal from "@/components/CreatePostModal";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showCreatePost, setShowCreatePost] = useState(false);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const getAvatarUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith("http")) return photoUrl;
    return `${API_BASE}${photoUrl}`;
  };

  return (
    <div className="min-h-screen bg-fight-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-fight-black/95 backdrop-blur border-b border-fight-concrete">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
            <div className="flex items-center">
              <span className="font-anton text-2xl text-white tracking-wide">FIGHT</span>
              <span className="font-anton text-2xl text-fight-red tracking-wide">NET</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`p-3 rounded-sm transition-colors ${
                isActive("/") && location.pathname === "/" ? "text-fight-red" : "text-gray-400 hover:text-white"
              }`}
              data-testid="nav-home"
            >
              <Home size={22} />
            </Link>
            <Link
              to="/messages"
              className={`p-3 rounded-sm transition-colors ${
                isActive("/messages") ? "text-fight-red" : "text-gray-400 hover:text-white"
              }`}
              data-testid="nav-messages"
            >
              <MessageCircle size={22} />
            </Link>
            <Link
              to={`/profile/${user?.id}`}
              className={`p-3 rounded-sm transition-colors ${
                isActive("/profile") ? "text-fight-red" : "text-gray-400 hover:text-white"
              }`}
              data-testid="nav-profile"
            >
              <User size={22} />
            </Link>
            <Link
              to="/store"
              className={`p-3 rounded-sm transition-colors ${
                isActive("/store") ? "text-fight-red" : "text-gray-400 hover:text-white"
              }`}
              data-testid="nav-store"
            >
              <ShoppingBag size={22} />
            </Link>
            <Link
              to="/donate"
              className={`p-3 rounded-sm transition-colors ${
                isActive("/donate") ? "text-fight-red" : "text-gray-400 hover:text-white"
              }`}
              data-testid="nav-donate"
            >
              <Heart size={22} />
            </Link>
            <Link
              to="/gyms"
              className={`p-3 rounded-sm transition-colors ${
                isActive("/gyms") ? "text-fight-red" : "text-gray-400 hover:text-white"
              }`}
              data-testid="nav-gyms"
            >
              <MapPin size={22} />
            </Link>
            <Link
              to="/pro"
              className={`p-3 rounded-sm transition-colors ${
                isActive("/pro") ? "text-yellow-500" : "text-yellow-600 hover:text-yellow-400"
              }`}
              data-testid="nav-pro"
            >
              <Crown size={22} />
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowCreatePost(true)}
              className="bg-fight-red hover:bg-red-700 text-white font-barlow font-bold uppercase tracking-wider rounded-sm h-9 px-4"
              data-testid="create-post-btn"
            >
              <Plus size={18} className="mr-1" />
              Post
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none" data-testid="user-menu-trigger">
                  <Avatar className="h-9 w-9 border border-fight-concrete">
                    <AvatarImage src={getAvatarUrl(user?.profile_photo)} />
                    <AvatarFallback className="bg-fight-charcoal text-white font-barlow">
                      {user?.username?.[0]?.toUpperCase() || "F"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-fight-charcoal border-fight-concrete"
              >
                <DropdownMenuItem
                  onClick={() => navigate(`/profile/${user?.id}`)}
                  className="cursor-pointer text-gray-200 focus:bg-fight-concrete focus:text-white"
                  data-testid="menu-profile"
                >
                  <User size={16} className="mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-fight-red focus:bg-fight-concrete focus:text-fight-red"
                  data-testid="menu-logout"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Create Post Modal */}
      <CreatePostModal open={showCreatePost} onClose={() => setShowCreatePost(false)} />
    </div>
  );
}
