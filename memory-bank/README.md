# Memory Bank: Dublin Accommodation Automation Bot

## Purpose
This Memory Bank serves as a comprehensive knowledge repository for the Dublin Accommodation Automation Bot project. It ensures that all critical project information is preserved and accessible, enabling effective continuation of work across sessions and team members.

## Structure

### Core Files (Required)
These files form the foundation of project knowledge and should be maintained with precision:

1. **[projectbrief.md](projectbrief.md)**
   - Foundation document defining core mission and requirements
   - Primary objectives and success criteria
   - Target user profile and technical requirements
   - Project status and constraints

2. **[productContext.md](productContext.md)**
   - Why this project exists and what problems it solves
   - User experience flow and benefits
   - Success metrics and target outcomes
   - Market context and opportunity analysis

3. **[systemPatterns.md](systemPatterns.md)**
   - System architecture and component relationships
   - Key technical decisions and design patterns
   - Error handling and performance optimization strategies
   - Security and scalability considerations

4. **[techContext.md](techContext.md)**
   - Technology stack and dependencies
   - Development setup and configuration
   - Technical constraints and limitations
   - Deployment and maintenance requirements

5. **[activeContext.md](activeContext.md)**
   - Current work focus and recent changes
   - Next steps and active decisions
   - Current challenges and system health status
   - Development environment and user support considerations

6. **[progress.md](progress.md)**
   - What works (completed features and test results)
   - Current status and recent achievements
   - What's left to build (enhancement opportunities)
   - Known issues and performance metrics

## Project Intelligence (.cursorrules)
The `.cursorrules` file captures project-specific patterns, preferences, and intelligence that help AI assistants work more effectively with the codebase. It includes:
- Critical implementation paths
- User preferences and workflow patterns
- Known challenges and solutions
- Tool usage patterns and maintenance tasks

## How to Use This Memory Bank

### For New Team Members
1. Start with `projectbrief.md` to understand the core mission
2. Read `productContext.md` to understand why this project exists
3. Review `systemPatterns.md` for technical architecture
4. Check `progress.md` for current status and what's working
5. Consult `activeContext.md` for current focus areas

### For Ongoing Development
1. Update `activeContext.md` when starting new work
2. Update `progress.md` when completing features or finding issues
3. Modify other files when making architectural or strategic changes
4. Keep `.cursorrules` updated with new patterns and insights

### For AI Assistants
1. **Always read ALL memory bank files** at the start of each session
2. Use the information to understand project context and current state
3. Update relevant files when making significant changes
4. Refer to `.cursorrules` for project-specific patterns and preferences

## Maintenance Guidelines

### Regular Updates
- **activeContext.md**: Update with each work session
- **progress.md**: Update when features are completed or issues discovered
- **Other files**: Update when making significant architectural or strategic changes

### Quality Standards
- **Accuracy**: All information must be current and correct
- **Clarity**: Write for future team members who may be unfamiliar with the project
- **Completeness**: Include sufficient detail for effective decision-making
- **Consistency**: Maintain consistent terminology and structure across files

### Version Control
- Commit memory bank updates with descriptive messages
- Include memory bank updates in pull requests when making significant changes
- Review memory bank accuracy during code reviews

## Project Status Summary

### Current State: PRODUCTION READY ✅
- **All 6 development phases completed successfully**
- **Playwright migration completed (January 2025)**
- **Comprehensive testing and validation completed**
- **Proven performance metrics and reliability**

### Key Achievements
- 50+ listings per hour processing speed
- 95%+ data validation success rate
- 40-60% improvement in anti-detection capabilities
- Complete integration of all system components

### System Components
- **Browser Automation**: Playwright (primary) + Puppeteer (fallback)
- **Data Processing**: Real-time validation and analysis
- **Message Generation**: 5 templates with personalization
- **Analytics**: Real-time insights and reporting
- **Storage**: Organized JSON file system

## Quick Reference

### Essential Commands
```bash
npm start                    # Full accommodation search
node src/test-all-phases.js  # Comprehensive testing
npx playwright install chromium  # Browser setup
```

### Key Directories
- `src/`: Source code (main.js, config/, services/, utils/)
- `data/`: All output files (listings/, processed/, messages/)
- `logs/`: Debug and error logs
- `memory-bank/`: This documentation system

### Important Files
- `package.json`: Dependencies and scripts
- `.env`: Environment configuration (optional)
- `README.md`: User documentation and setup guide
- `.cursorrules`: Project intelligence for AI assistants

## Contact and Support
For questions about this Memory Bank system or the project in general, refer to:
- Project documentation in the main README.md
- Technical guides in the dublin-accommodation-bot directory
- Troubleshooting resources in the project documentation

---

**Remember**: This Memory Bank is the project's institutional memory. Keep it accurate, current, and comprehensive to ensure effective collaboration and development continuity.