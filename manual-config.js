/**
 * Dublin Accommodation Bot - Manual Mode Configuration
 * 
 * Simple configuration for semi-manual operation
 */

module.exports = {
  // Search Parameters
  search: {
    maxListings: 20,
    minPrice: 0,
    maxPrice: 1000,
    location: 'Dublin, Ireland',
    radius: '30km'
  },

  // Dublin Location
  dublin: {
    lat: 53.3498053,
    lng: -6.2603097,
    searchRadius: 30000 // 30km in meters
  },

  // User Profile for Message Generation
  userProfile: {
    age: 36,
    occupation: 'Student',
    course: 'Digital Transformation (Life Science)',
    college: 'Griffith College Dublin',
    workplace: 'Guinness Storehouse',
    accommodationPeriod: '3-12 months',
    lifestyle: {
      smoker: false,
      pets: false,
      activities: ['calisthenics', 'running', 'hiking'],
      schedule: 'Early riser (6:30 AM - 10:30 PM)'
    }
  },

  // Browser Settings
  browser: {
    headless: false, // Keep visible for manual login
    timeout: 30000,
    viewport: {
      width: 1366,
      height: 768
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },

  // Output Settings
  output: {
    directory: 'data',
    saveScreenshots: false,
    format: 'json'
  },

  // Message Generation Settings
  messages: {
    maxMessages: 10,
    templates: ['freeAccommodation', 'workExchange', 'lowCost', 'houseSitting', 'caretaker'],
    personalize: true
  },

  // Free Accommodation Keywords
  freeAccommodationKeywords: [
    'free', 'exchange', 'work', 'help', 'house sitting', 
    'caretaker', 'au pair', 'volunteer', 'trade', 'barter'
  ]
};