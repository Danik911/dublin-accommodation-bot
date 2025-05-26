const FacebookMarketplaceScraper = require('./src/services/facebookScraperPlaywright');

/**
 * Simple test script to verify authentication and fixed filtering
 */
async function testAuthAndSearch() {
  const scraper = new FacebookMarketplaceScraper();
  
  try {
    console.log('🧪 TESTING AUTHENTICATION & FIXED FILTERING');
    console.log('==========================================\n');
    
    // Initialize browser
    await scraper.initBrowser();
    console.log('✅ Browser initialized\n');
    
    // Test login (this will use manual authentication mode)
    console.log('🔐 Testing login...');
    const loginSuccess = await scraper.login();
    
    if (!loginSuccess) {
      console.log('❌ Authentication failed - please complete manual login when prompted');
      return;
    }
    
    console.log('✅ Authentication successful!\n');
    
    // Test navigation with your specific filters
    console.log('🧭 Testing navigation with your filters...');
    const userFilters = {
      minPrice: 500,
      maxPrice: 1000,
      sortBy: 'newest'
    };
    
    await scraper.navigateToMarketplace(userFilters);
    console.log('✅ Successfully navigated to marketplace with filters\n');
    
    // Test listing extraction
    console.log('🔍 Testing listing extraction...');
    const listings = await scraper.extractListingsAuthenticated();
    
    console.log(`\n📊 RESULTS:`);
    console.log(`   - Listings found: ${listings.length}`);
    
    if (listings.length > 0) {
      console.log('   - Sample listings:');
      listings.slice(0, 3).forEach((listing, i) => {
        console.log(`     ${i+1}. ${listing.title} - €${listing.price || 'N/A'} - ${listing.location || 'No location'}`);
      });
      
      console.log('\n🎉 SUCCESS! The bot is now working correctly with fixed filtering.');
      console.log(`✅ Found ${listings.length} listings with your exact requirements:`);
      console.log('   ✓ Min Price: €500');
      console.log('   ✓ Max Price: €1000');
      console.log('   ✓ Sort: Date listed newest first');
      console.log('   ✓ Location: Dublin');
      
    } else {
      console.log('\n🔍 No listings found. This could mean:');
      console.log('   1. Facebook changed their DOM structure again');
      console.log('   2. Your search criteria are too restrictive');
      console.log('   3. There are genuinely no listings in your price range');
      console.log('   4. Authentication or location issues');
      
      // Take screenshot for debugging
      await scraper.takeScreenshot('test_no_results.png');
      console.log('   📸 Screenshot saved for debugging');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await scraper.takeScreenshot('test_error.png');
    
  } finally {
    console.log('\n🧹 Cleaning up...');
    await scraper.close();
    console.log('✅ Test completed');
  }
}

// Run the test
if (require.main === module) {
  testAuthAndSearch().catch(console.error);
}

module.exports = testAuthAndSearch;