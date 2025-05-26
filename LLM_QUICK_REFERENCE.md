# 🚀 Dublin Accommodation Bot - LLM Quick Reference (Semi-Manual Mode)

**🎉 LATEST UPDATE**: Simplified to semi-manual mode! Manual authentication + LLM control = reliable results.

## ⚡ Essential Commands

```bash
# Navigate to project
cd web_scrapper/dublin-accommodation-bot

# Run semi-manual mode (default: €0-€1000, 20 listings)
npm run manual

# Custom price range
node manual-mode.js --min-price 500 --max-price 800

# Higher budget search
node manual-mode.js --max-price 1200

# Install dependencies (if needed)
npm install && npm run install-browsers

# Check configuration
type manual-config.js
```

## 🔧 Critical Settings

```env
MANUAL_AUTH_MODE=true          # MUST BE SET
MAX_LISTINGS_PER_SESSION=15    # Conservative limit
DELAY_MIN=5000                 # 5 second minimum delay
DELAY_MAX=10000                # 10 second maximum delay
```

## 🎯 Authentication Flow

1. Run `npm start` or `node test-auth-and-search.js`
2. Browser opens → Facebook login page
3. **Manually enter credentials**
4. Complete 2FA/captcha if prompted
5. Press Enter in terminal when logged in
6. Bot begins searching with your specified filters

## 🎯 NEW: Dynamic Filter Support

### ✅ Filter Options
```bash
# Price Range
--min-price 500 --max-price 1000

# Sorting
--sort-by newest              # Date listed: Newest first
--sort-by price_low_to_high   # Price: Low to high
--sort-by price_high_to_low   # Price: High to low

# Combined (User's requirements)
node src/main.js --min-price 500 --max-price 1000 --sort-by newest
```

### ✅ Generated URL Format
```
https://www.facebook.com/marketplace/dublin/search?query=room+accommodation+dublin&exact=false&minPrice=500&maxPrice=1000&sortBy=creation_time_descend&category=propertyrentals
```

## 📊 Expected Results

- **25+ listings** per session ✅
- **Price range**: €500-€1,000 (user-specified)
- **Sort**: Date listed newest first ✅
- **Target**: FREE accommodation
- **Budget options**: €300-€700
- **Location**: Dublin, Ireland (100km radius)

## 🛠️ Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Authentication failed | Ensure on Facebook homepage, complete all security challenges |
| Browser closes | Check internet, restart with `npm start` |
| ✅ No listings found (FIXED) | Filter conflicts resolved with URL-based filtering |
| Rate limiting | Wait for automatic pause, increase delays in .env |

## 🧪 Testing Commands

```bash
# ✅ NEW: Test filter generation (verify fix)
node test_filters.js

# ✅ NEW: Test authentication and search
node test-auth-and-search.js

# Test authentication only
node src/test-facebook-auth.js

# Test main app
node test-main-app-playwright.js
```

## 🎮 Playwright Testing

```javascript
// Navigate to marketplace with filters
await page.goto('https://www.facebook.com/marketplace/dublin/search?minPrice=500&maxPrice=1000&sortBy=creation_time_descend');

// Take screenshot
await page.screenshot({ path: 'marketplace.png' });

// Verify URL has correct filters
console.log(await page.url()); // Should show filter parameters
```

## 📁 Key Files

- `src/main.js` - Main application
- `src/services/facebookScraperPlaywright.js` - ✅ UPDATED: Fixed filtering
- `test_filters.js` - ✅ NEW: Filter testing
- `test-auth-and-search.js` - ✅ NEW: Authentication testing
- `FILTER_FIX_SUMMARY.md` - ✅ NEW: Technical fix documentation
- `.env` - Environment configuration
- `data/` - Output listings
- `logs/` - Execution logs

## 🎉 Success Indicators

✅ Manual authentication working  
✅ Facebook Marketplace accessible  
✅ Dublin location set correctly  
✅ Property listings loading  
✅ **NEW**: Dynamic price filtering functional (€500-€1000)  
✅ **NEW**: Sort by newest first working  
✅ **NEW**: URL-based filtering generating correct parameters  
✅ Data extraction functional  
✅ No detection warnings  
✅ **NEW**: Filter test passes (`node test_filters.js`)  

## 🚨 Emergency Stop

```bash
# Stop bot immediately
Ctrl+C

# If blocked, wait 24 hours before retry
# Check Facebook account for restrictions
```

## 🎯 Primary Goal

Find **FREE or low-cost accommodation** in Dublin for students and young professionals.

**✅ FILTER FIX STATUS**: COMPLETE
- URL-based filtering implemented
- Dynamic parameter support added  
- Filter conflicts eliminated
- User requirements (Min €500, Max €1000, Sort by newest) fully supported

**Status**: 🟢 **FULLY OPERATIONAL** with reliable filtering