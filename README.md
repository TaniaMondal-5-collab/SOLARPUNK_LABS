# MEDBRIDGE 🏥
### Real-Time Medicine Availability & Retail Pharmacy Coordination Platform
> *"Find Medicines. Connect Pharmacies. Save Time."*

Built by **RED ZONE_DevOps** & **Quantum_Neurons** for the **Generative AI Clash Hackathon** at **Techno India University** (21 November 2026).

---

## 🚀 Executive Summary & Problem Statement

In Indian metropolitan hubs like Kolkata, patients and caregivers face the **"3-Pharmacy Commute Nightmare"**: during acute medical situations, they spend 2 to 4 stressful hours physically traveling from one pharmacy to another, often hearing *"Stock nei"* (Out of stock) for critical prescribed medicines like *Augmentin 625 Duo*, *Telma 40*, or *Glycomet-GP 2*.

- **Why Google Maps Fails**: Maps tell you if a pharmacy is geographically open, but have **zero visibility** into whether life-saving medications are in stock.
- **Why E-Commerce Apps Fail**: 24-48 hour delivery is too slow for acute antibiotics, cardiac therapies, or inhalers; quick-commerce dark stores carry only limited FMCG OTC inventory.
- **Why Calling Fails**: Pharmacy phone lines are perpetually busy with counter customers during peak hours.

**MEDBRIDGE bridges this critical healthcare gap** by connecting customers with nearby licensed community pharmacies, reporting verified stock availability before stepping out of home, and enabling guaranteed 2-hour in-store pickup reservations.

---

## 🌟 Core Innovations & Key Features

### 1. 🛡️ MedBridge Confidence Engine™
Unlike static databases that display stale stock counts, MedBridge assigns every reported inventory level an auditable **Confidence Badge**:
- **✓ Pharmacist Confirmed (`CONFIRMED < 4H`)**: Manually verified by the registered pharmacist on duty within the last 4 hours (100% certainty).
- **• Stock Sync (`UPDATED < 24H`)**: Synchronized via pharmacy POS billing systems or daily batch uploads within 24 hours.
- **▲ Outdated (`UPDATED > 48H`)**: Stock has not been verified recently; in-store hold reservation is recommended.
- **? Unverified**: Estimated via historical dispensing velocity; requires confirmation.

### 2. 📍 Smart Alternative Location Finder
When the nearest pharmacy is out of stock or low on inventory, MedBridge's routing engine automatically scans the Kolkata network, identifying verified stores in adjacent blocks (e.g., Salt Lake vs. New Town vs. Gariahat) with confirmed stock and estimated driving times.

### 3. 🔍 3-in-1 Multi-Modal Search
1. **Text & Generic Salt Search**: Real-time autocomplete matching brand names (*Augmentin*, *Pan 40*) and active ingredients (*Amoxicillin + Clavulanic Acid*, *Pantoprazole*).
2. **AI Medicine Packaging OCR (Gemini Vision)**: Upload a photo of a medicine box or blister strip. MedBridge runs OCR text segmentation to detect active salts and dosage, presenting a clinical review verification step before initiating search.
3. **Paste Product URL Parser**: Paste links from 1mg, Netmeds, or Apollo Pharmacy; MedBridge automatically parses the drug composition and locates it in local retail pharmacies.

### 4. 🔒 Concurrency-Protected In-Store Reservation
Customers can lock up to 5 packs behind the counter for 2 hours while commuting to the store. The inventory is temporarily locked, preventing other customers from claiming the last pack before arrival.

### 5. 🗺️ Interactive Kolkata Leaflet Map
View verified retail pharmacies (Frank Ross, Apollo, MedPlus, Dey's Medical) color-coded by stock level:
- 🟢 **Green Pin**: In Stock (≥ 5 packs)
- 🟡 **Amber Pin**: Low Stock (1–4 packs)
- 🔴 **Red Pin**: Out of Stock (0 packs)

### 6. 💼 Pharmacist Management Dashboard (CRUD)
- Live stock adjustments (`+` / `-`) with immediate audit logging.
- 1-Click "Verify Stock Now" button to refresh freshness timestamps.
- Manage incoming customer reservations (Accept & Hold, Mark Ready, Confirm Dispensation).
- Visual SVG analytics on stock health and pickup reliability.

### 7. ⚖️ Platform Admin & Drug License Verification
- Review retail pharmacy onboarding requests.
- Inspect official Drug Licenses (Form 20B/21B), GSTIN, and Pharmacist Registration certificates.
- Approve/Reject retail pharmacies to activate public search listings.

---

## 🎭 1-Click Hackathon Demo Switcher

At the top of the interface, a persistent **Demo Switcher Bar** allows hackathon judges to immediately test all roles without sign-up or complex credentials:

| Role | Persona | Key Capabilities to Test |
|---|---|---|
| **Customer** | **Rahul Sen** (Salt Lake Sector 1, CA Block) | Search medicines, test AI box scan, view distance & confidence, place in-store reservation, track multi-step status. |
| **Pharmacy** | **Frank Ross Pharmacy** (Subhasis Roy, Pharmacist) | Adjust physical stock (+/-), verify audit timestamp, accept customer holds, mark ready for pickup, confirm counter collection. |
| **Admin** | **RedZone Ops Administrator** | Review pending retail pharmacy onboarding (Dey's Medical Store), inspect drug licenses, view platform telemetry, reset demo data. |

> **Location Switcher**: Judges can toggle simulated customer location between **Salt Lake Sector 1 (700064)**, **Sector 2 (700091)**, **New Town (700156)**, **Gariahat (700019)**, and **Shyambazar (700004)** to observe dynamic Haversine distance recalculations.

---

## 🛠️ Technology Stack & Architecture

- **Frontend Core**: React 18 (Component architecture, hooks, optimized rendering).
- **Styling & UI**: Tailwind CSS (JIT compilation), custom fintech/healthcare SaaS design system (`styles.css`), Plus Jakarta Sans typography.
- **Mapping & Geolocation**: Leaflet.js with OpenStreetMap tiles, custom SVG markers, Haversine formula calculation.
- **Icons**: Lucide vector icons.
- **Backend & Persistence**:
  - Cloud Firestore Security Rules (`firestore.rules` with strict RBAC, domain validation, and least-privilege customer PII protection).
  - Reactive LocalStorage State Layer with publish/subscribe event dispatcher for zero-latency offline demo execution.
- **AI Vision Pipeline**: Google Gemini Vision API / Cloud OCR schema with client-side clinical verification review.
- **DevOps & Verification**: Headless Chromium DOM testing suite, Python runner (`run_app.py`).

---

## 🚦 Quickstart: Run Locally

### Zero-Build Instant Execution
No `npm install` or Node build step required. The application uses bundled production libraries and standard browser ES standards:

```bash
# 1. Clone repository
git clone https://github.com/TaniaMondal-5-collab/SOLARPUNK_LABS.git
cd "SOLARPUNK_LABS"

# 2. Launch application server
python run_app.py
```

Your default web browser will automatically open:
```
http://localhost:8000/index.html
```

---

## 🧪 3-Minute Hackathon Judging Walkthrough

1. **Step 1: Search & Discover**
   - Click the search bar on the landing page or type **"Augmentin"**.
   - Notice the autocomplete suggestions showing generic composition (*Amoxicillin + Clavulanate*).
   - Click **Augmentin 625 Duo** to open the Availability Catalog.
2. **Step 2: Observe Confidence & Alternatives**
   - Notice the **✓ Pharmacist Confirmed** and **• Stock Sync** badges with exact distance from your Salt Lake location.
   - Toggle between **List View** and **Map View** to see color-coded pins across Kolkata.
3. **Step 3: Reserve a Pack**
   - Click **"Reserve for In-Store Pickup"** on Frank Ross Pharmacy.
   - Choose 2 packs, select "Within 2 Hours", and confirm.
   - Note the reservation code (e.g., `MB-RES-94218`). The pack is now concurrency-locked!
4. **Step 4: Switch to Pharmacy Portal**
   - In the top demo bar, switch to **"Pharmacy (Frank Ross)"**.
   - Notice the badge on **Incoming Queue (1)**.
   - Click **"Accept & Hold Pack"** and then **"Mark Ready for Pickup"**.
   - In **Inventory CRUD**, adjust quantity using `+`/`-` or click **"Verify Now"**.
5. **Step 5: Verify Live State Synchronization**
   - Switch back to **"Customer (Rahul Sen)"** and navigate to **"My Reservations"**.
   - See the 4-step progress stepper updated live to **"Ready for Pickup"**.
6. **Step 6: AI Box Scan & Admin Review**
   - Go to Home, click **"AI Box Scan"**, pick **"Augmentin 625 Duo Box"**, and verify the clinical confirmation modal.
   - Switch to **"Admin (RedZone Ops)"** and approve **Dey's Medical Store** after reviewing their uploaded Form 20B license.

---

## ⚖️ Regulatory & Medical Safety Compliance

> **[!IMPORTANT] Critical Medical Safeguards:**
> - **Zero Diagnosis**: MedBridge never diagnoses symptoms or recommends prescription medicines.
> - **Prescription Enforcement**: Every Schedule H/H1 prescription drug requires a valid physical prescription presented at the licensed retail pharmacy counter prior to dispensing.
> - **Regulatory Compliance**: Designed in accordance with the **Drugs and Cosmetics Act, 1940** and **Drugs and Cosmetics Rules, 1945 (Rule 65 & Form 20B/21B)** under Indian pharmaceutical regulations.

---

## 👥 RedZone DevOps & Quantum_Neurons Team

- **Product Architecture & UI/UX**: RED ZONE_DevOps
- **AI Integrations & Data Modeling**: Quantum_Neurons
- **Event**: Generative AI Clash 2026, Techno India University, Kolkata

*MEDBRIDGE — Find Medicines. Connect Pharmacies. Save Time.*
