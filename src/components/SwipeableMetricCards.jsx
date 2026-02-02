// SwipeableMetricCards.jsx - Modern Swipeable KPI Card System
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Swipeable Metric Cards Component
 * 
 * A modern, mobile-first card carousel for displaying KPI metrics one at a time.
 * Features swipe navigation, smooth animations, and auto-pagination dots.
 * 
 * @param {Array} metrics - Array of metric objects with { icon, label, value, subtitle, color }
 * @param {boolean} showNavButtons - Show/hide arrow navigation buttons (default: true)
 * @param {boolean} showDots - Show/hide pagination dots (default: true)
 * @param {boolean} autoCountUp - Enable number count-up animation (default: true)
 * @param {number} swipeThreshold - Swipe distance threshold in px (default: 50)
 */
const SwipeableMetricCards = ({ 
  metrics = [],
  showNavButtons = true,
  showDots = true,
  autoCountUp = true,
  swipeThreshold = 50
}) => {
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);
  const x = useMotionValue(0);
  
  // Calculate drag constraints
  const dragConstraints = { left: 0, right: 0 };

  // Swipe detection logic
  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    // Determine swipe direction with velocity consideration
    if (Math.abs(velocity) > 500 || Math.abs(offset) > swipeThreshold) {
      if (offset > 0) {
        // Swipe right - go to previous card
        paginate(-1);
      } else {
        // Swipe left - go to next card
        paginate(1);
      }
    }
  };

  // Navigation functions
  const paginate = (newDirection) => {
    const newIndex = activeIndex + newDirection;
    
    // Wrap around for infinite scroll feel
    if (newIndex < 0) {
      setActiveIndex([metrics.length - 1, newDirection]);
    } else if (newIndex >= metrics.length) {
      setActiveIndex([0, newDirection]);
    } else {
      setActiveIndex([newIndex, newDirection]);
    }
  };

  const goToIndex = (index) => {
    const newDirection = index > activeIndex ? 1 : -1;
    setActiveIndex([index, newDirection]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  if (!metrics || metrics.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 dark:text-gray-400">
        No metrics to display
      </div>
    );
  }

  const currentMetric = metrics[activeIndex];

  // Animation variants for card transitions
  const cardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }
    })
  };

  return (
    <div className="relative w-full">
      {/* Main Card Container */}
      <div className="relative overflow-hidden px-4 sm:px-8 md:px-12">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
            whileTap={{ cursor: "grabbing" }}
          >
            <MetricCard 
              metric={currentMetric} 
              isActive={true}
              autoCountUp={autoCountUp}
              index={activeIndex}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons (Desktop) */}
      {showNavButtons && metrics.length > 1 && (
        <>
          <motion.button
            onClick={() => paginate(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors z-10"
            aria-label="Previous metric"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
          </motion.button>

          <motion.button
            onClick={() => paginate(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors z-10"
            aria-label="Next metric"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
          </motion.button>
        </>
      )}

      {/* Pagination Dots */}
      {showDots && metrics.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 sm:mt-6">
          {metrics.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'w-8 bg-gray-700 dark:bg-gray-400' 
                  : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to metric ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Mobile Swipe Hint (first load only) */}
      {metrics.length > 1 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="text-center mt-3 sm:hidden"
        >
          <p className="text-xs text-gray-400 dark:text-gray-500">
            ← Swipe to see more →
          </p>
        </motion.div>
      )}
    </div>
  );
};

/**
 * Individual Metric Card Component
 * Displays a single KPI metric with optional count-up animation
 */
const MetricCard = ({ metric, isActive, autoCountUp, index }) => {
  const { icon: Icon, label, value, subtitle, color } = metric;
  const [displayValue, setDisplayValue] = useState(0);

  // Count-up animation for numeric values
  useEffect(() => {
    if (!autoCountUp || typeof value !== 'number') return;

    let startTime = null;
    const duration = 1000; // 1 second animation
    const startValue = 0;
    const endValue = value;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth count-up
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, autoCountUp, index]);

  const formattedValue = typeof value === 'number' 
    ? (autoCountUp ? Math.round(displayValue) : value)
    : value;

  return (
    <motion.div
      whileHover={{ 
        y: -8,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="group relative mx-auto max-w-md sm:max-w-lg lg:max-w-xl"
    >
      {/* Glow effect on hover - using existing colors */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-3xl`} />
      
      {/* Main Card */}
      <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-700/50 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          {/* Label Section */}
          <div className="flex-1 min-w-0">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider"
            >
              {label}
            </motion.p>
            
            {/* Value with count-up animation */}
            <motion.p 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.2, 
                type: "spring", 
                stiffness: 200,
                damping: 15
              }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight"
            >
              {formattedValue}
            </motion.p>
            
            {/* Subtitle */}
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          
          {/* Icon with gradient background */}
          <motion.div 
            initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ 
              delay: 0.2,
              type: "spring", 
              stiffness: 200 
            }}
            whileHover={{ 
              rotate: 5, 
              scale: 1.1,
              transition: { type: "spring", stiffness: 400 }
            }}
            className={`p-4 sm:p-5 lg:p-6 rounded-2xl bg-gradient-to-br ${color} shadow-xl shrink-0 ml-4`}
          >
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
          </motion.div>
        </div>

        {/* Bottom accent bar - animated */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`h-1.5 rounded-full bg-gradient-to-r ${color} mt-6 origin-left`}
        />
      </div>

      {/* Floating indicator for active card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold rounded-full shadow-lg"
      >
        Now Viewing
      </motion.div>
    </motion.div>
  );
};

export default SwipeableMetricCards;