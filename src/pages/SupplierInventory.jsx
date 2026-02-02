// frontend/src/pages/SupplierInventory.jsx - GLASSMORPHISM REDESIGN
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Calendar, Trash2, TrendingUp, Package,
  ChevronLeft, ChevronRight, Eye, X, BarChart3,
  Boxes, RotateCcw, CheckCircle, AlertCircle, Search,
  ChevronDown, TrendingDown, DollarSign, Filter
} from 'lucide-react';
import api from '../api/api';
import { SkeletonStatCard, SkeletonDailyCard, SkeletonGroupCard } from '../components/skeleton/UnifiedSkeleton';

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// ============================================
// GLASSMORPHISM STAT CARD
// ============================================
const GlassStatCard = ({ icon: Icon, label, value, subtitle, color, trend, index }) => {
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
        
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend.direction === 'up' ? (
              <TrendingUp size={14} className="text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown size={14} className="text-red-600 dark:text-red-400" />
            )}
            <span className={`text-xs font-semibold ${
              trend.direction === 'up' 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {trend.value}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// DAILY CARD COMPONENT
// ============================================
const DailyCard = ({ date, dayData, onClick, index }) => {
  const dayTotal = dayData.reduce((sum, item) => sum + parseFloat(item.quantity), 0);
  
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group relative"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur-lg transition-opacity duration-300 rounded-xl" />
      
      {/* Card content */}
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-left">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 flex items-center justify-between">
          <span>
            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <Eye size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400" />
        </div>
        <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
          {dayTotal.toFixed(0)} units
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {dayData.length} {dayData.length === 1 ? 'supply' : 'supplies'}
        </div>
        <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
            className="h-full bg-linear-to-r from-blue-500 to-cyan-500"
          />
        </div>
      </div>
    </motion.button>
  );
};

// ============================================
// SUPPLIER GROUP CARD
// ============================================
const SupplierGroupCard = ({ supplier, items, onDelete, index }) => {
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
        className="w-full px-6 py-5 bg-linear-to-r from-gray-50/50 to-transparent dark:from-gray-700/50 border-b border-white/20 dark:border-gray-700/50 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-all"
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
              <p className="text-sm text-gray-600 dark:text-gray-400">{items.length} deliveries</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
            <p className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
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
                  className="p-4 hover:bg-white/50 dark:hover:bg-gray-700/50 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                          {item.variety.name}
                        </h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                          {item.variety.measurement_unit}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(item.supply_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition ml-2"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-600 dark:text-gray-400 text-xs block mb-0.5">Quantity</span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">{parseFloat(item.quantity).toFixed(1)}</span>
                    </div>
                    <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-600 dark:text-gray-400 text-xs block mb-0.5">Price/Unit</span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">₹{parseFloat(item.price_per_item).toFixed(2)}</span>
                    </div>
                    <div className="backdrop-blur-sm bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg p-2">
                      <span className="text-gray-600 dark:text-gray-400 text-xs block mb-0.5">Total</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">₹{parseFloat(item.total_amount).toFixed(2)}</span>
                    </div>
                    <div className="backdrop-blur-sm bg-blue-500/10 dark:bg-blue-500/20 rounded-lg p-2">
                      <span className="text-gray-600 dark:text-gray-400 text-xs block mb-0.5">Used</span>
                      <span className="text-blue-700 dark:text-blue-400 font-semibold">{parseFloat(item.quantity_used).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                    <div className="backdrop-blur-sm bg-red-500/10 dark:bg-red-500/20 rounded-lg p-2">
                      <span className="text-gray-600 dark:text-gray-400 text-xs block mb-0.5">Returned</span>
                      <span className="text-red-700 dark:text-red-400 font-semibold">{parseFloat(item.quantity_returned || 0).toFixed(1)}</span>
                    </div>
                    <div className="backdrop-blur-sm bg-green-500/10 dark:bg-green-500/20 rounded-lg p-2">
                      <span className="text-gray-600 dark:text-gray-400 text-xs block mb-0.5">Remaining</span>
                      <span className="text-green-700 dark:text-green-400 font-semibold">{parseFloat(item.quantity_remaining).toFixed(1)}</span>
                    </div>
                  </div>
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
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Used</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Returns</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Remaining</th>
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
                        {new Date(item.supply_date).toLocaleDateString('en-US', {
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
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">
                          ₹{parseFloat(item.total_amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl bg-blue-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-400">
                          {parseFloat(item.quantity_used).toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl bg-red-500/20 border border-red-500/30 text-red-700 dark:text-red-400">
                          {parseFloat(item.quantity_returned || 0).toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl bg-green-500/20 border border-green-500/30 text-green-700 dark:text-green-400">
                          {parseFloat(item.quantity_remaining).toFixed(1)}
                        </span>
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
export default function EnhancedSupplierInventory() {
  const [varieties, setVarieties] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [allInventory, setAllInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDailyDetails, setShowDailyDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMonthlyRecords, setShowMonthlyRecords] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState({
    supplier_name: '',
    variety_id: '',
    quantity: '',
    price_per_item: '',
    supply_date: formatDate(new Date())
  });

  const [varietySearch, setVarietySearch] = useState('');
  const [showVarietyDropdown, setShowVarietyDropdown] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    loadVarieties();
    loadAllInventory();
  }, []);

  useEffect(() => {
    loadMonthlyInventory();
  }, [currentMonth, currentYear]);

  const loadVarieties = async () => {
    try {
      const response = await api.get('/varieties/');
      setVarieties(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading varieties:', error);
    }
  };

  const loadAllInventory = async () => {
    try {
      const response = await api.get('/supplier/inventory');
      setAllInventory(Array.isArray(response.data) ? response.data : []);
      setInitialLoading(false);
    } catch (error) {
      console.error('Error loading all inventory:', error);
      setInitialLoading(false);
    }
  };

  const loadMonthlyInventory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/supplier/inventory');
      const data = response.data;

      const filtered = (Array.isArray(data) ? data : []).filter(item => {
        const itemDate = new Date(item.supply_date);
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      }).sort((a, b) => new Date(b.supply_date) - new Date(a.supply_date));

      setInventory(filtered);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVarietySelect = (variety) => {
    setFormData({ ...formData, variety_id: variety.id });
    setVarietySearch(variety.name);
    setSelectedVariety(variety);
    setShowVarietyDropdown(false);
  };

  const calculateTotal = () => {
    const qty = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.price_per_item) || 0;
    return qty * price;
  };

  const total = calculateTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplier_name || !formData.variety_id || !formData.quantity || !formData.price_per_item) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await api.post('/supplier/inventory', {
        ...formData,
        variety_id: parseInt(formData.variety_id),
        quantity: parseFloat(formData.quantity),
        price_per_item: parseFloat(formData.price_per_item)
      });

      alert('Inventory added successfully! Stock updated.');
      setFormData({
        supplier_name: '',
        variety_id: '',
        quantity: '',
        price_per_item: '',
        supply_date: formatDate(new Date())
      });
      setVarietySearch('');
      setSelectedVariety(null);
      setShowForm(false);
      loadMonthlyInventory();
      loadAllInventory();
    } catch (err) {
      console.error('Failed to add inventory:', err);
      alert(err.response?.data?.detail || 'Failed to add inventory');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inventory record? This will reduce stock levels.')) return;

    try {
      await api.delete(`/supplier/inventory/${id}`);
      loadMonthlyInventory();
      loadAllInventory();
      alert('Inventory deleted! Stock restored.');
    } catch (error) {
      console.error('Failed to delete inventory:', error);
      alert(error.response?.data?.detail || 'Failed to delete inventory');
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

  const showDailyDetailsModal = (date) => {
    setSelectedDate(date);
    setShowDailyDetails(true);
  };

  const overallStats = {
    totalQuantity: allInventory.reduce((sum, item) => sum + parseFloat(item.quantity), 0),
    totalUsed: allInventory.reduce((sum, item) => sum + parseFloat(item.quantity_used), 0),
    totalReturned: allInventory.reduce((sum, item) => sum + parseFloat(item.quantity_returned || 0), 0),
    totalRemaining: allInventory.reduce((sum, item) => sum + parseFloat(item.quantity_remaining), 0),
    totalValue: allInventory.reduce((sum, item) => sum + parseFloat(item.total_amount), 0)
  };

  const groupedBySupplier = inventory.reduce((acc, item) => {
    if (!acc[item.supplier_name]) {
      acc[item.supplier_name] = [];
    }
    acc[item.supplier_name].push(item);
    return acc;
  }, {});

  const totalAmount = inventory.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);

  const filteredVarieties = varieties.filter(v =>
    v.name.toLowerCase().includes(varietySearch.toLowerCase())
  );

  const isCurrentMonth = currentMonth === new Date().getMonth() &&
    currentYear === new Date().getFullYear();

  const uniqueDates = [...new Set(inventory.map(item => item.supply_date))].sort().reverse();

  const dailyInventory = selectedDate
    ? inventory.filter(item => item.supply_date === selectedDate)
    : [];

  const dailyTotal = dailyInventory.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
  const dailyQuantity = dailyInventory.reduce((sum, item) => sum + parseFloat(item.quantity), 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-cyan-50/30 to-blue-50/30 dark:from-gray-900 dark:via-cyan-900/10 dark:to-blue-900/10">
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
                Supplier Inventory Analytics
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Complete stock overview and daily tracking
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto flex items-center justify-center bg-linear-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              <Plus size={18} className="mr-2" />
              <span>Add Supply</span>
            </motion.button>
          </div>
        </motion.div>

        {/* SUPPLY FORM */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Record New Supply</h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Supplier Name *
                      </label>
                      <input
                        type="text"
                        value={formData.supplier_name}
                        onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                        placeholder="Enter supplier name"
                        className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 dark:text-gray-100 transition"
                        required
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
                        className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 dark:text-gray-100 transition"
                        required
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
                        min="0"
                        step={selectedVariety?.measurement_unit !== 'pieces' ? '0.01' : '1'}
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder={selectedVariety ? `Enter ${selectedVariety.measurement_unit}` : 'Select variety first'}
                        className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 dark:text-gray-100 transition"
                        required
                      />
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
                        placeholder="Price per unit"
                        className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 dark:text-gray-100 transition"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Supply Date *
                      </label>
                      <input
                        type="date"
                        value={formData.supply_date}
                        onChange={(e) => setFormData({ ...formData, supply_date: e.target.value })}
                        className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 dark:text-gray-100 transition"
                        required
                      />
                    </div>

                    {formData.quantity && formData.price_per_item && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="sm:col-span-2 p-4 backdrop-blur-xl bg-linear-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 dark:border-emerald-400/20 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Total Amount</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                              {formData.quantity} × ₹{formData.price_per_item}
                            </p>
                          </div>
                          <p className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                            ₹{total.toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full sm:flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white font-medium hover:shadow-xl transition-all"
                      >
                        Add Supply & Update Stock
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
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
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OVERALL STATISTICS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
          {initialLoading ? (
            <>
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </>
          ) : (
            <>
              <GlassStatCard
                icon={Boxes}
                label="Total Stock Received"
                value={overallStats.totalQuantity.toFixed(1)}
                subtitle="All-time"
                color="from-blue-500 to-cyan-500"
                index={0}
              />
              <GlassStatCard
                icon={CheckCircle}
                label="Stock Used"
                value={overallStats.totalUsed.toFixed(1)}
                subtitle={`${overallStats.totalQuantity > 0 ? ((overallStats.totalUsed / overallStats.totalQuantity) * 100).toFixed(1) : 0}% utilized`}
                color="from-purple-500 to-pink-500"
                index={1}
              />
              <GlassStatCard
                icon={RotateCcw}
                label="Stock Returned"
                value={overallStats.totalReturned.toFixed(1)}
                subtitle={`${overallStats.totalQuantity > 0 ? ((overallStats.totalReturned / overallStats.totalQuantity) * 100).toFixed(1) : 0}% returned`}
                color="from-red-500 to-orange-500"
                index={2}
              />
              <GlassStatCard
                icon={Package}
                label="Stock Remaining"
                value={overallStats.totalRemaining.toFixed(1)}
                subtitle="Available now"
                color="from-emerald-500 to-teal-500"
                index={3}
              />
              <GlassStatCard
                icon={DollarSign}
                label="Total Value"
                value={`₹${(overallStats.totalValue / 1000).toFixed(1)}K`}
                subtitle="Investment"
                color="from-amber-500 to-yellow-500"
                index={4}
              />
            </>
          )}
        </div>

        {/* DAILY DETAILS SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Daily Stock Details</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{uniqueDates.length} days with activity</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <SkeletonDailyCard key={i} />
              ))}
            </div>
          ) : uniqueDates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-gray-400 dark:text-gray-500 w-10 h-10" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">No supplies recorded yet</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {uniqueDates.slice(0, 14).map((date, index) => {
                  const dayData = inventory.filter(item => item.supply_date === date);
                  return (
                    <DailyCard
                      key={date}
                      date={date}
                      dayData={dayData}
                      onClick={() => showDailyDetailsModal(date)}
                      index={index}
                    />
                  );
                })}
              </div>

              {uniqueDates.length > 14 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing 14 of {uniqueDates.length} days
                  </p>
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {/* MONTH NAVIGATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
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
                  className="mt-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
                >
                  Go to current month
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

        {/* MONTHLY SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <>
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </>
          ) : (
            <>
              <GlassStatCard
                icon={Package}
                label="Total Supplies This Month"
                value={inventory.length}
                subtitle="deliveries"
                color="from-blue-500 to-cyan-500"
                index={0}
              />
              <GlassStatCard
                icon={TrendingUp}
                label="Monthly Investment"
                value={`₹${(totalAmount / 1000).toFixed(1)}K`}
                subtitle="spent on supplies"
                color="from-emerald-500 to-teal-500"
                index={1}
              />
              <GlassStatCard
                icon={BarChart3}
                label="Active Suppliers"
                value={Object.keys(groupedBySupplier).length}
                subtitle="this month"
                color="from-purple-500 to-pink-500"
                index={2}
              />
            </>
          )}
        </div>

        {/* PROGRESSIVE DISCLOSURE - VIEW MONTHLY RECORDS BUTTON */}
        {!loading && inventory.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMonthlyRecords(!showMonthlyRecords)}
              className="w-full backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-br from-gray-600 to-gray-800 group-hover:from-gray-700 group-hover:to-gray-900 transition-all">
                  <Eye size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                    {showMonthlyRecords ? 'Hide' : 'View'} Monthly Records
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {Object.keys(groupedBySupplier).length} suppliers • {inventory.length} deliveries in {monthNames[currentMonth]}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: showMonthlyRecords ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={24} className="text-gray-600 dark:text-gray-400" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}

        {/* MONTHLY INVENTORY LIST - WITH ANIMATION */}
        <AnimatePresence>
          {showMonthlyRecords && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="space-y-6"
            >
              {loading ? (
                <>
                  <SkeletonGroupCard rows={3} />
                  <SkeletonGroupCard rows={3} />
                </>
              ) : inventory.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-12 text-center"
                >
                  <div className="w-24 h-24 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="text-gray-400 dark:text-gray-500 w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    No supplies for this month
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Add your first supply to get started
                  </p>
                </motion.div>
              ) : (
                Object.entries(groupedBySupplier).map(([supplier, items], index) => (
                  <SupplierGroupCard
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

        {/* EMPTY STATE - When no supplies at all */}
        {!loading && inventory.length === 0 && !showMonthlyRecords && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-12 text-center"
          >
            <div className="w-24 h-24 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="text-gray-400 dark:text-gray-500 w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              No Supplies Recorded Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start tracking your inventory by adding your first supply
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-linear-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={18} />
              Add Your First Supply
            </motion.button>
          </motion.div>
        )}

        {/* DAILY DETAILS MODAL */}
        <AnimatePresence>
          {showDailyDetails && selectedDate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDailyDetails(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20 dark:border-gray-700/50"
              >
                {/* Modal Header */}
                <div className="bg-linear-to-r from-blue-500 to-cyan-500 px-6 py-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Daily Stock Details</h3>
                    <p className="text-blue-100 text-sm mt-1">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDailyDetails(false)}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition"
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="p-3 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 inline-block mb-3">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{dailyQuantity.toFixed(1)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Quantity</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 inline-block mb-3">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{dailyTotal.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 inline-block mb-3">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{dailyInventory.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Supplies</p>
                  </div>
                </div>

                {/* Details List */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {dailyInventory.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/50 rounded-xl p-4 hover:shadow-lg transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{item.supplier_name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{item.variety.name} • {item.variety.measurement_unit}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                              ₹{parseFloat(item.total_amount).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="backdrop-blur-sm bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Quantity</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{parseFloat(item.quantity).toFixed(1)}</p>
                          </div>
                          <div className="backdrop-blur-sm bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Used</p>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{parseFloat(item.quantity_used).toFixed(1)}</p>
                          </div>
                          <div className="backdrop-blur-sm bg-red-50/50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Returned</p>
                            <p className="text-lg font-bold text-red-700 dark:text-red-400">{parseFloat(item.quantity_returned || 0).toFixed(1)}</p>
                          </div>
                          <div className="backdrop-blur-sm bg-green-50/50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Remaining</p>
                            <p className="text-lg font-bold text-green-700 dark:text-green-400">{parseFloat(item.quantity_remaining).toFixed(1)}</p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Price/Unit: <span className="font-semibold text-gray-900 dark:text-gray-100">₹{parseFloat(item.price_per_item).toFixed(2)}</span>
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            parseFloat(item.quantity_remaining) > 0
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                          }`}>
                            {parseFloat(item.quantity_remaining) > 0 ? 'In Stock' : 'Fully Used'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDailyDetails(false)}
                    className="w-full px-4 py-3 bg-linear-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white rounded-lg hover:shadow-xl transition font-medium"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}