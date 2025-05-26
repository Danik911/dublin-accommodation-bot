#!/usr/bin/env node

/**
 * Dublin Accommodation Bot - Semi-Manual Mode
 * 
 * Simplified workflow:
 * 1. User manually logs into Facebook
 * 2. LLM takes control for searching accommodation
 * 3. LLM generates personalized messages
 * 4. Simple JSON output for review
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Import essential services only
const GoogleMapsService = require('./src/services/googleMaps');
const MessageGenerator = require('./src/services/messageGenerator');
const config = require('./manual-config');

class SemiManualAccommodationBot {
  constructor() {
    this.browser = null;
    this.page = null;
    this.googleMaps = new GoogleMapsService();
    this.messageGenerator = new MessageGenerator();
    this.results = {
      listings: [],
      messages: [],
      searchAreas: [],
      timestamp: new Date().toISOString(),
      summary: {}
    };
  }

  /**
   * Initialize browser for manual authentication
   */
  async initBrowser() {
    console.log('🚀 Initializing browser for manual authentication...');
    
    this.browser = await chromium.launch({
      headless: config.browser.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        `--window-size=${config.browser.viewport.width},${config.browser.viewport.height}`,
        '--start-maximized'
      ]
    });

    const context = await this.browser.newContext({
      userAgent: config.browser.userAgent,
      viewport: config.browser.viewport,
      locale: 'en-US',
      timezoneId: 'Europe/Dublin'
    });

    this.page = await context.newPage();
    console.log('✅ Browser initialized successfully');
  }

  /**
   * Manual authentication - user logs in, LLM waits
   */
  async manualAuthentication() {
    console.log('\n🔐 MANUAL AUTHENTICATION REQUIRED');
    console.log('=====================================');
    console.log('1. The browser will open Facebook');
    console.log('2. Please log in manually');
    console.log('3. Navigate to your Facebook homepage');
    console.log('4. Return here and press Enter');
    console.log('=====================================\n');

    // Navigate to Facebook
    await this.page.goto('https://www.facebook.com/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Wait for manual login
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    await new Promise((resolve) => {
      rl.question('Press Enter when you are logged in and can see your Facebook homepage: ', () => {
        rl.close();
        resolve();
      });
    });

    // Verify login
    console.log('🔍 Verifying login status...');
    await this.page.waitForLoadState('networkidle');
    
    const isLoggedIn = await this.page.locator('[aria-label="Your profile"], [data-testid="blue_bar_profile_link"]')
      .first().isVisible({ timeout: 10000 }).catch(() => false);

    if (isLoggedIn) {
      console.log('✅ Authentication successful! LLM taking control...\n');
      return true;
    } else {
      console.log('❌ Authentication failed. Please ensure you are logged in.');
      return false;
    }
  }

  /**
   * LLM-controlled search for accommodation
   */
  async searchAccommodation(options = {}) {
    console.log('🔍 LLM starting accommodation search...');
    
    const searchParams = {
      minPrice: options.minPrice || config.search.minPrice,
      maxPrice: options.maxPrice || config.search.maxPrice,
      location: config.search.location,
      radius: config.search.radius
    };

    console.log(`📍 Search parameters:`, searchParams);

    // Navigate to Facebook Marketplace
    console.log('🏪 Navigating to Facebook Marketplace...');
    await this.page.goto('https://www.facebook.com/marketplace/dublin/search', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Apply search filters
    await this.applySearchFilters(searchParams);

    // Extract listings
    const listings = await this.extractListings();
    
    console.log(`✅ Found ${listings.length} accommodation listings`);
    this.results.listings = listings;

    return listings;
  }

  /**
   * Apply search filters for accommodation
   */
  async applySearchFilters(params) {
    try {
      console.log('⚙️ Applying search filters...');

      // Search for accommodation
      const searchBox = this.page.locator('input[placeholder*="Search"], input[aria-label*="Search"]').first();
      if (await searchBox.isVisible({ timeout: 5000 })) {
        await searchBox.fill('accommodation room dublin');
        await searchBox.press('Enter');
        await this.page.waitForLoadState('networkidle');
      }

      // Apply price filter if specified
      if (params.maxPrice > 0) {
        await this.applyPriceFilter(params.minPrice, params.maxPrice);
      }

      // Apply category filter for property rentals
      await this.applyCategoryFilter();

      console.log('✅ Search filters applied');
    } catch (error) {
      console.log('⚠️ Some filters may not have been applied:', error.message);
    }
  }

  /**
   * Apply price filter
   */
  async applyPriceFilter(minPrice, maxPrice) {
    try {
      // Look for price filter button
      const priceFilter = this.page.locator('text=Price', 'text=€').first();
      if (await priceFilter.isVisible({ timeout: 3000 })) {
        await priceFilter.click();
        await this.page.waitForTimeout(1000);

        // Fill min price
        const minPriceInput = this.page.locator('input[placeholder*="Min"], input[aria-label*="minimum"]').first();
        if (await minPriceInput.isVisible({ timeout: 2000 })) {
          await minPriceInput.fill(minPrice.toString());
        }

        // Fill max price
        const maxPriceInput = this.page.locator('input[placeholder*="Max"], input[aria-label*="maximum"]').first();
        if (await maxPriceInput.isVisible({ timeout: 2000 })) {
          await maxPriceInput.fill(maxPrice.toString());
        }

        // Apply filter
        const applyButton = this.page.locator('text=Apply', 'button[type="submit"]').first();
        if (await applyButton.isVisible({ timeout: 2000 })) {
          await applyButton.click();
          await this.page.waitForLoadState('networkidle');
        }
      }
    } catch (error) {
      console.log('⚠️ Price filter not applied:', error.message);
    }
  }

  /**
   * Apply category filter for property rentals
   */
  async applyCategoryFilter() {
    try {
      // Look for category filter
      const categoryFilter = this.page.locator('text=Category', 'text=Property').first();
      if (await categoryFilter.isVisible({ timeout: 3000 })) {
        await categoryFilter.click();
        await this.page.waitForTimeout(1000);

        // Select property rentals
        const propertyOption = this.page.locator('text=Property Rentals', 'text=Rentals').first();
        if (await propertyOption.isVisible({ timeout: 2000 })) {
          await propertyOption.click();
          await this.page.waitForLoadState('networkidle');
        }
      }
    } catch (error) {
      console.log('⚠️ Category filter not applied:', error.message);
    }
  }

  /**
   * Extract accommodation listings from current page
   */
  async extractListings() {
    console.log('📋 Extracting accommodation listings...');
    
    const listings = [];
    
    try {
      // Wait for listings to load
      await this.page.waitForSelector('[data-testid="marketplace-item"], .marketplace-item, [role="article"]', { timeout: 10000 });
      
      // Get all listing elements
      const listingElements = await this.page.locator('[data-testid="marketplace-item"], .marketplace-item, [role="article"]').all();
      
      console.log(`📊 Processing ${listingElements.length} listing elements...`);

      for (let i = 0; i < Math.min(listingElements.length, config.search.maxListings); i++) { // Limit based on config
        try {
          const element = listingElements[i];
          
          const listing = await this.extractListingData(element);
          if (listing && listing.title) {
            listings.push(listing);
            console.log(`✓ Extracted: ${listing.title.substring(0, 50)}...`);
          }
        } catch (error) {
          console.log(`⚠️ Error extracting listing ${i + 1}:`, error.message);
        }
      }
    } catch (error) {
      console.log('❌ Error finding listings:', error.message);
    }

    return listings;
  }

  /**
   * Extract data from a single listing element
   */
  async extractListingData(element) {
    try {
      const title = await element.locator('span, h3, h4, [role="heading"]').first().textContent().catch(() => '');
      const price = await element.locator('text=/€[0-9]/, text=/[0-9]+€/').first().textContent().catch(() => '');
      const location = await element.locator('text=/Dublin/, text=/Ireland/').first().textContent().catch(() => '');
      
      // Get the link if available
      const link = await element.locator('a').first().getAttribute('href').catch(() => '');
      const fullLink = link && link.startsWith('/') ? `https://www.facebook.com${link}` : link;

      if (!title) return null;

      return {
        id: `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        price: this.parsePrice(price),
        location: location.trim() || 'Dublin',
        link: fullLink,
        extractedAt: new Date().toISOString(),
        source: 'Facebook Marketplace'
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Parse price from text
   */
  parsePrice(priceText) {
    if (!priceText) return null;
    
    const match = priceText.match(/€?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (match) {
      return parseFloat(match[1].replace(',', ''));
    }
    
    return null;
  }

  /**
   * Generate personalized messages for listings
   */
  async generateMessages(listings) {
    console.log('✍️ Generating personalized messages...');
    
    const messages = [];
    
    for (const listing of listings.slice(0, config.messages.maxMessages)) { // Limit based on config
      try {
        // Analyze listing for free accommodation potential
        const isFreeAccommodation = this.analyzeForFreeAccommodation(listing);
        
        // Generate appropriate message
        const messageData = await this.messageGenerator.generateMessage(listing, {
          isFreeAccommodation,
          userProfile: config.userProfile
        });

        if (messageData) {
          messages.push({
            listingId: listing.id,
            listingTitle: listing.title,
            messageType: messageData.template,
            message: messageData.message,
            generatedAt: new Date().toISOString()
          });
          
          console.log(`✓ Generated ${messageData.template} message for: ${listing.title.substring(0, 40)}...`);
        }
      } catch (error) {
        console.log(`⚠️ Error generating message for listing: ${error.message}`);
      }
    }

    this.results.messages = messages;
    console.log(`✅ Generated ${messages.length} personalized messages`);
    
    return messages;
  }

  /**
   * Simple analysis for free accommodation potential
   */
  analyzeForFreeAccommodation(listing) {
    const text = `${listing.title} ${listing.location}`.toLowerCase();
    
    const hasKeywords = config.freeAccommodationKeywords.some(keyword => text.includes(keyword));
    const isFreePrice = listing.price === null || listing.price === 0;
    
    return hasKeywords || isFreePrice;
  }

  /**
   * Save results to JSON file
   */
  async saveResults() {
    console.log('💾 Saving results...');
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, config.output.directory);
    await fs.mkdir(dataDir, { recursive: true });

    // Prepare summary
    this.results.summary = {
      totalListings: this.results.listings.length,
      messagesGenerated: this.results.messages.length,
      freeAccommodationFound: this.results.listings.filter(l => this.analyzeForFreeAccommodation(l)).length,
      searchCompleted: new Date().toISOString()
    };

    // Save main results
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `accommodation_search_${timestamp}.json`;
    const filepath = path.join(dataDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(this.results, null, 2));
    
    console.log(`✅ Results saved to: ${filepath}`);
    console.log(`📊 Summary: ${this.results.summary.totalListings} listings, ${this.results.summary.messagesGenerated} messages`);
    
    return filepath;
  }

  /**
   * Display results summary
   */
  displaySummary() {
    console.log('\n📊 SEARCH SUMMARY');
    console.log('==================');
    console.log(`🏠 Total listings found: ${this.results.listings.length}`);
    console.log(`✍️ Messages generated: ${this.results.messages.length}`);
    console.log(`🆓 Free accommodation potential: ${this.results.listings.filter(l => this.analyzeForFreeAccommodation(l)).length}`);
    
    if (this.results.listings.length > 0) {
      console.log('\n🏠 SAMPLE LISTINGS:');
      this.results.listings.slice(0, 3).forEach((listing, i) => {
        console.log(`${i + 1}. ${listing.title}`);
        console.log(`   Price: ${listing.price ? `€${listing.price}` : 'Not specified'}`);
        console.log(`   Location: ${listing.location}`);
        console.log('');
      });
    }

    if (this.results.messages.length > 0) {
      console.log('✍️ SAMPLE MESSAGE:');
      const sampleMessage = this.results.messages[0];
      console.log(`Template: ${sampleMessage.messageType}`);
      console.log(`Message: ${sampleMessage.message.substring(0, 200)}...`);
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Browser closed');
    }
  }

  /**
   * Main execution flow
   */
  async run(options = {}) {
    try {
      console.log('🚀 Dublin Accommodation Bot - Semi-Manual Mode');
      console.log('===============================================\n');

      // Initialize browser
      await this.initBrowser();

      // Manual authentication
      const authenticated = await this.manualAuthentication();
      if (!authenticated) {
        throw new Error('Authentication failed');
      }

      // LLM-controlled search
      await this.searchAccommodation(options);

      // Generate messages
      await this.generateMessages(this.results.listings);

      // Save results
      await this.saveResults();

      // Display summary
      this.displaySummary();

      console.log('\n🎉 Semi-manual search completed successfully!');
      console.log('📁 Check the data/ directory for detailed results');

    } catch (error) {
      console.error('❌ Error during execution:', error.message);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    
    if (key && value) {
      if (key === 'min-price' || key === 'max-price') {
        options[key.replace('-', '')] = parseInt(value);
      } else {
        options[key.replace('-', '')] = value;
      }
    }
  }

  console.log('Starting with options:', options);

  const bot = new SemiManualAccommodationBot();
  await bot.run(options);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = SemiManualAccommodationBot;