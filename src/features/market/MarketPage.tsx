import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  CheckCircle2,
  DollarSign,
  Package,
  X,
  ChevronDown,
  Building2,
  Clock,
} from 'lucide-react';
import {
  MOCK_BUYER_REQUESTS,
  INITIAL_FARMER_LISTINGS,
  BuyerRequest,
  FarmerListing,
  CROPS_CATALOG,
  ZIM_PROVINCES,
} from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';

export const MarketPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filterQuery = searchParams.get('filter') || '';

  const { user } = useAuthStore();

  const [search, setSearch] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'price_desc' | 'deadline'>('price_desc');

  // Buyer requests state
  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>(MOCK_BUYER_REQUESTS);

  // Farmer listings state
  const [farmerListings, setFarmerListings] = useState<FarmerListing[]>(INITIAL_FARMER_LISTINGS);
  const [isCreateOpen, setIsCreateOpen] = useState(searchParams.get('tab') === 'create');

  // Modal for Fulfill / Sell to Buyer
  const [selectedBuyerForContract, setSelectedBuyerForContract] = useState<BuyerRequest | null>(null);
  const [sellQuantity, setSellQuantity] = useState<number>(5);
  const [isSubmittingContract, setIsSubmittingContract] = useState(false);

  // New Listing Form State
  const [newCrop, setNewCrop] = useState(CROPS_CATALOG[0]);
  const [newQuantity, setNewQuantity] = useState<number>(10);
  const [newUnit, setNewUnit] = useState('Tonnes');
  const [newDate, setNewDate] = useState('2026-11-20');
  const [newAskingPrice, setNewAskingPrice] = useState<number>(320);

  // Filter buyer requests
  const filteredBuyers = buyerRequests.filter((br) => {
    const matchesSearch =
      br.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      br.crop.toLowerCase().includes(search.toLowerCase()) ||
      br.location.toLowerCase().includes(search.toLowerCase());

    const matchesCrop =
      selectedCropFilter === 'All' ||
      br.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());

    return matchesSearch && matchesCrop;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuantity || newQuantity <= 0 || !newAskingPrice || newAskingPrice <= 0) {
      toast.error('Please enter valid quantity and asking price');
      return;
    }

    const item: FarmerListing = {
      id: `fl_${Date.now()}`,
      crop: newCrop,
      quantity: newQuantity,
      unit: newUnit,
      expectedHarvestDate: newDate,
      askingPrice: newAskingPrice,
      province: user?.province || 'Mashonaland West',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      offersCount: 0,
    };

    setFarmerListings([item, ...farmerListings]);
    setIsCreateOpen(false);
    toast.success(
      `Listing created for ${newQuantity} ${newUnit} of ${newCrop} at US$${newAskingPrice}/${newUnit}`,
      'Listing Published'
    );
  };

  const handleConfirmContract = () => {
    if (!selectedBuyerForContract) return;
    setIsSubmittingContract(true);

    setTimeout(() => {
      setIsSubmittingContract(false);
      const buyerName = selectedBuyerForContract.buyerName;
      setSelectedBuyerForContract(null);
      toast.success(
        `Commercial agreement dispatched to ${buyerName}. A dispatch pass has been issued for ${sellQuantity} tonnes.`,
        'Supply Contract Dispatched'
      );
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-dark-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-trust-blue dark:text-blue-400 mb-1">
            <Store className="w-4 h-4" /> Section 3.2 Direct Market Aggregation Engine
          </div>
          <h1 className="text-2xl font-bold font-heading text-charcoal dark:text-white">
            Market Linkage & Offtaker Contracts
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Connect directly with verified corporate food processors and commodity buyers with transparent weighbridge settlement.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(!isCreateOpen)}
          className="px-4 py-2 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {isCreateOpen ? 'Close Form' : 'Create Harvest Listing'}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border p-3.5 rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search buyer, crop or depot location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          {['All', 'Maize', 'Tomatoes', 'Tobacco', 'Soya', 'Horticulture'].map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCropFilter(crop)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCropFilter === crop
                  ? 'bg-grow-600 text-white shadow-xs'
                  : 'bg-neutral-100 dark:bg-dark-surface text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout (stacks on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Buyer Requests (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-heading text-charcoal dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-trust-blue" />
              Verified Offtaker Purchase Orders ({filteredBuyers.length})
            </h3>
            <span className="text-[11px] text-neutral-400">Fixed Forward Contracts</span>
          </div>

          {filteredBuyers.length === 0 ? (
            <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-8 text-center space-y-2">
              <Package className="w-8 h-8 text-neutral-300 mx-auto" />
              <div className="text-xs font-semibold text-charcoal dark:text-white">
                No matching buyer orders found
              </div>
              <p className="text-[11px] text-neutral-500">
                Try selecting "All" or clearing the search term.
              </p>
            </div>
          ) : (
            filteredBuyers.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-5 shadow-xs hover:border-trust-blue/60 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-charcoal dark:text-white font-heading">
                        {order.buyerName}
                      </h4>
                      {order.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Offtaker
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-grow-700 dark:text-grow-400 mt-1">
                      Seeking: {order.quantityNeeded} of {order.crop}
                    </div>
                  </div>

                  {/* Offered Price Badge in Tabular Figures */}
                  <div className="text-right shrink-0">
                    <div className="text-lg font-extrabold font-mono text-charcoal dark:text-white tabular-nums">
                      US${order.offeredPrice.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-neutral-400 uppercase font-medium">
                      per {order.unit}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-dark-surface p-2.5 rounded-xl border border-neutral-100 dark:border-dark-border">
                  {order.logisticsNote}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-[11px] text-neutral-500 border-t border-neutral-100 dark:border-dark-border">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {order.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      Closes {order.deadline}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBuyerForContract(order);
                      setSellQuantity(5);
                    }}
                    className="px-4 py-1.5 bg-trust-blue hover:bg-trust-blue-dark text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer text-xs flex items-center justify-center gap-1"
                  >
                    Sell to Buyer <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Create Listing & My Listings (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Collapsible Create Listing Form */}
          <AnimatePresence>
            {isCreateOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-white">
                    Post Harvest Batch for Sale
                  </h4>
                  <button
                    onClick={() => setIsCreateOpen(false)}
                    className="p-1 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateListing} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Crop Commodity
                    </label>
                    <select
                      value={newCrop}
                      onChange={(e) => setNewCrop(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                    >
                      {CROPS_CATALOG.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Batch Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(parseFloat(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Unit
                      </label>
                      <select
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                      >
                        <option value="Tonnes">Tonnes</option>
                        <option value="Crates (20kg)">Crates (20kg)</option>
                        <option value="50kg Bags">50kg Bags</option>
                        <option value="Kg">Kg</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Expected Harvest Date
                      </label>
                      <input
                        type="date"
                        required
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Asking Price (US$)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        required
                        value={newAskingPrice}
                        onChange={(e) => setNewAskingPrice(parseFloat(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-grow-600 hover:bg-grow-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Publish to Commercial Offtakers
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* My Active Listings Widget */}
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-charcoal dark:text-white uppercase tracking-wider">
                My Harvest Listings ({farmerListings.length})
              </h3>
              <span className="text-[11px] text-neutral-400">Makonde Cluster Hub</span>
            </div>

            <div className="space-y-3">
              {farmerListings.map((listing) => (
                <div
                  key={listing.id}
                  className="p-3.5 rounded-xl border border-neutral-100 dark:border-dark-border bg-neutral-50/50 dark:bg-dark-surface space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-charcoal dark:text-white">
                        {listing.crop}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        <span className="font-mono tabular-nums">{listing.quantity} {listing.unit}</span> · Harvest: {listing.expectedHarvestDate}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        listing.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : listing.status === 'Offer Received'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-100 dark:border-dark-border">
                    <span className="text-neutral-500 font-mono tabular-nums">
                      US${listing.askingPrice} / {listing.unit}
                    </span>
                    <span className="text-grow-700 dark:text-grow-400 text-[11px] font-medium">
                      {listing.offersCount} Buyer inquiries
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contract Fulfill Confirmation Modal */}
      {selectedBuyerForContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedBuyerForContract(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl max-w-md w-full p-6 shadow-2xl z-10"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-dark-border mb-4">
              <div>
                <h3 className="text-sm font-bold font-heading text-charcoal dark:text-white">
                  Confirm Supply Contract
                </h3>
                <p className="text-[11px] text-neutral-400">{selectedBuyerForContract.buyerName}</p>
              </div>
              <button
                onClick={() => setSelectedBuyerForContract(null)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-dark-surface rounded-xl border border-neutral-100 dark:border-dark-border space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Commodity:</span>
                  <span className="font-semibold text-charcoal dark:text-white">
                    {selectedBuyerForContract.crop}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Offered Price:</span>
                  <span className="font-mono font-bold text-grow-700 dark:text-grow-400">
                    US${selectedBuyerForContract.offeredPrice.toFixed(2)} / {selectedBuyerForContract.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Depot:</span>
                  <span className="text-charcoal dark:text-white truncate max-w-[200px]">
                    {selectedBuyerForContract.location}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Quantity You Commit to Supply ({selectedBuyerForContract.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white font-mono outline-none focus:border-grow-600"
                />
              </div>

              <div className="p-3 bg-grow-50 dark:bg-grow-950/40 rounded-xl border border-grow-200 dark:border-grow-900 text-[11px] text-grow-900 dark:text-grow-300 flex items-center justify-between">
                <span>Estimated Gross Payout:</span>
                <span className="font-mono font-bold text-base tabular-nums">
                  US${(sellQuantity * selectedBuyerForContract.offeredPrice).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBuyerForContract(null)}
                  className="flex-1 py-2 border border-neutral-300 dark:border-dark-border text-neutral-600 dark:text-neutral-300 rounded-xl hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmittingContract}
                  onClick={handleConfirmContract}
                  className="flex-1 py-2 bg-grow-600 hover:bg-grow-700 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingContract ? 'Generating Contract…' : 'Sign & Submit Order'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
