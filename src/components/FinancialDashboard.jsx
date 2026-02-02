// frontend/src/components/FinancialDashboard.jsx - GLASSMORPHISM REDESIGN

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, AlertCircle, 
  Calendar, ArrowUp, ArrowDown, Activity, RefreshCw,
  Wallet, CreditCard, PieChart as PieChartIcon,
  BarChart3, Eye, ChevronDown, Zap, Target
} from 'lucide-react';
import api from '../api/api';

// ============================================
// GLASSMORPHISM KPI CARD
// ============================================
const GlassKPICard = ({ title, value, growth, icon: Icon, color, index }) => {
  const isPositive = growth !== null && growth !== undefined && growth > 0;
  const isNegative = growth !== null && growth !== undefined && growth < 0;

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
      <div className="relative backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              {title}
            </p>
            <motion.p 
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent truncate"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
            >
              {value}
            </motion.p>
          </div>
          
          {/* Icon with gradient background */}
          <motion.div 
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg shrink-0`}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </motion.div>
        </div>

        {/* Growth indicator */}
        {growth !== null && growth !== undefined && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className={`
              inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
              ${isPositive 
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                : isNegative
                ? 'bg-red-500/20 text-red-700 dark:text-red-400'
                : 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
              }
            `}
          >
            {isPositive ? <ArrowUp size={12} /> : isNegative ? <ArrowDown size={12} /> : <Activity size={12} />}
            <span>{growth > 0 ? '+' : ''}{Math.abs(growth).toFixed(1)}%</span>
            <span className="text-gray-600 dark:text-gray-400">vs last month</span>
          </motion.div>
        )}
      </div>
    </motion.div>
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
// EXPENSE CATEGORY ROW
// ============================================
const ExpenseCategoryRow = ({ item, index, total, color }) => {
  const percentage = (item.value / total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-3 sm:p-4 hover:bg-white/30 dark:hover:bg-gray-700/30 rounded-lg transition-all"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <div
          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base flex-1 min-w-0 truncate">
          {item.name}
        </span>
        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium shrink-0">
          {percentage.toFixed(1)}%
        </span>
      </div>
      
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.8 }}
            className="h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base shrink-0">
          ₹{item.value.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const FinancialDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    monthlyTrends: [],
    expenseBreakdown: [],
    profitTrend: [],
    kpis: {}
  });

  // Progressive disclosure states
  const [showRevenueTrend, setShowRevenueTrend] = useState(true);
  const [showProfitAnalysis, setShowProfitAnalysis] = useState(false);
  const [showExpenseBreakdown, setShowExpenseBreakdown] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const COLORS = [
    '#5f6388', '#8b7fb5', '#5f9a8d', '#c2a46b', 
    '#b56f6f', '#5f8fa3', '#8fa06a'
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getMonthsBack = (monthsAgo) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const months = [];
      for (let i = 5; i >= 0; i--) {
        months.push(getMonthsBack(i));
      }

      const monthlyReports = await Promise.all(
        months.map(async (m) => {
          try {
            const response = await api.get(`/expenses/financial-report/${m.year}/${m.month}`);
            const data = response.data;
            return { ...data, label: m.label };
          } catch (error) {
            return {
              total_revenue: 0,
              total_profit: 0,
              total_expenses: 0,
              net_income: 0,
              profit_margin: 0,
              expense_ratio: 0,
              label: m.label
            };
          }
        })
      );

      const currentMonth = new Date();
      const expensesResponse = await api.get(
        `/expenses/month/${currentMonth.getFullYear()}/${currentMonth.getMonth() + 1}`
      );
      const expenses = expensesResponse.data;

      const categoryMap = (expenses || []).reduce((acc, expense) => {
        const category = expense.category.replace(/_/g, ' ').toUpperCase();
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
        return acc;
      }, {});

      const expenseBreakdown = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2))
      }));

      const monthlyTrends = monthlyReports.map(report => ({
        month: report.label,
        revenue: parseFloat(report.total_revenue || 0),
        expenses: parseFloat(report.total_expenses || 0),
        profit: parseFloat(report.total_profit || 0),
        netIncome: parseFloat(report.net_income || 0)
      }));

      const currentMonthData = monthlyReports[monthlyReports.length - 1];
      const lastMonthData = monthlyReports[monthlyReports.length - 2] || currentMonthData;

      const calculateGrowth = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      const kpis = {
        revenue: {
          value: parseFloat(currentMonthData.total_revenue || 0),
          growth: calculateGrowth(
            parseFloat(currentMonthData.total_revenue || 0),
            parseFloat(lastMonthData.total_revenue || 0)
          )
        },
        expenses: {
          value: parseFloat(currentMonthData.total_expenses || 0),
          growth: calculateGrowth(
            parseFloat(currentMonthData.total_expenses || 0),
            parseFloat(lastMonthData.total_expenses || 0)
          )
        },
        profit: {
          value: parseFloat(currentMonthData.total_profit || 0),
          growth: calculateGrowth(
            parseFloat(currentMonthData.total_profit || 0),
            parseFloat(lastMonthData.total_profit || 0)
          )
        },
        netIncome: {
          value: parseFloat(currentMonthData.net_income || 0),
          growth: calculateGrowth(
            parseFloat(currentMonthData.net_income || 0),
            parseFloat(lastMonthData.net_income || 0)
          )
        }
      };

      setDashboardData({
        monthlyTrends,
        expenseBreakdown,
        profitTrend: monthlyTrends,
        kpis
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/30 dark:from-gray-900 dark:via-green-900/10 dark:to-emerald-900/10">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4"
          >
            <Wallet className="w-full h-full text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
            Loading financial data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-50/30 dark:from-gray-900 dark:via-green-900/10 dark:to-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Wallet className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
                  Financial Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive business analytics and insights
                </p>
              </div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-xl px-4 py-2.5 shadow-lg"
            >
              <Calendar size={18} className="text-gray-500 dark:text-gray-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Last 6 Months
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <GlassKPICard
            title="Total Revenue"
            value={`₹${dashboardData.kpis.revenue?.value?.toLocaleString() || 0}`}
            growth={dashboardData.kpis.revenue?.growth}
            icon={DollarSign}
            color="from-emerald-500 to-teal-500"
            index={0}
          />
          <GlassKPICard
            title="Total Expenses"
            value={`₹${dashboardData.kpis.expenses?.value?.toLocaleString() || 0}`}
            growth={dashboardData.kpis.expenses?.growth}
            icon={CreditCard}
            color="from-red-500 to-pink-500"
            index={1}
          />
          <GlassKPICard
            title="Gross Profit"
            value={`₹${dashboardData.kpis.profit?.value?.toLocaleString() || 0}`}
            growth={dashboardData.kpis.profit?.growth}
            icon={TrendingUp}
            color="from-blue-500 to-cyan-500"
            index={2}
          />
          <GlassKPICard
            title="Net Income"
            value={`₹${dashboardData.kpis.netIncome?.value?.toLocaleString() || 0}`}
            growth={dashboardData.kpis.netIncome?.growth}
            icon={Activity}
            color="from-purple-500 to-pink-500"
            index={3}
          />
        </div>

        {/* REVENUE VS EXPENSES TREND */}
        <div className="mb-6">
          <SectionToggle
            show={showRevenueTrend}
            onToggle={() => setShowRevenueTrend(!showRevenueTrend)}
            title="Revenue vs Expenses Trend"
            subtitle="6-month performance comparison"
            icon={BarChart3}
            color="from-emerald-500 to-teal-500"
          />
        </div>

        <AnimatePresence>
          {showRevenueTrend && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                Revenue vs Expenses Trend
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={dashboardData.monthlyTrends}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="currentColor"
                    className="text-gray-600 dark:text-gray-400"
                    style={{ fontSize: '11px' }}
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
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROFIT ANALYSIS */}
        <div className="mb-6">
          <SectionToggle
            show={showProfitAnalysis}
            onToggle={() => setShowProfitAnalysis(!showProfitAnalysis)}
            title="Profit Analysis"
            subtitle="Gross profit and net income trends"
            icon={TrendingUp}
            color="from-blue-500 to-cyan-500"
          />
        </div>

        <AnimatePresence>
          {showProfitAnalysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8"
            >
              {/* Profit Trend Line Chart */}
              <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Profit Trend
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.profitTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      stroke="currentColor"
                      className="text-gray-600 dark:text-gray-400"
                      style={{ fontSize: '11px' }}
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
                      formatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#0f805a"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 5 }}
                      activeDot={{ r: 7 }}
                      name="Gross Profit"
                    />
                    <Line
                      type="monotone"
                      dataKey="netIncome"
                      stroke="#7d68ab"
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', r: 5 }}
                      activeDot={{ r: 7 }}
                      name="Net Income"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Expense Breakdown Pie Chart */}
              <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Expense Distribution
                </h2>
                {dashboardData.expenseBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="#ffffff"
                        strokeWidth={2}
                      >
                        {dashboardData.expenseBreakdown.map((entry, index) => (
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
                        formatter={(value) => `₹${value.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-72 text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <AlertCircle size={40} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm">No expense data available</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EXPENSE BREAKDOWN DETAILS */}
        {dashboardData.expenseBreakdown.length > 0 && (
          <>
            <div className="mb-6">
              <SectionToggle
                show={showExpenseBreakdown}
                onToggle={() => setShowExpenseBreakdown(!showExpenseBreakdown)}
                title="Expense Category Details"
                subtitle={`${dashboardData.expenseBreakdown.length} categories tracked`}
                icon={PieChartIcon}
                color="from-orange-500 to-red-500"
              />
            </div>

            <AnimatePresence>
              {showExpenseBreakdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl overflow-hidden mb-6 sm:mb-8"
                >
                  <div className="p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-orange-100/30 to-red-100/30 dark:from-orange-900/20 dark:to-red-900/20">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                      Expense Category Details
                    </h2>
                  </div>

                  <div className="p-4 sm:p-6 space-y-3">
                    {dashboardData.expenseBreakdown
                      .sort((a, b) => b.value - a.value)
                      .map((item, idx) => {
                        const total = dashboardData.expenseBreakdown.reduce((sum, i) => sum + i.value, 0);
                        return (
                          <ExpenseCategoryRow
                            key={idx}
                            item={item}
                            index={idx}
                            total={total}
                            color={COLORS[idx % COLORS.length]}
                          />
                        );
                      })}
                  </div>

                  {/* Summary Footer */}
                  <div className="p-4 bg-gradient-to-r from-gray-100/30 to-transparent dark:from-gray-700/30 border-t border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                        Total Expenses
                      </span>
                      <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                        ₹{dashboardData.expenseBreakdown.reduce((sum, i) => sum + i.value, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* MONTHLY COMPARISON */}
        <div className="mb-6">
          <SectionToggle
            show={showComparison}
            onToggle={() => setShowComparison(!showComparison)}
            title="Monthly Financial Comparison"
            subtitle="Revenue, expenses, and net income side-by-side"
            icon={BarChart3}
            color="from-purple-500 to-pink-500"
          />
        </div>

        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                Monthly Financial Comparison
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dashboardData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="currentColor"
                    className="text-gray-600 dark:text-gray-400"
                    style={{ fontSize: '11px' }}
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
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="revenue" fill="#5f8fa3" name="Revenue" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill="#b56f6f" name="Expenses" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="netIncome" fill="#5f9a8d" name="Net Income" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FinancialDashboard;