// MEDBRIDGE - Location & Geolocation Service
// Supports Browser Geolocation, Manual PIN code resolution, and Haversine Distance Calculations

export interface UserCoords {
  lat: number;
  lng: number;
  accuracy?: number;
}

// Kolkata Popular Landmarks & PIN code directory for instant manual fallback
export const KOLKATA_PINCODES: Record<string, { area: string; lat: number; lng: number }> = {
  '700064': { area: 'Salt Lake Sector 1 / CA Block', lat: 22.5867, lng: 88.4178 },
  '700091': { area: 'Salt Lake Sector 2 / City Centre 1', lat: 22.5892, lng: 88.4095 },
  '700098': { area: 'Salt Lake Sector 3 / Sukanta Nagar', lat: 22.5714, lng: 88.4150 },
  '700156': { area: 'New Town Action Area 1 / Axis Mall', lat: 22.5855, lng: 88.4589 },
  '700019': { area: 'Gariahat / Ballygunge', lat: 22.5195, lng: 88.3653 },
  '700004': { area: 'Shyambazar / Hatibagan', lat: 22.6033, lng: 88.3712 },
  '700054': { area: 'Kankurgachi / VIP Road', lat: 22.5781, lng: 88.3934 },
  '700073': { area: 'College Street / Medical College', lat: 22.5744, lng: 88.3629 }
};

// Default fallback location (Salt Lake Sector 1, Kolkata)
export const DEFAULT_KOLKATA_LOCATION: UserCoords = {
  lat: 22.5867,
  lng: 88.4178
};

// Haversine distance formula in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return +d.toFixed(1);
}

// Request Browser Geolocation
export function requestCurrentPosition(): Promise<{ coords: UserCoords; error?: string }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        coords: DEFAULT_KOLKATA_LOCATION,
        error: 'Geolocation is not supported by your browser. Using Kolkata demo location.'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          }
        });
      },
      (err) => {
        let msg = 'Location permission denied. Please enter your PIN code manually.';
        if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out. Using default Kolkata area.';
        }
        resolve({
          coords: DEFAULT_KOLKATA_LOCATION,
          error: msg
        });
      },
      { timeout: 7000, maximumAge: 60000, enableHighAccuracy: true }
    );
  });
}

// Check if a store is currently open based on opening hours string
export function isStoreOpenNow(openingHours: string, is24x7: boolean): boolean {
  if (is24x7) return true;
  if (!openingHours) return true;

  // Simple parser for standard Indian formats e.g. "8:00 AM - 10:30 PM"
  try {
    const parts = openingHours.split('-').map(s => s.trim());
    if (parts.length < 2) return true;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const parseTime = (timeStr: string) => {
      const match = timeStr.match(/(\d+):?(\d*)\s*(AM|PM)/i);
      if (!match) return 0;
      let hours = parseInt(match[1], 10);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const openMin = parseTime(parts[0]);
    const closeMin = parseTime(parts[1]);

    return currentMinutes >= openMin && currentMinutes <= closeMin;
  } catch (e) {
    return true;
  }
}

