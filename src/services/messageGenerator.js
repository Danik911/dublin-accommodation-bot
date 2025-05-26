const settings = require('../config/settings');

/**
 * Message Generator Service
 * Creates personalized messages for accommodation requests
 */
class MessageGenerator {
  constructor() {
    this.userProfile = settings.userProfile;
    this.templates = {
      freeAccommodation: this.getFreeAccommodationTemplate(),
      workExchange: this.getWorkExchangeTemplate(),
      lowCost: this.getLowCostTemplate(),
      houseSitting: this.getHouseSittingTemplate(),
      caretaker: this.getCaretakerTemplate()
    };
  }

  /**
   * Generate personalized message for a listing
   */
  async generateMessage(listing, hostData = null) {
    try {
      // Determine message type based on listing analysis
      const messageType = this.determineMessageType(listing);
      
      // Get appropriate template
      const template = this.templates[messageType];
      
      // Personalize the message
      const personalizedMessage = this.personalizeMessage(template, listing, hostData);
      
      // Add message metadata
      const messageData = {
        listingId: listing.id,
        messageType,
        template: messageType,
        message: personalizedMessage,
        generatedAt: new Date().toISOString(),
        listing: {
          title: listing.title,
          location: listing.location,
          price: listing.price
        },
        host: hostData ? {
          name: hostData.name,
          profileUrl: hostData.profileUrl
        } : null
      };
      
      return messageData;
      
    } catch (error) {
      console.error('Error generating message:', error);
      throw error;
    }
  }

  /**
   * Determine the appropriate message type based on listing characteristics
   */
  determineMessageType(listing) {
    const title = listing.title?.toLowerCase() || '';
    const description = listing.description?.toLowerCase() || '';
    const text = `${title} ${description}`;
    
    // Check for specific accommodation types
    if (text.includes('house sitting') || text.includes('house sit')) {
      return 'houseSitting';
    }
    
    if (text.includes('caretaker') || text.includes('property maintenance')) {
      return 'caretaker';
    }
    
    if (text.includes('work exchange') || text.includes('help with')) {
      return 'workExchange';
    }
    
    // Check if it's free accommodation
    if (listing.freeAccommodationAnalysis?.isFreeAccommodation) {
      return 'freeAccommodation';
    }
    
    // Default to low cost for paid accommodation
    return 'lowCost';
  }

  /**
   * Personalize message template with listing and host data
   */
  personalizeMessage(template, listing, hostData) {
    const hostName = hostData?.name || 'there';
    const location = this.extractLocationName(listing.location);
    const propertyType = this.inferPropertyType(listing);
    const suggestedContribution = this.suggestContribution(listing);
    const commuteBenefit = this.getCommuteBenefit(listing);
    
    const replacements = {
      '{hostName}': hostName,
      '{location}': location,
      '{propertyType}': propertyType,
      '{suggestedContribution}': suggestedContribution,
      '{commuteBenefit}': commuteBenefit,
      '{userAge}': this.userProfile.age,
      '{userOccupation}': this.userProfile.occupation,
      '{userCourse}': this.userProfile.course,
      '{userCollege}': this.userProfile.college,
      '{userWorkplace}': this.userProfile.workplace,
      '{accommodationPeriod}': this.userProfile.accommodationPeriod,
      '{userActivities}': this.userProfile.lifestyle.activities.join(', '),
      '{userSchedule}': this.userProfile.lifestyle.schedule
    };
    
    let personalizedMessage = template;
    
    // Replace all placeholders
    Object.entries(replacements).forEach(([placeholder, value]) => {
      personalizedMessage = personalizedMessage.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return personalizedMessage;
  }

  /**
   * Free accommodation template
   */
  getFreeAccommodationTemplate() {
    return `Hi {hostName}! 👋

I hope you're doing well! I came across your listing for {propertyType} in {location} and I'm very interested in discussing a potential arrangement.

I'm a {userAge}-year-old {userOccupation} from abroad, currently studying {userCourse} at {userCollege}. I also work part-time at the {userWorkplace}. I'm looking for accommodation in the Dublin area for a period of {accommodationPeriod}.

A bit about me:
🎓 Responsible student with a structured daily routine (early riser: {userSchedule})
💼 Employed part-time, so I can contribute to household expenses if needed
🚭 Non-smoker, don't drink, and no pets
🏃‍♂️ Active lifestyle ({userActivities}) - I take good care of myself and my living space
🧹 Very clean and respectful of shared spaces

{commuteBenefit}

I'd be happy to discuss how I could contribute to your household through {suggestedContribution} or other arrangements that work for both of us.

I'm available for a call or meeting at your convenience. Thank you for considering my request! 🙏

Best regards,
[Your name]`;
  }

  /**
   * Work exchange template
   */
  getWorkExchangeTemplate() {
    return `Hi {hostName}! 👋

I'm very interested in your work exchange opportunity for {propertyType} in {location}. This sounds like exactly what I'm looking for!

I'm a {userAge}-year-old {userOccupation} studying {userCourse} at {userCollege}, and I work part-time at the {userWorkplace}. I'm seeking accommodation for {accommodationPeriod} and would love to contribute through work exchange.

What I can offer:
💪 Strong work ethic and reliability
🔧 Experience with {suggestedContribution}
⏰ Flexible schedule that can accommodate your needs
🧹 Excellent attention to detail and cleanliness
🚭 Non-smoker, no drinking, no pets - very responsible tenant

{commuteBenefit}

My active lifestyle ({userActivities}) keeps me healthy and energetic, and my structured routine ({userSchedule}) means I'm always available when needed.

I'd love to discuss how my skills and availability align with your needs. When would be a good time for a call or meeting?

Looking forward to hearing from you! 🙏

Best regards,
[Your name]`;
  }

  /**
   * House sitting template
   */
  getHouseSittingTemplate() {
    return `Hi {hostName}! 👋

I'm very interested in your house sitting opportunity in {location}. As a responsible {userAge}-year-old {userOccupation}, I believe I'd be an excellent fit for taking care of your property.

About me:
🎓 Currently studying {userCourse} at {userCollege}
💼 Work part-time at {userWorkplace} - reliable and trustworthy
🏠 Experienced with property care and maintenance
🌱 Great with plants, mail collection, and general upkeep
🚭 Non-smoker, don't drink, no pets - very responsible

{commuteBenefit}

My structured daily routine ({userSchedule}) means I'll be around regularly to ensure your property is well-maintained and secure. I'm also active with {userActivities}, so I'm always alert and aware of my surroundings.

I'm available for {accommodationPeriod} and would be happy to provide references or meet in person to discuss your specific requirements.

Thank you for considering me for this opportunity! 🙏

Best regards,
[Your name]`;
  }

  /**
   * Caretaker template
   */
  getCaretakerTemplate() {
    return `Hi {hostName}! 👋

I'm very interested in your caretaker position in {location}. This opportunity aligns perfectly with my skills and accommodation needs.

Background:
🎓 {userAge}-year-old {userOccupation} studying {userCourse} at {userCollege}
💼 Currently employed part-time at {userWorkplace}
🔧 Experienced with {suggestedContribution}
🏠 Reliable and detail-oriented with property maintenance

{commuteBenefit}

What I bring:
⏰ Structured schedule ({userSchedule}) ensuring consistent availability
💪 Active lifestyle ({userActivities}) - physically capable and energetic
🧹 Excellent attention to cleanliness and organization
🚭 Non-smoker, no drinking, no pets - very responsible
🔒 Security-conscious and trustworthy

I'm seeking accommodation for {accommodationPeriod} and would be dedicated to maintaining your property to the highest standards.

I'd love to discuss your specific requirements and how I can contribute. When would be convenient for a call or meeting?

Thank you for your consideration! 🙏

Best regards,
[Your name]`;
  }

  /**
   * Low cost accommodation template
   */
  getLowCostTemplate() {
    return `Hi {hostName}! 👋

I hope you're well! I'm interested in your {propertyType} in {location} and would love to learn more about it.

I'm a {userAge}-year-old {userOccupation} studying {userCourse} at {userCollege}. I also work part-time at the {userWorkplace} and am looking for accommodation for {accommodationPeriod}.

About me:
🎓 Responsible student with excellent references
💼 Employed part-time with stable income
🚭 Non-smoker, don't drink, no pets
🧹 Very clean and respectful of shared spaces
⏰ Structured routine ({userSchedule}) - quiet and considerate

{commuteBenefit}

I'm active with {userActivities} and maintain a healthy, organized lifestyle. I believe in being a positive addition to any household.

Would you be available for a viewing or call to discuss the details? I'm very interested and can provide references if needed.

Thank you for your time! 🙏

Best regards,
[Your name]`;
  }

  /**
   * Extract clean location name from listing location
   */
  extractLocationName(location) {
    if (!location) return 'the area';
    
    // Remove common suffixes and clean up
    return location
      .replace(/, Ireland$/, '')
      .replace(/, Co\. \w+$/, '')
      .replace(/Dublin \d+/, 'Dublin')
      .trim();
  }

  /**
   * Infer property type from listing
   */
  inferPropertyType(listing) {
    const title = listing.title?.toLowerCase() || '';
    
    if (title.includes('apartment') || title.includes('flat')) return 'apartment';
    if (title.includes('house')) return 'house';
    if (title.includes('studio')) return 'studio';
    if (title.includes('room')) return 'room';
    
    return 'accommodation';
  }

  /**
   * Suggest relevant contribution based on listing content
   */
  suggestContribution(listing) {
    const text = `${listing.title || ''} ${listing.description || ''}`.toLowerCase();
    
    const contributions = [];
    
    if (text.includes('garden') || text.includes('plants')) {
      contributions.push('garden maintenance and plant care');
    }
    if (text.includes('elderly') || text.includes('care')) {
      contributions.push('companionship and light assistance');
    }
    if (text.includes('maintenance') || text.includes('repair')) {
      contributions.push('property maintenance and repairs');
    }
    if (text.includes('clean') || text.includes('housework')) {
      contributions.push('cleaning and housework');
    }
    if (text.includes('pet') || text.includes('dog') || text.includes('cat')) {
      contributions.push('pet care and walking');
    }
    
    // Default contributions
    if (contributions.length === 0) {
      contributions.push('household maintenance', 'cleaning', 'garden work');
    }
    
    return contributions.slice(0, 3).join(', ');
  }

  /**
   * Generate commute benefit text based on location analysis
   */
  getCommuteBenefit(listing) {
    if (!listing.locationAnalysis) {
      return 'The location would work well for my daily commute to college and work.';
    }
    
    const { commuteToWork, commuteToCollege, transportScore } = listing.locationAnalysis;
    
    if (transportScore === 'Excellent') {
      return `The location is perfect for my daily routine - just ${commuteToCollege.toFixed(1)}km from ${this.userProfile.college} and ${commuteToWork.toFixed(1)}km from my workplace at ${this.userProfile.workplace}.`;
    } else if (transportScore === 'Good') {
      return `The location works well for my commute - ${commuteToCollege.toFixed(1)}km from college and ${commuteToWork.toFixed(1)}km from work, with good transport links.`;
    } else {
      return `I'm comfortable with the commute to college (${commuteToCollege.toFixed(1)}km) and work (${commuteToWork.toFixed(1)}km) from this location.`;
    }
  }

  /**
   * Generate multiple message variations
   */
  async generateMessageVariations(listing, hostData = null, count = 3) {
    const variations = [];
    
    for (let i = 0; i < count; i++) {
      const message = await this.generateMessage(listing, hostData);
      message.variation = i + 1;
      variations.push(message);
    }
    
    return variations;
  }

  /**
   * Get message statistics
   */
  getMessageStats(messages) {
    const stats = {
      total: messages.length,
      byType: {},
      averageLength: 0,
      totalCharacters: 0
    };
    
    messages.forEach(msg => {
      const type = msg.messageType || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      stats.totalCharacters += msg.message.length;
    });
    
    stats.averageLength = Math.round(stats.totalCharacters / messages.length);
    
    return stats;
  }
}

module.exports = MessageGenerator;