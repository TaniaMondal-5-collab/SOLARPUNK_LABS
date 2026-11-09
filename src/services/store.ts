// MEDBRIDGE - Central Reactive Store & Data Management Layer
// Supports LocalStorage Persistence, Concurrency Locking, and Live Event Subscriptions

import { 
  Medicine, 
  Pharmacy, 
  InventoryItem, 
  Reservation, 
  SearchHistoryItem, 
  PharmacyVerificationRequest,
  StockStatus,
  AvailabilityConfidence,
  UserProfile,
  UserRole
} from '../types';
import { 
  INITIAL_MEDICINES, 
  INITIAL_PHARMACIES, 
  INITIAL_INVENTORY, 
  INITIAL_RESERVATIONS, 
  INITIAL_VERIFICATION_REQUESTS 
} from '../data/mockData';

type Listener = () => void;

class MedBridgeStore {
  private medicines: Medicine[] = [];
  private pharmacies: Pharmacy[] = [];
  private inventory: InventoryItem[] = [];
  private reservations: Reservation[] = [];
  private searchHistory: SearchHistoryItem[] = [];
  private savedMedicineIds: Set<string> = new Set();
  private verificationRequests: PharmacyVerificationRequest[] = [];
  private currentUser: UserProfile;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.currentUser = {
      id: 'user_customer_rahul',
      name: 'Rahul Sen',
      email: 'customer@medbridge.health',
      role: 'customer',
      phone: '+91 98301 23456',
      location: {
        lat: 22.5867,
        lng: 88.4178,
        address: 'CA Block, Sector 1, Salt Lake City',
        city: 'Kolkata',
        pincode: '700064'
      },
      createdAt: '2026-10-15T10:00:00Z'
    };

    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedMeds = localStorage.getItem('mb_medicines');
      this.medicines = storedMeds ? JSON.parse(storedMeds) : [...INITIAL_MEDICINES];

      const storedPharms = localStorage.getItem('mb_pharmacies');
      this.pharmacies = storedPharms ? JSON.parse(storedPharms) : [...INITIAL_PHARMACIES];

      const storedInv = localStorage.getItem('mb_inventory');
      this.inventory = storedInv ? JSON.parse(storedInv) : [...INITIAL_INVENTORY];

      const storedRes = localStorage.getItem('mb_reservations');
      this.reservations = storedRes ? JSON.parse(storedRes) : [...INITIAL_RESERVATIONS];

      const storedVerif = localStorage.getItem('mb_verification_requests');
      this.verificationRequests = storedVerif ? JSON.parse(storedVerif) : [...INITIAL_VERIFICATION_REQUESTS];

      const storedHistory = localStorage.getItem('mb_search_history');
      this.searchHistory = storedHistory ? JSON.parse(storedHistory) : [
        { id: 'sh_1', query: 'Augmentin 625 Duo', searchType: 'TEXT', medicineId: 'med_aug625', medicineName: 'Augmentin 625 Duo', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 'sh_2', query: 'Glycomet-GP 2', searchType: 'TEXT', medicineId: 'med_gly2', medicineName: 'Glycomet-GP 2 Tablet PR', timestamp: new Date(Date.now() - 86400000).toISOString() }
      ];

      const storedSaved = localStorage.getItem('mb_saved_medicines');
      this.savedMedicineIds = storedSaved ? new Set(JSON.parse(storedSaved)) : new Set(['med_gly2', 'med_telma40']);

      const storedUser = localStorage.getItem('mb_current_user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (e) {
      console.warn('MedBridgeStore: Storage load fallback', e);
      this.medicines = [...INITIAL_MEDICINES];
      this.pharmacies = [...INITIAL_PHARMACIES];
      this.inventory = [...INITIAL_INVENTORY];
      this.reservations = [...INITIAL_RESERVATIONS];
      this.verificationRequests = [...INITIAL_VERIFICATION_REQUESTS];
      this.savedMedicineIds = new Set(['med_gly2']);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('mb_medicines', JSON.stringify(this.medicines));
      localStorage.setItem('mb_pharmacies', JSON.stringify(this.pharmacies));
      localStorage.setItem('mb_inventory', JSON.stringify(this.inventory));
      localStorage.setItem('mb_reservations', JSON.stringify(this.reservations));
      localStorage.setItem('mb_verification_requests', JSON.stringify(this.verificationRequests));
      localStorage.setItem('mb_search_history', JSON.stringify(this.searchHistory));
      localStorage.setItem('mb_saved_medicines', JSON.stringify(Array.from(this.savedMedicineIds)));
      localStorage.setItem('mb_current_user', JSON.stringify(this.currentUser));
    } catch (e) {
      console.warn('MedBridgeStore: Failed saving to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => {
      try { fn(); } catch (e) { console.error(e); }
    });
  }

  // --- USER & ROLE SWITCHING (Demo Mode) ---
  public getCurrentUser(): UserProfile {
    return { ...this.currentUser };
  }

  public switchRole(role: UserRole, targetPharmacyId?: string) {
    if (role === 'customer') {
      this.currentUser = {
        id: 'user_customer_rahul',
        name: 'Rahul Sen',
        email: 'customer@medbridge.health',
        role: 'customer',
        phone: '+91 98301 23456',
        location: {
          lat: 22.5867,
          lng: 88.4178,
          address: 'CA Block, Sector 1, Salt Lake City',
          city: 'Kolkata',
          pincode: '700064'
        },
        createdAt: '2026-10-15T10:00:00Z'
      };
    } else if (role === 'pharmacy') {
      const pId = targetPharmacyId || 'pharmacy_frank_ross_saltlake';
      const pharmacy = this.getPharmacyById(pId) || this.pharmacies[0];
      this.currentUser = {
        id: 'user_pharmacist_subhasis',
        name: 'Subhasis Roy',
        email: 'pharmacist@frankross.com',
        role: 'pharmacy',
        pharmacyId: pharmacy.id,
        phone: pharmacy.phone,
        location: {
          lat: pharmacy.lat,
          lng: pharmacy.lng,
          address: pharmacy.address,
          city: pharmacy.city,
          pincode: pharmacy.pincode
        },
        createdAt: '2026-08-01T10:00:00Z'
      };
    } else if (role === 'admin') {
      this.currentUser = {
        id: 'user_admin_ops',
        name: 'RedZone Admin',
        email: 'admin@medbridge.health',
        role: 'admin',
        phone: '+91 98300 00000',
        createdAt: '2026-01-01T00:00:00Z'
      };
    }
    this.saveToStorage();
  }

  public updateUserLocation(address: string, city: string, pincode: string, lat: number, lng: number) {
    if (this.currentUser.location) {
      this.currentUser.location = { address, city, pincode, lat, lng };
    } else {
      this.currentUser.location = { address, city, pincode, lat, lng };
    }
    this.saveToStorage();
  }

  // --- MEDICINES ---
  public getMedicines(): Medicine[] {
    return [...this.medicines];
  }

  public getMedicineById(id: string): Medicine | undefined {
    return this.medicines.find(m => m.id === id);
  }

  public searchMedicines(query: string, category?: string): Medicine[] {
    const q = query.trim().toLowerCase();
    return this.medicines.filter(m => {
      const matchesQuery = !q || 
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.strength.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q);
      const matchesCategory = !category || category === 'All' || m.category.toLowerCase().includes(category.toLowerCase());
      return matchesQuery && matchesCategory;
    });
  }

  // --- PHARMACIES ---
  public getPharmacies(): Pharmacy[] {
    return [...this.pharmacies];
  }

  public getPharmacyById(id: string): Pharmacy | undefined {
    return this.pharmacies.find(p => p.id === id);
  }

  // --- INVENTORY & AVAILABILITY ---
  public getInventory(): InventoryItem[] {
    return [...this.inventory];
  }

  public getInventoryByPharmacy(pharmacyId: string): (InventoryItem & { medicine: Medicine })[] {
    return this.inventory
      .filter(item => item.pharmacyId === pharmacyId)
      .map(item => {
        const med = this.getMedicineById(item.medicineId)!;
        return { ...item, medicine: med };
      })
      .filter(item => !!item.medicine);
  }

  public getInventoryForMedicine(medicineId: string): (InventoryItem & { pharmacy: Pharmacy })[] {
    return this.inventory
      .filter(item => item.medicineId === medicineId)
      .map(item => {
        const pharm = this.getPharmacyById(item.pharmacyId)!;
        return { ...item, pharmacy: pharm };
      })
      .filter(item => !!item.pharmacy);
  }

  // Calculate Smart Availability Confidence
  public calculateConfidence(lastUpdatedIso: string, isConfirmedByStaff: boolean): { confidence: AvailabilityConfidence; reason: string } {
    const diffHours = (Date.now() - new Date(lastUpdatedIso).getTime()) / (1000 * 3600);
    if (isConfirmedByStaff && diffHours <= 4) {
      return {
        confidence: 'PHARMACY_CONFIRMED',
        reason: 'The pharmacy staff explicitly verified stock within the last 4 hours.'
      };
    } else if (diffHours <= 24) {
      return {
        confidence: 'RECENTLY_UPDATED',
        reason: 'Stock record was updated within the last 24 hours.'
      };
    } else if (diffHours > 24) {
      return {
        confidence: 'OUTDATED',
        reason: 'Last inventory update was more than 24 hours ago. Fast-moving items may be sold out.'
      };
    } else {
      return {
        confidence: 'UNVERIFIED',
        reason: 'Pharmacy location is registered, but on-shelf inventory has not been confirmed.'
      };
    }
  }

  public updateStock(inventoryId: string, quantity: number, status: StockStatus, unitPrice?: number) {
    const idx = this.inventory.findIndex(i => i.id === inventoryId);
    if (idx === -1) return false;

    const safeQty = Math.max(0, quantity);
    const calculatedStatus: StockStatus = safeQty === 0 ? 'OUT_OF_STOCK' : (safeQty <= 5 ? 'LOW_STOCK' : status);
    const { confidence, reason } = this.calculateConfidence(new Date().toISOString(), true);

    this.inventory[idx] = {
      ...this.inventory[idx],
      quantity: safeQty,
      status: calculatedStatus,
      unitPrice: unitPrice !== undefined ? unitPrice : this.inventory[idx].unitPrice,
      lastUpdated: new Date().toISOString(),
      confidence,
      confidenceReason: reason,
      provenance: 'PHARMACY CONFIRMED',
      updatedBy: this.currentUser.id
    };

    this.saveToStorage();
    return true;
  }

  public addInventoryItem(pharmacyId: string, medicineId: string, quantity: number, unitPrice: number, batchNumber: string, expiryDate: string): boolean {
    // Check if already exists in this pharmacy
    const existing = this.inventory.find(i => i.pharmacyId === pharmacyId && i.medicineId === medicineId);
    if (existing) {
      return this.updateStock(existing.id, existing.quantity + quantity, 'AVAILABLE', unitPrice);
    }

    const { confidence, reason } = this.calculateConfidence(new Date().toISOString(), true);
    const newItem: InventoryItem = {
      id: `inv_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      pharmacyId,
      medicineId,
      quantity: Math.max(0, quantity),
      unitPrice,
      batchNumber: batchNumber || 'BATCH26A01',
      expiryDate: expiryDate || '2028-12-31',
      status: quantity > 5 ? 'AVAILABLE' : (quantity > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK'),
      confidence,
      confidenceReason: reason,
      provenance: 'PHARMACY CONFIRMED',
      lastUpdated: new Date().toISOString(),
      updatedBy: this.currentUser.id
    };

    this.inventory.unshift(newItem);
    this.saveToStorage();
    return true;
  }

  // --- RESERVATION MANAGEMENT & SAFE CONCURRENCY ---
  public getReservations(): Reservation[] {
    return [...this.reservations];
  }

  public getCustomerReservations(customerId: string): Reservation[] {
    return this.reservations.filter(r => r.customerId === customerId);
  }

  public getPharmacyReservations(pharmacyId: string): Reservation[] {
    return this.reservations.filter(r => r.pharmacyId === pharmacyId);
  }

  public createReservation(params: {
    pharmacyId: string;
    medicineId: string;
    quantity: number;
    customerNotes?: string;
    prescriptionFileName?: string;
  }): { success: boolean; message: string; reservation?: Reservation } {
    const { pharmacyId, medicineId, quantity, customerNotes, prescriptionFileName } = params;
    const med = this.getMedicineById(medicineId);
    const pharm = this.getPharmacyById(pharmacyId);
    if (!med || !pharm) {
      return { success: false, message: 'Invalid medicine or pharmacy' };
    }

    // Concurrency / Available Units Check
    const invItem = this.inventory.find(i => i.pharmacyId === pharmacyId && i.medicineId === medicineId);
    if (!invItem || invItem.quantity < quantity || invItem.status === 'OUT_OF_STOCK') {
      return { 
        success: false, 
        message: 'The requested quantity is no longer available at this store. Please check nearby alternatives.' 
      };
    }

    // Check for duplicate active reservation by same customer for same medicine at same pharmacy
    const existingActive = this.reservations.find(
      r => r.customerId === this.currentUser.id &&
           r.pharmacyId === pharmacyId &&
           r.medicineId === medicineId &&
           (r.status === 'PENDING' || r.status === 'ACCEPTED' || r.status === 'READY_FOR_PICKUP')
    );

    if (existingActive) {
      return {
        success: false,
        message: 'You already have an active reservation for this medicine at this pharmacy.'
      };
    }

    // Safely hold quantity in inventory
    invItem.quantity = Math.max(0, invItem.quantity - quantity);
    if (invItem.quantity === 0) {
      invItem.status = 'OUT_OF_STOCK';
    } else if (invItem.quantity <= 5) {
      invItem.status = 'LOW_STOCK';
    }

    const newRes: Reservation = {
      id: `res_${Date.now()}`,
      customerId: this.currentUser.id,
      customerName: this.currentUser.name,
      customerPhone: this.currentUser.phone || '+91 98301 23456',
      pharmacyId: pharm.id,
      pharmacyName: pharm.name,
      pharmacyAddress: pharm.address,
      pharmacyPhone: pharm.phone,
      medicineId: med.id,
      medicineName: med.name,
      strength: med.strength,
      dosageForm: med.dosageForm,
      quantity,
      unitPrice: invItem.unitPrice,
      totalPrice: +(invItem.unitPrice * quantity).toFixed(2),
      status: 'PENDING',
      prescriptionRequired: med.isRx,
      prescriptionUploaded: !!prescriptionFileName,
      prescriptionFileName,
      pickupWindow: 'Awaiting pharmacy confirmation (held for 2 hours once accepted)',
      customerNotes,
      timeline: [
        {
          status: 'PENDING',
          timestamp: new Date().toISOString(),
          note: 'Reservation request submitted by customer.',
          actor: 'CUSTOMER'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.reservations.unshift(newRes);
    this.saveToStorage();
    return { success: true, message: 'Reservation request sent to pharmacy!', reservation: newRes };
  }

  public acceptReservation(reservationId: string, pickupWindow: string, pharmacyNotes?: string): boolean {
    const res = this.reservations.find(r => r.id === reservationId);
    if (!res || res.status !== 'PENDING') return false;

    res.status = 'ACCEPTED';
    res.pickupWindow = pickupWindow || 'Ready for collection today. Held until 8:00 PM.';
    res.pharmacyNotes = pharmacyNotes;
    res.updatedAt = new Date().toISOString();
    res.timeline.push({
      status: 'ACCEPTED',
      timestamp: new Date().toISOString(),
      note: `Reservation confirmed by pharmacy staff. ${pharmacyNotes ? `Note: ${pharmacyNotes}` : ''}`,
      actor: 'PHARMACY'
    });

    this.saveToStorage();
    return true;
  }

  public rejectReservation(reservationId: string, rejectionReason: string): boolean {
    const res = this.reservations.find(r => r.id === reservationId);
    if (!res || res.status !== 'PENDING') return false;

    // Release held inventory back
    const inv = this.inventory.find(i => i.pharmacyId === res.pharmacyId && i.medicineId === res.medicineId);
    if (inv) {
      inv.quantity += res.quantity;
      if (inv.quantity > 5) inv.status = 'AVAILABLE';
      else if (inv.quantity > 0) inv.status = 'LOW_STOCK';
    }

    res.status = 'REJECTED';
    res.rejectionReason = rejectionReason || 'Item damaged or temporarily unavailable on shelf.';
    res.updatedAt = new Date().toISOString();
    res.timeline.push({
      status: 'REJECTED',
      timestamp: new Date().toISOString(),
      note: `Reservation declined by pharmacy: ${rejectionReason}`,
      actor: 'PHARMACY'
    });

    this.saveToStorage();
    return true;
  }

  public cancelReservation(reservationId: string): boolean {
    const res = this.reservations.find(r => r.id === reservationId);
    if (!res || (res.status !== 'PENDING' && res.status !== 'ACCEPTED')) return false;

    // Release held inventory back
    const inv = this.inventory.find(i => i.pharmacyId === res.pharmacyId && i.medicineId === res.medicineId);
    if (inv) {
      inv.quantity += res.quantity;
      if (inv.quantity > 5) inv.status = 'AVAILABLE';
      else if (inv.quantity > 0) inv.status = 'LOW_STOCK';
    }

    res.status = 'CANCELLED';
    res.updatedAt = new Date().toISOString();
    res.timeline.push({
      status: 'CANCELLED',
      timestamp: new Date().toISOString(),
      note: 'Reservation cancelled by customer.',
      actor: 'CUSTOMER'
    });

    this.saveToStorage();
    return true;
  }

  public markCollected(reservationId: string): boolean {
    const res = this.reservations.find(r => r.id === reservationId);
    if (!res || (res.status !== 'ACCEPTED' && res.status !== 'READY_FOR_PICKUP')) return false;

    res.status = 'COLLECTED';
    res.updatedAt = new Date().toISOString();
    res.timeline.push({
      status: 'COLLECTED',
      timestamp: new Date().toISOString(),
      note: 'Customer physically visited store and collected medicine.',
      actor: 'PHARMACY'
    });

    this.saveToStorage();
    return true;
  }

  // --- SEARCH HISTORY & SAVED MEDICINES ---
  public getSearchHistory(): SearchHistoryItem[] {
    return [...this.searchHistory];
  }

  public addSearchHistory(query: string, searchType: 'TEXT' | 'IMAGE' | 'URL', medicineId?: string, medicineName?: string) {
    if (!query) return;
    const item: SearchHistoryItem = {
      id: `sh_${Date.now()}`,
      query,
      searchType,
      medicineId,
      medicineName,
      timestamp: new Date().toISOString()
    };
    // remove duplicates of same query
    this.searchHistory = [item, ...this.searchHistory.filter(h => h.query.toLowerCase() !== query.toLowerCase())].slice(0, 15);
    this.saveToStorage();
  }

  public clearSearchHistory() {
    this.searchHistory = [];
    this.saveToStorage();
  }

  public getSavedMedicineIds(): string[] {
    return Array.from(this.savedMedicineIds);
  }

  public toggleSaveMedicine(medicineId: string): boolean {
    if (this.savedMedicineIds.has(medicineId)) {
      this.savedMedicineIds.delete(medicineId);
    } else {
      this.savedMedicineIds.add(medicineId);
    }
    this.saveToStorage();
    return this.savedMedicineIds.has(medicineId);
  }

  // --- ADMIN VERIFICATION REQUESTS ---
  public getVerificationRequests(): PharmacyVerificationRequest[] {
    return [...this.verificationRequests];
  }

  public approvePharmacy(requestId: string): boolean {
    const req = this.verificationRequests.find(r => r.id === requestId);
    if (!req) return false;
    req.status = 'APPROVED';
    req.reviewedAt = new Date().toISOString();

    const pharm = this.pharmacies.find(p => p.id === req.pharmacyId);
    if (pharm) {
      pharm.isVerified = true;
      pharm.verificationStatus = 'VERIFIED';
    }

    this.saveToStorage();
    return true;
  }

  public rejectPharmacy(requestId: string, notes: string): boolean {
    const req = this.verificationRequests.find(r => r.id === requestId);
    if (!req) return false;
    req.status = 'REJECTED';
    req.reviewNotes = notes;
    req.reviewedAt = new Date().toISOString();

    const pharm = this.pharmacies.find(p => p.id === req.pharmacyId);
    if (pharm) {
      pharm.isVerified = false;
      pharm.verificationStatus = 'REJECTED';
    }

    this.saveToStorage();
    return true;
  }

  // Reset to initial demo state
  public resetToDemoData() {
    this.medicines = [...INITIAL_MEDICINES];
    this.pharmacies = [...INITIAL_PHARMACIES];
    this.inventory = [...INITIAL_INVENTORY];
    this.reservations = [...INITIAL_RESERVATIONS];
    this.verificationRequests = [...INITIAL_VERIFICATION_REQUESTS];
    this.savedMedicineIds = new Set(['med_gly2', 'med_telma40']);
    this.searchHistory = [
      { id: 'sh_1', query: 'Augmentin 625 Duo', searchType: 'TEXT', medicineId: 'med_aug625', medicineName: 'Augmentin 625 Duo', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'sh_2', query: 'Glycomet-GP 2', searchType: 'TEXT', medicineId: 'med_gly2', medicineName: 'Glycomet-GP 2 Tablet PR', timestamp: new Date(Date.now() - 86400000).toISOString() }
    ];
    this.saveToStorage();
  }
}

export const store = new MedBridgeStore();

