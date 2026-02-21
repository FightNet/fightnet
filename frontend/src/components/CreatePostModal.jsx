import { useState, useRef } from "react";
import { API } from "@/App";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Video, X, Upload } from "lucide-react";
import { toast } from "sonner";

export default function CreatePostModal({ open, onClose }) {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      toast.error("Please select a video or image file");
      return;
    }

    setMedia(file);
    setPreview({
      url: URL.createObjectURL(file),
      type: isVideo ? "video" : "image",
    });
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !media) {
      toast.error("Add a caption or media");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("caption", caption.trim());
      if (media) {
        formData.append("media", media);
      }

      await axios.post(`${API}/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post shared!");
      setCaption("");
      handleRemoveMedia();
      onClose();
      
      // Refresh page to show new post
      window.location.reload();
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setCaption("");
      handleRemoveMedia();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-fight-charcoal border-fight-concrete max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-anton text-2xl text-white uppercase tracking-wide">
            Share Your Training
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Caption */}
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's happening in the gym?"
            className="bg-black border-fight-concrete text-white resize-none min-h-[120px] placeholder:text-gray-600"
            data-testid="post-caption-input"
          />

          {/* Media Preview */}
          {preview && (
            <div className="relative rounded-sm overflow-hidden border border-fight-concrete">
              <button
                type="button"
                onClick={handleRemoveMedia}
                className="absolute top-2 right-2 z-10 p-1 bg-black/80 rounded-full text-white hover:bg-black"
                data-testid="remove-media-btn"
              >
                <X size={18} />
              </button>
              {preview.type === "video" ? (
                <video
                  src={preview.url}
                  controls
                  className="w-full max-h-64 object-contain bg-black"
                  data-testid="media-preview-video"
                />
              ) : (
                <img
                  src={preview.url}
                  alt="Preview"
                  className="w-full max-h-64 object-contain bg-black"
                  data-testid="media-preview-image"
                />
              )}
            </div>
          )}

          {/* Media Upload */}
          {!preview && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-fight-concrete rounded-sm p-8 text-center cursor-pointer hover:border-fight-red transition-colors"
              data-testid="media-upload-area"
            >
              <Upload size={32} className="mx-auto text-gray-500 mb-3" />
              <p className="text-gray-500 font-barlow">
                Click to upload a video or image
              </p>
              <p className="text-gray-600 font-barlow text-sm mt-1">
                MP4, MOV, JPG, PNG
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*"
            onChange={handleFileSelect}
            className="hidden"
            data-testid="file-input"
          />

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-fight-concrete">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-gray-500 hover:text-fight-red transition-colors"
              data-testid="add-media-btn"
            >
              <Video size={20} />
              <span className="font-barlow text-sm">Add Media</span>
            </button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="border-fight-concrete text-white hover:bg-fight-concrete font-barlow uppercase tracking-wider"
                data-testid="cancel-post-btn"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || (!caption.trim() && !media)}
                className="bg-fight-red hover:bg-red-700 text-white font-barlow font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(220,38,38,0.4)]"
                data-testid="submit-post-btn"
              >
                {loading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
