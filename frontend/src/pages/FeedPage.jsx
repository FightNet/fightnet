import { useState, useEffect, useCallback } from "react";
import { API } from "@/App";
import axios from "axios";
import PostCard from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (loading) {
    return (
      <div className="space-y-6" data-testid="feed-loading">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-fight-charcoal border border-fight-concrete rounded-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-full bg-fight-concrete" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-fight-concrete" />
                <Skeleton className="h-3 w-24 bg-fight-concrete" />
              </div>
            </div>
            <Skeleton className="h-64 w-full bg-fight-concrete" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20" data-testid="feed-empty">
        <div className="font-anton text-4xl text-fight-red mb-4">NO POSTS YET</div>
        <p className="text-gray-500 font-barlow">
          Be the first to share your training footage
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="feed-container">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onUpdate={handlePostUpdate}
          onDelete={handlePostDelete}
        />
      ))}
    </div>
  );
}
