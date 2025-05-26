# Technical Context: Dublin Accommodation Automation Bot

## Technology Stack

### Core Runtime
- **Node.js**: v16+ required for modern JavaScript features and async/await support
- **JavaScript**: ES2020+ with async/await, destructuring, and modern syntax
- **Platform**: Cross-platform (Windows, macOS, Linux) with Windows 10 as primary development environment

### Browser Automation
- **Primary**: Playwright v1.52.0 (migrated from Puppeteer in January 2025)
- **Fallback**: Puppeteer v21.0.0 with stealth plugins for compatibility
- **Browser**: Chromium-based automation with anti-detection capabilities

### External APIs and Services
- **Google Maps API**: Location services and geocoding (optional with fallback)
- **Facebook Marketplace**: Target platform for accommodation listings
- **No Database**: File-based JSON storage for simplicity

## Dependencies

### Production Dependencies
```json
{
  "playwright": "^1.52.0",           // Primary browser automation
  "puppeteer": "^21.0.0",            // Fallback browser automation
  "puppeteer-extra": "^3.3.6",       // Plugin system for Puppeteer
  "puppeteer-extra-plugin-stealth": "^2.11.2", // Anti-detection
  "axios": "^1.5.0",                 // HTTP client for API calls
  "dotenv": "^16.3.1",               // Environment variable management
  "fs-extra": "^11.1.1"              // Enhanced file system operations
}
```

### Development Dependencies
- **Node.js built-ins**: `fs`, `path`, `url`, `crypto` for core functionality
- **No testing framework**: Manual testing with comprehensive test scripts
- **No build tools**: Direct Node.js execution without transpilation

## Development Setup

### Environment Requirements
1. **Node.js Installation**: v16.0.0 or higher
2. **Browser Installation**: Chrome/Chromium for Playwright
3. **Network Access**: Internet connection for scraping and API calls
4. **Disk Space**: ~500MB for dependencies and browser binaries

### Installation Process
```bash
# 1. Navigate to project directory
cd dublin-accommodation-bot

# 2. Install Node.js dependencies
npm install

# 3. Install Playwright browsers (if using Playwright)
npx playwright install chromium

# 4. Configure environment (optional)
cp environment.example .env
```

### Configuration Files

#### Environment Variables (.env)
```bash
# Google Maps API (optional)
GOOGLE_MAPS_API_KEY=your_api_key_here

# Dublin coordinates (default values)
DUBLIN_LAT=53.3498053
DUBLIN_LNG=-6.2603097

# Search parameters
SEARCH_RADIUS=30000
MAX_LISTINGS_PER_SESSION=50

# Timing controls
DELAY_MIN=2000
DELAY_MAX=5000
HUMAN_DELAY_MIN=1000
HUMAN_DELAY_MAX=3000

# Browser settings
HEADLESS=false
VIEWPORT_WIDTH=1366
VIEWPORT_HEIGHT=768
```

#### Package.json Scripts
```json
{
  "scripts": {
    "start": "node src/main.js",
    "search": "node src/main.js",
    "test": "node src/test-all-phases.js",
    "install-browsers": "npx playwright install chromium"
  }
}
```

## Technical Constraints

### Platform Limitations
- **Single-User Application**: Designed for individual use, not multi-tenant
- **Local Storage**: File-based storage limits concurrent access
- **Memory Usage**: Browser automation requires 200-500MB RAM per session
- **Network Dependency**: Requires stable internet connection

### Facebook Marketplace Constraints
- **Rate Limiting**: Facebook implements aggressive anti-bot measures
- **Dynamic Interface**: UI changes require adaptive scraping strategies
- **Authentication**: Manual login required to avoid detection
- **Geographic Restrictions**: Limited to Facebook's available regions

### Performance Constraints
- **Processing Speed**: 50+ listings per hour (limited by anti-detection delays)
- **Concurrent Sessions**: Single browser session to avoid detection
- **Data Volume**: Optimized for hundreds of listings, not thousands
- **API Limits**: Google Maps API has daily quotas (with fallback)

## Architecture Decisions

### Browser Automation Migration
**From**: Puppeteer with stealth plugins
**To**: Playwright with built-in anti-detection
**Rationale**:
- 40-60% improvement in detection avoidance
- Better cross-browser support
- More stable API for dynamic content
- Enhanced debugging capabilities

### Data Storage Strategy
**Decision**: JSON file-based storage
**Rationale**:
- No external database dependencies
- Easy data inspection and debugging
- Sufficient for single-user application
- Simple backup and migration

### Anti-Detection Approach
**Strategy**: Multi-layered stealth techniques
**Components**:
- Browser fingerprint randomization
- Human-like interaction patterns
- Adaptive rate limiting
- Session management

## File Structure

### Source Code Organization
```
src/
├── main.js                    # Application entry point
├── config/
│   ├── settings.js           # Configuration management
│   ├── locations.js          # Dublin area definitions
│   └── userProfile.js        # Target user characteristics
├── services/
│   ├── facebookScraper.js    # Marketplace automation
│   ├── googleMaps.js         # Location services
│   ├── messageGenerator.js   # Communication templates
│   └── database.js           # Data persistence
└── utils/
    ├── dataProcessor.js      # Data validation and analysis
    ├── antiDetection.js      # Stealth browsing utilities
    ├── storage.js            # File system operations
    └── analytics.js          # Data analysis and reporting
```

### Data Directory Structure
```
data/
├── listings/                 # Raw scraped data
│   └── listings_YYYY-MM-DD.json
├── processed/                # Validated and analyzed data
│   ├── all_listings_YYYY-MM-DD.json
│   ├── free_accommodation_YYYY-MM-DD.json
│   └── processing_stats_YYYY-MM-DD.json
├── messages/                 # Generated communications
│   └── generated_messages.json
└── hosts/                    # Host profile information
    └── host_profiles.json
```

## Development Workflow

### Local Development
1. **Setup**: Install dependencies and configure environment
2. **Testing**: Run individual phase tests to verify functionality
3. **Development**: Modify source code with immediate testing
4. **Validation**: Run full integration tests before deployment

### Testing Strategy
- **Unit Testing**: Individual component testing with test scripts
- **Integration Testing**: Full workflow testing with sample data
- **Manual Testing**: Browser automation verification
- **Performance Testing**: Rate limiting and efficiency validation

### Debugging Tools
- **Browser DevTools**: Playwright inspector for DOM analysis
- **Console Logging**: Structured logging with different levels
- **Screenshot Capture**: Visual debugging for browser automation
- **Network Monitoring**: Request/response analysis for API calls

## Security Considerations

### Data Protection
- **Environment Variables**: Sensitive configuration in .env files
- **API Key Management**: Secure storage and rotation practices
- **Local Storage**: File permissions and access control
- **No Persistent Authentication**: Manual login for each session

### Privacy Compliance
- **GDPR Compliance**: Data minimization and user consent
- **Data Retention**: Configurable retention periods
- **Anonymization**: Personal data protection in logs
- **Audit Trail**: Activity logging for compliance

## Performance Optimization

### Browser Automation
- **Resource Management**: Proper browser cleanup and memory management
- **Selective Loading**: Disable images and unnecessary resources
- **Connection Pooling**: Reuse browser instances when possible
- **Timeout Management**: Appropriate timeouts for different operations

### Data Processing
- **Streaming**: Process large datasets without loading into memory
- **Caching**: Local caching of frequently accessed data
- **Batch Processing**: Group operations for efficiency
- **Lazy Loading**: Load data only when needed

## Monitoring and Logging

### Application Monitoring
- **Performance Metrics**: Response times and success rates
- **Error Tracking**: Comprehensive error logging and analysis
- **Resource Usage**: Memory and CPU monitoring
- **Health Checks**: Automated system health validation

### Operational Logging
- **Structured Logging**: JSON format with consistent fields
- **Log Levels**: DEBUG, INFO, WARN, ERROR with appropriate usage
- **Log Rotation**: Automatic log file management
- **Centralized Logging**: Single location for all application logs

## Deployment and Maintenance

### Deployment Strategy
- **Local Deployment**: Single-user desktop application
- **Configuration Management**: Environment-specific settings
- **Dependency Management**: Locked versions for stability
- **Update Process**: Manual updates with version control

### Maintenance Tasks
- **Dependency Updates**: Regular security and feature updates
- **Browser Updates**: Playwright browser version management
- **Configuration Review**: Periodic settings validation
- **Performance Tuning**: Optimization based on usage patterns

## Future Technical Considerations

### Scalability Options
- **Multi-User Support**: Database migration for shared usage
- **Cloud Deployment**: Containerization and cloud hosting
- **API Development**: REST API for external integrations
- **Real-Time Processing**: WebSocket or SSE for live updates

### Technology Evolution
- **Framework Updates**: Keep pace with Playwright and Node.js updates
- **Alternative Platforms**: Support for additional accommodation sites
- **Machine Learning**: AI-powered matching and recommendation
- **Mobile Support**: Progressive Web App or mobile application