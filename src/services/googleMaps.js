const axios = require('axios');
const settings = require('../config/settings');
const { calculateDistance, getAllSearchAreas } = require('../config/locations');

class GoogleMapsService {
  constructor(apiKey = settings.googleMaps.apiKey) {
    this.apiKey = apiKey;
    this.dublinCenter = {
      lat: settings.dublin.lat,
      lng: settings.dublin.lng
    };
    this.searchRadius = settings.dublin.searchRadius / 1000; // Convert to km
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  /**
   * Get predefined search areas within Dublin radius
   */
  async getSearchAreas() {
    try {
      console.log('Getting search areas within 30km of Dublin...');
      const areas = getAllSearchAreas();
      
      // Filter areas within search radius
      const validAreas = areas.filter(area => {
        const distance = calculateDistance(
          this.dublinCenter.lat,
          this.dublinCenter.lng,
          area.lat,
          area.lng
        );
        return distance <= this.searchRadius;
      });

      console.log(`Found ${validAreas.length} search areas within ${this.searchRadius}km radius`);
      return validAreas;
    } catch (error) {
      console.error('Error getting search areas:', error);
      throw error;
    }
  }

  /**
   * Validate if an address is within the search radius
   */
  async validateLocation(address) {
    try {
      if (!this.apiKey || this.apiKey === 'your_api_key_here') {
        console.warn('Google Maps API key not configured, using fallback validation');
        return this.fallbackLocationValidation(address);
      }

      const geocodeUrl = `${this.baseUrl}/geocode/json`;
      const params = {
        address: address,
        key: this.apiKey,
        region: 'ie', // Ireland
        components: 'country:IE'
      };

      const response = await axios.get(geocodeUrl, { params });
      
      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        const distance = this.calculateDistanceFromDublin(location.lat, location.lng);
        
        return {
          valid: distance <= this.searchRadius,
          coordinates: location,
          distance: distance,
          formattedAddress: response.data.results[0].formatted_address
        };
      }

      return { valid: false, error: 'Location not found' };
    } catch (error) {
      console.error('Error validating location:', error);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Fallback location validation when API key is not available
   */
  fallbackLocationValidation(address) {
    const dublinKeywords = [
      'dublin', 'swords', 'malahide', 'howth', 'balbriggan',
      'blanchardstown', 'lucan', 'maynooth', 'celbridge',
      'tallaght', 'dundrum', 'bray', 'dun laoghaire',
      'greystones', 'dalkey', 'killiney'
    ];

    const addressLower = address.toLowerCase();
    const containsDublinArea = dublinKeywords.some(keyword => 
      addressLower.includes(keyword)
    );

    return {
      valid: containsDublinArea,
      coordinates: this.dublinCenter, // Default to Dublin center
      distance: 0,
      formattedAddress: address,
      fallback: true
    };
  }

  /**
   * Calculate distance from Dublin center
   */
  calculateDistanceFromDublin(lat, lng) {
    return calculateDistance(
      this.dublinCenter.lat,
      this.dublinCenter.lng,
      lat,
      lng
    );
  }

  /**
   * Calculate distance between two points
   */
  calculateDistance(point1, point2) {
    return calculateDistance(point1.lat, point1.lng, point2.lat, point2.lng);
  }

  /**
   * Get nearby transport links (placeholder for future implementation)
   */
  async getNearbyTransport(lat, lng) {
    try {
      if (!this.apiKey || this.apiKey === 'your_api_key_here') {
        return this.fallbackTransportInfo(lat, lng);
      }

      const placesUrl = `${this.baseUrl}/place/nearbysearch/json`;
      const params = {
        location: `${lat},${lng}`,
        radius: 1000, // 1km radius
        type: 'transit_station',
        key: this.apiKey
      };

      const response = await axios.get(placesUrl, { params });
      
      if (response.data.status === 'OK') {
        return response.data.results.map(place => ({
          name: place.name,
          type: place.types,
          distance: this.calculateDistance(
            { lat, lng },
            { lat: place.geometry.location.lat, lng: place.geometry.location.lng }
          )
        }));
      }

      return [];
    } catch (error) {
      console.error('Error getting transport links:', error);
      return [];
    }
  }

  /**
   * Fallback transport information
   */
  fallbackTransportInfo(lat, lng) {
    // Basic transport scoring based on proximity to Dublin center
    const distance = this.calculateDistanceFromDublin(lat, lng);
    
    if (distance < 5) {
      return [{ name: 'City Center - Good Transport Links', type: ['transit_station'], distance: 0 }];
    } else if (distance < 15) {
      return [{ name: 'Suburban Area - Regular Transport', type: ['bus_station'], distance: 1 }];
    } else {
      return [{ name: 'Outer Area - Limited Transport', type: ['bus_station'], distance: 2 }];
    }
  }

  /**
   * Analyze commute to key locations
   */
  async analyzeCommute(lat, lng) {
    const keyLocations = [
      { name: 'Griffith College Dublin', lat: 53.3515, lng: -6.2489 },
      { name: 'Guinness Storehouse', lat: 53.3419, lng: -6.2867 }
    ];

    const commuteAnalysis = keyLocations.map(location => {
      const distance = calculateDistance(lat, lng, location.lat, location.lng);
      return {
        destination: location.name,
        distance: distance,
        estimatedTime: this.estimateCommuteTime(distance),
        transportScore: this.scoreTransportAccessibility(distance)
      };
    });

    return commuteAnalysis;
  }

  /**
   * Estimate commute time based on distance
   */
  estimateCommuteTime(distanceKm) {
    // Rough estimates for Dublin transport
    if (distanceKm < 5) return '15-25 minutes';
    if (distanceKm < 10) return '25-40 minutes';
    if (distanceKm < 20) return '40-60 minutes';
    return '60+ minutes';
  }

  /**
   * Score transport accessibility
   */
  scoreTransportAccessibility(distanceKm) {
    if (distanceKm < 5) return 'Excellent';
    if (distanceKm < 10) return 'Good';
    if (distanceKm < 20) return 'Fair';
    return 'Poor';
  }
}

module.exports = GoogleMapsService;