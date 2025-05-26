const dublinAreas = {
  // Central Dublin
  central: [
    { name: 'Dublin City Centre', lat: 53.3498, lng: -6.2603 },
    { name: 'Temple Bar', lat: 53.3456, lng: -6.2672 },
    { name: 'Trinity College Area', lat: 53.3438, lng: -6.2546 },
    { name: 'St. Stephen\'s Green', lat: 53.3381, lng: -6.2592 },
  ],

  // North Dublin (within 30km)
  north: [
    { name: 'Swords', lat: 53.4597, lng: -6.2181 },
    { name: 'Malahide', lat: 53.4509, lng: -6.1542 },
    { name: 'Howth', lat: 53.3906, lng: -6.0648 },
    { name: 'Balbriggan', lat: 53.6117, lng: -6.1814 },
    { name: 'Portmarnock', lat: 53.4258, lng: -6.1394 },
    { name: 'Clontarf', lat: 53.3647, lng: -6.2097 },
  ],

  // West Dublin (within 30km)
  west: [
    { name: 'Blanchardstown', lat: 53.3928, lng: -6.3747 },
    { name: 'Lucan', lat: 53.3575, lng: -6.4489 },
    { name: 'Clonsilla', lat: 53.3833, lng: -6.4167 },
    { name: 'Maynooth', lat: 53.3817, lng: -6.5931 },
    { name: 'Celbridge', lat: 53.3394, lng: -6.5439 },
    { name: 'Leixlip', lat: 53.3658, lng: -6.4953 },
  ],

  // South Dublin (within 30km)
  south: [
    { name: 'Tallaght', lat: 53.2859, lng: -6.3733 },
    { name: 'Dundrum', lat: 53.2892, lng: -6.2358 },
    { name: 'Rathfarnham', lat: 53.3067, lng: -6.2756 },
    { name: 'Dun Laoghaire', lat: 53.2941, lng: -6.1347 },
    { name: 'Bray', lat: 53.2028, lng: -6.0986 },
    { name: 'Blackrock', lat: 53.3014, lng: -6.1778 },
  ],

  // East Dublin (within 30km)
  east: [
    { name: 'Greystones', lat: 53.1406, lng: -6.0631 },
    { name: 'Dalkey', lat: 53.2758, lng: -6.1006 },
    { name: 'Killiney', lat: 53.2647, lng: -6.1131 },
    { name: 'Sandycove', lat: 53.2856, lng: -6.1181 },
  ],

  // Dublin Postal Districts
  postalDistricts: [
    { name: 'Dublin 1', lat: 53.3515, lng: -6.2489 },
    { name: 'Dublin 2', lat: 53.3381, lng: -6.2592 },
    { name: 'Dublin 3', lat: 53.3647, lng: -6.2097 },
    { name: 'Dublin 4', lat: 53.3267, lng: -6.2297 },
    { name: 'Dublin 6', lat: 53.3167, lng: -6.2597 },
    { name: 'Dublin 7', lat: 53.3597, lng: -6.2897 },
    { name: 'Dublin 8', lat: 53.3397, lng: -6.2997 }, // Guinness Storehouse area
    { name: 'Dublin 9', lat: 53.3797, lng: -6.2397 },
    { name: 'Dublin 11', lat: 53.3897, lng: -6.3197 },
    { name: 'Dublin 12', lat: 53.3197, lng: -6.3397 },
    { name: 'Dublin 14', lat: 53.2897, lng: -6.2597 },
    { name: 'Dublin 15', lat: 53.3897, lng: -6.3797 },
    { name: 'Dublin 18', lat: 53.2697, lng: -6.2097 },
    { name: 'Dublin 22', lat: 53.2897, lng: -6.3797 },
    { name: 'Dublin 24', lat: 53.2597, lng: -6.3997 },
  ],
};

// Generate search grid coordinates within 30km radius
function generateSearchGrid(centerLat, centerLng, radiusKm, gridSize = 5) {
  const searchPoints = [];
  const latRange = radiusKm / 111; // Approximate km per degree latitude
  const lngRange = radiusKm / (111 * Math.cos(centerLat * Math.PI / 180)); // Adjust for longitude

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lat = centerLat + (latRange * 2 * (i / (gridSize - 1) - 0.5));
      const lng = centerLng + (lngRange * 2 * (j / (gridSize - 1) - 0.5));
      
      // Check if point is within radius
      const distance = calculateDistance(centerLat, centerLng, lat, lng);
      if (distance <= radiusKm) {
        searchPoints.push({
          name: `Grid_${i}_${j}`,
          lat: lat,
          lng: lng,
          distance: distance
        });
      }
    }
  }
  
  return searchPoints;
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get all search areas
function getAllSearchAreas() {
  const allAreas = [];
  
  // Add all predefined areas
  Object.values(dublinAreas).forEach(areaGroup => {
    if (Array.isArray(areaGroup)) {
      allAreas.push(...areaGroup);
    }
  });
  
  // Add grid points
  const gridPoints = generateSearchGrid(53.3498053, -6.2603097, 30, 5);
  allAreas.push(...gridPoints);
  
  return allAreas;
}

module.exports = {
  dublinAreas,
  generateSearchGrid,
  calculateDistance,
  getAllSearchAreas,
};