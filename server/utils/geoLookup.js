// Indian Heritage Cities & Locations GPS Geocoding Dictionary
const CITY_COORDINATES = {
  // Gujarat
  'jamnagar': { lat: 22.4707, lng: 70.0577 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'patan': { lat: 23.8493, lng: 72.1266 },
  'vadodara': { lat: 22.3072, lng: 73.1812 },
  'junagadh': { lat: 21.5222, lng: 70.4579 },
  'bhuj': { lat: 23.2420, lng: 69.6669 },
  'kutch': { lat: 23.8864, lng: 70.2131 },
  'somnath': { lat: 20.8880, lng: 70.4012 },
  'dwarka': { lat: 22.2442, lng: 68.9685 },
  'modhera': { lat: 23.5835, lng: 72.1331 },
  'champaner': { lat: 22.4854, lng: 73.5356 },
  'surat': { lat: 21.1702, lng: 72.8311 },
  'rajkot': { lat: 22.3039, lng: 70.8022 },
  'bhavnagar': { lat: 21.7645, lng: 72.1519 },
  'porbandar': { lat: 21.6417, lng: 69.6293 },
  'palitana': { lat: 21.5346, lng: 71.8275 },
  'diu': { lat: 20.7138, lng: 70.9857 },
  'gandhinagar': { lat: 23.2156, lng: 72.6369 },

  // Rajasthan
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'jodhpur': { lat: 26.2389, lng: 73.0243 },
  'udaipur': { lat: 24.5854, lng: 73.7125 },
  'jaisalmer': { lat: 26.9157, lng: 70.9083 },
  'chittorgarh': { lat: 24.8887, lng: 74.6269 },
  'bundi': { lat: 25.4415, lng: 75.6425 },
  'bikaner': { lat: 28.0229, lng: 73.3119 },
  'abhaneri': { lat: 27.0073, lng: 76.6064 },
  'pushkar': { lat: 26.4899, lng: 74.5511 },
  'ajmer': { lat: 26.4499, lng: 74.6399 },
  'ranakpur': { lat: 25.1167, lng: 73.4733 },
  'kumbhalgarh': { lat: 25.1528, lng: 73.5872 },
  'alwar': { lat: 27.5530, lng: 76.6346 },
  'mount abu': { lat: 24.5926, lng: 72.7156 },

  // Delhi & NCR / UP
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'new delhi': { lat: 28.6139, lng: 77.2090 },
  'agra': { lat: 27.1767, lng: 78.0081 },
  'fatehpur sikri': { lat: 27.0945, lng: 77.6679 },
  'varanasi': { lat: 25.3176, lng: 82.9739 },
  'kashi': { lat: 25.3176, lng: 82.9739 },
  'lucknow': { lat: 26.8467, lng: 80.9462 },
  'prayagraj': { lat: 25.4358, lng: 81.8463 },
  'allahabad': { lat: 25.4358, lng: 81.8463 },
  'mathura': { lat: 27.4924, lng: 77.6737 },
  'vrindavan': { lat: 27.5807, lng: 77.7006 },
  'ayodhya': { lat: 26.7922, lng: 82.1998 },

  // Madhya Pradesh
  'khajuraho': { lat: 24.8318, lng: 79.9199 },
  'gwalior': { lat: 26.2183, lng: 78.1828 },
  'orchha': { lat: 25.3516, lng: 78.6417 },
  'sanchi': { lat: 23.4800, lng: 77.7400 },
  'bhopal': { lat: 23.2599, lng: 77.4126 },
  'mandu': { lat: 22.3662, lng: 75.4042 },
  'ujjain': { lat: 23.1765, lng: 75.7885 },
  'jabalpur': { lat: 23.1815, lng: 79.9864 },

  // Maharashtra
  'mumbai': { lat: 18.9220, lng: 72.8347 },
  'aurangabad': { lat: 19.8762, lng: 75.3433 },
  'sambhajinagar': { lat: 19.8762, lng: 75.3433 },
  'ellora': { lat: 20.0268, lng: 75.1790 },
  'ajanta': { lat: 20.5519, lng: 75.7033 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'nagpur': { lat: 21.1458, lng: 79.0882 },

  // Karnataka & South
  'hampi': { lat: 15.3350, lng: 76.4600 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'mysore': { lat: 12.2958, lng: 76.6394 },
  'mysuru': { lat: 12.2958, lng: 76.6394 },
  'badami': { lat: 15.9187, lng: 75.6766 },
  'pattadakal': { lat: 15.9493, lng: 75.8160 },
  'aihole': { lat: 16.0210, lng: 75.8820 },
  'bijapur': { lat: 16.8302, lng: 75.7100 },
  'belur': { lat: 13.1622, lng: 75.8648 },
  'halebidu': { lat: 13.2167, lng: 75.9833 },

  // Tamil Nadu & Kerala
  'thanjavur': { lat: 10.7870, lng: 79.1378 },
  'tanjore': { lat: 10.7870, lng: 79.1378 },
  'madurai': { lat: 9.9252, lng: 78.1198 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'mahabalipuram': { lat: 12.6269, lng: 80.1928 },
  'kanchipuram': { lat: 12.8342, lng: 79.7036 },
  'rameshwaram': { lat: 9.2876, lng: 79.3129 },
  'kochi': { lat: 9.9312, lng: 76.2673 },
  'trivandrum': { lat: 8.5241, lng: 76.9366 },

  // East & North
  'konark': { lat: 19.8876, lng: 86.0945 },
  'puri': { lat: 19.8135, lng: 85.8312 },
  'bhubaneswar': { lat: 20.2961, lng: 85.8245 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'amritsar': { lat: 31.6200, lng: 74.8765 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'nalanda': { lat: 25.1357, lng: 85.4450 },
  'bodh gaya': { lat: 24.6961, lng: 84.9913 }
};

const STATE_DEFAULTS = {
  'gujarat': { lat: 22.5, lng: 71.5 },
  'rajasthan': { lat: 26.5, lng: 73.8 },
  'madhya pradesh': { lat: 23.5, lng: 77.5 },
  'maharashtra': { lat: 19.5, lng: 75.5 },
  'karnataka': { lat: 14.5, lng: 76.0 },
  'tamil nadu': { lat: 11.0, lng: 78.5 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'uttar pradesh': { lat: 26.8, lng: 81.0 },
  'odisha': { lat: 20.5, lng: 85.5 },
  'west bengal': { lat: 23.0, lng: 87.8 },
  'punjab': { lat: 31.1, lng: 75.3 },
  'kerala': { lat: 10.0, lng: 76.5 }
};

function getCoordinatesForLocation(city = '', state = '', siteName = '') {
  const normCity = (city || '').toLowerCase().trim();
  const normState = (state || '').toLowerCase().trim();
  const normName = (siteName || '').toLowerCase().trim();

  // Check city exact match
  if (CITY_COORDINATES[normCity]) {
    return CITY_COORDINATES[normCity];
  }

  // Check city substring match
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (normCity.includes(key) || key.includes(normCity) || normName.includes(key)) {
      return coords;
    }
  }

  // Check state defaults
  for (const [key, coords] of Object.entries(STATE_DEFAULTS)) {
    if (normState.includes(key)) {
      return coords;
    }
  }

  // Default Central India coords
  return { lat: 22.4707, lng: 70.0577 }; // Jamnagar/Gujarat default
}

module.exports = {
  CITY_COORDINATES,
  getCoordinatesForLocation
};
