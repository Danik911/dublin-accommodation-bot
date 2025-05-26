# 🤖 Dublin Accommodation Bot - LLM Usage Instructions (Semi-Manual Mode)

## 📋 Overview

This document provides instructions for LLMs to operate the Dublin Accommodation Bot in **semi-manual mode**. The user handles authentication manually, then the LLM takes control for searching and message generation.

**🎉 LATEST UPDATE**: Simplified to semi-manual mode! Manual authentication eliminates detection issues while LLM handles search and messaging.

## 🎯 Bot Capabilities

- **Manual Authentication**: User logs in manually, LLM takes control afterward
- **LLM-Controlled Search**: Automated navigation and filtering via Playwright
- **Price Filtering**: Customizable min/max price ranges (€0-€1000+ default)
- **Smart Data Extraction**: Extracts titles, prices, locations, and links
- **Message Generation**: Creates personalized messages using 5 template types
- **Free Accommodation Detection**: Identifies work exchange and house sitting opportunities
- **Simple JSON Output**: Clean, readable results for easy review
- **No Detection Issues**: Manual authentication eliminates bot detection

## 🚀 Quick Start Guide

### Step 1: Navigate to Project Directory
```bash
cd web_scrapper/dublin-accommodation-bot
```

### Step 2: Verify Dependencies
```bash
# Check if node_modules exists
dir node_modules

# If missing, install dependencies
npm install
npm run install-browsers
```

### Step 3: Run Semi-Manual Mode
```bash
# Default run (€0-€1000, 20 listings max)
npm run manual

# Custom price range
node manual-mode.js --min-price 500 --max-price 800

# Higher budget search
node manual-mode.js --max-price 1200
```

### Step 4: Follow the Workflow
1. **Browser opens** → Facebook login page
2. **User logs in manually** → Complete authentication
3. **LLM takes control** → Searches and extracts listings
4. **Results saved** → Check `data/` directory for JSON output

## 🔧 Detailed Setup Instructions

### Environment Configuration

**Required .env Variables:**
```env
# Authentication Mode (CRITICAL)
MANUAL_AUTH_MODE=true

# Facebook Credentials (for reference only in manual mode)
FACEBOOK_EMAIL=your-email@example.com
FACEBOOK_PASSWORD=your-password

# Search Parameters
MAX_LISTINGS_PER_SESSION=15
DELAY_MIN=5000
DELAY_MAX=10000

# Optional: Location Settings
DUBLIN_LAT=53.3498053
DUBLIN_LNG=-6.2603097
SEARCH_RADIUS=30000
```

**Critical Settings:**
- `MANUAL_AUTH_MODE=true` - **MUST BE SET** to avoid Facebook detection
- Conservative delays (5-10 seconds) to prevent rate limiting
- Limited listings per session for safety

### Manual Authentication Process

When you run `npm start`, the bot will:

1. **Open Browser Window**: Playwright launches visible browser
2. **Navigate to Facebook**: Automatically goes to login page
3. **Wait for Manual Input**: You manually enter credentials
4. **Handle Security Challenges**: Complete 2FA, captcha, etc.
5. **Verify Login**: Bot confirms successful authentication
6. **Begin Search**: Proceeds with accommodation search using your specified filters

**Authentication Steps:**
```
🔐 MANUAL AUTHENTICATION MODE (Playwright)
==========================================
The browser will open Facebook login page.
Please manually enter your credentials and complete any security challenges.
Once you are successfully logged in, return to this terminal and press Enter to continue.
==========================================
```

## 🎯 NEW: Dynamic Filter Support

### ✅ Filter Fix Implementation

**Problem Resolved**: The bot previously had conflicting filter application methods causing 0 results.

**Solution**: URL-based filtering with dynamic parameter support.

### Supported Filter Options

```bash
# Price Range Filtering
node src/main.js --min-price 500 --max-price 1000

# Sorting Options
node src/main.js --sort-by newest              # Date listed: Newest first
node src/main.js --sort-by price_low_to_high   # Price: Low to high  
node src/main.js --sort-by price_high_to_low   # Price: High to low

# Combined Filters (User's exact requirements)
node src/main.js --min-price 500 --max-price 1000 --sort-by newest

# Area Targeting
node src/main.js --area "Dublin 2" --max-areas 3
```

### Generated URLs (Technical Reference)

The bot now generates proper Facebook Marketplace URLs:

```
Base URL: https://www.facebook.com/marketplace/dublin/search

Parameters:
- query=room+accommodation+dublin
- exact=false
- minPrice=500
- maxPrice=1000
- sortBy=creation_time_descend
- category=propertyrentals
```

**Example Generated URL:**
```
https://www.facebook.com/marketplace/dublin/search?query=room+accommodation+dublin&exact=false&minPrice=500&maxPrice=1000&sortBy=creation_time_descend&category=propertyrentals
```

## 🎮 Using Playwright Tools for Testing

### Browser Navigation
```javascript
// Navigate to Facebook Marketplace with filters
await page.goto('https://www.facebook.com/marketplace/dublin/search?minPrice=500&maxPrice=1000&sortBy=creation_time_descend');

// Navigate to Property Rentals
await page.goto('https://www.facebook.com/marketplace/category/propertyrentals');
```

### Taking Screenshots
```javascript
// Take screenshot of current page
await page.screenshot({ path: 'marketplace.png' });
```

### Interacting with Elements
```javascript
// Click on property listing
await page.click('[data-testid="marketplace-item"]');

// Fill search box
await page.fill('input[placeholder="Search Marketplace"]', 'Dublin accommodation');

// Verify URL has correct filters
console.log(await page.url()); // Should show filter parameters
```

## 📊 Expected Results

### Typical Search Results
The bot should find 15-30 listings per session with:

**Price Ranges:**
- **Budget Options**: €300-€700 (rooms, shared accommodation)
- **Mid-Range**: €800-€1,200 (ensuite rooms, small apartments)
- **Premium**: €1,300+ (full apartments, luxury options)
- **Target**: FREE accommodation (primary goal)

**Accommodation Types:**
- Single/double rooms in shared houses
- Ensuite rooms
- Studio apartments
- 1-bedroom apartments
- Shared accommodation for couples

## 🔍 Message Generation System

### 5 Message Template Types

1. **freeAccommodation**: General free accommodation requests
2. **workExchange**: Skills/work in exchange for accommodation
3. **lowCost**: Budget-friendly rental options
4. **houseSitting**: Property care during owner absence
5. **caretaker**: Property maintenance and security roles

### User Profile Integration

All messages include:
- 36-year-old international student
- Studying Digital Transformation at Griffith College Dublin
- Part-time work at Guinness Storehouse (Dublin 8)
- Non-smoker, no pets, active lifestyle
- Seeking 3-12 month accommodation

### Sample Generated Message

```
Hi there! 👋

I hope you're doing well! I came across your listing for accommodation in Dublin 2 and I'm very interested in discussing a potential arrangement.

I'm a 36-year-old Student from abroad, currently studying Digital Transformation (Life Science) at Griffith College Dublin. I also work part-time at the Guinness Storehouse. I'm looking for accommodation in the Dublin area for a period of 3-12 months.

A bit about me:
🎓 Responsible student with a structured daily routine (early riser: 6:30 AM - 10:30 PM)
💼 Employed part-time, so I can contribute to household expenses if needed
🚭 Non-smoker, don't drink, and no pets
🏃‍♂️ Active lifestyle (calisthenics, running, hiking) - I take good care of myself and my living space
🧹 Very clean and respectful of shared spaces

The location is perfect for my daily routine - just 2.1km from Griffith College Dublin and 1.8km from my workplace at Guinness Storehouse.

I'd be happy to discuss how I could contribute to your household through household maintenance, cleaning, garden work or other arrangements that work for both of us.

I'm available for a call or meeting at your convenience. Thank you for considering my request! 🙏

Best regards,
[Your name]
```

## 🛠️ Technical Implementation

### File Structure
```
dublin-accommodation-bot/
├── manual-mode.js              # Main entry point for semi-manual mode
├── manual-config.js            # Simple configuration
├── src/
│   ├── services/
│   │   ├── messageGenerator.js # Message generation with 5 templates
│   │   └── googleMaps.js       # Location analysis and commute scoring
│   └── config/
│       ├── settings.js         # Comprehensive settings
│       └── locations.js        # Dublin areas and coordinates
├── data/                       # Output directory for results
└── logs/                       # Debug and error logs
```

### Key Services

**MessageGenerator**: Creates personalized messages based on:
- Listing analysis (free vs paid accommodation)
- User profile integration
- Location benefits (commute analysis)
- Template selection (5 types available)

**GoogleMaps**: Provides:
- Location validation within 30km Dublin radius
- Commute analysis to Griffith College and Guinness Storehouse
- Transport accessibility scoring
- Distance calculations

## 🎯 Success Indicators

### Authentication Success
```
✅ Manual authentication completed successfully
✅ Facebook session established
✅ Marketplace access confirmed
```

### Search Success
```
✅ Applied filters: €500-€1000, Newest first
✅ Found 15 listings in Dublin area
✅ Extracted listing details successfully
✅ Generated personalized messages
```

### Output Files
```
data/
├── listings_2025-01-26_14-30-15.json    # Raw listing data
├── messages_2025-01-26_14-30-15.json    # Generated messages
└── search_summary_2025-01-26.json       # Session summary
```

## 🚨 Troubleshooting

### Common Issues

**1. Authentication Timeout**
```
Error: Manual authentication timeout
Solution: Complete Facebook login within 60 seconds
```

**2. No Listings Found**
```
Error: 0 listings extracted
Solution: Check if filters are too restrictive, try broader price range
```

**3. Selector Not Found**
```
Error: page.waitForSelector: Timeout
Solution: Facebook UI may have changed, update selectors in code
```

### Debug Mode
```bash
# Enable detailed logging
DEBUG=true node manual-mode.js --min-price 500 --max-price 1000

# Take screenshots during execution
SCREENSHOTS=true node manual-mode.js
```

## 📈 Performance Metrics

### Target Performance
- **Processing Speed**: 15-20 listings per session
- **Success Rate**: 95%+ authentication success
- **Data Quality**: 100% valid listing extraction
- **Message Generation**: 5 template types, 100% personalization

### Rate Limiting
- **Conservative Delays**: 5-10 seconds between actions
- **Session Limits**: 15-20 listings maximum per run
- **Daily Limits**: 2-3 sessions recommended
- **Anti-Detection**: Manual authentication eliminates bot detection

## 🔄 Workflow Summary

1. **Setup**: Navigate to project directory, verify dependencies
2. **Launch**: Run `npm run manual` or `node manual-mode.js` with filters
3. **Authenticate**: Manually log into Facebook when browser opens
4. **Search**: LLM takes control, applies filters, extracts listings
5. **Generate**: Creates personalized messages for each listing
6. **Output**: Saves results to JSON files in `data/` directory
7. **Review**: Check generated messages and listing data

## 🎯 User Requirements Integration

Based on user specifications:
- **Price Range**: €500-€1000 (configurable)
- **Sorting**: Newest first (creation_time_descend)
- **Location**: Dublin area (30km radius)
- **Output**: Simple JSON format for easy review
- **Authentication**: Manual mode to avoid detection
- **Message Types**: 5 templates for different accommodation types

## 🚀 Next Steps

After successful execution:
1. Review generated messages in `data/messages_*.json`
2. Check listing details in `data/listings_*.json`
3. Manually send selected messages to hosts
4. Track responses and success rates
5. Adjust filters and templates based on results

---

**Note**: This bot is designed for legitimate accommodation searching. Always respect Facebook's terms of service and use responsibly.