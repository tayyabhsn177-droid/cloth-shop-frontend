// frontend/src/pages/AnalyticsDashboard.jsx - GLASSMORPHISM REDESIGN
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Award, AlertCircle, Users, Calendar, Eye, ChevronDown, Filter, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import InventoryAnalyticsDashboard from '../components/InventoryAnalyticsDashboard';
import { fetchAnalyticsByDateRange, KPICard } from '../components/core/AnalyticsFunction';
import { SkeletonStatCard, SkeletonChart, SkeletonTable, SkeletonPieChart } from '../components/skeleton/UnifiedSkeleton';

const getDateRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { startDate: start, endDate: end };
};

const getCustomDateRange = (startDateStr, endDateStr) => {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { startDate: start, endDate: end };
};

const COLORS = [
  '#7A8CA5', '#8FA897', '#C2A98D', '#9B8FB3', '#86A6A6', '#B08E8E',
];

// ============================================
// GLASSMORPHISM KPI CARD
// ============================================
const GlassKPICard = ({ title, value, subtitle, icon: Icon, trend, color, index }) => {
  const trendPositive = trend !== null && trend !== undefined && trend > 0;
  const trendNegative = trend !== null && trend !== undefined && trend < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative"
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur-xl transition-opacity duration-500 rounded-2xl`} />
      
      {/* Glass card */}
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              {title}
            </p>
            <motion.p 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
            >
              {value}
            </motion.p>
          </div>
          
          {/* Icon */}
          <motion.div 
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </motion.div>
        </div>

        {/* Subtitle & Trend */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">
            {subtitle}
          </p>
          
          {trend !== null && trend !== undefined && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className={`flex items-center gap-1 ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                trendPositive 
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                  : trendNegative
                  ? 'bg-red-500/20 text-red-700 dark:text-red-400'
                  : 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
              }`}
            >
              {trendPositive ? <TrendingUp size={12} /> : trendNegative ? <TrendingDown size={12} /> : null}
              <span>{trend > 0 ? '+' : ''}{trend}%</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// SECTION TOGGLE BUTTON
// ============================================
const SectionToggle = ({ show, onToggle, title, subtitle, icon: Icon }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onToggle}
      className="w-full backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-between group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 group-hover:from-gray-700 group-hover:to-gray-900 transition-all">
          <Icon size={20} className="text-white" />
        </div>
        <div className="text-left">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg">
            {show ? 'Hide' : 'View'} {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
      </div>
      <motion.div
        animate={{ rotate: show ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronDown size={24} className="text-gray-600 dark:text-gray-400" />
      </motion.div>
    </motion.button>
  );
};

// ============================================
// DATE RANGE PILL
// ============================================
const DateRangePill = ({ active, label, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
        ${active
          ? 'bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white shadow-lg'
          : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/70'
        }
      `}
    >
      {label}
    </motion.button>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const AnalyticsDashboard = () => {
  const [rangeMode, setRangeMode] = useState('preset');
  const [timeRange, setTimeRange] = useState(7);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Progressive disclosure states
  const [showSalesTrend, setShowSalesTrend] = useState(true);
  const [showTopProducts, setShowTopProducts] = useState(false);
  const [showProductMix, setShowProductMix] = useState(false);
  const [showSalespersonPerf, setShowSalespersonPerf] = useState(false);
  const [showSuppliers, setShowSuppliers] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        let dateRange;
        if (rangeMode === 'preset') {
          dateRange = getDateRange(timeRange);
        } else if (rangeMode === 'custom' && customStartDate && customEndDate) {
          dateRange = getCustomDateRange(customStartDate, customEndDate);
        } else {
          setLoading(false);
          return;
        }

        const data = await fetchAnalyticsByDateRange(dateRange.startDate, dateRange.endDate);
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load analytics data. Please check if the API is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [timeRange, rangeMode, customStartDate, customEndDate]);

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-cyan-50/30 to-blue-50/30 dark:from-gray-900 dark:via-cyan-900/10 dark:to-blue-900/10 px-4"
      >
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-red-200/50 dark:border-red-800/50 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">Error Loading Data</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white rounded-lg hover:shadow-xl transition-all text-sm sm:text-base font-medium"
          >
            Retry
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50/30 to-blue-50/30 dark:from-gray-900 dark:via-cyan-900/10 dark:to-blue-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Real-time business insights and performance metrics
              </p>
            </div>

            {/* DATE RANGE CONTROLS */}
            <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl p-1 shadow-lg">
                <button
                  onClick={() => setRangeMode('preset')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    rangeMode === 'preset' 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white shadow-md' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  Preset
                </button>
                <button
                  onClick={() => setRangeMode('custom')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    rangeMode === 'custom' 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 text-white shadow-md' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Calendar size={14} className="hidden sm:block" />
                  <span>Custom</span>
                </button>
              </div>

              {rangeMode === 'preset' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl p-1 shadow-lg"
                >
                  {[7, 30, 90].map((days) => (
                    <DateRangePill
                      key={days}
                      active={timeRange === days}
                      label={`${days} Days`}
                      onClick={() => setTimeRange(days)}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* CUSTOM DATE RANGE */}
        <AnimatePresence>
          {rangeMode === 'custom' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300/50 dark:border-gray-600/50 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300/50 dark:border-gray-600/50 rounded-lg backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-sm sm:text-base"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <>
            {/* KPI CARDS SKELETON */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <SkeletonStatCard showTrend />
              <SkeletonStatCard showTrend />
              <SkeletonStatCard showTrend />
              <SkeletonStatCard showTrend />
            </div>

            {/* CHARTS SKELETON */}
            <SkeletonChart height={300} showTitle showLegend />
            <div className="mt-6 sm:mt-8">
              <SkeletonTable rows={5} columns={6} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8">
              <SkeletonPieChart showTitle />
              <SkeletonChart height={250} showTitle />
            </div>
          </>
        ) : analytics && (
          <>
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <GlassKPICard
                title="Total Revenue"
                value={`₹${(analytics.kpis.totalRevenue / 1000).toFixed(1)}K`}
                subtitle={`${analytics.kpis.totalSales} transactions`}
                icon={DollarSign}
                trend={analytics.kpis.growthRate}
                color="from-emerald-500 to-teal-500"
                index={0}
              />
              <GlassKPICard
                title="Total Profit"
                value={`₹${(analytics.kpis.totalProfit / 1000).toFixed(1)}K`}
                subtitle={`${analytics.kpis.profitMargin.toFixed(1)}% margin`}
                icon={TrendingUp}
                trend={null}
                color="from-blue-500 to-cyan-500"
                index={1}
              />
              <GlassKPICard
                title="Orders"
                value={analytics.kpis.totalSales}
                subtitle={`₹${analytics.kpis.avgOrderValue.toLocaleString()} avg value`}
                icon={ShoppingCart}
                trend={null}
                color="from-purple-500 to-pink-500"
                index={2}
              />
              <GlassKPICard
                title="Items Sold"
                value={analytics.kpis.totalItemsSold}
                subtitle={`${analytics.kpis.topProduct}`}
                icon={Package}
                color="from-orange-500 to-red-500"
                index={3}
              />
            </div>

            {/* SALES TREND SECTION */}
            <div className="mb-6">
              <SectionToggle
                show={showSalesTrend}
                onToggle={() => setShowSalesTrend(!showSalesTrend)}
                title="Sales Trend"
                subtitle={`Performance over ${timeRange} days`}
                icon={BarChart3}
              />
            </div>

            <AnimatePresence>
              {showSalesTrend && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Sales Trend ({timeRange} Days)
                  </h2>
                  {analytics.salesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.salesData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#765496" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#765496" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#bf5095" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#bf5095" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" opacity={0.3} />
                        <XAxis
                          dataKey="date"
                          stroke="currentColor"
                          className="text-gray-600 dark:text-gray-400"
                          style={{ fontSize: '11px' }}
                          angle={timeRange > 30 ? -45 : 0}
                          textAnchor={timeRange > 30 ? "end" : "middle"}
                          height={timeRange > 30 ? 80 : 30}
                        />
                        <YAxis stroke="currentColor" className="text-gray-600 dark:text-gray-400" style={{ fontSize: '11px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(31, 41, 55, 0.95)',
                            border: '1px solid rgba(75, 85, 99, 0.5)',
                            borderRadius: '12px',
                            padding: '12px',
                            color: 'rgb(243 244 246)',
                            fontSize: '12px',
                            backdropFilter: 'blur(10px)'
                          }}
                          formatter={(value) => `₹${value.toLocaleString()}`}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#765496"
                          strokeWidth={3}
                          name="Revenue (₹)"
                          dot={timeRange <= 30}
                          fill="url(#colorRevenue)"
                        />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#bf5095"
                          strokeWidth={3}
                          name="Profit (₹)"
                          dot={timeRange <= 30}
                          fill="url(#colorProfit)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 py-8">No sales data available for this period</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* TOP PRODUCTS SECTION */}
            {analytics.topProducts && analytics.topProducts.length > 0 && (
              <>
                <div className="mb-6">
                  <SectionToggle
                    show={showTopProducts}
                    onToggle={() => setShowTopProducts(!showTopProducts)}
                    title="Top Products"
                    subtitle="Best performing products by profit"
                    icon={Award}
                  />
                </div>

                <AnimatePresence>
                  {showTopProducts && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8"
                    >
                      <div className="p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Top 5 Products by Profit</h2>
                      </div>
                      
                      {/* Bar Chart */}
                      <div className="hidden sm:block p-6">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={analytics.topProducts.slice(0, 5)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" opacity={0.3} />
                            <XAxis
                              dataKey="name"
                              stroke="currentColor"
                              className="text-gray-600 dark:text-gray-400"
                              style={{ fontSize: '11px' }}
                              angle={-45}
                              textAnchor="end"
                              height={100}
                            />
                            <YAxis stroke="currentColor" className="text-gray-600 dark:text-gray-400" style={{ fontSize: '11px' }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'rgba(31, 41, 55, 0.95)',
                                border: '1px solid rgba(75, 85, 99, 0.5)',
                                borderRadius: '12px',
                                padding: '12px',
                                color: 'rgb(243 244 246)',
                                fontSize: '12px',
                                backdropFilter: 'blur(10px)'
                              }}
                              formatter={(value) => [`₹${value.toLocaleString()}`, 'Profit']}
                            />
                            <Bar
                              dataKey="profit"
                              fill="url(#barGradient)"
                              radius={[8, 8, 0, 0]}
                            >
                              <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#8FAEA3" stopOpacity={1}/>
                                  <stop offset="100%" stopColor="#7FA096" stopOpacity={0.8}/>
                                </linearGradient>
                              </defs>
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-600/50">
                            <tr>
                              <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Rank</th>
                              <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Product</th>
                              <th className="px-3 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Items Sold</th>
                              <th className="px-3 sm:px-4 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Revenue</th>
                              <th className="px-3 sm:px-4 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Profit</th>
                              <th className="px-3 sm:px-4 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">Margin</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                            {analytics.topProducts.slice(0, 5).map((product, idx) => (
                              <motion.tr 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors"
                              >
                                <td className="px-3 sm:px-4 py-3">
                                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-white text-xs sm:text-sm ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : idx === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'}`}>
                                    {idx + 1}
                                  </div>
                                </td>
                                <td className="px-3 sm:px-4 py-3">
                                  <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">{product.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">{product.measurement_unit}</div>
                                </td>
                                <td className="px-3 sm:px-4 py-3 text-center">
                                  <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100/50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 backdrop-blur-sm">
                                    {product.items_sold}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 py-3 text-right font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                  ₹{product.revenue.toLocaleString()}
                                </td>
                                <td className="px-3 sm:px-4 py-3 text-right font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                  ₹{product.profit.toLocaleString()}
                                </td>
                                <td className="px-3 sm:px-4 py-3 text-right">
                                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{product.margin.toFixed(1)}%</span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* PRODUCT MIX SECTION */}
            <div className="mb-6">
              <SectionToggle
                show={showProductMix}
                onToggle={() => setShowProductMix(!showProductMix)}
                title="Product Mix"
                subtitle="Revenue distribution across products"
                icon={PieChartIcon}
              />
            </div>

            <AnimatePresence>
              {showProductMix && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8"
                >
                  {/* Pie Chart */}
                  <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Revenue by Product</h2>
                    {analytics.productMix.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={analytics.productMix}
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            dataKey="value"
                            stroke="#ffffff"
                            strokeWidth={2}
                            label={false}
                          >
                            {analytics.productMix.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(31, 41, 55, 0.95)',
                              border: '1px solid rgba(75, 85, 99, 0.5)',
                              borderRadius: '12px',
                              padding: '12px',
                              color: 'rgb(243 244 246)',
                              fontSize: '12px',
                              backdropFilter: 'blur(10px)'
                            }}
                            formatter={(value, name, props) => [`₹${props.payload.amount.toLocaleString()}`, 'Revenue']} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">No product data available</p>
                    )}
                  </div>

                  {/* Horizontal Bar Chart */}
                  <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Top 5 Products by Revenue</h2>
                    {analytics.topProducts.length > 0 ? (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={analytics.topProducts.slice(0, 5)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" opacity={0.3} />
                          <XAxis
                            type="number"
                            stroke="currentColor"
                            className="text-gray-600 dark:text-gray-400"
                            style={{ fontSize: '11px' }}
                          />
                          <YAxis
                            dataKey="name"
                            type="category"
                            stroke="currentColor"
                            className="text-gray-600 dark:text-gray-400"
                            style={{ fontSize: '11px' }}
                            width={90}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(31, 41, 55, 0.95)',
                              border: '1px solid rgba(75, 85, 99, 0.5)',
                              borderRadius: '12px',
                              padding: '10px',
                              color: 'rgb(243 244 246)',
                              fontSize: '12px',
                              backdropFilter: 'blur(10px)'
                            }}
                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                          />
                          <Bar dataKey="revenue" fill="#7C8DB0" radius={[0, 8, 8, 0]} barSize={16} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">No product data available</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SALESPERSON PERFORMANCE SECTION */}
            {analytics.salespersonPerformance && analytics.salespersonPerformance.length > 0 && (
              <>
                <div className="mb-6">
                  <SectionToggle
                    show={showSalespersonPerf}
                    onToggle={() => setShowSalespersonPerf(!showSalespersonPerf)}
                    title="Salesperson Performance"
                    subtitle="Individual sales team metrics"
                    icon={Users}
                  />
                </div>

                <AnimatePresence>
                  {showSalespersonPerf && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8"
                    >
                      {/* Header */}
                      <div className="p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-100/30 to-transparent dark:from-gray-700/30">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Salesperson Performance</h2>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Individual sales team metrics and achievements</p>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Cards */}
                      <div className="block lg:hidden divide-y divide-gray-200/50 dark:divide-gray-700/50">
                        {analytics.salespersonPerformance.map((person, idx) => {
                          const isTopPerformer = idx === 0;
                          const profitMargin = person.revenue > 0 ? (person.profit / person.revenue) * 100 : 0;

                          return (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className={`p-4 ${isTopPerformer ? "bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-900/10" : ""}`}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isTopPerformer ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : "bg-gradient-to-br from-gray-400 to-gray-600"}`}>
                                  <span className="text-sm font-semibold text-white">
                                    {person.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{person.name}</p>
                                  {isTopPerformer && (
                                    <span className="inline-flex items-center gap-1 text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                                      <Award size={12} /> Top Performer
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-700/30 rounded-lg p-2">
                                  <span className="text-gray-600 dark:text-gray-400 text-xs block mb-0.5">Transactions</span>
                                  <span className="text-gray-800 dark:text-gray-200 font-semibold">{person.transactions}</span>
                                </div>
                                <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-700/30 rounded-lg p-2">
                                  <span className="text-gray-600 dark:text-gray-400 text-xs block mb-0.5">Items Sold</span>
                                  <span className="text-gray-800 dark:text-gray-200 font-semibold">{person.items_sold}</span>
                                </div>
                                <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-700/30 rounded-lg p-2">
                                  <span className="text-gray-600 dark:text-gray-400 text-xs block mb-0.5">Revenue</span>
                                  <span className="text-gray-800 dark:text-gray-200 font-semibold">₹{person.revenue.toLocaleString()}</span>
                                </div>
                                <div className="backdrop-blur-sm bg-emerald-100/30 dark:bg-emerald-900/20 rounded-lg p-2">
                                  <span className="text-gray-600 dark:text-gray-400 text-xs block mb-0.5">Profit</span>
                                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">₹{person.profit.toLocaleString()}</span>
                                </div>
                              </div>

                              <div className="mt-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-600 dark:text-gray-400">Profit Margin</span>
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{profitMargin.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(profitMargin * 2, 100)}%` }}
                                    transition={{ delay: idx * 0.1 + 0.3, duration: 0.8 }}
                                    className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Desktop Table */}
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-600/50">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Salesperson</th>
                              <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Transactions</th>
                              <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Items Sold</th>
                              <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Revenue</th>
                              <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Profit</th>
                              <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Avg Transaction</th>
                              <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Performance</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                            {analytics.salespersonPerformance.map((person, idx) => {
                              const isTopPerformer = idx === 0;
                              const profitMargin = person.revenue > 0 ? (person.profit / person.revenue) * 100 : 0;

                              return (
                                <motion.tr 
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className={`hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors ${isTopPerformer ? "bg-gradient-to-r from-yellow-50/30 to-transparent dark:from-yellow-900/10" : ""}`}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isTopPerformer ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : "bg-gradient-to-br from-gray-400 to-gray-600"}`}>
                                        <span className="text-sm font-semibold text-white">
                                          {person.name.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">{person.name}</p>
                                        {isTopPerformer && (
                                          <span className="inline-flex items-center gap-1 text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                                            <Award size={12} /> Top Performer
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 backdrop-blur-sm">
                                      {person.transactions}
                                    </span>
                                  </td>

                                  <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100/50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 backdrop-blur-sm">
                                      {person.items_sold}
                                    </span>
                                  </td>

                                  <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                      ₹{person.revenue.toLocaleString()}
                                    </span>
                                  </td>

                                  <td className="px-6 py-4 text-right">
                                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                      ₹{person.profit.toLocaleString()}
                                    </span>
                                  </td>

                                  <td className="px-6 py-4 text-right">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                      ₹{person.avgTransactionValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </span>
                                  </td>

                                  <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${Math.min(profitMargin * 2, 100)}%` }}
                                          transition={{ delay: idx * 0.1 + 0.3, duration: 0.8 }}
                                          className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                        />
                                      </div>
                                      <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {profitMargin.toFixed(1)}% margin
                                      </span>
                                    </div>
                                  </td>
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Summary Footer */}
                      <div className="p-4 bg-gradient-to-r from-gray-100/30 to-transparent dark:from-gray-700/30 border-t border-gray-200/50 dark:border-gray-600/50">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center">
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Transactions</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                              {analytics.salespersonPerformance.reduce((sum, p) => sum + p.transactions, 0)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Items</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                              {analytics.salespersonPerformance.reduce((sum, p) => sum + p.items_sold, 0)}
                            </p>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Revenue</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                              ₹{analytics.salespersonPerformance.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Profit</p>
                            <p className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-400">
                              ₹{analytics.salespersonPerformance.reduce((sum, p) => sum + p.profit, 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Team Avg</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                              ₹{(analytics.salespersonPerformance.reduce((sum, p) => sum + p.avgTransactionValue, 0) /
                                analytics.salespersonPerformance.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* SUPPLIER RELIABILITY SECTION */}
            <div className="mb-6">
              <SectionToggle
                show={showSuppliers}
                onToggle={() => setShowSuppliers(!showSuppliers)}
                title="Supplier Reliability"
                subtitle="Supplier performance metrics"
                icon={Package}
              />
            </div>

            <AnimatePresence>
              {showSuppliers && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8"
                >
                  <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Supplier Reliability</h2>
                    </div>
                    <div className="overflow-x-auto">
                      {analytics.suppliers.length > 0 ? (
                        <table className="w-full">
                          <thead className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-600/50">
                            <tr>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Supplier</th>
                              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap">Net Supply</th>
                              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Reliability</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                            {analytics.suppliers.map((supplier, idx) => (
                              <motion.tr 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors"
                              >
                                <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-xs font-bold text-white">{supplier.name.charAt(0)}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{supplier.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100">
                                  ₹{(supplier.netAmount / 1000).toFixed(0)}K
                                </td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                                  <div className="flex items-center justify-end">
                                    <div className="w-12 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${supplier.reliability}%` }}
                                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                                      />
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{supplier.reliability.toFixed(1)}%</span>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">No supplier data available</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* INVENTORY ANALYTICS */}
            <div className="mt-8 sm:mt-12">
              <InventoryAnalyticsDashboard timeRange={timeRange} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;