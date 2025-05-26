require('dotenv').config();

const settings = {
  // Google Maps Configuration
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || 'your_api_key_here',
  },

  // Dublin Location Configuration
  dublin: {
    lat: parseFloat(process.env.DUBLIN_LAT) || 53.3498053,
    lng: parseFloat(process.env.DUBLIN_LNG) || -6.2603097,
    searchRadius: parseInt(process.env.SEARCH_RADIUS) || 40000, // 40km in meters
  },

  // Facebook Authentication Configuration
  facebook: {
    baseUrl: 'https://www.facebook.com/marketplace',
    searchUrl: 'https://www.facebook.com/marketplace/dublin/search',
    categoryRentals: '?category=propertyrentals&query=room%20accommodation',
    cookiesPath: './data/facebook_cookies.json',
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    
    // Authentication settings
    authentication: {
      // Set to true to enable manual authentication mode
      // When enabled, user manually enters credentials instead of automatic filling
      manualMode: process.env.MANUAL_AUTH_MODE === 'true' || false,
      
      // Automatic authentication credentials (used when manualMode is false)
      credentials: {
        email: process.env.FACEBOOK_EMAIL || '',
        password: process.env.FACEBOOK_PASSWORD || ''
      },
      
      // Authentication timeouts and retries
      loginTimeout: 30000, // 30 seconds
      verificationTimeout: 60000, // 60 seconds for manual verification
      maxRetries: 3
    }
  },

  // Enhanced Scraping Configuration
  scraping: {
    maxListingsPerSession: parseInt(process.env.MAX_LISTINGS_PER_SESSION) || 30, // Reduced for safety
    delayMin: parseInt(process.env.DELAY_MIN) || 3000, // Increased delays
    delayMax: parseInt(process.env.DELAY_MAX) || 8000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    // Anti-detection measures
    antiDetection: {
      randomDelayMin: 1000,
      randomDelayMax: 3000,
      maxRequestsPerHour: 100,
      scrollDelay: 2000,
      humanTypingSpeed: 150, // milliseconds per character
      enableStealth: true
    },
    // Browser configuration
    browser: {
      headless: false, // Keep false for manual authentication
      viewport: {
        width: 1366,
        height: 768
      },
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-blink-features=AutomationControlled',
        '--window-size=1366,768',
        '--start-maximized'
      ]
    }
  },

  // Database Configuration
  database: {
    path: process.env.DB_PATH || './data/accommodation.db',
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/scraping.log',
  },

  // User Profile for Message Generation
  userProfile: {
    age: 36,
    occupation: 'Student',
    course: 'Digital Transformation (Life Science)',
    college: 'Griffith College Dublin',
    workplace: 'Guinness Storehouse',
    workLocation: 'Dublin 8',
    accommodationPeriod: '3-12 months',
    lifestyle: {
      smoker: false,
      drinker: false,
      pets: false,
      earlyRiser: true,
      schedule: '6:30 AM - 10:30 PM',
      activities: ['calisthenics', 'running', 'hiking'],
    },
  },

  // Location configuration
  locations: [
    { name: 'Dublin', enabled: true },
    { name: 'Dublin 1', enabled: true },
    { name: 'Dublin 2', enabled: true },
    { name: 'Dublin 4', enabled: true },
    { name: 'Dublin 6', enabled: true },
    { name: 'Dublin 8', enabled: true },
    { name: 'Rathmines', enabled: true },
    { name: 'Ranelagh', enabled: true },
    { name: 'Temple Bar', enabled: true },
    { name: 'Ballsbridge', enabled: true }
  ],

  // Output configuration
  output: {
    dataDir: './data',
    logsDir: './logs',
    reportsDir: './test_reports',
    
    // File naming
    listingsFile: 'listings_{timestamp}.json',
    logFile: 'scraper_{date}.log',
    screenshotDir: './logs/screenshots',
    
    // Data retention
    maxLogFiles: 30,
    maxDataFiles: 100
  },

  // Filtering options
  filters: {
    maxPrice: 1000, // EUR - User requested max 1000
    minPrice: 500,   // EUR - User requested min 500
    propertyTypes: ['room', 'studio', 'apartment', 'house share'],
    excludeKeywords: ['scam', 'fake', 'deposit only', 'viewing fee'],
    sortBy: 'newest' // newest - User requested "Newest first"
  },

  // Notification settings
  notifications: {
    enabled: false,
    webhook: process.env.WEBHOOK_URL || '',
    email: {
      enabled: false,
      smtp: {
        host: process.env.SMTP_HOST || '',
        port: process.env.SMTP_PORT || 587,
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      },
      to: process.env.EMAIL_TO || '',
      from: process.env.EMAIL_FROM || ''
    }
  }
};

module.exports = settings;