import { useState } from "react";
import { Heart, Building2, Users, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Donation amounts
const DONATION_AMOUNTS = [5, 10, 25, 50, 100, 250];

// Featured gyms/dojos that accept donations
const FEATURED_GYMS = [
  {
    id: "fightnet",
    name: "FightNet Team (Knockout-Social)",
    description: "Support the FightNet platform development and community initiatives.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400",
    type: "Platform",
  },
  {
    id: "gym1",
    name: "Iron Fist Boxing Gym",
    description: "Local boxing gym helping underprivileged youth learn the sweet science.",
    image: "https://images.unsplash.com/photo-1517438322307-e67111335449?w=400",
    type: "Boxing Gym",
  },
  {
    id: "gym2",
    name: "Rising Sun Dojo",
    description: "Traditional martial arts dojo teaching discipline and respect.",
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400",
    type: "Dojo",
  },
  {
    id: "gym3",
    name: "Apex MMA Academy",
    description: "Mixed martial arts training center for fighters of all levels.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
    type: "MMA Gym",
  },
];

export default function DonatePage() {
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [donationAmount, setDonationAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectRecipient = (gym) => {
    setSelectedRecipient(gym);
    setShowSuccess(false);
  };

  const handleDonate = () => {
    if (!selectedRecipient) {
      toast.error("Please select a gym or organization to donate to");
      return;
    }

    const amount = customAmount ? parseFloat(customAmount) : donationAmount;
    if (!amount || amount < 1) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    // Placeholder for payment integration
    setShowSuccess(true);
    toast.success(`Thank you for your $${amount} donation to ${selectedRecipient.name}!`);
  };

  return (
    <div className="space-y-6" data-testid="donate-container">
      {/* Donate Header */}
      <div className="bg-fight-charcoal border border-fight-concrete rounded-sm p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart size={32} className="text-fight-red" />
          <h1 className="font-anton text-4xl text-white uppercase tracking-wide">
            SUPPORT THE FIGHT
          </h1>
        </div>
        <p className="text-gray-400 font-barlow max-w-xl mx-auto">
          Donate to your local gym, dojo, or support the FightNet community. Every contribution helps fighters train and grow.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recipients List */}
        <div className="space-y-4">
          <h2 className="font-anton text-xl text-white uppercase tracking-wide">
            SELECT RECIPIENT
          </h2>
          
          {FEATURED_GYMS.map((gym) => (
            <div
              key={gym.id}
              onClick={() => handleSelectRecipient(gym)}
              className={`bg-fight-charcoal border rounded-sm p-4 cursor-pointer transition-all ${
                selectedRecipient?.id === gym.id
                  ? "border-fight-red shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  : "border-fight-concrete hover:border-gray-600"
              }`}
              data-testid={`recipient-${gym.id}`}
            >
              <div className="flex gap-4">
                <img
                  src={gym.image}
                  alt={gym.name}
                  className="w-20 h-20 object-cover rounded-sm"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-barlow font-semibold text-white">
                      {gym.name}
                    </h3>
                    {selectedRecipient?.id === gym.id && (
                      <CheckCircle size={16} className="text-fight-red" />
                    )}
                  </div>
                  <span className="text-xs text-fight-red font-barlow uppercase">
                    {gym.type}
                  </span>
                  <p className="text-gray-500 font-barlow text-sm mt-1">
                    {gym.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Custom Gym Input */}
          <div className="bg-fight-black border border-fight-concrete rounded-sm p-4">
            <h3 className="font-barlow font-semibold text-white mb-3">
              Or enter a custom gym/dojo
            </h3>
            <Input
              placeholder="Enter gym name or ID"
              className="bg-fight-charcoal border-fight-concrete text-white"
              data-testid="custom-gym-input"
            />
            <p className="text-gray-600 font-barlow text-xs mt-2">
              Contact the gym to get their FightNet donation ID
            </p>
          </div>
        </div>

        {/* Donation Form */}
        <div className="bg-fight-charcoal border border-fight-concrete rounded-sm p-6">
          {showSuccess ? (
            <div className="text-center py-12">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h3 className="font-anton text-2xl text-white uppercase mb-2">
                THANK YOU!
              </h3>
              <p className="text-gray-400 font-barlow mb-6">
                Your donation to {selectedRecipient?.name} has been received.
              </p>
              <Button
                onClick={() => setShowSuccess(false)}
                className="bg-fight-red hover:bg-red-700 text-white font-barlow uppercase"
              >
                Make Another Donation
              </Button>
            </div>
          ) : (
            <>
              <h2 className="font-anton text-xl text-white uppercase tracking-wide mb-6">
                DONATION DETAILS
              </h2>

              {selectedRecipient && (
                <div className="bg-fight-black rounded-sm p-3 mb-6 flex items-center gap-3">
                  <Building2 size={20} className="text-fight-red" />
                  <span className="text-white font-barlow">
                    Donating to: <strong>{selectedRecipient.name}</strong>
                  </span>
                </div>
              )}

              {/* Amount Selection */}
              <div className="space-y-3 mb-6">
                <Label className="text-gray-400 font-barlow uppercase text-xs tracking-wider">
                  Select Amount
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {DONATION_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setDonationAmount(amount);
                        setCustomAmount("");
                      }}
                      className={`py-3 rounded-sm font-anton text-lg transition-all ${
                        donationAmount === amount && !customAmount
                          ? "bg-fight-red text-white"
                          : "bg-fight-black text-gray-400 border border-fight-concrete hover:border-fight-red"
                      }`}
                      data-testid={`amount-${amount}`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="bg-fight-black border-fight-concrete text-white mt-2"
                  data-testid="custom-amount-input"
                />
              </div>

              {/* Donor Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 accent-fight-red"
                  />
                  <Label htmlFor="anonymous" className="text-gray-400 font-barlow">
                    Donate anonymously
                  </Label>
                </div>

                {!isAnonymous && (
                  <div className="space-y-2">
                    <Label className="text-gray-400 font-barlow uppercase text-xs tracking-wider">
                      Your Name (Optional)
                    </Label>
                    <Input
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Fighter Name"
                      className="bg-fight-black border-fight-concrete text-white"
                      data-testid="donor-name-input"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-gray-400 font-barlow uppercase text-xs tracking-wider">
                    Message (Optional)
                  </Label>
                  <Textarea
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    placeholder="Leave a message of support..."
                    className="bg-fight-black border-fight-concrete text-white resize-none"
                    rows={3}
                    data-testid="donor-message-input"
                  />
                </div>
              </div>

              {/* Donate Button */}
              <Button
                onClick={handleDonate}
                disabled={!selectedRecipient}
                className="w-full bg-fight-red hover:bg-red-700 text-white font-barlow font-bold uppercase tracking-wider h-12 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                data-testid="donate-btn"
              >
                <CreditCard size={18} className="mr-2" />
                Donate ${customAmount || donationAmount}
              </Button>

              <p className="text-gray-600 font-barlow text-xs text-center mt-4">
                Secure payment processing. Payment integration coming soon.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Owner Note */}
      <div className="bg-fight-black border border-fight-concrete rounded-sm p-6">
        <h3 className="font-anton text-lg text-fight-red uppercase tracking-wide mb-2">
          OWNER NOTE
        </h3>
        <p className="text-gray-400 font-barlow text-sm">
          To add your gym to receive donations, edit the <code className="text-fight-red bg-fight-charcoal px-2 py-1 rounded">FEATURED_GYMS</code> array 
          in <code className="text-fight-red bg-fight-charcoal px-2 py-1 rounded">/frontend/src/pages/DonatePage.jsx</code>. 
          For payment processing, integrate Stripe Connect or PayPal to the <code className="text-fight-red bg-fight-charcoal px-2 py-1 rounded">handleDonate</code> function.
        </p>
      </div>
    </div>
  );
}
