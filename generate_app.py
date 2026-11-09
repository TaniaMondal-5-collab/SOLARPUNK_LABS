# -*- coding: utf-8 -*-
"""
Full, complete generate_app.py including MedBridge Confidence Engine Explainer,
Hackathon Showcase, and clean UI components
"""

app_code = r'''/**
 * MEDBRIDGE - Real-time Medicine Availability & Pharmacy Coordination Platform
 * Developed for Generative AI Clash Hackathon at Techno India University (21 November 2026)
 * Built by RED ZONE_DevOps & Quantum_Neurons
 * 
 * "Find Medicines. Connect Pharmacies. Save Time."
 */

(function () {
  'use strict';

  const { createElement: h, useState, useEffect, useMemo, useRef, useCallback } = window.React;

  // --- SVG Icon Components ---
  function Icon({ name, className = "w-5 h-5", size = 20, color = "currentColor" }) {
    const icons = {
      search: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('circle', { cx: 11, cy: 11, r: 8 }),
        h('path', { d: 'm21 21-4.3-4.3' })
      ),
      mapPin: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' }),
        h('circle', { cx: 12, cy: 10, r: 3 })
      ),
      checkCircle: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
        h('polyline', { points: '22 4 12 14.01 9 11.01' })
      ),
      alertTriangle: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' }),
        h('line', { x1: 12, y1: 9, x2: 12, y2: 13 }),
        h('line', { x1: 12, y1: 17, x2: 12.01, y2: 17 })
      ),
      clock: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('circle', { cx: 12, cy: 12, r: 10 }),
        h('polyline', { points: '12 6 12 12 16 14' })
      ),
      shieldCheck: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' }),
        h('path', { d: 'm9 12 2 2 4-4' })
      ),
      package: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'm7.5 4.27 9 5.15' }),
        h('path', { d: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' }),
        h('path', { d: 'm3.3 7 8.7 5 8.7-5' }),
        h('path', { d: 'M12 22V12' })
      ),
      pill: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'm10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z' }),
        h('path', { d: 'm8.5 8.5 7 7' })
      ),
      camera: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z' }),
        h('circle', { cx: 12, cy: 13, r: 3 })
      ),
      link: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }),
        h('path', { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' })
      ),
      phone: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' })
      ),
      arrowRight: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('line', { x1: 5, y1: 12, x2: 19, y2: 12 }),
        h('polyline', { points: '12 5 19 12 12 19' })
      ),
      plus: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
        h('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
      ),
      minus: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
      ),
      x: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
        h('line', { x1: 6, y1: 6, x2: 18, y2: 18 })
      ),
      refresh: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' }),
        h('path', { d: 'M21 3v5h-5' }),
        h('path', { d: 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' }),
        h('path', { d: 'M3 21v-5h5' })
      ),
      store: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'm2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7' }),
        h('path', { d: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8' }),
        h('path', { d: 'M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4' }),
        h('path', { d: 'M2 7h20' })
      ),
      user: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }),
        h('circle', { cx: 12, cy: 7, r: 4 })
      ),
      shield: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })
      ),
      activity: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('polyline', { points: '22 12 18 12 15 21 9 3 6 12 2 12' })
      ),
      heart: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('path', { d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' })
      ),
      map: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('polygon', { points: '3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21' }),
        h('line', { x1: 9, y1: 3, x2: 9, y2: 18 }),
        h('line', { x1: 15, y1: 6, x2: 15, y2: 21 })
      ),
      list: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('line', { x1: 8, y1: 6, x2: 21, y2: 6 }),
        h('line', { x1: 8, y1: 12, x2: 21, y2: 12 }),
        h('line', { x1: 8, y1: 18, x2: 21, y2: 18 }),
        h('line', { x1: 3, y1: 6, x2: 3.01, y2: 6 }),
        h('line', { x1: 3, y1: 12, x2: 3.01, y2: 12 }),
        h('line', { x1: 3, y1: 18, x2: 3.01, y2: 18 })
      ),
      info: h('svg', { className, width: size, height: size, fill: 'none', stroke: color, viewBox: '0 0 24 24', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
        h('circle', { cx: 12, cy: 12, r: 10 }),
        h('line', { x1: 12, y1: 16, x2: 12, y2: 12 }),
        h('line', { x1: 12, y1: 8, x2: 12.01, y2: 8 })
      )
    };
    return icons[name] || icons.info;
  }

  // --- Real-world Kolkata Locations ---
  const KOLKATA_PINCODES = {
    '700064': { area: 'Salt Lake Sector 1 (CA Block)', lat: 22.5867, lng: 88.4178 },
    '700091': { area: 'Salt Lake Sector 2 (City Centre 1)', lat: 22.5892, lng: 88.4095 },
    '700098': { area: 'Salt Lake Sector 3 (Sukanta Nagar)', lat: 22.5714, lng: 88.4150 },
    '700156': { area: 'New Town Action Area 1 (Axis Mall)', lat: 22.5855, lng: 88.4589 },
    '700019': { area: 'Gariahat (Rashbehari Ave)', lat: 22.5195, lng: 88.3653 },
    '700004': { area: 'Shyambazar (5-Point Crossing)', lat: 22.6033, lng: 88.3712 },
    '700054': { area: 'Kankurgachi (VIP Road)', lat: 22.5781, lng: 88.3934 },
    '700073': { area: 'College Street (Medical College)', lat: 22.5744, lng: 88.3629 }
  };

  const DEFAULT_USER_LOCATION = {
    pincode: '700064',
    area: 'Salt Lake Sector 1 (CA Block)',
    lat: 22.5867,
    lng: 88.4178
  };

  // Safe coordinate extractor helper
  function getPharmacyCoords(pharmacy) {
    if (!pharmacy) return { lat: 22.5867, lng: 88.4178 };
    const lat = pharmacy.lat !== undefined ? pharmacy.lat : (pharmacy.location && pharmacy.location.lat !== undefined ? pharmacy.location.lat : 22.5867);
    const lng = pharmacy.lng !== undefined ? pharmacy.lng : (pharmacy.location && pharmacy.location.lng !== undefined ? pharmacy.location.lng : 88.4178);
    return { lat, lng };
  }

  // Haversine distance in kilometers
  function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return +(R * c).toFixed(1);
  }

  // Stock status resolver helper
  function resolveStockStatus(inv) {
    if (!inv) return 'OUT_OF_STOCK';
    if (inv.quantity <= 0) return 'OUT_OF_STOCK';
    if (inv.status === 'AVAILABLE' || inv.status === 'IN_STOCK' || inv.stockStatus === 'IN_STOCK') {
      return inv.quantity >= 5 ? 'IN_STOCK' : 'LOW_STOCK';
    }
    if (inv.status === 'LOW_STOCK' || inv.stockStatus === 'LOW_STOCK') return 'LOW_STOCK';
    return inv.quantity >= 5 ? 'IN_STOCK' : 'LOW_STOCK';
  }

  // Confidence resolver helper
  function resolveConfidence(inv) {
    if (!inv) return 'UNVERIFIED';
    return inv.confidence || inv.availabilityConfidence || 'PHARMACY_CONFIRMED';
  }

  // --- Reactive Local Store ---
  function getInitialData() {
    const data = window.MEDBRIDGE_DATA || {};
    try {
      const storedMeds = localStorage.getItem('mb_medicines');
      const storedPharms = localStorage.getItem('mb_pharmacies');
      const storedInv = localStorage.getItem('mb_inventory');
      const storedRes = localStorage.getItem('mb_reservations');
      const storedVerif = localStorage.getItem('mb_verification_requests');

      return {
        medicines: storedMeds ? JSON.parse(storedMeds) : (data.INITIAL_MEDICINES || []),
        pharmacies: storedPharms ? JSON.parse(storedPharms) : (data.INITIAL_PHARMACIES || []),
        inventory: storedInv ? JSON.parse(storedInv) : (data.INITIAL_INVENTORY || []),
        reservations: storedRes ? JSON.parse(storedRes) : (data.INITIAL_RESERVATIONS || []),
        verificationRequests: storedVerif ? JSON.parse(storedVerif) : (data.INITIAL_VERIFICATION_REQUESTS || [])
      };
    } catch (e) {
      console.warn("Could not read localStorage, using default seed data", e);
      return {
        medicines: data.INITIAL_MEDICINES || [],
        pharmacies: data.INITIAL_PHARMACIES || [],
        inventory: data.INITIAL_INVENTORY || [],
        reservations: data.INITIAL_RESERVATIONS || [],
        verificationRequests: data.INITIAL_VERIFICATION_REQUESTS || []
      };
    }
  }

  // --- Main Application Component ---
  function MedBridgeApp() {
    // Top-Level State
    const [store, setStore] = useState(getInitialData);
    const [userRole, setUserRole] = useState('customer'); // 'customer' | 'pharmacy' | 'admin'
    const [activeTab, setActiveTab] = useState('home'); // customer: 'home' | 'search' | 'reservations'; pharmacy: 'dashboard' | 'inventory' | 'requests' | 'analytics'; admin: 'approvals' | 'metrics'
    const [userLocation, setUserLocation] = useState(DEFAULT_USER_LOCATION);

    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
    const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'stock'

    // Modals
    const [ocrModalOpen, setOcrModalOpen] = useState(false);
    const [urlModalOpen, setUrlModalOpen] = useState(false);
    const [reserveModalData, setReserveModalData] = useState(null);
    const [addMedicineModalOpen, setAddMedicineModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    // Save state to localStorage whenever store changes
    const persistStore = (nextStore) => {
      setStore(nextStore);
      try {
        localStorage.setItem('mb_medicines', JSON.stringify(nextStore.medicines));
        localStorage.setItem('mb_pharmacies', JSON.stringify(nextStore.pharmacies));
        localStorage.setItem('mb_inventory', JSON.stringify(nextStore.inventory));
        localStorage.setItem('mb_reservations', JSON.stringify(nextStore.reservations));
        localStorage.setItem('mb_verification_requests', JSON.stringify(nextStore.verificationRequests));
      } catch (e) {
        console.error("Storage error:", e);
      }
    };

    const showToast = (msg, type = "success") => {
      setToastMessage({ text: msg, type });
      setTimeout(() => setToastMessage(null), 4000);
    };

    const resetDemoData = () => {
      try {
        localStorage.clear();
        const data = window.MEDBRIDGE_DATA || {};
        const fresh = {
          medicines: data.INITIAL_MEDICINES || [],
          pharmacies: data.INITIAL_PHARMACIES || [],
          inventory: data.INITIAL_INVENTORY || [],
          reservations: data.INITIAL_RESERVATIONS || [],
          verificationRequests: data.INITIAL_VERIFICATION_REQUESTS || []
        };
        persistStore(fresh);
        setSelectedMedicine(null);
        showToast("Demo data successfully restored to fresh Kolkata benchmark state!");
      } catch (e) {
        console.error(e);
      }
    };

    // Calculate Availability for a medicine across pharmacies
    const getAvailabilityForMedicine = (medId) => {
      if (!medId) return [];
      const relevantInventory = store.inventory.filter(inv => inv.medicineId === medId);

      return relevantInventory.map(inv => {
        const pharmacy = store.pharmacies.find(p => p.id === inv.pharmacyId) || {
          id: inv.pharmacyId,
          name: 'Pharmacy Store',
          address: 'Kolkata',
          lat: 22.58,
          lng: 88.41,
          isVerified: false,
          phone: '+91 33 0000 0000',
          openingHours: '9:00 AM - 10:00 PM'
        };

        const pharmCoords = getPharmacyCoords(pharmacy);
        const distance = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          pharmCoords.lat,
          pharmCoords.lng
        );

        return {
          inventory: inv,
          pharmacy,
          distance,
          stockStatus: resolveStockStatus(inv),
          confidence: resolveConfidence(inv)
        };
      }).sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        if (sortBy === 'stock') return b.inventory.quantity - a.inventory.quantity;
        return a.distance - b.distance;
      });
    };

    // Quick Select Medicine and launch Search view
    const handleSelectMedicine = (med) => {
      setSelectedMedicine(med);
      setActiveTab('search');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 1. Demo Mode Switcher Bar
    const renderDemoBar = () => {
      return h('div', { className: 'bg-slate-900 border-b border-slate-800 text-slate-200 text-xs py-2 px-4 shadow-sm' },
        h('div', { className: 'max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3' },
          // Left: Hackathon Identity & Mode
          h('div', { className: 'flex items-center gap-2 flex-wrap' },
            h('span', { className: 'px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono font-semibold border border-blue-500/30' },
              'HACKATHON DEMO'
            ),
            h('span', { className: 'text-slate-400 hidden sm:inline' },
              'Generative AI Clash 2026 | RED ZONE_DevOps & Quantum_Neurons'
            )
          ),

          // Center: Role Switcher
          h('div', { className: 'flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700' },
            h('span', { className: 'text-slate-400 font-medium px-2 hidden md:inline' }, 'Role:'),
            h('button', {
              onClick: () => { setUserRole('customer'); setActiveTab('home'); },
              className: `px-3 py-1 rounded-md font-medium transition-all ${userRole === 'customer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`
            }, 'Customer (Rahul Sen)'),
            h('button', {
              onClick: () => { setUserRole('pharmacy'); setActiveTab('dashboard'); },
              className: `px-3 py-1 rounded-md font-medium transition-all ${userRole === 'pharmacy' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`
            }, 'Pharmacy (Frank Ross)'),
            h('button', {
              onClick: () => { setUserRole('admin'); setActiveTab('approvals'); },
              className: `px-3 py-1 rounded-md font-medium transition-all ${userRole === 'admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`
            }, 'Admin (RedZone Ops)')
          ),

          // Right: Location Dropdown & Reset
          h('div', { className: 'flex items-center gap-2 flex-wrap' },
            h('div', { className: 'flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700' },
              h(Icon, { name: 'mapPin', className: 'w-3.5 h-3.5 text-cyan-400' }),
              h('select', {
                value: userLocation.pincode,
                onChange: (e) => {
                  const pin = e.target.value;
                  const loc = KOLKATA_PINCODES[pin];
                  if (loc) {
                    setUserLocation({ pincode: pin, area: loc.area, lat: loc.lat, lng: loc.lng });
                    showToast(`Simulated customer location moved to ${loc.area}`);
                  }
                },
                className: 'bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer'
              },
                Object.entries(KOLKATA_PINCODES).map(([pin, data]) =>
                  h('option', { key: pin, value: pin, className: 'bg-slate-900 text-slate-200' },
                    `${data.area} (${pin})`
                  )
                )
              )
            ),
            h('button', {
              onClick: resetDemoData,
              title: 'Reset database to initial benchmark dataset',
              className: 'flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition'
            },
              h(Icon, { name: 'refresh', className: 'w-3 h-3 text-amber-400' }),
              h('span', { className: 'hidden sm:inline' }, 'Reset Data')
            )
          )
        )
      );
    };

    // 2. Main Navigation Header
    const renderNavbar = () => {
      const pendingReservationsCount = store.reservations.filter(r => r.status === 'PENDING').length;
      const pendingApprovalsCount = store.verificationRequests.filter(v => v.status === 'PENDING').length;

      return h('header', { className: 'bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm' },
        h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4' },
          // Logo & Tagline
          h('div', {
            onClick: () => {
              if (userRole === 'customer') setActiveTab('home');
              else if (userRole === 'pharmacy') setActiveTab('dashboard');
              else setActiveTab('approvals');
            },
            className: 'flex items-center gap-3 cursor-pointer group'
          },
            h('div', { className: 'w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform' },
              h(Icon, { name: 'activity', className: 'w-6 h-6' })
            ),
            h('div', null,
              h('div', { className: 'flex items-center gap-2' },
                h('span', { className: 'text-xl font-bold tracking-tight text-slate-900' }, 'MEDBRIDGE'),
                h('span', { className: 'text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200' }, 'Kolkata')
              ),
              h('p', { className: 'text-xs text-slate-500 hidden sm:block font-medium' }, 'Find Medicines. Connect Pharmacies. Save Time.')
            )
          ),

          // Role Navigation Tabs
          h('nav', { className: 'flex items-center gap-1 sm:gap-2' },
            userRole === 'customer' && [
              h('button', {
                key: 'home',
                onClick: () => setActiveTab('home'),
                className: `px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
              }, 'Find Medicines'),
              h('button', {
                key: 'search',
                onClick: () => {
                  if (!selectedMedicine && store.medicines.length > 0) {
                    setSelectedMedicine(store.medicines[0]);
                  }
                  setActiveTab('search');
                },
                className: `px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'search' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
              }, 'Availability Catalog'),
              h('button', {
                key: 'reservations',
                onClick: () => setActiveTab('reservations'),
                className: `relative px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'reservations' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
              },
                'My Reservations',
                store.reservations.length > 0 && h('span', { className: 'ml-1.5 px-1.5 py-0.2 rounded-full text-xs font-bold bg-blue-600 text-white' }, store.reservations.length)
              )
            ],

            userRole === 'pharmacy' && [
              h('button', {
                key: 'dashboard',
                onClick: () => setActiveTab('dashboard'),
                className: `px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
              }, 'Store Overview'),
              h('button', {
                key: 'inventory',
                onClick: () => setActiveTab('inventory'),
                className: `px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'inventory' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
              }, 'Inventory CRUD'),
              h('button', {
                key: 'requests',
                onClick: () => setActiveTab('requests'),
                className: `relative px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'requests' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
              },
                'Incoming Queue',
                pendingReservationsCount > 0 && h('span', { className: 'ml-1.5 px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse' }, pendingReservationsCount)
              ),
              h('button', {
                key: 'analytics',
                onClick: () => setActiveTab('analytics'),
                className: `px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
              }, 'Store Analytics')
            ],

            userRole === 'admin' && [
              h('button', {
                key: 'approvals',
                onClick: () => setActiveTab('approvals'),
                className: `relative px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'approvals' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
              },
                'Pharmacy Approvals',
                pendingApprovalsCount > 0 && h('span', { className: 'ml-1.5 px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse' }, pendingApprovalsCount)
              ),
              h('button', {
                key: 'metrics',
                onClick: () => setActiveTab('metrics'),
                className: `px-3 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'metrics' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
              }, 'Platform Metrics')
            ]
          )
        )
      );
    };

    // 3. Customer Landing Page (Home View)
    const renderCustomerHome = () => {
      const filteredSuggestions = searchQuery.trim()
        ? store.medicines.filter(m =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

      return h('div', { className: 'animate-fade-in pb-16' },
        // Hero Section
        h('section', { className: 'relative bg-gradient-to-b from-slate-900 via-brand-navy to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden' },
          h('div', { className: 'absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]' }),
          h('div', { className: 'absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none' }),
          h('div', { className: 'absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none' }),

          h('div', { className: 'relative max-w-4xl mx-auto text-center' },
            h('div', { className: 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-cyan-300 text-xs font-medium mb-6 backdrop-blur' },
              h(Icon, { name: 'shieldCheck', className: 'w-4 h-4 text-cyan-400' }),
              'Verified Kolkata Retail Pharmacy Stock Network'
            ),

            h('h1', { className: 'text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight' },
              'Find Your Prescribed Medicines.',
              h('span', { className: 'block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300' },
                'Check Live Stock Before You Go.'
              )
            ),

            h('p', { className: 'text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed' },
              'Save critical hours commuting between pharmacies. Search real-time stock across licensed pharmacies in Salt Lake, New Town, Gariahat and Shyambazar. Reserve packs for in-store pickup.'
            ),

            // Omnibox 3-in-1 Search Bar
            h('div', { className: 'bg-white rounded-2xl shadow-2xl p-2 sm:p-3 text-slate-800 text-left border border-slate-200/80 max-w-3xl mx-auto relative' },
              h('div', { className: 'flex flex-col sm:flex-row items-stretch sm:items-center gap-2' },
                h('div', { className: 'flex-1 flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition' },
                  h(Icon, { name: 'search', className: 'w-5 h-5 text-slate-400 mr-2 flex-shrink-0' }),
                  h('input', {
                    type: 'text',
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    placeholder: 'Search medicine name, generic salt (e.g. Augmentin, Telmisartan)...',
                    className: 'w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none'
                  }),
                  searchQuery && h('button', {
                    onClick: () => setSearchQuery(''),
                    className: 'text-slate-400 hover:text-slate-600 p-1'
                  }, h(Icon, { name: 'x', className: 'w-4 h-4' }))
                ),

                h('div', { className: 'flex items-center gap-2' },
                  h('button', {
                    onClick: () => setOcrModalOpen(true),
                    className: 'flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 transition'
                  },
                    h(Icon, { name: 'camera', className: 'w-4 h-4 text-blue-600' }),
                    h('span', { className: 'hidden md:inline' }, 'AI Box Scan')
                  ),
                  h('button', {
                    onClick: () => setUrlModalOpen(true),
                    className: 'flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 transition'
                  },
                    h(Icon, { name: 'link', className: 'w-4 h-4 text-cyan-600' }),
                    h('span', { className: 'hidden md:inline' }, 'Paste Link')
                  ),
                  h('button', {
                    onClick: () => {
                      if (searchQuery.trim()) {
                        const match = store.medicines.find(m =>
                          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        if (match) handleSelectMedicine(match);
                        else showToast(`No exact match for "${searchQuery}". Showing standard catalog.`, "info");
                      }
                      setActiveTab('search');
                    },
                    className: 'px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition'
                  }, 'Search')
                )
              ),

              // Autocomplete Dropdown
              searchQuery.trim().length > 0 && h('div', { className: 'absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden z-50 max-h-72 overflow-y-auto' },
                filteredSuggestions.length > 0
                  ? filteredSuggestions.map(med =>
                      h('div', {
                        key: med.id,
                        onClick: () => {
                          setSearchQuery('');
                          handleSelectMedicine(med);
                        },
                        className: 'p-3 hover:bg-blue-50/70 cursor-pointer flex items-center justify-between transition'
                      },
                        h('div', { className: 'flex items-center gap-3' },
                          h('div', { className: 'w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs' },
                            med.dosageForm[0]
                          ),
                          h('div', null,
                            h('div', { className: 'font-semibold text-sm text-slate-900 flex items-center gap-2' },
                              med.name,
                              med.isRx && h('span', { className: 'text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200' }, 'Rx')
                            ),
                            h('div', { className: 'text-xs text-slate-500' },
                              `${med.genericName} • ${med.strength}`
                            )
                          )
                        ),
                        h('div', { className: 'text-right' },
                          h('div', { className: 'text-xs font-bold text-slate-800' }, `₹${med.mrp.toFixed(2)}`),
                          h('div', { className: 'text-[11px] text-blue-600 font-medium' }, 'View Stock →')
                        )
                      )
                    )
                  : h('div', { className: 'p-4 text-center text-sm text-slate-500' },
                      `No medicine found matching "${searchQuery}". Showing standard catalog.`
                    )
              )
            ),

            // Popular Quick Chips
            h('div', { className: 'mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400' },
              h('span', { className: 'font-semibold text-slate-300' }, 'Frequently searched in Kolkata:'),
              store.medicines.slice(0, 5).map(med =>
                h('button', {
                  key: med.id,
                  onClick: () => handleSelectMedicine(med),
                  className: 'px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-blue-900/60 hover:text-cyan-300 text-slate-300 border border-slate-700/80 transition'
                }, med.name)
              )
            )
          )
        ),

        // Live Kolkata Stats Bar
        h('section', { className: 'max-w-7xl mx-auto px-4 -mt-8 relative z-20' },
          h('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-2xl shadow-card p-6 border border-slate-200/80' },
            [
              { label: 'Verified Kolkata Pharmacies', value: `${store.pharmacies.length}`, icon: 'store', sub: 'Salt Lake, New Town, Gariahat' },
              { label: 'Medicines Tracked', value: `${store.medicines.length}`, icon: 'pill', sub: 'Updated via Pharmacy API/Portal' },
              { label: 'Real-time Stock Accuracy', value: '98.4%', icon: 'shieldCheck', sub: 'With Pharmacy Timestamp' },
              { label: '100% Free For Patients', value: '₹0 Fee', icon: 'heart', sub: 'Direct In-Store Dispensation' }
            ].map((stat, i) =>
              h('div', { key: i, className: 'flex items-start gap-3.5 p-2' },
                h('div', { className: 'w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0' },
                  h(Icon, { name: stat.icon, className: 'w-6 h-6' })
                ),
                h('div', null,
                  h('div', { className: 'text-2xl font-extrabold text-slate-900 tracking-tight' }, stat.value),
                  h('div', { className: 'text-xs font-bold text-slate-700' }, stat.label),
                  h('div', { className: 'text-[11px] text-slate-400' }, stat.sub)
                )
              )
            )
          )
        ),

        // Three-Step Workflow Explanation
        h('section', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16' },
          h('div', { className: 'text-center max-w-2xl mx-auto mb-12' },
            h('span', { className: 'text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100' },
              'Simple 3-Step Coordination'
            ),
            h('h2', { className: 'text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight' },
              'How MedBridge Protects Your Time'
            ),
            h('p', { className: 'text-sm text-slate-600 mt-2' },
              'We never sell drugs online. We connect you directly with nearby licensed community pharmacists.'
            )
          ),

          h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },
            [
              {
                step: '01',
                title: 'Search & Verify Stock',
                desc: 'Enter your prescribed medicine name, upload a box photo, or paste a link. See verified stock status and distance from your location in Salt Lake.',
                icon: 'search',
                highlight: 'MedBridge Confidence Tiers'
              },
              {
                step: '02',
                title: 'Reserve In-Store Pickup',
                desc: 'Lock your pack with 1 click. The pharmacy holds the medicine behind the counter for up to 2 hours while you commute to the store.',
                icon: 'package',
                highlight: 'Concurrency Protected Hold'
              },
              {
                step: '03',
                title: 'Collect with Prescription',
                desc: 'Visit the pharmacy, present your physical doctor prescription, review the batch with the registered pharmacist, and pay at standard MRP.',
                icon: 'checkCircle',
                highlight: 'Safety & Regulatory Compliant'
              }
            ].map((card, idx) =>
              h('div', { key: idx, className: 'relative bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between' },
                h('div', null,
                  h('div', { className: 'flex items-center justify-between mb-4' },
                    h('div', { className: 'w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20' },
                      h(Icon, { name: card.icon, className: 'w-6 h-6' })
                    ),
                    h('span', { className: 'text-3xl font-black text-slate-200 font-mono' }, card.step)
                  ),
                  h('h3', { className: 'text-lg font-bold text-slate-900 mb-2' }, card.title),
                  h('p', { className: 'text-sm text-slate-600 leading-relaxed mb-4' }, card.desc)
                ),
                h('div', { className: 'pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-600' },
                  h(Icon, { name: 'shieldCheck', className: 'w-4 h-4' }),
                  card.highlight
                )
              )
            )
          )
        ),

        // MedBridge Availability Confidence Explainer Card
        h('section', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16' },
          h('div', { className: 'bg-gradient-to-br from-slate-900 to-brand-navy rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden' },
            h('div', { className: 'max-w-3xl' },
              h('div', { className: 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold border border-cyan-800 mb-4' },
                h(Icon, { name: 'activity', className: 'w-3.5 h-3.5' }),
                'Core Innovation: MedBridge Confidence Engine'
              ),
              h('h2', { className: 'text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight' },
                'Know Before You Go: Transparent Stock Reliability'
              ),
              h('p', { className: 'text-slate-300 text-sm leading-relaxed mb-8' },
                'Traditional maps tell you if a shop is open, but not whether they have your life-saving medication. MedBridge assigns every reported inventory level a clear confidence badge backed by audit timestamps:'
              ),

              h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
                [
                  {
                    title: 'Pharmacy Confirmed',
                    badge: 'CONFIRMED < 4H',
                    color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30',
                    desc: 'Manually verified by the registered pharmacist on duty within the last 4 hours.'
                  },
                  {
                    title: 'Recently Updated',
                    badge: 'UPDATED < 24H',
                    color: 'text-blue-300 bg-blue-950/80 border-blue-500/30',
                    desc: 'Synchronized via daily pharmacy POS or batch upload within the last 24 hours.'
                  },
                  {
                    title: 'Outdated / Low Certainty',
                    badge: 'UPDATED > 48H',
                    color: 'text-amber-300 bg-amber-950/80 border-amber-500/30',
                    desc: 'Stock level has not been confirmed recently. In-store reservation recommended.'
                  },
                  {
                    title: 'Estimated Stock',
                    badge: 'UNVERIFIED',
                    color: 'text-slate-300 bg-slate-800/80 border-slate-700',
                    desc: 'Based on historical dispensing rate. Call pharmacy or request stock verification.'
                  }
                ].map((tier, idx) =>
                  h('div', { key: idx, className: 'bg-slate-800/60 rounded-xl p-4 border border-slate-700/60' },
                    h('div', { className: 'flex items-center justify-between mb-2' },
                      h('span', { className: 'font-bold text-sm text-white' }, tier.title),
                      h('span', { className: `text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${tier.color}` }, tier.badge)
                    ),
                    h('p', { className: 'text-xs text-slate-300 leading-normal' }, tier.desc)
                  )
                )
              )
            )
          )
        ),

        // Featured Kolkata Medicines
        h('section', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16' },
          h('div', { className: 'flex items-center justify-between mb-8 flex-wrap gap-4' },
            h('div', null,
              h('h2', { className: 'text-2xl font-bold text-slate-900 tracking-tight' }, 'Tracked Medicines in Kolkata Network'),
              h('p', { className: 'text-sm text-slate-500 mt-1' }, 'Click any medicine to view real-time availability across Salt Lake and surrounding pharmacies.')
            ),
            h('button', {
              onClick: () => {
                if (!selectedMedicine && store.medicines.length > 0) setSelectedMedicine(store.medicines[0]);
                setActiveTab('search');
              },
              className: 'text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1'
            },
              'Browse all catalog',
              h(Icon, { name: 'arrowRight', className: 'w-4 h-4' })
            )
          ),

          h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5' },
            store.medicines.slice(0, 8).map(med => {
              const availability = getAvailabilityForMedicine(med.id);
              const inStockPharmacies = availability.filter(a => a.stockStatus === 'IN_STOCK');
              const closestPharm = availability[0];

              return h('div', {
                key: med.id,
                onClick: () => handleSelectMedicine(med),
                className: 'bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition group flex flex-col justify-between'
              },
                h('div', null,
                  h('div', { className: 'flex items-start justify-between gap-2 mb-3' },
                    h('span', { className: 'text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700' }, med.category),
                    med.isRx
                      ? h('span', { className: 'text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200' }, 'Rx')
                      : h('span', { className: 'text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200' }, 'OTC')
                  ),
                  h('h3', { className: 'font-bold text-slate-900 group-hover:text-blue-600 transition text-base' }, med.name),
                  h('p', { className: 'text-xs text-slate-500 mt-1 line-clamp-1' }, `${med.genericName} • ${med.strength}`),
                  h('div', { className: 'mt-3 text-sm font-extrabold text-slate-900' },
                    `₹${med.mrp.toFixed(2)}`,
                    h('span', { className: 'text-xs font-normal text-slate-400 ml-1' }, `/ ${med.packSize}`)
                  )
                ),

                h('div', { className: 'mt-5 pt-3 border-t border-slate-100' },
                  closestPharm
                    ? h('div', { className: 'flex items-center justify-between text-xs' },
                        h('span', { className: 'text-slate-500 flex items-center gap-1' },
                          h(Icon, { name: 'mapPin', className: 'w-3 h-3 text-slate-400' }),
                          `${closestPharm.distance} km away`
                        ),
                        h('span', { className: `font-semibold ${inStockPharmacies.length > 0 ? 'text-emerald-600' : 'text-amber-600'}` },
                          inStockPharmacies.length > 0 ? `${inStockPharmacies.length} Stores In Stock` : 'Low Availability'
                        )
                      )
                    : h('div', { className: 'text-xs text-slate-400' }, 'Check availability')
                )
              );
            })
          )
        )
      );
    };

    // 4. Medicine Search & Detailed Availability View
    const renderSearchView = () => {
      const activeMed = selectedMedicine || store.medicines[0];
      const availability = getAvailabilityForMedicine(activeMed ? activeMed.id : null);

      const nearest = availability[0];
      const hasAlternativeConfirmed = availability.find(a =>
        a !== nearest && a.stockStatus === 'IN_STOCK' && a.inventory.quantity >= 5
      );

      return h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in' },
        // Top Breadcrumb & Medicine Switcher
        h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6' },
          h('div', { className: 'flex items-center gap-2 text-sm text-slate-500' },
            h('button', { onClick: () => setActiveTab('home'), className: 'hover:text-blue-600' }, 'Find Medicines'),
            h('span', null, '/'),
            h('span', { className: 'font-semibold text-slate-900' }, 'Availability Catalog'),
            h('span', null, '/'),
            h('span', { className: 'text-blue-600 font-semibold' }, activeMed ? activeMed.name : '')
          ),

          // Quick Medicine Selector Dropdown
          h('div', { className: 'flex items-center gap-2' },
            h('span', { className: 'text-xs font-semibold text-slate-500' }, 'Select Medicine:'),
            h('select', {
              value: activeMed ? activeMed.id : '',
              onChange: (e) => {
                const found = store.medicines.find(m => m.id === e.target.value);
                if (found) setSelectedMedicine(found);
              },
              className: 'bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            },
              store.medicines.map(m =>
                h('option', { key: m.id, value: m.id }, `${m.name} (${m.dosageForm})`)
              )
            )
          )
        ),

        activeMed && [
          // Medicine Monograph Card
          h('div', { key: 'monograph', className: 'bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-card mb-8' },
            h('div', { className: 'flex flex-col lg:flex-row lg:items-center justify-between gap-6' },
              h('div', { className: 'flex-1' },
                h('div', { className: 'flex items-center gap-2.5 flex-wrap mb-2' },
                  h('span', { className: 'px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700' }, activeMed.category),
                  activeMed.isRx
                    ? h('span', { className: 'px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1' },
                        h(Icon, { name: 'alertTriangle', className: 'w-3 h-3 text-amber-600' }),
                        'Schedule H / Prescription Required at Counter'
                      )
                    : h('span', { className: 'px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800' }, 'OTC / Over The Counter')
                ),
                h('h1', { className: 'text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight' }, activeMed.name),
                h('p', { className: 'text-sm sm:text-base font-medium text-slate-600 mt-1' },
                  h('strong', { className: 'text-slate-800' }, 'Generic Salt: '),
                  activeMed.genericName,
                  h('span', { className: 'mx-2 text-slate-300' }, '•'),
                  h('strong', { className: 'text-slate-800' }, 'Strength: '),
                  activeMed.strength
                ),
                h('p', { className: 'text-xs text-slate-500 mt-2' },
                  `Manufacturer: ${activeMed.brand} • Pack: ${activeMed.packSize}`
                ),
                h('p', { className: 'text-xs text-slate-600 mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed' },
                  activeMed.description
                )
              ),

              // Price & Storage Box
              h('div', { className: 'bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between min-w-[240px]' },
                h('div', null,
                  h('span', { className: 'text-xs font-semibold text-slate-500' }, 'Maximum Retail Price (MRP)'),
                  h('div', { className: 'text-3xl font-extrabold text-slate-900 tracking-tight mt-1' },
                    `₹${activeMed.mrp.toFixed(2)}`
                  ),
                  h('p', { className: 'text-[11px] text-slate-500 mt-0.5' }, 'Inclusive of all GST & taxes')
                ),
                h('div', { className: 'mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600' },
                  h('strong', { className: 'text-slate-700 block mb-1' }, 'Storage Guidelines:'),
                  activeMed.storageCondition
                )
              )
            )
          ),

          // Smart Alternative Location Finder Banner
          nearest && (nearest.stockStatus === 'OUT_OF_STOCK' || nearest.inventory.quantity <= 2) && hasAlternativeConfirmed && h('div', {
            key: 'smart-alert',
            className: 'bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-5 mb-8 text-white border border-cyan-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4'
          },
            h('div', { className: 'flex items-start gap-3.5' },
              h('div', { className: 'w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center flex-shrink-0 border border-cyan-400/30' },
                h(Icon, { name: 'mapPin', className: 'w-6 h-6' })
              ),
              h('div', null,
                h('div', { className: 'flex items-center gap-2' },
                  h('span', { className: 'text-xs font-bold uppercase tracking-wider text-cyan-300' }, 'SMART ALTERNATIVE LOCATION FINDER'),
                  h('span', { className: 'text-[10px] font-mono bg-cyan-400/20 text-cyan-200 px-2 py-0.2 rounded border border-cyan-400/30' }, 'CONFIRMED STOCK')
                ),
                h('p', { className: 'text-sm font-semibold text-white mt-1' },
                  `Nearest store (${nearest.pharmacy.name}) has low/zero stock. Available at ${hasAlternativeConfirmed.pharmacy.name}!`
                ),
                h('p', { className: 'text-xs text-slate-300 mt-0.5' },
                  `Located ${hasAlternativeConfirmed.distance} km away in ${hasAlternativeConfirmed.pharmacy.area || 'Kolkata'} (${hasAlternativeConfirmed.inventory.quantity} units confirmed). Approx 12-15 min drive.`
                )
              )
            ),
            h('button', {
              onClick: () => {
                setReserveModalData({
                  medicine: activeMed,
                  pharmacy: hasAlternativeConfirmed.pharmacy,
                  inventory: hasAlternativeConfirmed.inventory
                });
              },
              className: 'px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition whitespace-nowrap'
            }, `Reserve at ${hasAlternativeConfirmed.pharmacy.area || 'Store'} →`)
          ),

          // View Controls (List / Map Toggle & Sort)
          h('div', { key: 'controls', className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6' },
            h('div', null,
              h('h2', { className: 'text-xl font-bold text-slate-900' }, 'Nearby Pharmacies Stock Availability'),
              h('p', { className: 'text-xs text-slate-500 mt-0.5' },
                `Showing ${availability.length} licensed pharmacies near ${userLocation.area}`
              )
            ),

            h('div', { className: 'flex items-center gap-3' },
              h('div', { className: 'flex items-center gap-1.5 text-xs text-slate-600' },
                h('span', null, 'Sort by:'),
                h('select', {
                  value: sortBy,
                  onChange: (e) => setSortBy(e.target.value),
                  className: 'bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none'
                },
                  h('option', { value: 'distance' }, 'Distance (Closest)'),
                  h('option', { value: 'stock' }, 'Stock (Highest First)')
                )
              ),

              h('div', { className: 'flex items-center bg-slate-200/80 p-0.5 rounded-lg' },
                h('button', {
                  onClick: () => setViewMode('list'),
                  className: `flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition ${viewMode === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`
                },
                  h(Icon, { name: 'list', className: 'w-3.5 h-3.5' }),
                  'List'
                ),
                h('button', {
                  onClick: () => setViewMode('map'),
                  className: `flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition ${viewMode === 'map' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`
                },
                  h(Icon, { name: 'map', className: 'w-3.5 h-3.5' }),
                  'Map'
                )
              )
            )
          ),

          // Availability Content: List vs Map
          viewMode === 'list'
            ? h('div', { key: 'list-view', className: 'space-y-4' },
                availability.map(({ inventory: inv, pharmacy, distance, stockStatus, confidence }) => {
                  const isAvailable = stockStatus === 'IN_STOCK';
                  const isLow = stockStatus === 'LOW_STOCK';
                  const isOut = stockStatus === 'OUT_OF_STOCK';
                  const openHours = pharmacy.openingHours || pharmacy.operatingHours || '8:00 AM - 10:00 PM';

                  return h('div', {
                    key: inv.id,
                    className: 'bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6'
                  },
                    // Left Pharmacy Details
                    h('div', { className: 'flex-1' },
                      h('div', { className: 'flex items-center gap-2 flex-wrap mb-1' },
                        h('h3', { className: 'text-lg font-bold text-slate-900' }, pharmacy.name),
                        pharmacy.isVerified && h('span', { className: 'inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200' },
                          h(Icon, { name: 'checkCircle', className: 'w-3 h-3 text-blue-600' }),
                          'Verified Retailer'
                        )
                      ),
                      h('p', { className: 'text-xs text-slate-500' }, pharmacy.address),
                      h('div', { className: 'flex items-center gap-4 text-xs text-slate-600 mt-2 flex-wrap' },
                        h('span', { className: 'flex items-center gap-1 text-blue-600 font-semibold' },
                          h(Icon, { name: 'mapPin', className: 'w-3.5 h-3.5' }),
                          `${distance} km from you`
                        ),
                        h('span', { className: 'flex items-center gap-1 text-slate-500' },
                          h(Icon, { name: 'clock', className: 'w-3.5 h-3.5 text-slate-400' }),
                          openHours
                        ),
                        h('span', { className: 'flex items-center gap-1 text-slate-500' },
                          h(Icon, { name: 'phone', className: 'w-3.5 h-3.5 text-slate-400' }),
                          pharmacy.phone
                        )
                      )
                    ),

                    // Middle: Stock & MedBridge Confidence
                    h('div', { className: 'flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0' },
                      h('div', { className: 'flex items-center gap-2' },
                        isAvailable && h('span', { className: 'badge-available px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5' },
                          h('span', { className: 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse' }),
                          `In Stock (${inv.quantity} packs)`
                        ),
                        isLow && h('span', { className: 'badge-low-stock px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5' },
                          h('span', { className: 'w-2 h-2 rounded-full bg-amber-500' }),
                          `Low Stock (${inv.quantity} left)`
                        ),
                        isOut && h('span', { className: 'badge-out-of-stock px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5' },
                          h('span', { className: 'w-2 h-2 rounded-full bg-rose-500' }),
                          'Out of Stock'
                        )
                      ),

                      // Confidence Badge
                      h('div', {
                        className: `text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          confidence === 'PHARMACY_CONFIRMED' ? 'confidence-confirmed' :
                          confidence === 'RECENTLY_UPDATED' ? 'confidence-recent' :
                          confidence === 'OUTDATED' ? 'confidence-outdated' : 'confidence-unverified'
                        }`
                      },
                        confidence === 'PHARMACY_CONFIRMED' ? '✓ Pharmacist Confirmed' :
                        confidence === 'RECENTLY_UPDATED' ? '• Stock Sync (< 24h)' :
                        confidence === 'OUTDATED' ? '▲ Outdated (> 48h)' : '? Unverified'
                      )
                    ),

                    // Right: Action Buttons
                    h('div', { className: 'flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0' },
                      h('button', {
                        disabled: isOut,
                        onClick: () => {
                          setReserveModalData({
                            medicine: activeMed,
                            pharmacy,
                            inventory: inv
                          });
                        },
                        className: `px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-sm ${
                          isOut
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                        }`
                      }, isOut ? 'Unavailable' : 'Reserve for In-Store Pickup')
                    )
                  );
                })
              )
            : h(LeafletMapComponent, {
                key: 'map-view',
                userLocation,
                availability,
                onReserve: (item) => {
                  setReserveModalData({
                    medicine: activeMed,
                    pharmacy: item.pharmacy,
                    inventory: item.inventory
                  });
                }
              })
        ]
      );
    };

    // 5. Leaflet Map Interactive Component
    function LeafletMapComponent({ userLocation, availability, onReserve }) {
      const mapContainerRef = useRef(null);
      const mapInstanceRef = useRef(null);

      useEffect(() => {
        if (!window.L || !mapContainerRef.current) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = window.L.map(mapContainerRef.current).setView([userLocation.lat, userLocation.lng], 13);
        mapInstanceRef.current = map;

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors | MedBridge Healthcare'
        }).addTo(map);

        // User Marker
        const userIcon = window.L.divIcon({
          className: 'custom-user-marker',
          html: `<div style="background-color: #2563EB; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.8);"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });

        window.L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup(`<strong>Your Location</strong><br>${userLocation.area}`);

        // Pharmacy Markers
        availability.forEach(item => {
          const isAvailable = item.stockStatus === 'IN_STOCK';
          const isLow = item.stockStatus === 'LOW_STOCK';
          const pinColor = isAvailable ? '#10B981' : isLow ? '#F59E0B' : '#EF4444';
          const coords = getPharmacyCoords(item.pharmacy);

          const pharmacyIcon = window.L.divIcon({
            className: 'custom-pharm-marker',
            html: `<div style="background-color: ${pinColor}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">+</div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });

          const popupHtml = `
            <div style="font-family: inherit; padding: 12px; min-width: 200px;">
              <strong style="font-size: 14px; color: #0F172A; display: block; margin-bottom: 2px;">${item.pharmacy.name}</strong>
              <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">${item.pharmacy.address}</div>
              <div style="font-size: 12px; font-weight: bold; color: ${pinColor}; margin-bottom: 6px;">
                ${isAvailable ? `In Stock (${item.inventory.quantity} packs)` : isLow ? `Low Stock (${item.inventory.quantity} packs)` : 'Out of Stock'}
              </div>
              <div style="font-size: 11px; color: #2563EB; margin-bottom: 10px;">${item.distance} km from your location</div>
              <button id="map-reserve-${item.pharmacy.id}" style="width: 100%; background: #2563EB; color: white; border: none; padding: 6px 10px; border-radius: 6px; font-weight: bold; font-size: 11px; cursor: pointer;">
                Reserve at this Store
              </button>
            </div>
          `;

          const marker = window.L.marker([coords.lat, coords.lng], { icon: pharmacyIcon })
            .addTo(map)
            .bindPopup(popupHtml, { className: 'custom-map-popup' });

          marker.on('popupopen', () => {
            const btn = document.getElementById(`map-reserve-${item.pharmacy.id}`);
            if (btn) {
              btn.onclick = () => onReserve(item);
            }
          });
        });

        setTimeout(() => {
          if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
        }, 200);

        return () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
          }
        };
      }, [userLocation, availability]);

      return h('div', { className: 'bg-white rounded-2xl p-4 border border-slate-200 shadow-sm' },
        h('div', { ref: mapContainerRef, className: 'w-full h-[500px] rounded-xl overflow-hidden' })
      );
    }

    // 6. Customer "My Reservations" View
    const renderCustomerReservations = () => {
      const userReservations = store.reservations;

      const handleCancelReservation = (resId) => {
        if (!confirm("Are you sure you want to cancel this reservation? The held medicine pack will be returned to inventory.")) return;

        const target = store.reservations.find(r => r.id === resId);
        if (!target) return;

        const nextInventory = store.inventory.map(inv => {
          if (inv.pharmacyId === target.pharmacyId && inv.medicineId === target.medicineId) {
            const nextQty = inv.quantity + target.quantity;
            return {
              ...inv,
              quantity: nextQty,
              status: nextQty >= 5 ? 'AVAILABLE' : 'LOW_STOCK',
              stockStatus: nextQty >= 5 ? 'IN_STOCK' : 'LOW_STOCK',
              updatedAt: new Date().toISOString()
            };
          }
          return inv;
        });

        const nextReservations = store.reservations.map(r => {
          if (r.id === resId) {
            return {
              ...r,
              status: 'CANCELLED',
              timeline: [
                ...r.timeline,
                {
                  status: 'CANCELLED',
                  timestamp: new Date().toISOString(),
                  note: 'Reservation cancelled by customer. Stock returned to shelf.',
                  actor: 'CUSTOMER'
                }
              ],
              updatedAt: new Date().toISOString()
            };
          }
          return r;
        });

        persistStore({
          ...store,
          inventory: nextInventory,
          reservations: nextReservations
        });

        showToast("Reservation cancelled and stock restored.");
      };

      return h('div', { className: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in' },
        h('div', { className: 'flex items-center justify-between mb-8' },
          h('div', null,
            h('h1', { className: 'text-2xl font-bold text-slate-900 tracking-tight' }, 'My Medicine Reservations'),
            h('p', { className: 'text-xs text-slate-500 mt-1' }, 'Track in-store pickup holds and verification status.')
          ),
          h('button', {
            onClick: () => setActiveTab('home'),
            className: 'text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition'
          }, '+ New Medicine Search')
        ),

        userReservations.length === 0
          ? h('div', { className: 'bg-white rounded-2xl p-12 text-center border border-slate-200' },
              h('div', { className: 'w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4' },
                h(Icon, { name: 'package', className: 'w-8 h-8' })
              ),
              h('h3', { className: 'text-lg font-bold text-slate-900' }, 'No Active Reservations'),
              h('p', { className: 'text-xs text-slate-500 max-w-sm mx-auto mt-2 mb-6' },
                'You have not placed any medicine reservations yet. Search a medicine and reserve at a nearby licensed pharmacy.'
              ),
              h('button', {
                onClick: () => setActiveTab('home'),
                className: 'px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md'
              }, 'Find Prescribed Medicines')
            )
          : h('div', { className: 'space-y-6' },
              userReservations.map(res => {
                const isPending = res.status === 'PENDING';
                const isAccepted = res.status === 'ACCEPTED';
                const isReady = res.status === 'READY_FOR_PICKUP';
                const isCollected = res.status === 'COLLECTED';

                return h('div', {
                  key: res.id,
                  className: 'bg-white rounded-2xl p-6 border border-slate-200 shadow-sm overflow-hidden'
                },
                  // Card Header
                  h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100' },
                    h('div', null,
                      h('div', { className: 'flex items-center gap-2' },
                        h('span', { className: 'text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100' }, res.id),
                        h('span', { className: 'text-xs text-slate-400' }, `Placed on ${new Date(res.createdAt).toLocaleDateString()}`)
                      ),
                      h('h3', { className: 'text-xl font-extrabold text-slate-900 mt-1' }, res.medicineName),
                      h('p', { className: 'text-xs text-slate-500' }, `${res.pharmacyName} • Quantity: ${res.quantity} pack(s)`)
                    ),

                    h('div', { className: 'text-left sm:text-right' },
                      h('div', { className: 'text-xs text-slate-400' }, 'Total MRP (Pay at Counter)'),
                      h('div', { className: 'text-2xl font-extrabold text-slate-900' }, `₹${res.totalPrice.toFixed(2)}`),
                      h('div', { className: 'text-[11px] font-semibold text-emerald-600 mt-0.5' }, 'Zero Advance Required')
                    )
                  ),

                  // Progress Stepper
                  h('div', { className: 'py-6' },
                    h('div', { className: 'grid grid-cols-4 gap-2 text-center text-xs' },
                      [
                        { label: 'Requested', done: true, current: isPending },
                        { label: 'Confirmed', done: isAccepted || isReady || isCollected, current: isAccepted },
                        { label: 'Ready for Pickup', done: isReady || isCollected, current: isReady },
                        { label: 'Collected', done: isCollected, current: isCollected }
                      ].map((step, idx) =>
                        h('div', { key: idx, className: 'flex flex-col items-center' },
                          h('div', {
                            className: `w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition ${
                              step.done
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`
                          }, idx + 1),
                          h('span', { className: `font-semibold text-[11px] ${step.current ? 'text-blue-700' : 'text-slate-600'}` }, step.label)
                        )
                      )
                    )
                  ),

                  // Status Banner & Pharmacist Notes
                  h('div', { className: 'bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs' },
                    h('div', null,
                      h('strong', { className: 'text-slate-700 block' }, 'Pickup Instruction:'),
                      h('p', { className: 'text-slate-600 mt-0.5' },
                        res.pharmacyNotes || 'Pack held at counter. Please present your valid doctor prescription upon pickup.'
                      )
                    ),
                    (isPending || isAccepted) && h('button', {
                      onClick: () => handleCancelReservation(res.id),
                      className: 'text-rose-600 hover:text-rose-700 font-semibold underline'
                    }, 'Cancel Reservation')
                  )
                );
              })
            )
      );
    };

    // 7. Pharmacy Owner / Staff Dashboard & Inventory CRUD
    const renderPharmacyDashboard = () => {
      const currentPharmacy = store.pharmacies.find(p => p.id === 'pharmacy_frank_ross_saltlake') || store.pharmacies[0];
      const pharmacyInventory = store.inventory.filter(i => i.pharmacyId === currentPharmacy.id);
      const pharmacyReservations = store.reservations.filter(r => r.pharmacyId === currentPharmacy.id);

      const totalSkus = pharmacyInventory.length;
      const inStockCount = pharmacyInventory.filter(i => resolveStockStatus(i) === 'IN_STOCK').length;
      const lowStockCount = pharmacyInventory.filter(i => resolveStockStatus(i) === 'LOW_STOCK').length;
      const outStockCount = pharmacyInventory.filter(i => resolveStockStatus(i) === 'OUT_OF_STOCK').length;
      const pendingOrders = pharmacyReservations.filter(r => r.status === 'PENDING').length;

      const handleAdjustStock = (invId, delta) => {
        const nextInv = store.inventory.map(inv => {
          if (inv.id === invId) {
            const nextQty = Math.max(0, inv.quantity + delta);
            const status = nextQty >= 5 ? 'AVAILABLE' : nextQty > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK';
            return {
              ...inv,
              quantity: nextQty,
              status,
              stockStatus: status === 'AVAILABLE' ? 'IN_STOCK' : status,
              confidence: 'PHARMACY_CONFIRMED',
              availabilityConfidence: 'PHARMACY_CONFIRMED',
              lastUpdated: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }
          return inv;
        });
        persistStore({ ...store, inventory: nextInv });
        showToast("Stock quantity updated and confidence verified!");
      };

      const handleVerifyStockNow = (invId) => {
        const nextInv = store.inventory.map(inv => {
          if (inv.id === invId) {
            return {
              ...inv,
              confidence: 'PHARMACY_CONFIRMED',
              availabilityConfidence: 'PHARMACY_CONFIRMED',
              lastUpdated: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }
          return inv;
        });
        persistStore({ ...store, inventory: nextInv });
        showToast("Verified stock audit timestamp refreshed to just now.");
      };

      const handleTransitionReservation = (resId, newStatus, note = "") => {
        const nextReservations = store.reservations.map(r => {
          if (r.id === resId) {
            return {
              ...r,
              status: newStatus,
              pharmacyNotes: note || r.pharmacyNotes,
              timeline: [
                ...r.timeline,
                {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  note: note || `Reservation transitioned to ${newStatus}`,
                  actor: 'PHARMACY'
                }
              ],
              updatedAt: new Date().toISOString()
            };
          }
          return r;
        });
        persistStore({ ...store, reservations: nextReservations });
        showToast(`Reservation status updated to ${newStatus}`);
      };

      return h('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in' },
        // Pharmacy Store Header
        h('div', { className: 'bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card mb-8' },
          h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
            h('div', null,
              h('div', { className: 'flex items-center gap-2 flex-wrap mb-1' },
                h('span', { className: 'text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800' }, 'REGISTERED RETAILER'),
                h('span', { className: 'text-xs text-slate-500' }, `License: ${currentPharmacy.licenseNumber || currentPharmacy.drugLicenseNumber || 'WB/KOL/DL-2021-9943'}`)
              ),
              h('h1', { className: 'text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight' }, currentPharmacy.name),
              h('p', { className: 'text-xs sm:text-sm text-slate-600 mt-1' },
                `${currentPharmacy.address} • Phone: ${currentPharmacy.phone}`
              )
            ),

            h('div', { className: 'flex items-center gap-3' },
              h('button', {
                onClick: () => setAddMedicineModalOpen(true),
                className: 'flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition'
              },
                h(Icon, { name: 'plus', className: 'w-4 h-4' }),
                'Add Medicine to Store'
              )
            )
          )
        ),

        // 4 Key Metric Cards
        h('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8' },
          [
            { label: 'Total Tracked SKUs', val: totalSkus, icon: 'package', color: 'text-blue-600 bg-blue-50' },
            { label: 'In-Stock Healthy', val: inStockCount, icon: 'checkCircle', color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Low / Out of Stock', val: lowStockCount + outStockCount, icon: 'alertTriangle', color: 'text-amber-600 bg-amber-50' },
            { label: 'Pending Reservations', val: pendingOrders, icon: 'clock', color: 'text-purple-600 bg-purple-50' }
          ].map((card, i) =>
            h('div', { key: i, className: 'bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between' },
              h('div', null,
                h('div', { className: 'text-2xl font-black text-slate-900' }, card.val),
                h('div', { className: 'text-xs font-semibold text-slate-500 mt-0.5' }, card.label)
              ),
              h('div', { className: `w-10 h-10 rounded-xl ${card.color} flex items-center justify-center` },
                h(Icon, { name: card.icon, className: 'w-5 h-5' })
              )
            )
          )
        ),

        // Subtabs for Pharmacy
        h('div', { className: 'flex items-center gap-2 border-b border-slate-200 mb-6' },
          h('button', {
            onClick: () => setActiveTab('inventory'),
            className: `pb-3 px-4 text-sm font-bold border-b-2 transition ${activeTab === 'inventory' || activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`
          }, `Store Inventory (${pharmacyInventory.length})`),
          h('button', {
            onClick: () => setActiveTab('requests'),
            className: `pb-3 px-4 text-sm font-bold border-b-2 transition ${activeTab === 'requests' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`
          }, `Incoming Reservations Queue (${pharmacyReservations.length})`),
          h('button', {
            onClick: () => setActiveTab('analytics'),
            className: `pb-3 px-4 text-sm font-bold border-b-2 transition ${activeTab === 'analytics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`
          }, 'Store Analytics')
        ),

        // 1. Inventory CRUD
        (activeTab === 'inventory' || activeTab === 'dashboard') && h('div', { className: 'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden' },
          h('div', { className: 'p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50' },
            h('h2', { className: 'text-base font-bold text-slate-900' }, 'Manage Physical Pharmacy Stock'),
            h('span', { className: 'text-xs text-slate-500' }, 'Adjust quantities or verify confidence timestamps in real time.')
          ),

          h('div', { className: 'divide-y divide-slate-100' },
            pharmacyInventory.map(inv => {
              const med = store.medicines.find(m => m.id === inv.medicineId) || {
                name: inv.medicineId,
                genericName: '',
                dosageForm: 'Pack'
              };
              const status = resolveStockStatus(inv);

              return h('div', {
                key: inv.id,
                className: 'p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition'
              },
                // Medicine info
                h('div', { className: 'flex-1' },
                  h('div', { className: 'flex items-center gap-2' },
                    h('h3', { className: 'font-bold text-slate-900 text-base' }, med.name),
                    h('span', { className: 'text-[11px] text-slate-500 font-mono' }, `Batch: ${inv.batchNumber || 'N/A'}`)
                  ),
                  h('p', { className: 'text-xs text-slate-500 mt-0.5' },
                    `${med.genericName} • Shelf: ${inv.rackLocation || 'Counter A'}`
                  ),
                  h('div', { className: 'flex items-center gap-2 mt-2 text-xs' },
                    h('span', { className: 'text-slate-400' }, 'Last Verified:'),
                    h('span', { className: 'font-mono text-slate-600' }, new Date(inv.lastUpdated || inv.lastVerifiedAt || Date.now()).toLocaleTimeString())
                  )
                ),

                // Real-time stock +/- controls
                h('div', { className: 'flex items-center gap-3' },
                  h('div', { className: 'flex items-center bg-slate-100 rounded-xl border border-slate-200 p-1' },
                    h('button', {
                      onClick: () => handleAdjustStock(inv.id, -1),
                      className: 'w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-sm shadow-sm transition'
                    }, '-'),
                    h('span', { className: 'w-12 text-center font-bold text-slate-900 text-sm' }, inv.quantity),
                    h('button', {
                      onClick: () => handleAdjustStock(inv.id, 1),
                      className: 'w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-sm shadow-sm transition'
                    }, '+')
                  ),

                  // Stock Status Pill
                  h('span', {
                    className: `text-xs font-bold px-3 py-1 rounded-full ${
                      status === 'IN_STOCK' ? 'badge-available' :
                      status === 'LOW_STOCK' ? 'badge-low-stock' : 'badge-out-of-stock'
                    }`
                  }, status),

                  // Verify Now Button
                  h('button', {
                    onClick: () => handleVerifyStockNow(inv.id),
                    title: 'Refresh audit timestamp to give customers 100% verified confidence',
                    className: 'px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-blue-700 text-xs font-bold border border-slate-200 transition'
                  }, 'Verify Now')
                )
              );
            })
          )
        ),

        // 2. Incoming Queue
        activeTab === 'requests' && h('div', { className: 'space-y-4' },
          pharmacyReservations.length === 0
            ? h('div', { className: 'bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200' },
                'No reservation requests pending for this store.'
              )
            : pharmacyReservations.map(res =>
                h('div', {
                  key: res.id,
                  className: 'bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4'
                },
                  h('div', null,
                    h('div', { className: 'flex items-center gap-2' },
                      h('span', { className: 'text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded' }, res.id),
                      h('span', { className: `text-xs font-bold px-2 py-0.5 rounded ${
                        res.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        res.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                        res.status === 'READY_FOR_PICKUP' ? 'bg-purple-100 text-purple-800' :
                        res.status === 'COLLECTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }` }, res.status)
                    ),
                    h('h3', { className: 'text-lg font-bold text-slate-900 mt-1' }, `${res.quantity}x ${res.medicineName}`),
                    h('p', { className: 'text-xs text-slate-500 mt-0.5' },
                      `Customer: ${res.customerName} (${res.customerPhone}) • Total: ₹${res.totalPrice.toFixed(2)}`
                    )
                  ),

                  h('div', { className: 'flex items-center gap-2 flex-wrap' },
                    res.status === 'PENDING' && [
                      h('button', {
                        key: 'accept',
                        onClick: () => handleTransitionReservation(res.id, 'ACCEPTED', 'Reserved behind counter. Please collect within 2 hours.'),
                        className: 'px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition'
                      }, 'Accept & Hold Pack'),
                      h('button', {
                        key: 'reject',
                        onClick: () => handleTransitionReservation(res.id, 'REJECTED', 'Stock was sold out over the counter.'),
                        className: 'px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs border border-rose-200 transition'
                      }, 'Decline')
                    ],

                    res.status === 'ACCEPTED' && h('button', {
                      onClick: () => handleTransitionReservation(res.id, 'READY_FOR_PICKUP', 'Pack is kept ready at the pickup desk.'),
                      className: 'px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition'
                    }, 'Mark Ready for Pickup'),

                    res.status === 'READY_FOR_PICKUP' && h('button', {
                      onClick: () => handleTransitionReservation(res.id, 'COLLECTED', 'Prescription verified. Dispensed by Registered Pharmacist.'),
                      className: 'px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition'
                    }, 'Confirm Handover & Payment')
                  )
                )
              )
        ),

        // 3. Store Analytics
        activeTab === 'analytics' && h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          h('div', { className: 'bg-white rounded-2xl p-6 border border-slate-200 shadow-sm' },
            h('h3', { className: 'text-base font-bold text-slate-900 mb-1' }, 'Stock Health Distribution'),
            h('p', { className: 'text-xs text-slate-500 mb-6' }, 'Proportion of available catalog items.'),
            h('div', { className: 'space-y-4' },
              [
                { label: 'In Stock', count: inStockCount, total: totalSkus, color: 'bg-emerald-500' },
                { label: 'Low Stock (< 5 packs)', count: lowStockCount, total: totalSkus, color: 'bg-amber-500' },
                { label: 'Out of Stock (0 packs)', count: outStockCount, total: totalSkus, color: 'bg-rose-500' }
              ].map((item, idx) => {
                const pct = totalSkus > 0 ? Math.round((item.count / totalSkus) * 100) : 0;
                return h('div', { key: idx },
                  h('div', { className: 'flex justify-between text-xs font-semibold mb-1' },
                    h('span', { className: 'text-slate-700' }, item.label),
                    h('span', { className: 'text-slate-900' }, `${item.count} items (${pct}%)`)
                  ),
                  h('div', { className: 'w-full h-3 bg-slate-100 rounded-full overflow-hidden' },
                    h('div', { className: `h-full ${item.color} rounded-full transition-all duration-500`, style: { width: `${pct}%` } })
                  )
                );
              })
            )
          ),

          h('div', { className: 'bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between' },
            h('div', null,
              h('h3', { className: 'text-base font-bold text-slate-900 mb-1' }, 'Customer Fulfillment Performance'),
              h('p', { className: 'text-xs text-slate-500 mb-4' }, 'Pickup reliability metric.'),
              h('div', { className: 'bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 text-xs' },
                h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-500' }, 'Average Reservation Hold Duration:'),
                  h('span', { className: 'font-bold text-slate-900' }, '1 hr 18 min')
                ),
                h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-500' }, 'Pickup Success Rate:'),
                  h('span', { className: 'font-bold text-emerald-600' }, '94.2%')
                ),
                h('div', { className: 'flex justify-between' },
                  h('span', { className: 'text-slate-500' }, 'Pharmacist Audit Compliance:'),
                  h('span', { className: 'font-bold text-blue-600' }, '100% Form 20B Verified')
                )
              )
            ),
            h('div', { className: 'mt-6 text-[11px] text-slate-400 text-center' },
              'Verified via MedBridge Retailer SLA protocol.'
            )
          )
        )
      );
    };

    // 8. Admin / Platform Verification View
    const renderAdminView = () => {
      const pendingVerifications = store.verificationRequests;

      const handleApproveVerification = (verifId) => {
        const target = store.verificationRequests.find(v => v.id === verifId);
        if (!target) return;

        const nextPharmacies = store.pharmacies.map(p => {
          if (p.id === target.pharmacyId) {
            return { ...p, isVerified: true, verificationStatus: 'VERIFIED' };
          }
          return p;
        });

        const nextVerif = store.verificationRequests.map(v => {
          if (v.id === verifId) {
            return { ...v, status: 'APPROVED', reviewedAt: new Date().toISOString() };
          }
          return v;
        });

        persistStore({ ...store, pharmacies: nextPharmacies, verificationRequests: nextVerif });
        showToast(`Pharmacy "${target.pharmacyName}" verified and activated on public search!`);
      };

      const handleRejectVerification = (verifId) => {
        const nextVerif = store.verificationRequests.map(v => {
          if (v.id === verifId) {
            return { ...v, status: 'REJECTED', reviewedAt: new Date().toISOString() };
          }
          return v;
        });
        persistStore({ ...store, verificationRequests: nextVerif });
        showToast("Pharmacy verification request declined.", "info");
      };

      return h('div', { className: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in' },
        h('div', { className: 'flex items-center justify-between mb-8' },
          h('div', null,
            h('h1', { className: 'text-2xl font-bold text-slate-900 tracking-tight' }, 'MedBridge Platform Administration'),
            h('p', { className: 'text-xs text-slate-500 mt-1' }, 'Inspect drug licenses, approve retail pharmacies, and monitor telemetry.')
          ),
          h('button', {
            onClick: resetDemoData,
            className: 'text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3.5 py-2 rounded-xl transition'
          }, 'Reset Demo Database')
        ),

        // Subtabs for Admin
        h('div', { className: 'flex items-center gap-4 border-b border-slate-200 mb-6' },
          h('button', {
            onClick: () => setActiveTab('approvals'),
            className: `pb-3 px-2 text-sm font-bold border-b-2 transition ${activeTab === 'approvals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`
          }, `Pending Pharmacy Verification (${pendingVerifications.filter(v => v.status === 'PENDING').length})`),
          h('button', {
            onClick: () => setActiveTab('metrics'),
            className: `pb-3 px-2 text-sm font-bold border-b-2 transition ${activeTab === 'metrics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`
          }, 'Platform Network Overview')
        ),

        activeTab === 'approvals' && h('div', { className: 'space-y-6' },
          pendingVerifications.map(verif => {
            const isApproved = verif.status === 'APPROVED';
            const isPending = verif.status === 'PENDING';

            return h('div', {
              key: verif.id,
              className: 'bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm'
            },
              h('div', { className: 'flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4' },
                h('div', null,
                  h('div', { className: 'flex items-center gap-2' },
                    h('span', { className: 'text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded' }, verif.id),
                    h('span', { className: `text-xs font-bold px-2 py-0.5 rounded ${
                      isApproved ? 'bg-emerald-100 text-emerald-800' :
                      isPending ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }` }, verif.status)
                  ),
                  h('h3', { className: 'text-xl font-bold text-slate-900 mt-2' }, verif.pharmacyName),
                  h('p', { className: 'text-xs text-slate-500' }, `${verif.address}, ${verif.city} - ${verif.pincode}`)
                ),

                isPending && h('div', { className: 'flex items-center gap-2' },
                  h('button', {
                    onClick: () => handleApproveVerification(verif.id),
                    className: 'px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition'
                  }, 'Approve & Activate'),
                  h('button', {
                    onClick: () => handleRejectVerification(verif.id),
                    className: 'px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs border border-rose-200 transition'
                  }, 'Decline')
                )
              ),

              // Credential Inspection Table
              h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs mt-4' },
                h('div', null,
                  h('span', { className: 'text-slate-400 block' }, 'Drug License Number:'),
                  h('span', { className: 'font-mono font-bold text-slate-800' }, verif.drugLicenseNumber)
                ),
                h('div', null,
                  h('span', { className: 'text-slate-400 block' }, 'GSTIN Number:'),
                  h('span', { className: 'font-mono font-bold text-slate-800' }, verif.gstin)
                ),
                h('div', null,
                  h('span', { className: 'text-slate-400 block' }, 'Registered Owner:'),
                  h('span', { className: 'font-bold text-slate-800' }, verif.ownerName)
                ),
                h('div', null,
                  h('span', { className: 'text-slate-400 block' }, 'Attached License Document:'),
                  h('span', { className: 'text-blue-600 font-medium underline flex items-center gap-1 cursor-pointer' },
                    h(Icon, { name: 'shieldCheck', className: 'w-3 h-3' }),
                    verif.documentName || 'License_Form20B.pdf'
                  )
                )
              )
            );
          })
        ),

        activeTab === 'metrics' && h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
          [
            { title: 'Registered Kolkata Pharmacies', value: `${store.pharmacies.length}`, detail: 'Salt Lake, New Town, Gariahat, Shyambazar' },
            { title: 'Medicines In Catalog', value: `${store.medicines.length}`, detail: 'Standard Indian Schedule H & OTC medicines' },
            { title: 'Active Physical Inventory Holds', value: `${store.reservations.filter(r => r.status === 'ACCEPTED').length}`, detail: 'Secured via concurrency token' }
          ].map((m, idx) =>
            h('div', { key: idx, className: 'bg-white rounded-2xl p-6 border border-slate-200 shadow-sm' },
              h('span', { className: 'text-xs font-semibold text-slate-500' }, m.title),
              h('div', { className: 'text-3xl font-black text-slate-900 mt-2 mb-1' }, m.value),
              h('p', { className: 'text-xs text-slate-500' }, m.detail)
            )
          )
        )
      );
    };

    // 9. AI OCR Packaging Extraction Modal
    const renderOcrModal = () => {
      if (!ocrModalOpen) return null;

      const [step, setStep] = useState('select');
      const [extractedData, setExtractedData] = useState(null);

      const testSamples = [
        {
          name: 'Augmentin 625 Duo Box',
          generic: 'Amoxicillin and Potassium Clavulanate (500mg+125mg)',
          brand: 'GSK Pharmaceuticals',
          form: 'Tablet',
          matchedMedId: 'med_aug625'
        },
        {
          name: 'Glycomet-GP 2 Strip',
          generic: 'Metformin Hydrochloride + Glimepiride (500mg+2mg)',
          brand: 'USV Ltd',
          form: 'Tablet',
          matchedMedId: 'med_gly2'
        },
        {
          name: 'Telma 40 Box',
          generic: 'Telmisartan 40mg',
          brand: 'Glenmark Pharmaceuticals',
          form: 'Tablet',
          matchedMedId: 'med_telma40'
        }
      ];

      const runExtraction = (sample) => {
        setStep('extracting');
        setTimeout(() => {
          setExtractedData({
            sampleName: sample.name,
            detectedBrand: sample.brand,
            detectedGeneric: sample.generic,
            dosageForm: sample.form,
            confidence: 96.8,
            matchedMed: store.medicines.find(m => m.id === sample.matchedMedId)
          });
          setStep('review');
        }, 1200);
      };

      return h('div', { className: 'modal-overlay' },
        h('div', { className: 'bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fade-in' },
          h('button', {
            onClick: () => setOcrModalOpen(false),
            className: 'absolute top-5 right-5 text-slate-400 hover:text-slate-600'
          }, h(Icon, { name: 'x', className: 'w-5 h-5' })),

          h('div', { className: 'flex items-center gap-3 mb-4' },
            h('div', { className: 'w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center' },
              h(Icon, { name: 'camera', className: 'w-6 h-6' })
            ),
            h('div', null,
              h('h3', { className: 'text-lg font-bold text-slate-900' }, 'AI Medicine Packaging OCR'),
              h('p', { className: 'text-xs text-slate-500' }, 'Extracts active ingredients from medicine packaging photo.')
            )
          ),

          step === 'select' && h('div', { className: 'space-y-4' },
            h('p', { className: 'text-xs text-slate-600' },
              'Select a sample medicine box or upload your own photo to test real-time OCR extraction:'
            ),
            h('div', { className: 'space-y-2' },
              testSamples.map((sample, idx) =>
                h('div', {
                  key: idx,
                  onClick: () => runExtraction(sample),
                  className: 'p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition flex items-center justify-between'
                },
                  h('div', null,
                    h('div', { className: 'text-sm font-bold text-slate-900' }, sample.name),
                    h('div', { className: 'text-xs text-slate-500' }, sample.generic)
                  ),
                  h('span', { className: 'text-xs font-bold text-blue-600' }, 'Test Scan →')
                )
              )
            ),
            h('div', { className: 'pt-2 text-center text-xs text-slate-400' },
              'Supports Gemini Vision & Cloud OCR Pipeline'
            )
          ),

          step === 'extracting' && h('div', { className: 'py-12 text-center' },
            h('div', { className: 'w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto mb-4' }),
            h('h4', { className: 'text-sm font-bold text-slate-900' }, 'Analyzing Medicine Packaging...'),
            h('p', { className: 'text-xs text-slate-500 mt-1' }, 'Running text segmentation, salt extraction, and strength parser.')
          ),

          step === 'review' && extractedData && h('div', { className: 'space-y-4' },
            h('div', { className: 'bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs text-amber-800 flex items-start gap-2' },
              h(Icon, { name: 'alertTriangle', className: 'w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5' }),
              h('span', null,
                h('strong', null, 'Patient Safety Verification: '),
                'Please verify the extracted name and dosage matches your doctor prescription before searching.'
              )
            ),

            h('div', { className: 'bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2' },
              h('div', { className: 'flex justify-between' },
                h('span', { className: 'text-slate-500' }, 'Identified Medicine:'),
                h('span', { className: 'font-bold text-slate-900' }, extractedData.sampleName)
              ),
              h('div', { className: 'flex justify-between' },
                h('span', { className: 'text-slate-500' }, 'Active Ingredients:'),
                h('span', { className: 'font-bold text-slate-900' }, extractedData.detectedGeneric)
              ),
              h('div', { className: 'flex justify-between' },
                h('span', { className: 'text-slate-500' }, 'OCR Confidence:'),
                h('span', { className: 'font-bold text-emerald-600' }, `${extractedData.confidence}%`)
              )
            ),

            h('div', { className: 'flex items-center gap-3 pt-2' },
              h('button', {
                onClick: () => setStep('select'),
                className: 'w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs'
              }, 'Scan Another'),
              h('button', {
                onClick: () => {
                  if (extractedData.matchedMed) {
                    handleSelectMedicine(extractedData.matchedMed);
                  }
                  setOcrModalOpen(false);
                },
                className: 'w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md'
              }, 'Confirm & View Stock')
            )
          )
        )
      );
    };

    // 10. Paste Product URL Modal
    const renderUrlModal = () => {
      if (!urlModalOpen) return null;

      const [inputUrl, setInputUrl] = useState('');
      const [matchedMed, setMatchedMed] = useState(null);

      const handleParseUrl = () => {
        const lower = inputUrl.toLowerCase();
        let found = null;
        if (lower.includes('augmentin')) found = store.medicines.find(m => m.id === 'med_aug625');
        else if (lower.includes('telma')) found = store.medicines.find(m => m.id === 'med_telma40');
        else if (lower.includes('pan')) found = store.medicines.find(m => m.id === 'med_pan40');
        else found = store.medicines[0];

        setMatchedMed(found);
      };

      return h('div', { className: 'modal-overlay' },
        h('div', { className: 'bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fade-in' },
          h('button', {
            onClick: () => setUrlModalOpen(false),
            className: 'absolute top-5 right-5 text-slate-400 hover:text-slate-600'
          }, h(Icon, { name: 'x', className: 'w-5 h-5' })),

          h('div', { className: 'flex items-center gap-3 mb-4' },
            h('div', { className: 'w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center' },
              h(Icon, { name: 'link', className: 'w-6 h-6' })
            ),
            h('div', null,
              h('h3', { className: 'text-lg font-bold text-slate-900' }, 'Paste Product URL'),
              h('p', { className: 'text-xs text-slate-500' }, 'Enter link from 1mg, Netmeds, or Apollo Pharmacy.')
            )
          ),

          h('div', { className: 'space-y-4' },
            h('div', null,
              h('label', { className: 'block text-xs font-bold text-slate-700 mb-1' }, 'E-Pharmacy Medicine URL:'),
              h('input', {
                type: 'text',
                value: inputUrl,
                onChange: (e) => setInputUrl(e.target.value),
                placeholder: 'e.g. https://www.1mg.com/drugs/augmentin-625-duo-tablet',
                className: 'w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
              })
            ),

            h('div', { className: 'text-xs text-slate-500' },
              h('span', { className: 'block font-semibold mb-1' }, 'Or test with a sample URL:'),
              h('div', { className: 'flex flex-wrap gap-1.5' },
                [
                  { label: '1mg: Augmentin 625 Duo', url: 'https://www.1mg.com/drugs/augmentin-625-duo-tablet-138629' },
                  { label: 'Netmeds: Telma 40', url: 'https://www.netmeds.com/prescriptions/telma-40mg-tablet-30s' }
                ].map((sample, i) =>
                  h('button', {
                    key: i,
                    onClick: () => {
                      setInputUrl(sample.url);
                      handleParseUrl();
                    },
                    className: 'px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] text-slate-700'
                  }, sample.label)
                )
              )
            ),

            matchedMed && h('div', { className: 'bg-blue-50 rounded-xl p-4 border border-blue-200 text-xs' },
              h('div', { className: 'font-bold text-blue-900' }, `Matched Catalog Medicine: ${matchedMed.name}`),
              h('div', { className: 'text-blue-700 mt-0.5' }, `${matchedMed.genericName} (${matchedMed.strength})`),
              h('button', {
                onClick: () => {
                  handleSelectMedicine(matchedMed);
                  setUrlModalOpen(false);
                },
                className: 'mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm'
              }, 'Check In-Store Stock at Kolkata Pharmacies →')
            )
          )
        )
      );
    };

    // 11. Customer Reservation Modal
    const renderReserveModal = () => {
      if (!reserveModalData) return null;

      const { medicine, pharmacy, inventory } = reserveModalData;
      const [quantity, setQuantity] = useState(1);
      const [customerName, setCustomerName] = useState('Rahul Sen');
      const [customerPhone, setCustomerPhone] = useState('+91 98301 23456');
      const [pickupWindow, setPickupWindow] = useState('Within 2 Hours');
      const [prescriptionAttached, setPrescriptionAttached] = useState(true);

      const totalPrice = quantity * medicine.mrp;

      const handleConfirmReservation = () => {
        if (quantity > inventory.quantity) {
          alert("Selected quantity exceeds available in-store inventory.");
          return;
        }

        const newReservationId = `MB-RES-${Math.floor(10000 + Math.random() * 90000)}`;

        const nextInventory = store.inventory.map(inv => {
          if (inv.id === inventory.id) {
            const nextQty = inv.quantity - quantity;
            const status = nextQty >= 5 ? 'AVAILABLE' : nextQty > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK';
            return {
              ...inv,
              quantity: nextQty,
              status,
              stockStatus: status === 'AVAILABLE' ? 'IN_STOCK' : status,
              updatedAt: new Date().toISOString()
            };
          }
          return inv;
        });

        const newReservation = {
          id: newReservationId,
          customerId: 'user_customer_rahul',
          customerName,
          customerPhone,
          pharmacyId: pharmacy.id,
          pharmacyName: pharmacy.name,
          medicineId: medicine.id,
          medicineName: medicine.name,
          quantity,
          unitPrice: medicine.mrp,
          totalPrice,
          prescriptionUrl: prescriptionAttached ? 'prescription_scan_dr_das.pdf' : null,
          pickupWindow,
          status: 'PENDING',
          pharmacyNotes: 'Reservation received. Hold lock active.',
          timeline: [
            {
              status: 'PENDING',
              timestamp: new Date().toISOString(),
              note: `Requested ${quantity} pack(s) by customer for in-store pickup.`,
              actor: 'CUSTOMER'
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const nextReservations = [newReservation, ...store.reservations];

        persistStore({
          ...store,
          inventory: nextInventory,
          reservations: nextReservations
        });

        setReserveModalData(null);
        setActiveTab('reservations');
        showToast(`Pack reserved! Reservation Code: ${newReservationId}. Collect at counter.`);
      };

      return h('div', { className: 'modal-overlay' },
        h('div', { className: 'bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fade-in' },
          h('button', {
            onClick: () => setReserveModalData(null),
            className: 'absolute top-5 right-5 text-slate-400 hover:text-slate-600'
          }, h(Icon, { name: 'x', className: 'w-5 h-5' })),

          h('div', { className: 'flex items-center gap-3 mb-4' },
            h('div', { className: 'w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center' },
              h(Icon, { name: 'package', className: 'w-6 h-6' })
            ),
            h('div', null,
              h('h3', { className: 'text-lg font-bold text-slate-900' }, 'Reserve For In-Store Pickup'),
              h('p', { className: 'text-xs text-slate-500' }, 'Locks your medicine pack behind the pharmacy counter.')
            )
          ),

          h('div', { className: 'bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1.5 mb-4' },
            h('div', { className: 'font-bold text-slate-900 text-sm' }, medicine.name),
            h('div', { className: 'text-slate-600' }, `${medicine.genericName} • ${medicine.strength}`),
            h('div', { className: 'text-blue-600 font-semibold pt-1 border-t border-slate-200' },
              `Pickup Store: ${pharmacy.name} (${pharmacy.address})`
            )
          ),

          h('div', { className: 'space-y-4' },
            h('div', { className: 'flex items-center justify-between' },
              h('div', null,
                h('label', { className: 'text-xs font-bold text-slate-800 block' }, 'Number of Packs:'),
                h('span', { className: 'text-[11px] text-slate-500' }, `Max ${Math.min(inventory.quantity, 5)} units per reservation`)
              ),
              h('div', { className: 'flex items-center bg-slate-100 rounded-xl p-1' },
                h('button', {
                  onClick: () => setQuantity(Math.max(1, quantity - 1)),
                  className: 'w-8 h-8 rounded-lg bg-white text-slate-800 font-bold text-sm shadow-sm'
                }, '-'),
                h('span', { className: 'w-10 text-center font-bold text-slate-900 text-sm' }, quantity),
                h('button', {
                  onClick: () => setQuantity(Math.min(Math.min(inventory.quantity, 5), quantity + 1)),
                  className: 'w-8 h-8 rounded-lg bg-white text-slate-800 font-bold text-sm shadow-sm'
                }, '+')
              )
            ),

            h('div', null,
              h('label', { className: 'text-xs font-bold text-slate-800 block mb-1' }, 'Estimated Pickup Window:'),
              h('select', {
                value: pickupWindow,
                onChange: (e) => setPickupWindow(e.target.value),
                className: 'w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none'
              },
                h('option', { value: 'Within 2 Hours' }, 'Within 2 Hours (Urgent commute)'),
                h('option', { value: 'Within 4 Hours' }, 'Within 4 Hours'),
                h('option', { value: 'Today Evening (Before 9 PM)' }, 'Today Evening (Before 9 PM)')
              )
            ),

            medicine.isRx && h('div', { className: 'bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs' },
              h('label', { className: 'flex items-start gap-2 cursor-pointer' },
                h('input', {
                  type: 'checkbox',
                  checked: prescriptionAttached,
                  onChange: (e) => setPrescriptionAttached(e.target.checked),
                  className: 'mt-0.5 rounded text-blue-600 focus:ring-0'
                }),
                h('div', null,
                  h('strong', { className: 'text-amber-900 block' }, 'I will present a valid doctor prescription at counter'),
                  h('span', { className: 'text-amber-700 text-[11px]' }, 'Mandatory under Drugs & Cosmetics Rules 1945.')
                )
              )
            ),

            h('div', { className: 'pt-2 border-t border-slate-200 flex items-center justify-between' },
              h('div', null,
                h('span', { className: 'text-xs text-slate-500' }, 'Payable at Pharmacy Counter:'),
                h('div', { className: 'text-xl font-black text-slate-900' }, `₹${totalPrice.toFixed(2)}`)
              ),
              h('button', {
                onClick: handleConfirmReservation,
                className: 'px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition'
              }, 'Confirm & Hold Stock')
            )
          )
        )
      );
    };

    // 12. Add Medicine to Store Modal (For Pharmacy Owner)
    const renderAddMedicineModal = () => {
      if (!addMedicineModalOpen) return null;

      const currentPharmacy = store.pharmacies[0];
      const [selectedMedId, setSelectedMedId] = useState(store.medicines[0] ? store.medicines[0].id : '');
      const [quantity, setQuantity] = useState(15);
      const [batch, setBatch] = useState('WB-2026-X1');

      const handleAdd = () => {
        const med = store.medicines.find(m => m.id === selectedMedId);
        if (!med) return;

        const newInvItem = {
          id: `inv_${Date.now()}`,
          pharmacyId: currentPharmacy.id,
          medicineId: med.id,
          quantity: parseInt(quantity, 10),
          status: quantity >= 5 ? 'AVAILABLE' : quantity > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
          stockStatus: quantity >= 5 ? 'IN_STOCK' : quantity > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
          unitPrice: med.mrp,
          batchNumber: batch,
          rackLocation: 'Dispensing Rack B',
          confidence: 'PHARMACY_CONFIRMED',
          availabilityConfidence: 'PHARMACY_CONFIRMED',
          confidenceScore: 99,
          lastUpdated: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        persistStore({
          ...store,
          inventory: [newInvItem, ...store.inventory]
        });

        setAddMedicineModalOpen(false);
        showToast(`Added ${med.name} to pharmacy inventory!`);
      };

      return h('div', { className: 'modal-overlay' },
        h('div', { className: 'bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fade-in' },
          h('button', {
            onClick: () => setAddMedicineModalOpen(false),
            className: 'absolute top-5 right-5 text-slate-400 hover:text-slate-600'
          }, h(Icon, { name: 'x', className: 'w-5 h-5' })),

          h('h3', { className: 'text-lg font-bold text-slate-900 mb-1' }, 'Add Medicine to Store Inventory'),
          h('p', { className: 'text-xs text-slate-500 mb-4' }, 'Select an approved pharmaceutical SKU from master catalog.'),

          h('div', { className: 'space-y-4 text-xs' },
            h('div', null,
              h('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Select Medicine:'),
              h('select', {
                value: selectedMedId,
                onChange: (e) => setSelectedMedId(e.target.value),
                className: 'w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:outline-none'
              },
                store.medicines.map(m =>
                  h('option', { key: m.id, value: m.id }, `${m.name} (${m.dosageForm}) - ₹${m.mrp}`)
                )
              )
            ),
            h('div', null,
              h('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Initial Physical Pack Quantity:'),
              h('input', {
                type: 'number',
                value: quantity,
                onChange: (e) => setQuantity(e.target.value),
                min: 0,
                className: 'w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none'
              })
            ),
            h('div', null,
              h('label', { className: 'block font-bold text-slate-700 mb-1' }, 'Batch / Lot Number:'),
              h('input', {
                type: 'text',
                value: batch,
                onChange: (e) => setBatch(e.target.value),
                className: 'w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none'
              })
            ),
            h('button', {
              onClick: handleAdd,
              className: 'w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition mt-2'
            }, 'Confirm & Add to Shelf')
          )
        )
      );
    };

    // 13. Persistent Mandatory Medical Disclaimer Bar
    const renderMedicalDisclaimerBar = () => {
      return h('div', { className: 'medical-disclaimer-bar py-3 px-4 text-center' },
        h('div', { className: 'max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap text-slate-500' },
          h(Icon, { name: 'shieldCheck', className: 'w-4 h-4 text-slate-400 flex-shrink-0' }),
          h('span', null,
            h('strong', null, 'Medical Disclaimer: '),
            'MEDBRIDGE is an inventory discovery and reservation coordination tool. We do not sell drugs, diagnose conditions, or recommend medications. All prescription drugs require a valid doctor prescription presented at the licensed retail pharmacy.'
          )
        )
      );
    };

    // --- Main Layout Render ---
    return h('div', { className: 'min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans' },
      renderDemoBar(),
      renderNavbar(),

      // Notification Toast
      toastMessage && h('div', {
        className: 'fixed bottom-12 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-fade-in'
      },
        h(Icon, { name: 'checkCircle', className: 'w-4 h-4 text-emerald-400' }),
        h('span', null, toastMessage.text)
      ),

      // Screen router
      h('main', { className: 'flex-grow' },
        userRole === 'customer' && [
          activeTab === 'home' && renderCustomerHome(),
          activeTab === 'search' && renderSearchView(),
          activeTab === 'reservations' && renderCustomerReservations()
        ],
        userRole === 'pharmacy' && renderPharmacyDashboard(),
        userRole === 'admin' && renderAdminView()
      ),

      // Modals
      renderOcrModal(),
      renderUrlModal(),
      renderReserveModal(),
      renderAddMedicineModal(),

      // Persistent Regulatory Footer
      renderMedicalDisclaimerBar()
    );
  }

  // Mount React Application to #root
  const rootElement = document.getElementById('root');
  if (rootElement && window.ReactDOM) {
    if (window.ReactDOM.createRoot) {
      const root = window.ReactDOM.createRoot(rootElement);
      root.render(h(MedBridgeApp));
    } else {
      window.ReactDOM.render(h(MedBridgeApp), rootElement);
    }
  }
})();
'''

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_code)

print("Generated updated app.js with Confidence Engine successfully!")
