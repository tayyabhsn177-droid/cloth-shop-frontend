// frontend/src/components/PredictionsDashboard.jsx - GLASSMORPHISM REDESIGN

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Zap, Package, ShoppingCart, Lightbulb, Calendar, Target, Award, Activity, Brain, ChevronDown, Eye, Sparkles, BarChart3, TrendingUp as TrendIcon } from 'lucide-react';
import api from '../api/api';

// ============================================
// GLASSMORPHISM STAT CARD
// ============================================
const GlassPredictionCard = ({ icon: Icon, label, value, subtitle, color, index, confidence }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur-xl transition-opacity duration-500 rounded-2xl`} />
      
      {/* Glass card */}
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              {label}
            </p>
            <motion.p 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
            >
              {value}
            </motion.p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Icon with gradient background */}
          <motion.div 
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </motion.div>
        </div>

        {/* Confidence Badge */}
        {confidence && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className={`
              inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm border
              ${confidence === 'high' 
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' 
                : confidence === 'medium'
                ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-700 dark:text-yellow-400'
                : 'bg-red-500/20 border-red-500/30 text-red-700 dark:text-red-400'
              }
            `}
          >
            <Brain size={12} />
            <span>{confidence?.toUpperCase()} CONFIDENCE</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// FORECAST PERIOD PILL
// ============================================
const ForecastPill = ({ active, label, days, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300
        ${active
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white shadow-lg'
          : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/70'
        }
      `}
    >
      {label}
    </motion.button>
  );
};

// ============================================
// SECTION TOGGLE
// ============================================
const SectionToggle = ({ show, onToggle, title, subtitle, icon: Icon, color = "from-gray-600 to-gray-800" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onToggle}
      className="w-full backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-between group"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color} group-hover:from-gray-700 group-hover:to-gray-900 transition-all`}>
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
// TREND INDICATOR
// ============================================
const TrendIndicator = ({ trend, strength }) => {
  const getTrendIcon = () => {
    if (trend === 'upward') return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />;
    if (trend === 'downward') return <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />;
    return <Activity className="w-4 h-4 sm:w-5 sm:h-5" />;
  };

  const getTrendColor = () => {
    if (trend === 'upward') return 'from-emerald-500 to-teal-500 text-emerald-700 dark:text-emerald-300';
    if (trend === 'downward') return 'from-red-500 to-pink-500 text-red-700 dark:text-red-300';
    return 'from-gray-500 to-gray-600 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${getTrendColor()} bg-opacity-10 backdrop-blur-sm border border-white/20 dark:border-gray-700/50`}>
      <div className="flex items-center gap-3 mb-2">
        {getTrendIcon()}
        <span className="text-sm font-medium capitalize">{trend || 'stable'} Trend</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600 dark:text-gray-400">Strength</span>
        <span className="text-xl font-bold">{strength || 0}%</span>
      </div>
      <div className="mt-2 w-full bg-white/30 dark:bg-gray-700/30 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${strength || 0}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-2 rounded-full bg-gradient-to-r from-current to-current opacity-70"
        />
      </div>
    </div>
  );
};

// ============================================
// INSIGHT CARD
// ============================================
const InsightCard = ({ insight, index }) => {
  const getInsightIcon = (type) => {
    if (type === 'positive') return <Award className="w-5 h-5 sm:w-6 sm:h-6" />;
    if (type === 'warning') return <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />;
    return <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />;
  };

  const getInsightColor = (type) => {
    if (type === 'positive') return 'from-emerald-500 to-teal-500 border-emerald-200 dark:border-emerald-800';
    if (type === 'warning') return 'from-yellow-500 to-orange-500 border-yellow-200 dark:border-yellow-800';
    return 'from-blue-500 to-cyan-500 border-blue-200 dark:border-blue-800';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-red-500/20 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700';
    if (priority === 'medium') return 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700';
    return 'bg-gray-500/20 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, x: 4 }}
      className={`p-4 rounded-xl backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border-l-4 border ${getInsightColor(insight.type)} shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex gap-3">
        <div className={`shrink-0 p-2 rounded-lg bg-gradient-to-br ${getInsightColor(insight.type).split(' ')[0]}`}>
          <div className="text-white">
            {getInsightIcon(insight.type)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base">
            {insight.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
            {insight.message}
          </p>
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityColor(insight.priority)}`}>
            {insight.priority?.toUpperCase()} PRIORITY
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// REORDER RECOMMENDATION CARD
// ============================================
const ReorderCard = ({ item, index }) => {
  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'from-red-500 to-pink-500';
    if (priority === 'medium') return 'from-yellow-500 to-orange-500';
    return 'from-emerald-500 to-teal-500';
  };

  const getPriorityBadgeColor = (priority) => {
    if (priority === 'high') return 'bg-red-500/20 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700';
    if (priority === 'medium') return 'bg-yellow-500/20 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700';
    return 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start gap-3 mb-3">
        <motion.div 
          className={`p-2 rounded-lg bg-gradient-to-br ${getPriorityColor(item.priority)} shadow-lg`}
          whileHover={{ rotate: 5 }}
        >
          <Package className="w-4 h-4 text-white" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
            {item.variety_name}
          </h4>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-bold border shrink-0 ${getPriorityBadgeColor(item.priority)}`}>
          {item.priority.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-700/30 rounded-lg p-2">
          <p className="text-gray-600 dark:text-gray-400 mb-0.5">Avg Daily Sales</p>
          <p className="font-bold text-gray-900 dark:text-gray-100">{item.avg_daily_sales.toFixed(1)}</p>
        </div>
        <div className="backdrop-blur-sm bg-yellow-100/30 dark:bg-yellow-900/20 rounded-lg p-2">
          <p className="text-gray-600 dark:text-gray-400 mb-0.5">Reorder Point</p>
          <p className="font-bold text-yellow-800 dark:text-yellow-300">{item.reorder_point}</p>
        </div>
        <div className="backdrop-blur-sm bg-blue-100/30 dark:bg-blue-900/20 rounded-lg p-2">
          <p className="text-gray-600 dark:text-gray-400 mb-0.5">Order Qty</p>
          <p className="font-bold text-blue-800 dark:text-blue-300">{item.optimal_order_quantity}</p>
        </div>
        <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-700/30 rounded-lg p-2">
          <p className="text-gray-600 dark:text-gray-400 mb-0.5">Days Stock</p>
          <p className="font-bold text-gray-900 dark:text-gray-100">{item.days_of_stock}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const PredictionsDashboard = () => {
  const [forecastData, setForecastData] = useState(null);
  const [trends, setTrends] = useState(null);
  const [insights, setInsights] = useState(null);
  const [reorderRecs, setReorderRecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecastDays, setForecastDays] = useState(30);

  // Progressive disclosure states
  const [showForecast, setShowForecast] = useState(true);
  const [showTrends, setShowTrends] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showReorder, setShowReorder] = useState(false);

  useEffect(() => {
    loadPredictions();
  }, [forecastDays]);

  const loadPredictions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [forecastRes, trendsRes, insightsRes, reorderRes] = await Promise.all([
        api.get(`/predictions/revenue-forecast?days_ahead=${forecastDays}`),
        api.get('/predictions/sales-trends?days=30'),
        api.get('/predictions/smart-insights?days=30'),
        api.get('/predictions/reorder-recommendations')
      ]);

      setForecastData(forecastRes.data);
      setTrends(trendsRes.data);
      setInsights(insightsRes.data);
      setReorderRecs(reorderRes.data);
    } catch (err) {
      setError('Failed to load predictions. Ensure you have sufficient historical data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4"
          >
            <Sparkles className="w-full h-full text-purple-600 dark:text-purple-400" />
          </motion.div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
            Generating AI predictions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10 px-4"
      >
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-red-200/50 dark:border-red-800/50 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
            Unable to Generate Predictions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadPredictions}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg hover:shadow-xl transition-all font-medium"
          >
            Retry
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const combinedChartData = [
    ...((forecastData?.historical_data || []).map(d => ({ ...d, type: 'historical' }))),
    ...((forecastData?.forecast || []).map(d => ({ 
      date: d.date, 
      revenue: d.predicted_revenue, 
      type: 'forecast' 
    })))
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              AI Predictions & Insights
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Machine learning powered forecasts and smart recommendations
          </p>
        </motion.div>

        {/* FORECAST PERIOD CONTROLS */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl shadow-lg p-4 mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Forecast Period:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[7, 14, 30, 60, 90].map((days) => (
                <ForecastPill
                  key={days}
                  active={forecastDays === days}
                  label={`${days} Days`}
                  days={days}
                  onClick={() => setForecastDays(days)}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* SUMMARY STATS */}
        {forecastData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 sm:mb-8">
            <GlassPredictionCard
              icon={TrendIcon}
              label="Predicted Revenue"
              value={`₹${Math.round(forecastData.summary?.total_predicted_revenue || 0).toLocaleString()}`}
              subtitle={`Next ${forecastDays} days`}
              color="from-purple-500 to-pink-500"
              confidence={forecastData.confidence}
              index={0}
            />
            <GlassPredictionCard
              icon={Activity}
              label="Avg Daily Predicted"
              value={`₹${Math.round(forecastData.summary?.avg_daily_predicted || 0).toLocaleString()}`}
              subtitle="Expected per day"
              color="from-blue-500 to-cyan-500"
              index={1}
            />
            <GlassPredictionCard
              icon={Brain}
              label="Model Accuracy"
              value={`${((forecastData.r_squared || 0) * 100).toFixed(1)}%`}
              subtitle="R² score"
              color="from-emerald-500 to-teal-500"
              index={2}
            />
          </div>
        )}

        {/* REVENUE FORECAST SECTION */}
        {forecastData && (
          <>
            <div className="mb-6">
              <SectionToggle
                show={showForecast}
                onToggle={() => setShowForecast(!showForecast)}
                title="Revenue Forecast"
                subtitle={`${forecastDays}-day prediction with historical comparison`}
                icon={BarChart3}
                color="from-purple-600 to-blue-600"
              />
            </div>

            <AnimatePresence>
              {showForecast && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-6 mb-6 sm:mb-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        Revenue Forecast
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Predicted total: ₹{Math.round(forecastData.summary?.total_predicted_revenue || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={combinedChartData}>
                      <defs>
                        <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        stroke="currentColor"
                        className="text-gray-600 dark:text-gray-400"
                        style={{ fontSize: '11px' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        stroke="currentColor"
                        className="text-gray-600 dark:text-gray-400"
                        style={{ fontSize: '11px' }}
                      />
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
                        formatter={(value) => [`₹${value?.toLocaleString()}`, 'Revenue']}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorHistorical)"
                        name="Revenue"
                        connectNulls
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Model Accuracy (R²)</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {((forecastData.r_squared || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Daily Predicted</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        ₹{Math.round(forecastData.summary?.avg_daily_predicted || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Forecast Period</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {forecastDays} Days
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* TRENDS SECTION */}
        {trends && (
          <>
            <div className="mb-6">
              <SectionToggle
                show={showTrends}
                onToggle={() => setShowTrends(!showTrends)}
                title="Sales Trends Analysis"
                subtitle="Revenue and profit trend patterns"
                icon={TrendingUp}
                color="from-emerald-500 to-teal-500"
              />
            </div>

            <AnimatePresence>
              {showTrends && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    Trend Analysis
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <TrendIndicator
                      trend={trends.revenue_trend?.trend}
                      strength={trends.revenue_trend?.strength}
                    />
                    <TrendIndicator
                      trend={trends.profit_trend?.trend}
                      strength={trends.profit_trend?.strength}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="backdrop-blur-sm bg-blue-100/30 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
                      <p className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Growth Rate</p>
                      <p className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {(trends.growth_rate || 0) > 0 ? '+' : ''}{(trends.growth_rate || 0).toFixed(1)}%
                      </p>
                    </div>

                    {trends.seasonality?.has_seasonality && (
                      <div className="backdrop-blur-sm bg-purple-100/30 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50">
                        <p className="text-xs sm:text-sm font-medium text-purple-900 dark:text-purple-100 mb-3">
                          Seasonal Pattern Detected
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                          <div>
                            <p className="text-purple-700 dark:text-purple-300 mb-1">Best Day:</p>
                            <p className="font-bold text-purple-900 dark:text-purple-100">{trends.seasonality.best_day}</p>
                          </div>
                          <div>
                            <p className="text-purple-700 dark:text-purple-300 mb-1">Worst Day:</p>
                            <p className="font-bold text-purple-900 dark:text-purple-100">{trends.seasonality.worst_day}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* INSIGHTS SECTION */}
        {insights && (
          <>
            <div className="mb-6">
              <SectionToggle
                show={showInsights}
                onToggle={() => setShowInsights(!showInsights)}
                title="Smart Insights"
                subtitle={`${insights.insights?.length || 0} actionable recommendations`}
                icon={Lightbulb}
                color="from-yellow-500 to-orange-500"
              />
            </div>

            <AnimatePresence>
              {showInsights && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    Smart Insights
                  </h2>

                  <div className="space-y-3">
                    {insights.insights?.length > 0 ? (
                      insights.insights.map((insight, idx) => (
                        <InsightCard key={idx} insight={insight} index={idx} />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                          No insights available yet. More data needed.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* REORDER RECOMMENDATIONS SECTION */}
        {reorderRecs && reorderRecs.recommendations?.length > 0 && (
          <>
            <div className="mb-6">
              <SectionToggle
                show={showReorder}
                onToggle={() => setShowReorder(!showReorder)}
                title="Smart Reorder Recommendations"
                subtitle={`${reorderRecs.recommendations?.length || 0} products need attention`}
                icon={Target}
                color="from-cyan-500 to-blue-500"
              />
            </div>

            <AnimatePresence>
              {showReorder && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8"
                >
                  <div className="p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-cyan-100/30 to-blue-100/30 dark:from-cyan-900/20 dark:to-blue-900/20">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                          Smart Reorder Recommendations
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                          AI-calculated optimal inventory levels
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reorderRecs.recommendations.slice(0, 9).map((rec, idx) => (
                      <ReorderCard key={idx} item={rec} index={idx} />
                    ))}
                  </div>

                  {reorderRecs.recommendations.length > 9 && (
                    <div className="p-4 bg-gray-100/30 dark:bg-gray-700/30 text-center border-t border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing top 9 of {reorderRecs.recommendations.length} recommendations
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default PredictionsDashboard;