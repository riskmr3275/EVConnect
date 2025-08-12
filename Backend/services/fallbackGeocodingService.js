// Fallback geocoding service with predefined Indian cities
class FallbackGeocodingService {
    constructor() {
        // Predefined coordinates for major Indian cities
        this.cityCoordinates = {
            // Major metros
            'delhi': { latitude: 28.6139, longitude: 77.2090, displayName: 'Delhi, India' },
            'mumbai': { latitude: 19.0760, longitude: 72.8777, displayName: 'Mumbai, Maharashtra, India' },
            'bangalore': { latitude: 12.9716, longitude: 77.5946, displayName: 'Bangalore, Karnataka, India' },
            'bengaluru': { latitude: 12.9716, longitude: 77.5946, displayName: 'Bengaluru, Karnataka, India' },
            'kolkata': { latitude: 22.5726, longitude: 88.3639, displayName: 'Kolkata, West Bengal, India' },
            'chennai': { latitude: 13.0827, longitude: 80.2707, displayName: 'Chennai, Tamil Nadu, India' },
            'hyderabad': { latitude: 17.3850, longitude: 78.4867, displayName: 'Hyderabad, Telangana, India' },
            'pune': { latitude: 18.5204, longitude: 73.8567, displayName: 'Pune, Maharashtra, India' },
            
            // State capitals
            'patna': { latitude: 25.5941, longitude: 85.1376, displayName: 'Patna, Bihar, India' },
            'lucknow': { latitude: 26.8467, longitude: 80.9462, displayName: 'Lucknow, Uttar Pradesh, India' },
            'jaipur': { latitude: 26.9124, longitude: 75.7873, displayName: 'Jaipur, Rajasthan, India' },
            'bhopal': { latitude: 23.2599, longitude: 77.4126, displayName: 'Bhopal, Madhya Pradesh, India' },
            'gandhinagar': { latitude: 23.2156, longitude: 72.6369, displayName: 'Gandhinagar, Gujarat, India' },
            'chandigarh': { latitude: 30.7333, longitude: 76.7794, displayName: 'Chandigarh, India' },
            'thiruvananthapuram': { latitude: 8.5241, longitude: 76.9366, displayName: 'Thiruvananthapuram, Kerala, India' },
            'bhubaneswar': { latitude: 20.2961, longitude: 85.8245, displayName: 'Bhubaneswar, Odisha, India' },
            'ranchi': { latitude: 23.3441, longitude: 85.3096, displayName: 'Ranchi, Jharkhand, India' },
            'raipur': { latitude: 21.2514, longitude: 81.6296, displayName: 'Raipur, Chhattisgarh, India' },
            'panaji': { latitude: 15.4909, longitude: 73.8278, displayName: 'Panaji, Goa, India' },
            'shimla': { latitude: 31.1048, longitude: 77.1734, displayName: 'Shimla, Himachal Pradesh, India' },
            'srinagar': { latitude: 34.0837, longitude: 74.7973, displayName: 'Srinagar, Jammu and Kashmir, India' },
            'dehradun': { latitude: 30.3165, longitude: 78.0322, displayName: 'Dehradun, Uttarakhand, India' },
            
            // Other major cities
            'ahmedabad': { latitude: 23.0225, longitude: 72.5714, displayName: 'Ahmedabad, Gujarat, India' },
            'surat': { latitude: 21.1702, longitude: 72.8311, displayName: 'Surat, Gujarat, India' },
            'kanpur': { latitude: 26.4499, longitude: 80.3319, displayName: 'Kanpur, Uttar Pradesh, India' },
            'nagpur': { latitude: 21.1458, longitude: 79.0882, displayName: 'Nagpur, Maharashtra, India' },
            'indore': { latitude: 22.7196, longitude: 75.8577, displayName: 'Indore, Madhya Pradesh, India' },
            'thane': { latitude: 19.2183, longitude: 72.9781, displayName: 'Thane, Maharashtra, India' },
            'visakhapatnam': { latitude: 17.6868, longitude: 83.2185, displayName: 'Visakhapatnam, Andhra Pradesh, India' },
            'vadodara': { latitude: 22.3072, longitude: 73.1812, displayName: 'Vadodara, Gujarat, India' },
            'ghaziabad': { latitude: 28.6692, longitude: 77.4538, displayName: 'Ghaziabad, Uttar Pradesh, India' },
            'ludhiana': { latitude: 30.9010, longitude: 75.8573, displayName: 'Ludhiana, Punjab, India' },
            'agra': { latitude: 27.1767, longitude: 78.0081, displayName: 'Agra, Uttar Pradesh, India' },
            'nashik': { latitude: 19.9975, longitude: 73.7898, displayName: 'Nashik, Maharashtra, India' },
            'faridabad': { latitude: 28.4089, longitude: 77.3178, displayName: 'Faridabad, Haryana, India' },
            'meerut': { latitude: 28.9845, longitude: 77.7064, displayName: 'Meerut, Uttar Pradesh, India' },
            'rajkot': { latitude: 22.3039, longitude: 70.8022, displayName: 'Rajkot, Gujarat, India' },
            'kalyan': { latitude: 19.2437, longitude: 73.1355, displayName: 'Kalyan, Maharashtra, India' },
            'vasai': { latitude: 19.4912, longitude: 72.8054, displayName: 'Vasai, Maharashtra, India' },
            'varanasi': { latitude: 25.3176, longitude: 82.9739, displayName: 'Varanasi, Uttar Pradesh, India' },
            'srinagar': { latitude: 34.0837, longitude: 74.7973, displayName: 'Srinagar, Uttarakhand, India' },
            'aurangabad': { latitude: 19.8762, longitude: 75.3433, displayName: 'Aurangabad, Maharashtra, India' },
            'dhanbad': { latitude: 23.7957, longitude: 86.4304, displayName: 'Dhanbad, Jharkhand, India' },
            'amritsar': { latitude: 31.6340, longitude: 74.8723, displayName: 'Amritsar, Punjab, India' },
            'navi mumbai': { latitude: 19.0330, longitude: 73.0297, displayName: 'Navi Mumbai, Maharashtra, India' },
            'allahabad': { latitude: 25.4358, longitude: 81.8463, displayName: 'Allahabad, Uttar Pradesh, India' },
            'prayagraj': { latitude: 25.4358, longitude: 81.8463, displayName: 'Prayagraj, Uttar Pradesh, India' },
            'howrah': { latitude: 22.5958, longitude: 88.2636, displayName: 'Howrah, West Bengal, India' },
            'ranchi': { latitude: 23.3441, longitude: 85.3096, displayName: 'Ranchi, Jharkhand, India' },
            'gwalior': { latitude: 26.2183, longitude: 78.1828, displayName: 'Gwalior, Madhya Pradesh, India' },
            'jabalpur': { latitude: 23.1815, longitude: 79.9864, displayName: 'Jabalpur, Madhya Pradesh, India' },
            'coimbatore': { latitude: 11.0168, longitude: 76.9558, displayName: 'Coimbatore, Tamil Nadu, India' },
            'vijayawada': { latitude: 16.5062, longitude: 80.6480, displayName: 'Vijayawada, Andhra Pradesh, India' },
            'jodhpur': { latitude: 26.2389, longitude: 73.0243, displayName: 'Jodhpur, Rajasthan, India' },
            'madurai': { latitude: 9.9252, longitude: 78.1198, displayName: 'Madurai, Tamil Nadu, India' },
            'raipur': { latitude: 21.2514, longitude: 81.6296, displayName: 'Raipur, Chhattisgarh, India' },
            'kota': { latitude: 25.2138, longitude: 75.8648, displayName: 'Kota, Rajasthan, India' },
            'guwahati': { latitude: 26.1445, longitude: 91.7362, displayName: 'Guwahati, Assam, India' },
            'chandigarh': { latitude: 30.7333, longitude: 76.7794, displayName: 'Chandigarh, India' },
            'solapur': { latitude: 17.6599, longitude: 75.9064, displayName: 'Solapur, Maharashtra, India' },
            'hubli': { latitude: 15.3647, longitude: 75.1240, displayName: 'Hubli, Karnataka, India' },
            'bareilly': { latitude: 28.3670, longitude: 79.4304, displayName: 'Bareilly, Uttar Pradesh, India' },
            'moradabad': { latitude: 28.8386, longitude: 78.7733, displayName: 'Moradabad, Uttar Pradesh, India' },
            'mysore': { latitude: 12.2958, longitude: 76.6394, displayName: 'Mysore, Karnataka, India' },
            'mysuru': { latitude: 12.2958, longitude: 76.6394, displayName: 'Mysuru, Karnataka, India' },
            'gurgaon': { latitude: 28.4595, longitude: 77.0266, displayName: 'Gurgaon, Haryana, India' },
            'gurugram': { latitude: 28.4595, longitude: 77.0266, displayName: 'Gurugram, Haryana, India' },
            'aligarh': { latitude: 27.8974, longitude: 78.0880, displayName: 'Aligarh, Uttar Pradesh, India' },
            'jalandhar': { latitude: 31.3260, longitude: 75.5762, displayName: 'Jalandhar, Punjab, India' },
            'tiruchirappalli': { latitude: 10.7905, longitude: 78.7047, displayName: 'Tiruchirappalli, Tamil Nadu, India' },
            'trichy': { latitude: 10.7905, longitude: 78.7047, displayName: 'Trichy, Tamil Nadu, India' },
            'bhubaneswar': { latitude: 20.2961, longitude: 85.8245, displayName: 'Bhubaneswar, Odisha, India' },
            'salem': { latitude: 11.6643, longitude: 78.1460, displayName: 'Salem, Tamil Nadu, India' },
            'warangal': { latitude: 17.9689, longitude: 79.5941, displayName: 'Warangal, Telangana, India' },
            'mira-bhayandar': { latitude: 19.2952, longitude: 72.8544, displayName: 'Mira-Bhayandar, Maharashtra, India' },
            'thiruvananthapuram': { latitude: 8.5241, longitude: 76.9366, displayName: 'Thiruvananthapuram, Kerala, India' },
            'bhiwandi': { latitude: 19.3002, longitude: 73.0635, displayName: 'Bhiwandi, Maharashtra, India' },
            'saharanpur': { latitude: 29.9680, longitude: 77.5552, displayName: 'Saharanpur, Uttar Pradesh, India' },
            'guntur': { latitude: 16.3067, longitude: 80.4365, displayName: 'Guntur, Andhra Pradesh, India' },
            'amravati': { latitude: 20.9374, longitude: 77.7796, displayName: 'Amravati, Maharashtra, India' },
            'bikaner': { latitude: 28.0229, longitude: 73.3119, displayName: 'Bikaner, Rajasthan, India' },
            'noida': { latitude: 28.5355, longitude: 77.3910, displayName: 'Noida, Uttar Pradesh, India' },
            'jamshedpur': { latitude: 22.8046, longitude: 86.2029, displayName: 'Jamshedpur, Jharkhand, India' },
            'bhilai nagar': { latitude: 21.1938, longitude: 81.3509, displayName: 'Bhilai Nagar, Chhattisgarh, India' },
            'cuttack': { latitude: 20.4625, longitude: 85.8828, displayName: 'Cuttack, Odisha, India' },
            'firozabad': { latitude: 27.1592, longitude: 78.3957, displayName: 'Firozabad, Uttar Pradesh, India' },
            'kochi': { latitude: 9.9312, longitude: 76.2673, displayName: 'Kochi, Kerala, India' },
            'cochin': { latitude: 9.9312, longitude: 76.2673, displayName: 'Cochin, Kerala, India' },
            'bhavnagar': { latitude: 21.7645, longitude: 72.1519, displayName: 'Bhavnagar, Gujarat, India' },
            'dehradun': { latitude: 30.3165, longitude: 78.0322, displayName: 'Dehradun, Uttarakhand, India' },
            'durgapur': { latitude: 23.5204, longitude: 87.3119, displayName: 'Durgapur, West Bengal, India' },
            'asansol': { latitude: 23.6739, longitude: 86.9524, displayName: 'Asansol, West Bengal, India' },
            'rourkela': { latitude: 22.2604, longitude: 84.8536, displayName: 'Rourkela, Odisha, India' },
            'nanded': { latitude: 19.1383, longitude: 77.3210, displayName: 'Nanded, Maharashtra, India' },
            'kolhapur': { latitude: 16.7050, longitude: 74.2433, displayName: 'Kolhapur, Maharashtra, India' },
            'ajmer': { latitude: 26.4499, longitude: 74.6399, displayName: 'Ajmer, Rajasthan, India' },
            'akola': { latitude: 20.7002, longitude: 77.0082, displayName: 'Akola, Maharashtra, India' },
            'gulbarga': { latitude: 17.3297, longitude: 76.8343, displayName: 'Gulbarga, Karnataka, India' },
            'jamnagar': { latitude: 22.4707, longitude: 70.0577, displayName: 'Jamnagar, Gujarat, India' },
            'ujjain': { latitude: 23.1765, longitude: 75.7885, displayName: 'Ujjain, Madhya Pradesh, India' },
            'loni': { latitude: 28.7333, longitude: 77.2833, displayName: 'Loni, Uttar Pradesh, India' },
            'siliguri': { latitude: 26.7271, longitude: 88.3953, displayName: 'Siliguri, West Bengal, India' },
            'jhansi': { latitude: 25.4484, longitude: 78.5685, displayName: 'Jhansi, Uttar Pradesh, India' },
            'ulhasnagar': { latitude: 19.2215, longitude: 73.1645, displayName: 'Ulhasnagar, Maharashtra, India' },
            'jammu': { latitude: 32.7266, longitude: 74.8570, displayName: 'Jammu, Jammu and Kashmir, India' },
            'sangli-miraj & kupwad': { latitude: 16.8524, longitude: 74.5815, displayName: 'Sangli-Miraj & Kupwad, Maharashtra, India' },
            'mangalore': { latitude: 12.9141, longitude: 74.8560, displayName: 'Mangalore, Karnataka, India' },
            'erode': { latitude: 11.3410, longitude: 77.7172, displayName: 'Erode, Tamil Nadu, India' },
            'belgaum': { latitude: 15.8497, longitude: 74.4977, displayName: 'Belgaum, Karnataka, India' },
            'ambattur': { latitude: 13.1143, longitude: 80.1548, displayName: 'Ambattur, Tamil Nadu, India' },
            'tirunelveli': { latitude: 8.7139, longitude: 77.7567, displayName: 'Tirunelveli, Tamil Nadu, India' },
            'malegaon': { latitude: 20.5579, longitude: 74.5287, displayName: 'Malegaon, Maharashtra, India' },
            'gaya': { latitude: 24.7914, longitude: 85.0002, displayName: 'Gaya, Bihar, India' },
            'jalgaon': { latitude: 21.0077, longitude: 75.5626, displayName: 'Jalgaon, Maharashtra, India' },
            'udaipur': { latitude: 24.5854, longitude: 73.7125, displayName: 'Udaipur, Rajasthan, India' },
            'maheshtala': { latitude: 22.5049, longitude: 88.2482, displayName: 'Maheshtala, West Bengal, India' }
        };
    }

    // Search for a city in the predefined list
    geocodeAddress(address) {
        const searchTerm = address.toLowerCase().trim();
        
        // Direct match
        if (this.cityCoordinates[searchTerm]) {
            return Promise.resolve({
                ...this.cityCoordinates[searchTerm],
                address: { city: address, country: 'India' }
            });
        }

        // Partial match
        const partialMatches = Object.keys(this.cityCoordinates).filter(city => 
            city.includes(searchTerm) || searchTerm.includes(city)
        );

        if (partialMatches.length > 0) {
            const bestMatch = partialMatches[0];
            return Promise.resolve({
                ...this.cityCoordinates[bestMatch],
                address: { city: bestMatch, country: 'India' }
            });
        }

        // No match found
        return Promise.reject(new Error(`Location '${address}' not found in fallback database`));
    }

    // Get all available cities
    getAvailableCities() {
        return Object.keys(this.cityCoordinates).map(city => ({
            name: city,
            ...this.cityCoordinates[city]
        }));
    }

    // Check if a city is available
    isCityAvailable(cityName) {
        return this.cityCoordinates.hasOwnProperty(cityName.toLowerCase().trim());
    }
}

module.exports = new FallbackGeocodingService();