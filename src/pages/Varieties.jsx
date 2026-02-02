// frontend/src/pages/Varieties.jsx - GLASSMORPHISM REDESIGN
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Save, Package, Eye, ChevronDown, Ruler, Tag, DollarSign, FileText } from 'lucide-react';
import api from '../api/api';
import { SkeletonMobileCard, SkeletonTableRow } from '../components/skeleton/UnifiedSkeleton';

// ============================================
// GLASSMORPHISM STAT CARD
// ============================================
const GlassStatCard = ({ icon: Icon, label, value, color, index }) => {
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
        <div className="flex items-start justify-between">
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
      </div>
    </motion.div>
  );
};

// ============================================
// VARIETY CARD (MOBILE)
// ============================================
const VarietyCard = ({ variety, onEdit, onDelete, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group relative"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur-lg transition-opacity duration-300 rounded-xl" />
      
      {/* Card content */}
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg truncate">
                {variety.name}
              </h4>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl bg-linear-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-400 capitalize shrink-0">
                {variety.measurement_unit}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(variety)}
              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
              title="Edit"
            >
              <Edit2 size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(variety.id)}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {variety.standard_length && (
            <div className="flex items-center gap-2 backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
              <Ruler size={14} className="text-gray-600 dark:text-gray-400 shrink-0" />
              <div className="flex justify-between flex-1">
                <span className="text-gray-600 dark:text-gray-400">Standard Length:</span>
                <span className="text-gray-800 dark:text-gray-200 font-semibold">
                  {variety.standard_length} {variety.measurement_unit}
                </span>
              </div>
            </div>
          )}
          
          {variety.default_cost_price && (
            <div className="flex items-center gap-2 backdrop-blur-sm bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg p-2">
              <DollarSign size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex justify-between flex-1">
                <span className="text-gray-600 dark:text-gray-400">Default Cost:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  ₹{parseFloat(variety.default_cost_price).toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          {variety.description && (
            <div className="flex items-start gap-2 backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
              <FileText size={14} className="text-gray-600 dark:text-gray-400 shrink-0 mt-0.5" />
              <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 flex-1">
                {variety.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// VARIETY TABLE ROW (DESKTOP)
// ============================================
const VarietyTableRow = ({ variety, onEdit, onDelete, index }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
      className="border-b border-gray-200/50 dark:border-gray-700/50 transition"
    >
      <td className="px-6 py-4">
        <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">{variety.name}</div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl bg-gradlinearient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-400 capitalize">
          {variety.measurement_unit}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
        {variety.standard_length ? `${variety.standard_length} ${variety.measurement_unit}` : '—'}
      </td>
      <td className="px-6 py-4 text-right">
        {variety.default_cost_price ? (
          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">
            ₹{parseFloat(variety.default_cost_price).toFixed(2)}
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">—</span>
        )}
      </td>
      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm max-w-xs truncate">
        {variety.description || '—'}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(variety)}
            className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
            title="Edit"
          >
            <Edit2 size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(variety.id)}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function Varieties() {
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showVarieties, setShowVarieties] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    measurement_unit: 'pieces',
    standard_length: '',
    default_cost_price: '',
  });

  const units = [
    { value: 'pieces', label: 'Pieces', icon: Package },
    { value: 'meters', label: 'Meters', icon: Ruler },
    { value: 'yards', label: 'Yards', icon: Ruler },
  ];

  useEffect(() => {
    loadVarieties();
  }, []);

  const loadVarieties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/varieties/');
      setVarieties(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to load varieties:', error);
      alert('Failed to load varieties');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      description: formData.description || null,
      measurement_unit: formData.measurement_unit,
      standard_length:
        formData.measurement_unit === 'pieces'
          ? null
          : Number(formData.standard_length),
      default_cost_price: formData.default_cost_price 
        ? Number(formData.default_cost_price) 
        : null,
    };

    try {
      if (editingId) {
        await api.put(`/varieties/${editingId}`, payload);
        alert('Variety updated successfully!');
      } else {
        await api.post('/varieties/', payload);
        alert('Variety created successfully!');
      }
      resetForm();
      loadVarieties();
    } catch (err) {
      console.error('Failed to save variety:', err);
      alert(err.response?.data?.detail || 'Failed to save variety');
    }
  };

  const handleEdit = (variety) => {
    setEditingId(variety.id);
    setFormData({
      name: variety.name,
      description: variety.description || '',
      measurement_unit: variety.measurement_unit,
      standard_length: variety.standard_length || '',
      default_cost_price: variety.default_cost_price || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this variety?')) return;
    try {
      await api.delete(`/varieties/${id}`);
      loadVarieties();
      alert('Variety deleted successfully!');
    } catch (error) {
      console.error('Failed to delete variety:', error);
      alert('Failed to delete variety');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      measurement_unit: 'pieces',
      standard_length: '',
      default_cost_price: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  // Calculate stats
  const stats = {
    total: varieties.length,
    withCost: varieties.filter(v => v.default_cost_price).length,
    byUnit: {
      pieces: varieties.filter(v => v.measurement_unit === 'pieces').length,
      meters: varieties.filter(v => v.measurement_unit === 'meters').length,
      yards: varieties.filter(v => v.measurement_unit === 'yards').length,
    }
  };

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
                Cloth Varieties
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Manage your product catalog
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto flex items-center justify-center bg-linear-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              <Plus size={18} className="mr-2" />
              <span>Add Variety</span>
            </motion.button>
          </div>
        </motion.div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <GlassStatCard
            icon={Package}
            label="Total Varieties"
            value={stats.total}
            color="from-blue-500 to-cyan-500"
            index={0}
          />
          <GlassStatCard
            icon={DollarSign}
            label="With Default Cost"
            value={stats.withCost}
            color="from-emerald-500 to-teal-500"
            index={1}
          />
          <GlassStatCard
            icon={Tag}
            label="Pieces"
            value={stats.byUnit.pieces}
            color="from-purple-500 to-pink-500"
            index={2}
          />
          <GlassStatCard
            icon={Ruler}
            label="Meters/Yards"
            value={stats.byUnit.meters + stats.byUnit.yards}
            color="from-orange-500 to-amber-500"
            index={3}
          />
        </div>

        {/* VARIETY FORM */}
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
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {editingId ? 'Edit Variety' : 'New Variety'}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetForm}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Variety Name *
                    </label>
                    <input
                      placeholder="e.g., Cotton Fabric"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 dark:text-gray-100 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Measurement Unit *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {units.map((unit) => {
                        const Icon = unit.icon;
                        const isSelected = formData.measurement_unit === unit.value;
                        return (
                          <motion.button
                            key={unit.value}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({ ...formData, measurement_unit: unit.value })}
                            className={`
                              relative p-4 rounded-xl border-2 transition-all
                              ${isSelected 
                                ? 'bg-linear-to-br from-blue-500 to-cyan-500 border-transparent text-white shadow-lg' 
                                : 'backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border-white/20 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:border-blue-500/50'
                              }
                            `}
                          >
                            <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                            <span className="text-sm font-semibold">{unit.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {(formData.measurement_unit === 'meters' || formData.measurement_unit === 'yards') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Standard Length *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g., 2.5"
                        value={formData.standard_length}
                        onChange={(e) => setFormData({ ...formData, standard_length: e.target.value })}
                        className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 dark:text-gray-100 transition"
                      />
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Cost Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g., 150.00"
                      value={formData.default_cost_price}
                      onChange={(e) => setFormData({ ...formData, default_cost_price: e.target.value })}
                      className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 dark:text-gray-100 transition"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                      <DollarSign size={12} />
                      This price will be auto-filled when recording sales
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Optional description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 backdrop-blur-xl bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 dark:text-gray-100 transition resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      className="w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-lg bg-linear-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white font-medium hover:shadow-xl transition-all"
                    >
                      <Save size={18} className="mr-2" />
                      {editingId ? 'Update' : 'Create'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetForm}
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

        {/* PROGRESSIVE DISCLOSURE - VIEW VARIETIES BUTTON */}
        {!loading && varieties.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowVarieties(!showVarieties)}
              className="w-full backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-br from-gray-600 to-gray-800 group-hover:from-gray-700 group-hover:to-gray-900 transition-all">
                  <Eye size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                    {showVarieties ? 'Hide' : 'View'} All Varieties
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {varieties.length} {varieties.length === 1 ? 'variety' : 'varieties'} in catalog
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: showVarieties ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={24} className="text-gray-600 dark:text-gray-400" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}

        {/* VARIETIES LIST - WITH ANIMATION */}
        <AnimatePresence>
          {showVarieties && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
            >
              {loading ? (
                <>
                  <div className="block lg:hidden p-4 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <SkeletonMobileCard key={i} />
                    ))}
                  </div>

                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-600/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Unit</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Standard Length</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Default Cost</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Description</th>
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
              ) : varieties.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 px-4"
                >
                  <div className="w-20 h-20 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Package className="text-gray-400 dark:text-gray-500 w-10 h-10" />
                  </div>
                  <p className="text-base text-gray-600 dark:text-gray-400 font-semibold">
                    No varieties found
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Add your first cloth variety to get started
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* MOBILE: Card View */}
                  <div className="block lg:hidden p-4 space-y-3">
                    {varieties.map((v, index) => (
                      <VarietyCard
                        key={v.id}
                        variety={v}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        index={index}
                      />
                    ))}
                  </div>

                  {/* DESKTOP: Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-600/50 sticky top-0">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Unit</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Standard Length</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Default Cost</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                        {varieties.map((v, idx) => (
                          <VarietyTableRow
                            key={v.id}
                            variety={v}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            index={idx}
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

        {/* EMPTY STATE - When no varieties at all */}
        {!loading && varieties.length === 0 && !showVarieties && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-12 text-center"
          >
            <div className="w-24 h-24 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="text-gray-400 dark:text-gray-500 w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              No Varieties Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start building your product catalog by adding your first variety
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-linear-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={18} />
              Add Your First Variety
            </motion.button>
          </motion.div>
        )}

        {/* FOOTER STATS */}
        {!loading && varieties.length > 0 && showVarieties && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <div className="backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/50 rounded-xl px-4 py-3 inline-block">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total: <span className="font-bold text-gray-900 dark:text-gray-100">{varieties.length}</span> {varieties.length === 1 ? 'variety' : 'varieties'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}