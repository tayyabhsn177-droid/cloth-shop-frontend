// frontend/src/pages/Sales.jsx - GLASSMORPHISM WITH SWIPEABLE METRICS
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  Trash2, 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Edit2, 
  ChevronDown,
  Eye,
  Filter,
  TrendingDown,
  ShoppingBag,
  Clock,
  User,
  CreditCard
} from 'lucide-react';
import SalesForm from '../components/SaleForm';
import api from '../api/api';
import { EditSaleModal } from '../components/core/SaleFunc';
import { SkeletonStatCard, SkeletonMobileCard, SkeletonTableRow } from '../components/skeleton/UnifiedSkeleton';
import SwipeableMetricCards from '../components/SwipeableMetricCards';

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getItemCount = (quantity, unit) => {
  if (unit === 'meters' || unit === 'yards') return 1;
  return parseFloat(quantity);
};

// ============================================
// FILTER CHIP
// ============================================
const FilterChip = ({ active, label, count, icon: Icon, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
        ${active 
          ? 'bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 text-white shadow-lg' 
          : 'backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-800/90'
        }
      `}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} />}
        <span>{label}</span>
        {count !== undefined && (
          <span className={`
            px-2 py-0.5 rounded-full text-xs font-bold
            ${active 
              ? 'bg-white/20 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }
          `}>
            {count}
          </span>
        )}
      </div>
    </motion.button>
  );
};

// ============================================
// SALES TABLE ROW
// ============================================
const SalesTableRow = ({ item, index, onEdit, onDelete, formatQuantityWithUnit }) => {
  const hasCost = parseFloat(item.cost_price) > 0;
  
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
      className={`
        border-b border-gray-200/50 dark:border-gray-700/50 
        backdrop-blur-sm transition-all duration-300
        ${!hasCost ? 'border-l-4 border-orange-400' : ''}
      `}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <User size={16} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {item.salesperson_name}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="font-medium text-gray-800 dark:text-gray-100">
          {item.variety.name}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">
          {item.variety.measurement_unit}
        </div>
      </td>
      
      <td className="px-6 py-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
            backdrop-blur-xl border
            ${item.payment_status === 'paid'
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-orange-500/20 border-orange-500/30 text-orange-700 dark:text-orange-400'
            }
          `}>
            <CreditCard size={12} className="mr-1" />
            {item.payment_status === 'paid' ? 'Paid' : 'Loan'}
          </span>
          {item.customer_name && (
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {item.customer_name}
            </div>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4 text-center">
        <span className="font-bold text-gray-800 dark:text-gray-100 text-lg">
          {formatQuantityWithUnit(item.quantity, item.variety.measurement_unit)}
        </span>
      </td>
      
      <td className="px-6 py-4 text-right">
        <div className="font-bold text-gray-900 dark:text-gray-100">
          ₹{(parseFloat(item.selling_price) * item.quantity).toFixed(2)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          ₹{parseFloat(item.selling_price).toFixed(2)}/unit
        </div>
      </td>
      
      <td className="px-6 py-4 text-right">
        <div className={`
          font-bold text-lg
          ${hasCost ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}
        `}>
          ₹{parseFloat(item.profit).toFixed(2)}
          {!hasCost && <span className="text-xs ml-1">(approx)</span>}
        </div>
        {!hasCost && (
          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center justify-end gap-1">
            <AlertCircle size={12} />
            <span>Cost unknown</span>
          </div>
        )}
      </td>
      
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
          <Clock size={14} />
          <span className="text-sm font-medium">
            {new Date(item.sale_timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(item)}
            className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
            title="Edit sale"
          >
            <Edit2 size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(item.id)}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors"
            title="Delete sale"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

// ============================================
// MOBILE CARD
// ============================================
const SalesMobileCard = ({ item, index, onEdit, onDelete, formatQuantityWithUnit }) => {
  const hasCost = parseFloat(item.cost_price) > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-3"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-1 truncate">
            {item.variety.name}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <User size={12} />
            <p className="capitalize">{item.salesperson_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(item)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
          >
            <Edit2 size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(item.id)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>

      {!hasCost && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center gap-2"
        >
          <AlertCircle size={14} className="text-orange-600 dark:text-orange-400 shrink-0" />
          <span className="text-xs text-orange-700 dark:text-orange-300 font-medium">
            Cost needs update
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
          <span className="text-gray-600 dark:text-gray-400 text-xs block mb-1">Quantity</span>
          <span className="text-gray-800 dark:text-gray-200 font-semibold">
            {formatQuantityWithUnit(item.quantity, item.variety.measurement_unit)}
          </span>
        </div>

        <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
          <span className="text-gray-600 dark:text-gray-400 text-xs block mb-1">Sale Amount</span>
          <span className="text-gray-800 dark:text-gray-200 font-semibold">
            ₹{(parseFloat(item.selling_price) * item.quantity).toFixed(2)}
          </span>
        </div>

        <div className="backdrop-blur-sm bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg p-2">
          <span className="text-gray-600 dark:text-gray-400 text-xs block mb-1">Profit</span>
          <span className={`font-bold ${hasCost ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
            ₹{parseFloat(item.profit).toFixed(2)}
            {!hasCost && <span className="text-xs ml-1">(approx)</span>}
          </span>
        </div>

        <div className="backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
          <span className="text-gray-600 dark:text-gray-400 text-xs block mb-1">Time</span>
          <span className="text-gray-800 dark:text-gray-200 font-semibold flex items-center gap-1">
            <Clock size={12} />
            {new Date(item.sale_timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`
          inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm
          ${item.payment_status === 'paid'
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
            : 'bg-orange-500/20 text-orange-700 dark:text-orange-400'
          }
        `}>
          <CreditCard size={12} className="mr-1" />
          {item.payment_status === 'paid' ? 'Paid' : 'Loan'}
        </span>
        
        {item.customer_name && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-blue-500/20 text-blue-700 dark:text-blue-400">
            {item.customer_name}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function EnhancedSalesWithPriceSelector() {
  const [varieties, setVarieties] = useState([]);
  const [sales, setSales] = useState([]);
  const [supplierInventories, setSupplierInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [filterMode, setFilterMode] = useState('all');
  const [editingSale, setEditingSale] = useState(null);
  const [showRecords, setShowRecords] = useState(false);

  useEffect(() => {
    loadVarieties();
    loadSupplierInventories();
  }, []);

  useEffect(() => {
    loadSales();
  }, [selectedDate]);

  const loadVarieties = async () => {
    try {
      const response = await api.get('/varieties/');
      setVarieties(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading varieties:', error);
    }
  };

  const formatQuantityWithUnit = (quantity, unit) => {
    const qty = parseFloat(quantity);
    if (unit === 'meters') return qty % 1 === 0 ? `${qty}m` : `${qty.toFixed(2)}m`;
    if (unit === 'yards') return qty % 1 === 0 ? `${qty}y` : `${qty.toFixed(2)}y`;
    return Math.floor(qty);
  };

  const loadSupplierInventories = async () => {
    try {
      const response = await api.get('/supplier/inventory');
      setSupplierInventories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading supplier inventories:', error);
    }
  };

  const loadSales = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/sales/date/${selectedDate}`);
      setSales(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this sale? This action cannot be undone.')) return;

    try {
      await api.delete(`/sales/${id}`);
      loadSales();
      loadSupplierInventories();
      alert('Sale deleted successfully!');
    } catch (error) {
      console.error('Failed to delete sale:', error);
      alert('Failed to delete sale');
    }
  };

  const filteredSales = sales.filter(sale => {
    if (filterMode === 'cost_unknown') {
      return parseFloat(sale.cost_price) === 0;
    }
    return true;
  });

  const costUnknownCount = sales.filter(s => parseFloat(s.cost_price) === 0).length;

  const totalSales = filteredSales.reduce((sum, item) => sum + (parseFloat(item.selling_price) * item.quantity), 0);
  const totalProfit = filteredSales.reduce((sum, item) => sum + parseFloat(item.profit), 0);
  const totalItemsSold = filteredSales.reduce((sum, item) => {
    return sum + getItemCount(item.quantity, item.variety.measurement_unit);
  }, 0);

  // ============================================
  // PREPARE METRICS FOR SWIPEABLE CARDS
  // ============================================
  const metrics = [
    {
      icon: Package,
      label: "Items Sold",
      value: totalItemsSold,
      subtitle: `${filteredSales.length} transaction${filteredSales.length !== 1 ? 's' : ''}`,
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: DollarSign,
      label: "Total Sales",
      value: `₹${totalSales.toFixed(2)}`,
      subtitle: new Date(selectedDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      label: "Total Profit",
      value: `₹${totalProfit.toFixed(2)}`,
      subtitle: `Margin: ${totalSales > 0 ? ((totalProfit/totalSales)*100).toFixed(1) : 0}%`,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50/30 to-blue-50/30 dark:from-gray-900 dark:via-cyan-900/10 dark:to-blue-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
                Sales Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Track and manage your daily sales with precision
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Date Picker */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl px-4 py-3 shadow-lg"
              >
                <Calendar size={18} className="text-gray-500 dark:text-gray-400 shrink-0" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-sm sm:text-base text-gray-800 dark:text-gray-100 font-medium focus:outline-none min-w-0 flex-1"
                />
              </motion.div>

              {/* Add Sale Button */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(!showForm)}
                className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                <Plus size={18} className="mr-2" />
                <span>Record Sale</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* FILTER TABS */}
        {!loading && sales.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            <FilterChip
              active={filterMode === 'all'}
              label="All Sales"
              count={sales.length}
              icon={ShoppingBag}
              onClick={() => setFilterMode('all')}
            />
            
            {costUnknownCount > 0 && (
              <FilterChip
                active={filterMode === 'cost_unknown'}
                label="Needs Cost Update"
                count={costUnknownCount}
                icon={AlertCircle}
                onClick={() => setFilterMode('cost_unknown')}
              />
            )}
          </motion.div>
        )}

        {/* Sales Form Modal */}
        <SalesForm
          show={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={() => {
            loadSales();
            loadSupplierInventories();
          }}
          varieties={varieties}
          supplierInventories={supplierInventories}
        />

        {/* Edit Sale Modal */}
        {editingSale && (
          <EditSaleModal
            sale={editingSale}
            varieties={varieties}
            onClose={() => setEditingSale(null)}
            onSave={() => {
              loadSales();
              setEditingSale(null);
            }}
          />
        )}

        {/* ============================================ */}
        {/* SWIPEABLE METRIC CARDS - INSTAGRAM STYLE */}
        {/* ============================================ */}
        {loading ? (
          <div className="mb-8">
            <SkeletonStatCard />
          </div>
        ) : !loading && filteredSales.length > 0 && (
          <div className="mb-8">
            <SwipeableMetricCards 
              metrics={metrics}
              showNavButtons={true}
              showDots={true}
              autoCountUp={true}
              swipeThreshold={50}
            />
          </div>
        )}

        {/* PROGRESSIVE DISCLOSURE - VIEW RECORDS BUTTON */}
        {!loading && filteredSales.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRecords(!showRecords)}
              className="w-full backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 group-hover:from-gray-700 group-hover:to-gray-900 transition-all">
                  <Eye size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                    {showRecords ? 'Hide' : 'View'} Detailed Records
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredSales.length} sale{filteredSales.length !== 1 ? 's' : ''} on {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: showRecords ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={24} className="text-gray-600 dark:text-gray-400" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}

        {/* SALES RECORDS TABLE - WITH ANIMATION */}
        <AnimatePresence>
          {showRecords && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-100/50 to-transparent dark:from-gray-700/50">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {filterMode === 'cost_unknown' ? 'Sales Needing Cost Update' : 'Sales Records'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {loading ? (
                <>
                  <div className="block lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
                    {[...Array(5)].map((_, i) => (
                      <SkeletonMobileCard key={i} />
                    ))}
                  </div>

                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-600/50 sticky top-0">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Salesperson</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Variety</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Payment</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sale</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Profit</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                        {[...Array(5)].map((_, i) => (
                          <SkeletonTableRow key={i} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : filteredSales.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Package className="text-gray-400 dark:text-gray-500 w-10 h-10" />
                  </div>
                  <p className="text-base text-gray-600 dark:text-gray-400 font-semibold">
                    {filterMode === 'cost_unknown' ? 'No sales need cost updates' : 'No sales recorded'}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {filterMode === 'cost_unknown' ? 'All sales have cost information' : 'Start by recording your first sale'}
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* MOBILE: Card View */}
                  <div className="block lg:hidden divide-y divide-gray-200/50 dark:divide-gray-700/50 p-4">
                    {filteredSales.map((item, index) => (
                      <SalesMobileCard
                        key={item.id}
                        item={item}
                        index={index}
                        onEdit={setEditingSale}
                        onDelete={handleDelete}
                        formatQuantityWithUnit={formatQuantityWithUnit}
                      />
                    ))}
                  </div>

                  {/* DESKTOP: Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-600/50 sticky top-0">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Salesperson</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Variety</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Payment</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sale</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Profit</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                        {filteredSales.map((item, index) => (
                          <SalesTableRow
                            key={item.id}
                            item={item}
                            index={index}
                            onEdit={setEditingSale}
                            onDelete={handleDelete}
                            formatQuantityWithUnit={formatQuantityWithUnit}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* EMPTY STATE - When no sales at all */}
        {!loading && sales.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-12 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-400 dark:text-gray-500 w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              No Sales Recorded Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start tracking your sales by recording your first transaction
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={18} />
              Record Your First Sale
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}