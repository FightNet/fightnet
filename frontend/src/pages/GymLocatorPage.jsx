import { useState, useEffect } from "react";
import { MapPin, Search, Navigation, Phone, Globe, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Sample gyms data - Owner can add more or integrate with Google Places API
const SAMPLE_GYMS = [
  {
    id: "1",
    name: "Iron Fist Boxing Gym",
    type: "Boxing",
    address: "123 Main Street, Los Angeles, CA 90001",
    phone: "(555) 123-4567",
    website: "https://ironfistboxing.com",
    hours: "6AM - 10PM",
    rating: 4.8,
    reviews: 124,
    lat: 34.0522,
    lng: -118.2437,
    image: "https://images.unsplash.com/photo-1517438322307-e67111335449?w=400",
    amenities: ["Heavy Bags", "Ring", "Trainers", "Locker Rooms"],
  },
  {
    id: "2",
    name: "Rising Sun Dojo",
    type: "Martial Arts",
    address: "456 Oak Avenue, Los Angeles, CA 90002",
    phone: "(555) 234-5678",
    website: "https://risingsundojo.com",
    hours: "7AM - 9PM",
    rating: 4.9,
    reviews: 89,
    lat: 34.0622,
    lng: -118.2537,
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400",
    amenities: ["Mats", "Weapons Training", "Kids Classes", "Meditation Room"],
  },
  {
    id: "3",
    name: "Apex MMA Academy",
    type: "MMA",
    address: "789 Fighter Lane, Los Angeles, CA 90003",
    phone: "(555) 345-6789",
    website: "https://apexmma.com",
    hours: "5AM - 11PM",
    rating: 4.7,
    reviews: 256,
    lat: 34.0422,
    lng: -118.2337,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
    amenities: ["Cage", "Wrestling Mats", "BJJ Area", "Strength Room", "Sauna"],
  },
  {
    id: "4",
    name: "Muay Thai Warriors",
    type: "Muay Thai",
    address: "321 Combat Street, Los Angeles, CA 90004",
    phone: "(555) 456-7890",
    website: "https://muaythaiwarriors.com",
    hours: "6AM - 10PM",
    rating: 4.6,
    reviews: 178,
    lat: 34.0722,
    lng: -118.2637,
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400",
    amenities: ["Thai Pads", "Heavy Bags", "Ring", "Clinch Area"],
  },
];

const GYM_TYPES = ["All", "Boxing", "MMA", "Martial Arts", "Muay Thai", "BJJ", "Wrestling"];

export default function GymLocatorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedGym, setSelectedGym] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const filteredGyms = SAMPLE_GYMS.filter((gym) => {
    const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gym.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || gym.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleGetLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoadingLocation(false);
          toast.success("Location found! Showing nearby gyms.");
        },
        (error) => {
          setLoadingLocation(false);
          toast.error("Unable to get your location. Please enable location services.");
        }
      );
    } else {
      setLoadingLocation(false);
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleGetDirections = (gym) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(gym.address)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6" data-testid="gym-locator-container">
      {/* Header */}
      <div className="bg-fight-charcoal border border-fight-concrete rounded-sm p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <MapPin size={32} className="text-fight-red" />
          <h1 className="font-anton text-4xl text-white uppercase tracking-wide">
            GYM LOCATOR
          </h1>
        </div>
        <p className="text-gray-400 font-barlow max-w-xl mx-auto">
          Find boxing gyms, MMA academies, and martial arts dojos near you. Train with the best in your area.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-fight-charcoal border border-fight-concrete rounded-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gyms, dojos, or locations..."
              className="bg-fight-black border-fight-concrete text-white pl-10"
              data-testid="gym-search-input"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48 bg-fight-black border-fight-concrete text-white" data-testid="gym-type-select">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-fight-charcoal border-fight-concrete">
              {GYM_TYPES.map((type) => (
                <SelectItem key={type} value={type} className="text-white focus:bg-fight-concrete">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleGetLocation}
            disabled={loadingLocation}
            className="bg-fight-red hover:bg-red-700 text-white font-barlow uppercase"
            data-testid="get-location-btn"
          >
            <Navigation size={18} className="mr-2" />
            {loadingLocation ? "Finding..." : "Near Me"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-fight-charcoal border border-fight-concrete rounded-sm overflow-hidden">
          <div className="aspect-video bg-fight-black relative">
            {/* Map placeholder - Owner can integrate Google Maps or Mapbox */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={64} className="mx-auto text-fight-red mb-4" />
                <p className="text-gray-400 font-barlow">
                  Interactive map coming soon
                </p>
                <p className="text-gray-600 font-barlow text-sm mt-2">
                  Integrate Google Maps API or Mapbox
                </p>
              </div>
            </div>
            
            {/* Sample gym markers */}
            <div className="absolute top-4 left-4 flex gap-2">
              {filteredGyms.slice(0, 4).map((gym, i) => (
                <button
                  key={gym.id}
                  onClick={() => setSelectedGym(gym)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    selectedGym?.id === gym.id
                      ? "bg-fight-red text-white scale-110"
                      : "bg-white text-fight-black hover:bg-fight-red hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Gym Preview */}
          {selectedGym && (
            <div className="p-4 border-t border-fight-concrete">
              <div className="flex gap-4">
                <img
                  src={selectedGym.image}
                  alt={selectedGym.name}
                  className="w-24 h-24 object-cover rounded-sm"
                />
                <div className="flex-1">
                  <h3 className="font-barlow font-semibold text-white text-lg">
                    {selectedGym.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-barlow text-sm">{selectedGym.rating}</span>
                    <span className="text-gray-500 text-sm">({selectedGym.reviews} reviews)</span>
                  </div>
                  <p className="text-gray-400 font-barlow text-sm mt-1">{selectedGym.address}</p>
                  <Button
                    onClick={() => handleGetDirections(selectedGym)}
                    size="sm"
                    className="mt-2 bg-fight-red hover:bg-red-700 text-white font-barlow uppercase text-xs"
                  >
                    <Navigation size={14} className="mr-1" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gym List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          <h2 className="font-anton text-xl text-white uppercase tracking-wide sticky top-0 bg-fight-black py-2">
            NEARBY GYMS ({filteredGyms.length})
          </h2>
          
          {filteredGyms.map((gym) => (
            <div
              key={gym.id}
              onClick={() => setSelectedGym(gym)}
              className={`bg-fight-charcoal border rounded-sm p-4 cursor-pointer transition-all ${
                selectedGym?.id === gym.id
                  ? "border-fight-red"
                  : "border-fight-concrete hover:border-gray-600"
              }`}
              data-testid={`gym-card-${gym.id}`}
            >
              <div className="flex gap-3">
                <img
                  src={gym.image}
                  alt={gym.name}
                  className="w-16 h-16 object-cover rounded-sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-barlow font-semibold text-white truncate">
                    {gym.name}
                  </h3>
                  <span className="text-xs text-fight-red font-barlow uppercase">
                    {gym.type}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-barlow text-xs">{gym.rating}</span>
                    <span className="text-gray-500 text-xs">({gym.reviews})</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <MapPin size={12} />
                  <span className="truncate">{gym.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Clock size={12} />
                  <span>{gym.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Phone size={12} />
                  <span>{gym.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {gym.amenities.slice(0, 3).map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-0.5 bg-fight-black text-gray-400 text-xs rounded-sm"
                  >
                    {amenity}
                  </span>
                ))}
                {gym.amenities.length > 3 && (
                  <span className="px-2 py-0.5 bg-fight-black text-gray-500 text-xs rounded-sm">
                    +{gym.amenities.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGetDirections(gym);
                  }}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-fight-concrete text-white hover:bg-fight-concrete text-xs h-8"
                >
                  Directions
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(gym.website, "_blank");
                  }}
                  size="sm"
                  className="flex-1 bg-fight-red hover:bg-red-700 text-white text-xs h-8"
                >
                  Visit Site
                </Button>
              </div>
            </div>
          ))}

          {filteredGyms.length === 0 && (
            <div className="text-center py-12">
              <MapPin size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-500 font-barlow">No gyms found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Owner Note */}
      <div className="bg-fight-black border border-fight-concrete rounded-sm p-6">
        <h3 className="font-anton text-lg text-fight-red uppercase tracking-wide mb-2">
          OWNER NOTE
        </h3>
        <p className="text-gray-400 font-barlow text-sm">
          To add gyms, edit the <code className="text-fight-red bg-fight-charcoal px-2 py-1 rounded">SAMPLE_GYMS</code> array 
          in <code className="text-fight-red bg-fight-charcoal px-2 py-1 rounded">/frontend/src/pages/GymLocatorPage.jsx</code>. 
          For a live map, integrate Google Maps API or Mapbox and replace the map placeholder div.
        </p>
      </div>
    </div>
  );
}
