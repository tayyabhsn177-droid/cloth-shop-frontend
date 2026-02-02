// frontend/src/pages/SupplierReturns.jsx - GLASSMORPHISM REDESIGN
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, TrendingDown, RotateCcw, ChevronLeft, ChevronRight, 
  AlertCircle, X, Package, DollarSign, Eye, ChevronDown, Users
} from 'lucide-react';
import api from '../api/api';
import { SkeletonStatCard, SkeletonGroupCard } from '../components/skeleton/UnifiedSkeleton';

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// ============================================
// GLASSMORPHISM STAT CARD
// ============================================
const GlassStatCard = ({ icon: Icon, label, value, subtitle, color, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur-xl transition-opacity duration-500 rounded-2xl`} />
      
      {/* Glass card */}
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {label}
            </p>
            <motion.p 
              className="text-3xl lg:text-4xl font-bold bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
            >
              {value}
            </motion.p>
          </div>
          
          {/* Icon with gradient background */}
          <motion.div 
            className={`p-3 rounded-xl bg-linear-to-br ${color} shadow-lg`}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
          </motion.div>
        </div>
        
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// SUPPLIER GROUP CARD (RETURNS)
// ============================================
const SupplierReturnsCard = ({ supplier, items, onDelete, index }) => {
  const [expanded, setExpanded] = useState(false);
  const supplierTotal = items.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-5 bg-linear-to-r from-red-50/50 to-transparent dark:from-red-900/20 border-b border-white/20 dark:border-gray-700/50 hover:bg-red-50/80 dark:hover:bg-red-900/30 transition-all"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={20} className="text-gray-600 dark:text-gray-400" />
            </motion.div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{supplier}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{items.length} returns</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Refund</p>
            <p className="text-2xl font-bold bg-linear-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
              ₹{supplierTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </motion.button>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Mobile Cards */}
            <div className="block lg:hidden divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 hover:bg-red-50/30 dark:hover:bg-red-900/10 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">{item.variety.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.variety.measurement_unit}</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      title="Delete return"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-500 dark:text-gray-400 text-xs block mb-0.5">Date:</span>
                      <div className="font-medium text-gray-700 dark:text-gray-300">
                        {new Date(item.return_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-500 dark:text-gray-400 text-xs block mb-0.5">Quantity:</span>
                      <div className="font-medium text-gray-700 dark:text-gray-300">{parseFloat(item.quantity).toFixed(1)}</div>
                    </div>
                    <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-500 dark:text-gray-400 text-xs block mb-0.5">Price/Unit:</span>
                      <div className="font-medium text-gray-700 dark:text-gray-300">₹{parseFloat(item.price_per_item).toFixed(2)}</div>
                    </div>
                    <div className="backdrop-blur-sm bg-red-500/10 dark:bg-red-500/20 rounded-lg p-2">
                      <span className="text-gray-500 dark:text-gray-400 text-xs block mb-0.5">Total:</span>
                      <div className="font-semibold text-red-700 dark:text-red-400">₹{parseFloat(item.total_amount).toFixed(2)}</div>
                    </div>
                  </div>
                  
                  {item.reason && (
                    <div className="mt-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-800 dark:text-yellow-400">
                        <AlertCircle size={12} className="mr-1" />
                        {item.reason}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-600/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Variety</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Price/Unit</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {items.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                      className="transition"
                    >
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {new Date(item.return_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{item.variety.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.variety.measurement_unit}</div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900 dark:text-gray-100 text-lg">{parseFloat(item.quantity).toFixed(1)}</td>
                      <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-100">₹{parseFloat(item.price_per_item).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-red-700 dark:text-red-400 text-lg">
                          ₹{parseFloat(item.total_amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.reason ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-800 dark:text-yellow-400">
                            <AlertCircle size={12} className="mr-1" />
                            {item.reason}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-xs">No reason</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete(item.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function MonthlySupplierReturns() {
  const [varieties, setVarieties] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showReturns, setShowReturns] = useState(false);
  
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const [formData, setFormData] = useState({
    supplier_name: '',
    variety_id: '',
    quantity: '',
    price_per_item: '',
    return_date: formatDate(new Date()),
    reason: ''
  });

  const [varietySearch, setVarietySearch] = useState('');
  const [showVarietyDropdown, setShowVarietyDropdown] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [availableStock, setAvailableStock] = useState(null);
  const [supplierInventories, setSupplierInventories] = useState([]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    loadVarieties();
    loadSupplierInventories();
  }, []);

  useEffect(() => {
    loadMonthlyReturns();
  }, [currentMonth, currentYear]);

  const loadVarieties = async () => {
    try {
      const response = await api.get('/varieties/');
      setVarieties(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading varieties:', error);
    }
  };

  const loadSupplierInventories = async () => {
    try {
      const response = await api.get('/supplier/inventory');
      setSupplierInventories(Array.isArray(response.data) ? response.data : []);
      setInitialLoading(false);
    } catch (error) {
      console.error('Error loading supplier inventories:', error);
      setInitialLoading(false);
    }
  };

  const loadMonthlyReturns = async () => {
    setLoading(true);
    try {
      const response = await api.get('/supplier/returns');
      const data = response.data;
      
      const filtered = (Array.isArray(data) ? data : []).filter(item => {
        const itemDate = new Date(item.return_date);
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      }).sort((a, b) => new Date(b.return_date) - new Date(a.return_date));
      
      setReturns(filtered);
    } catch (error) {
      console.error('Error loading returns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVarietySelect = (variety) => {
    setFormData({ ...formData, variety_id: variety.id });
    setVarietySearch(variety.name);
    setSelectedVariety(variety);
    setShowVarietyDropdown(false);
    
    if (formData.supplier_name) {
      fetchSupplierPrice(formData.supplier_name, variety.id);
    }
  };

  const handleSupplierChange = (supplierName) => {
    setFormData({ ...formData, supplier_name: supplierName });
    
    if (selectedVariety) {
      fetchSupplierPrice(supplierName, selectedVariety.id);
    }
  };

  const fetchSupplierPrice = (supplierName, varietyId) => {
    const matchingInventories = supplierInventories.filter(inv => 
      inv.supplier_name.toLowerCase() === supplierName.toLowerCase() &&
      inv.variety_id === varietyId &&
      parseFloat(inv.quantity_remaining) > 0
    ).sort((a, b) => new Date(b.supply_date) - new Date(a.supply_date));

    if (matchingInventories.length > 0) {
      const latestInventory = matchingInventories[0];
      const totalAvailable = matchingInventories.reduce((sum, inv) => 
        sum + parseFloat(inv.quantity_remaining), 0
      );
      
      setFormData(prev => ({
        ...prev,
        price_per_item: latestInventory.price_per_item.toString()
      }));
      
      setAvailableStock({
        quantity: totalAvailable,
        price: parseFloat(latestInventory.price_per_item),
        unit: selectedVariety?.measurement_unit || 'units'
      });
    } else {
      setAvailableStock(null);
    }
  };

  const calculateTotal = () => {
    const qty = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.price_per_item) || 0;
    return qty * price;
  };

  const total = calculateTotal();

  const handleSubmit = async () => {
    if (!formData.supplier_name || !formData.variety_id || !formData.quantity || !formData.price_per_item) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await api.post('/supplier/returns', {
        ...formData,
        variety_id: parseInt(formData.variety_id),
        quantity: parseFloat(formData.quantity),
        price_per_item: parseFloat(formData.price_per_item)
      });

      alert('Return recorded successfully! Stock deducted.');
      setFormData({
        supplier_name: '',
        variety_id: '',
        quantity: '',
        price_per_item: '',
        return_date: formatDate(new Date()),
        reason: ''
      });
      setVarietySearch('');
      setSelectedVariety(null);
      setShowForm(false);
      loadMonthlyReturns();
    } catch (error) {
      console.error('Failed to record return:', error);
      alert(error.response?.data?.detail || 'Failed to record return');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this return record? This will restore stock levels.')) return;
    
    try {
      await api.delete(`/supplier/returns/${id}`);
      loadMonthlyReturns();
      alert('Return deleted! Stock restored.');
    } catch (error) {
      console.error('Failed to delete return:', error);
      alert('Failed to delete return');
    }
  };

  const changeMonth = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
  };

  const groupedBySupplier = returns.reduce((acc, item) => {
    if (!acc[item.supplier_name]) {
      acc[item.supplier_name] = [];
    }
    acc[item.supplier_name].push(item);
    return acc;
  }, {});

  const totalAmount = returns.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);

  const filteredVarieties = varieties.filter(v =>
    v.name.toLowerCase().includes(varietySearch.toLowerCase())
  );

  const isCurrentMonth = currentMonth === new Date().getMonth() && 
                         currentYear === new Date().getFullYear();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-red-50/20 to-orange-50/20 dark:from-gray-900 dark:via-red-900/10 dark:to-orange-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
                Supplier Returns
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Track returns to suppliers and refunds
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto flex items-center justify-center bg-linear-to-r from-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              <Plus size={18} className="mr-2" />
              <span>Record Return</span>
            </motion.button>
          </div>
        </motion.div>

        {/* RETURN FORM */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-red-200/50 dark:border-red-900/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Record Return to Supplier</h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Supplier Name *
                    </label>
                    <input
                      type="text"
                      value={formData.supplier_name}
                      onChange={(e) => handleSupplierChange(e.target.value)}
                      placeholder="Enter supplier name"
                      className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:text-gray-100 transition"
                    />
                  </div>

                  <div className="relative">
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cloth Variety *
                    </label>
                    <input
                      type="text"
                      value={varietySearch}
                      onChange={(e) => {
                        setVarietySearch(e.target.value);
                        setShowVarietyDropdown(true);
                      }}
                      onFocus={() => setShowVarietyDropdown(true)}
                      placeholder="Search variety..."
                      className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:text-gray-100 transition"
                    />

                    {showVarietyDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border border-white/20 dark:border-gray-600/50 rounded-lg shadow-lg"
                      >
                        {filteredVarieties.length === 0 ? (
                          <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                            No varieties found
                          </div>
                        ) : (
                          filteredVarieties.map((v) => (
                            <motion.div
                              key={v.id}
                              whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                              onClick={() => handleVarietySelect(v)}
                              className="px-4 py-2 cursor-pointer transition border-b border-gray-100 dark:border-gray-700 last:border-0"
                            >
                              <div className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                                {v.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {v.measurement_unit}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quantity {selectedVariety && `(${selectedVariety.measurement_unit})`} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step={selectedVariety?.measurement_unit !== 'pieces' ? '0.01' : '1'}
                      max={availableStock ? availableStock.quantity : undefined}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder={selectedVariety ? `Enter ${selectedVariety.measurement_unit}` : 'Select variety first'}
                      className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:text-gray-100 transition"
                    />
                    {availableStock && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Max available: {availableStock.quantity.toFixed(1)} {availableStock.unit}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price per {selectedVariety ? selectedVariety.measurement_unit.slice(0, -1) : 'Unit'} (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price_per_item}
                      onChange={(e) => setFormData({ ...formData, price_per_item: e.target.value })}
                      placeholder={availableStock ? "Price auto-filled" : "Price per unit"}
                      className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:text-gray-100 transition"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Return Date *</label>
                    <input
                      type="date"
                      value={formData.return_date}
                      onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                      className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:text-gray-100 transition"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Reason for Return</label>
                    <input
                      type="text"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="e.g., Defective, Wrong item"
                      className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:text-gray-100 transition"
                    />
                  </div>

                  {formData.quantity && formData.price_per_item && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="md:col-span-2 p-4 backdrop-blur-xl bg-linear-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 dark:border-red-400/20 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-300">Refund Amount</p>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            {formData.quantity} × ₹{formData.price_per_item}
                          </p>
                        </div>
                        <p className="text-3xl font-bold bg-linear-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                          ₹{total.toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      className="w-full sm:flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500 text-white font-medium hover:shadow-xl transition-all"
                    >
                      Record Return & Deduct Stock
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowForm(false);
                        setSelectedVariety(null);
                        setVarietySearch('');
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 transition"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MONTH NAVIGATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => changeMonth(-1)}
              className="p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition text-gray-700 dark:text-gray-300"
            >
              <ChevronLeft size={20} />
            </motion.button>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              {!isCurrentMonth && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToCurrentMonth}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mt-1 hover:underline"
                >
                  Go to Current Month
                </motion.button>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => changeMonth(1)}
              className="p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition text-gray-700 dark:text-gray-300"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
          {initialLoading ? (
            <>
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </>
          ) : (
            <>
              <GlassStatCard
                icon={RotateCcw}
                label="Total Returns"
                value={returns.length}
                subtitle="returns this month"
                color="from-red-500 to-orange-500"
                index={0}
              />
              <GlassStatCard
                icon={TrendingDown}
                label="Return Value"
                value={`₹${(totalAmount / 1000).toFixed(1)}K`}
                subtitle="refunded to suppliers"
                color="from-purple-500 to-pink-500"
                index={1}
              />
              <GlassStatCard
                icon={Users}
                label="Suppliers"
                value={Object.keys(groupedBySupplier).length}
                subtitle="with returns"
                color="from-blue-500 to-cyan-500"
                index={2}
              />
            </>
          )}
        </div>

        {/* PROGRESSIVE DISCLOSURE - VIEW RETURNS BUTTON */}
        {!loading && returns.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowReturns(!showReturns)}
              className="w-full backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-br from-red-600 to-orange-600 group-hover:from-red-700 group-hover:to-orange-700 transition-all">
                  <Eye size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                    {showReturns ? 'Hide' : 'View'} Return Records
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {Object.keys(groupedBySupplier).length} suppliers • {returns.length} returns in {monthNames[currentMonth]}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: showReturns ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={24} className="text-gray-600 dark:text-gray-400" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}

        {/* RETURNS LIST - WITH ANIMATION */}
        <AnimatePresence>
          {showReturns && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-6"
            >
              {loading ? (
                <div className="space-y-6">
                  <SkeletonGroupCard rows={3} />
                  <SkeletonGroupCard rows={3} />
                </div>
              ) : returns.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-12 text-center"
                >
                  <div className="w-24 h-24 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <RotateCcw className="text-gray-400 dark:text-gray-500 w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    No returns for this month
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Great! No items needed to be returned
                  </p>
                </motion.div>
              ) : (
                Object.entries(groupedBySupplier).map(([supplier, items], index) => (
                  <SupplierReturnsCard
                    key={supplier}
                    supplier={supplier}
                    items={items}
                    onDelete={handleDelete}
                    index={index}
                  />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* EMPTY STATE - When no returns at all */}
        {!loading && returns.length === 0 && !showReturns && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-12 text-center"
          >
            <div className="w-24 h-24 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <RotateCcw className="text-gray-400 dark:text-gray-500 w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              No Returns This Month
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Excellent! All inventory is in good condition
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}