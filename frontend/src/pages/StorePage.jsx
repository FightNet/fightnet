import { useState } from "react";
import { ShoppingBag, Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Sample placeholder items - Owner can edit these directly in the code
const STORE_ITEMS = [
  {
    id: "1",
    name: "Pro MMA Gloves",
    description: "Professional grade MMA training gloves. Perfect for sparring and bag work.",
    price: 59.99,
    category: "Gloves",
    image: "https://images.unsplash.com/photo-1583473848882-f9a5bc1a4e98?w=400",
    inStock: true,
  },
  {
    id: "2",
    name: "Fight Shorts",
    description: "Lightweight, breathable fight shorts with reinforced stitching.",
    price: 44.99,
    category: "Shorts",
    image: "https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?w=400",
    inStock: true,
  },
  {
    id: "3",
    name: "FightNet Training Shirt",
    description: "Premium cotton blend training shirt with moisture-wicking technology.",
    price: 29.99,
    category: "Shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    inStock: true,
  },
  {
    id: "4",
    name: "Hand Wraps (Pair)",
    description: "180 inch hand wraps for maximum protection during training.",
    price: 12.99,
    category: "Training Gear",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400",
    inStock: true,
  },
];

const CATEGORIES = ["All", "Gloves", "Shorts", "Shirts", "Training Gear"];

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);

  const filteredItems = selectedCategory === "All" 
    ? STORE_ITEMS 
    : STORE_ITEMS.filter(item => item.category === selectedCategory);

  const handleBuyNow = (item) => {
    // Placeholder - Owner can integrate payment processing
    toast.success(`Added ${item.name} to cart! Payment integration coming soon.`);
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  return (
    <div className="space-y-6" data-testid="store-container">
      {/* Store Header */}
      <div className="bg-fight-charcoal border border-fight-concrete rounded-sm p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ShoppingBag size={32} className="text-fight-red" />
          <h1 className="font-anton text-4xl text-white uppercase tracking-wide">
            GEAR SHOP
          </h1>
        </div>
        <p className="text-gray-400 font-barlow max-w-xl mx-auto">
          Official FightNet gear for fighters. Premium quality MMA gloves, training apparel, and equipment.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-sm font-barlow font-semibold uppercase tracking-wider text-sm transition-all ${
              selectedCategory === category
                ? "bg-fight-red text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]"
                : "bg-fight-charcoal text-gray-400 border border-fight-concrete hover:border-fight-red hover:text-white"
            }`}
            data-testid={`category-${category.toLowerCase().replace(" ", "-")}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-fight-charcoal border border-fight-concrete rounded-sm overflow-hidden group hover:border-fight-red transition-all"
            data-testid={`product-${item.id}`}
          >
            {/* Product Image */}
            <div className="aspect-square overflow-hidden bg-fight-black">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-barlow font-semibold text-white text-lg leading-tight">
                  {item.name}
                </h3>
                <span className="text-fight-red font-anton text-xl">
                  ${item.price}
                </span>
              </div>
              
              <p className="text-gray-500 font-barlow text-sm mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`text-xs font-barlow uppercase tracking-wider ${
                  item.inStock ? "text-green-500" : "text-red-500"
                }`}>
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </span>
                <span className="text-xs text-gray-500 font-barlow">
                  {item.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleViewItem(item)}
                  variant="outline"
                  className="flex-1 border-fight-concrete text-white hover:bg-fight-concrete font-barlow uppercase tracking-wider text-xs h-9"
                  data-testid={`view-${item.id}`}
                >
                  View
                </Button>
                <Button
                  onClick={() => handleBuyNow(item)}
                  disabled={!item.inStock}
                  className="flex-1 bg-fight-red hover:bg-red-700 text-white font-barlow uppercase tracking-wider text-xs h-9"
                  data-testid={`buy-${item.id}`}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-500 font-barlow">No items in this category yet.</p>
        </div>
      )}

      {/* Admin Note */}
      <div className="bg-fight-black border border-fight-concrete rounded-sm p-6 mt-8">
        <h3 className="font-anton text-lg text-fight-red uppercase tracking-wide mb-2">
          STORE OWNER NOTE
        </h3>
        <p className="text-gray-400 font-barlow text-sm">
          To add your own products, edit the <code className="text-fight-red bg-fight-charcoal px-2 py-1 rounded">STORE_ITEMS</code> array 
          in <code className="text-fight-red bg-fight-charcoal px-2 py-1 rounded">/frontend/src/pages/StorePage.jsx</code>. 
          Each item needs: name, description, price, category, image URL, and inStock status.
          For payment integration, connect Stripe or your preferred payment processor to the <code className="text-fight-red bg-fight-charcoal px-2 py-1 rounded">handleBuyNow</code> function.
        </p>
      </div>

      {/* Item Detail Modal */}
      <Dialog open={showItemModal} onOpenChange={setShowItemModal}>
        <DialogContent className="bg-fight-charcoal border-fight-concrete max-w-lg">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="font-anton text-2xl text-white uppercase">
                  {selectedItem.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="aspect-video overflow-hidden rounded-sm bg-fight-black">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fight-red font-anton text-3xl">
                    ${selectedItem.price}
                  </span>
                  <span className={`px-3 py-1 rounded-sm text-sm font-barlow uppercase ${
                    selectedItem.inStock 
                      ? "bg-green-900/30 text-green-500" 
                      : "bg-red-900/30 text-red-500"
                  }`}>
                    {selectedItem.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <p className="text-gray-300 font-barlow">
                  {selectedItem.description}
                </p>
                <div className="text-gray-500 font-barlow text-sm">
                  Category: {selectedItem.category}
                </div>
                <Button
                  onClick={() => {
                    handleBuyNow(selectedItem);
                    setShowItemModal(false);
                  }}
                  disabled={!selectedItem.inStock}
                  className="w-full bg-fight-red hover:bg-red-700 text-white font-barlow font-bold uppercase tracking-wider h-12"
                  data-testid="modal-buy-btn"
                >
                  <DollarSign size={18} className="mr-2" />
                  Buy Now - ${selectedItem.price}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
