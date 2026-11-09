// MEDBRIDGE - Healthcare Technology Platform
// Domain TypeScript Types & Interfaces

export type UserRole = 'customer' | 'pharmacy' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    pincode: string;
  };
  pharmacyId?: string; // If user is pharmacy owner / staff
  createdAt: string;
}

export type DosageForm = 
  | 'Tablet' 
  | 'Capsule' 
  | 'Syrup' 
  | 'Injection' 
  | 'Inhaler' 
  | 'Drops' 
  | 'Ointment' 
  | 'Suspension'
  | 'Powder';

export interface Medicine {
  id: string;
  name: string; // e.g. "Augmentin 625 Duo"
  brand: string; // e.g. "GlaxoSmithKline"
  genericName: string; // e.g. "Amoxicillin and Potassium Clavulanate"
  strength: string; // e.g. "500mg + 125mg"
  dosageForm: DosageForm;
  packSize: string; // e.g. "Strip of 10 tablets"
  category: string; // e.g. "Antibiotics", "Diabetes", "Cardiac", "Pain Relief"
  isRx: boolean; // Prescription Required (Schedule H / X)
  mrp: number; // Approximate MRP in INR
  description: string;
  storageCondition?: string; // e.g. "Store below 25°C in a dry place"
  imageUrl?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  chain: 'Frank Ross' | 'Apollo Pharmacy' | 'MedPlus' | 'Lifeline Pharmacy' | 'Independent';
  address: string;
  area: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  phone: string;
  email?: string;
  openingHours: string; // e.g. "8:00 AM - 10:30 PM"
  is24x7: boolean;
  isVerified: boolean;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  licenseNumber?: string;
  rating?: number;
  deliveryAvailable?: boolean;
}

export type StockStatus = 
  | 'AVAILABLE' 
  | 'LOW_STOCK' 
  | 'OUT_OF_STOCK' 
  | 'UNCONFIRMED';

export type AvailabilityConfidence = 
  | 'PHARMACY_CONFIRMED'  // Verified by staff within 4 hours
  | 'RECENTLY_UPDATED'    // Updated within 24 hours
  | 'OUTDATED'            // > 24 hours since last update
  | 'UNVERIFIED';         // Store discovered, inventory not confirmed

export type ProvenanceTag = 
  | 'LIVE PARTNER UPDATE'
  | 'PHARMACY CONFIRMED'
  | 'RECENTLY UPDATED'
  | 'DEMO INVENTORY'
  | 'NOT VERIFIED';

export interface InventoryItem {
  id: string;
  pharmacyId: string;
  medicineId: string;
  quantity: number;
  unitPrice: number;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  status: StockStatus;
  confidence: AvailabilityConfidence;
  confidenceReason: string;
  provenance: ProvenanceTag;
  lastUpdated: string; // ISO 8601 string
  updatedBy: string; // Staff user id
}

export type ReservationStatus = 
  | 'PENDING' 
  | 'ACCEPTED' 
  | 'READY_FOR_PICKUP' 
  | 'COLLECTED' 
  | 'REJECTED' 
  | 'CANCELLED' 
  | 'EXPIRED';

export interface ReservationTimelineEvent {
  status: ReservationStatus;
  timestamp: string;
  note: string;
  actor: 'CUSTOMER' | 'PHARMACY' | 'SYSTEM';
}

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyPhone: string;
  medicineId: string;
  medicineName: string;
  strength: string;
  dosageForm: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: ReservationStatus;
  prescriptionRequired: boolean;
  prescriptionUploaded?: boolean;
  prescriptionFileName?: string;
  pickupWindow?: string;
  customerNotes?: string;
  pharmacyNotes?: string;
  rejectionReason?: string;
  timeline: ReservationTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  searchType: 'TEXT' | 'IMAGE' | 'URL';
  medicineId?: string;
  medicineName?: string;
  timestamp: string;
}

export interface PharmacyVerificationRequest {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  ownerName: string;
  email: string;
  phone: string;
  drugLicenseNumber: string;
  gstin: string;
  address: string;
  city: string;
  pincode: string;
  documentName: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewNotes?: string;
  reviewedAt?: string;
}

export interface InventoryUpdateLog {
  id: string;
  pharmacyId: string;
  medicineId: string;
  medicineName: string;
  previousQuantity: number;
  newQuantity: number;
  previousStatus: StockStatus;
  newStatus: StockStatus;
  timestamp: string;
  updatedBy: string;
  action: 'UPDATE_STOCK' | 'ADD_MEDICINE' | 'RESERVATION_HOLD' | 'RESERVATION_RELEASE' | 'RESERVATION_COLLECT';
}

