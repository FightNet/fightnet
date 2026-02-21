import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, API } from "@/App";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MessageCircle, UserPlus, UserMinus, Trophy, Target, Zap } from "lucide-react";
import PostCard from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [uploading, setUploading] = useState(false);

  const isOwnProfile = currentUser?.id === userId;

  const fetchProfile = useCallback(async () => {
    try {
      const [profileRes, postsRes] = await Promise.all([
        axios.get(`${API}/users/${userId}`),
        axios.get(`${API}/posts/user/${userId}`),
      ]);
      setProfile(profileRes.data);
      setPosts(postsRes.data);
      if (isOwnProfile) {
        setEditData({
          first_name: profileRes.data.first_name,
          fighter_type: profileRes.data.fighter_type,
          gym: profileRes.data.gym || "",
          bio: profileRes.data.bio || "",
          wins: profileRes.data.wins || 0,
          losses: profileRes.data.losses || 0,
          kos: profileRes.data.kos || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [userId, isOwnProfile]);

  useEffect(() => {
    setLoading(true);
    fetchProfile();
  }, [fetchProfile]);

  const handleFollow = async () => {
    try {
      if (profile.is_following) {
        await axios.post(`${API}/users/${userId}/unfollow`);
        setProfile((prev) => ({
          ...prev,
          is_following: false,
          follower_count: prev.follower_count - 1,
        }));
      } else {
        await axios.post(`${API}/users/${userId}/follow`);
        setProfile((prev) => ({
          ...prev,
          is_following: true,
          follower_count: prev.follower_count + 1,
        }));
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.post(`${API}/upload/profile-photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile((prev) => ({ ...prev, profile_photo: response.data.photo_url }));
      updateUser({ ...currentUser, profile_photo: response.data.photo_url });
      toast.success("Profile photo updated!");
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(`${API}/users/profile`, editData);
      setProfile((prev) => ({ ...prev, ...response.data }));
      updateUser({ ...currentUser, ...response.data });
      setShowEditModal(false);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setProfile((prev) => ({ ...prev, post_count: prev.post_count - 1 }));
  };

  const getAvatarUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith("http")) return photoUrl;
    return `${API_BASE}${photoUrl}`;
  };

  if (loading) {
    return (
      <div className="space-y-6" data-testid="profile-loading">
        <div className="bg-fight-charcoal border border-fight-concrete rounded-sm p-8">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-full bg-fight-concrete" />
            <Skeleton className="h-8 w-48 bg-fight-concrete" />
            <Skeleton className="h-4 w-32 bg-fight-concrete" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20" data-testid="profile-not-found">
        <div className="font-anton text-4xl text-fight-red mb-4">FIGHTER NOT FOUND</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="profile-container">
      {/* Profile Header */}
      <div className="bg-fight-charcoal border border-fight-concrete rounded-sm p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-fight-concrete">
              <AvatarImage src={getAvatarUrl(profile.profile_photo)} />
              <AvatarFallback className="bg-fight-black text-fight-red font-anton text-4xl">
                {profile.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 p-2 bg-fight-red rounded-full cursor-pointer hover:bg-red-700 transition-colors">
                <Camera size={18} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploading}
                  data-testid="photo-upload-input"
                />
              </label>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-anton text-3xl text-white uppercase tracking-wide">
              {profile.first_name}
            </h1>
            <p className="text-gray-500 font-barlow">@{profile.username}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
              <span className="px-3 py-1 bg-fight-red/20 text-fight-red font-barlow text-sm font-semibold rounded-sm">
                {profile.fighter_type}
              </span>
              {profile.gym && (
                <span className="text-gray-400 font-barlow text-sm">
                  {profile.gym}
                </span>
              )}
            </div>
            {profile.bio && (
              <p className="text-gray-300 font-barlow mt-3">{profile.bio}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {isOwnProfile ? (
              <Button
                onClick={() => setShowEditModal(true)}
                variant="outline"
                className="border-fight-concrete text-white hover:bg-fight-concrete font-barlow uppercase tracking-wider"
                data-testid="edit-profile-btn"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleFollow}
                  className={`font-barlow uppercase tracking-wider ${
                    profile.is_following
                      ? "bg-fight-concrete hover:bg-fight-black text-white"
                      : "bg-fight-red hover:bg-red-700 text-white"
                  }`}
                  data-testid="follow-btn"
                >
                  {profile.is_following ? (
                    <>
                      <UserMinus size={18} className="mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} className="mr-2" />
                      Follow
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => navigate(`/messages/${userId}`)}
                  variant="outline"
                  className="border-fight-concrete text-white hover:bg-fight-concrete font-barlow uppercase tracking-wider"
                  data-testid="message-btn"
                >
                  <MessageCircle size={18} className="mr-2" />
                  Message
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          <div className="stat-card p-4 text-center">
            <div className="font-anton text-2xl text-white">{profile.post_count}</div>
            <div className="text-gray-500 font-barlow text-xs uppercase tracking-wider">Posts</div>
          </div>
          <div className="stat-card p-4 text-center">
            <div className="font-anton text-2xl text-white">{profile.follower_count}</div>
            <div className="text-gray-500 font-barlow text-xs uppercase tracking-wider">Followers</div>
          </div>
          <div className="stat-card p-4 text-center flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Trophy size={18} className="text-green-500" />
              <span className="font-anton text-2xl text-green-500">{profile.wins || 0}</span>
            </div>
            <div className="text-gray-500 font-barlow text-xs uppercase tracking-wider">Wins</div>
          </div>
          <div className="stat-card p-4 text-center flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Target size={18} className="text-red-500" />
              <span className="font-anton text-2xl text-red-500">{profile.losses || 0}</span>
            </div>
            <div className="text-gray-500 font-barlow text-xs uppercase tracking-wider">Losses</div>
          </div>
          <div className="stat-card p-4 text-center flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Zap size={18} className="text-yellow-500" />
              <span className="font-anton text-2xl text-yellow-500">{profile.kos || 0}</span>
            </div>
            <div className="text-gray-500 font-barlow text-xs uppercase tracking-wider">KOs</div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full bg-fight-charcoal border border-fight-concrete rounded-sm p-1">
          <TabsTrigger
            value="posts"
            className="flex-1 font-barlow uppercase tracking-wider data-[state=active]:bg-fight-red data-[state=active]:text-white"
            data-testid="tab-posts"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className="flex-1 font-barlow uppercase tracking-wider data-[state=active]:bg-fight-red data-[state=active]:text-white"
            data-testid="tab-media"
          >
            Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6 space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-barlow">
              No posts yet
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onUpdate={handlePostUpdate}
                onDelete={handlePostDelete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {posts
              .filter((p) => p.media_url)
              .map((post) => (
                <div
                  key={post.id}
                  className="aspect-square bg-fight-charcoal border border-fight-concrete rounded-sm overflow-hidden cursor-pointer hover:border-fight-red transition-colors"
                  onClick={() => {}}
                >
                  {post.media_type === "video" ? (
                    <video
                      src={`${API_BASE}${post.media_url}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={`${API_BASE}${post.media_url}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
          </div>
          {posts.filter((p) => p.media_url).length === 0 && (
            <div className="text-center py-12 text-gray-500 font-barlow">
              No media yet
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-fight-charcoal border-fight-concrete max-w-md">
          <DialogHeader>
            <DialogTitle className="font-anton text-2xl text-white uppercase">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-gray-400 font-barlow uppercase text-xs tracking-wider">
                Name
              </Label>
              <Input
                value={editData.first_name || ""}
                onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                className="bg-black border-fight-concrete text-white"
                data-testid="edit-name-input"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400 font-barlow uppercase text-xs tracking-wider">
                Bio
              </Label>
              <Textarea
                value={editData.bio || ""}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                className="bg-black border-fight-concrete text-white resize-none"
                rows={3}
                data-testid="edit-bio-input"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400 font-barlow uppercase text-xs tracking-wider">
                Gym / Team
              </Label>
              <Input
                value={editData.gym || ""}
                onChange={(e) => setEditData({ ...editData, gym: e.target.value })}
                className="bg-black border-fight-concrete text-white"
                data-testid="edit-gym-input"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-400 font-barlow uppercase text-xs tracking-wider">
                  Wins
                </Label>
                <Input
                  type="number"
                  value={editData.wins || 0}
                  onChange={(e) => setEditData({ ...editData, wins: parseInt(e.target.value) || 0 })}
                  className="bg-black border-fight-concrete text-white"
                  data-testid="edit-wins-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400 font-barlow uppercase text-xs tracking-wider">
                  Losses
                </Label>
                <Input
                  type="number"
                  value={editData.losses || 0}
                  onChange={(e) => setEditData({ ...editData, losses: parseInt(e.target.value) || 0 })}
                  className="bg-black border-fight-concrete text-white"
                  data-testid="edit-losses-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400 font-barlow uppercase text-xs tracking-wider">
                  KOs
                </Label>
                <Input
                  type="number"
                  value={editData.kos || 0}
                  onChange={(e) => setEditData({ ...editData, kos: parseInt(e.target.value) || 0 })}
                  className="bg-black border-fight-concrete text-white"
                  data-testid="edit-kos-input"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveProfile}
              className="w-full bg-fight-red hover:bg-red-700 text-white font-barlow uppercase tracking-wider"
              data-testid="save-profile-btn"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
