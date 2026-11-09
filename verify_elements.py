with open("test_output.html", "r", encoding="utf-8") as f:
    html = f.read()

checks = [
    ("MEDBRIDGE Brand", "MEDBRIDGE"),
    ("Kolkata Network Pill", "Kolkata"),
    ("Hackathon Demo Pill", "HACKATHON DEMO"),
    ("Customer Role Switcher", "Customer (Rahul Sen)"),
    ("Pharmacy Role Switcher", "Pharmacy (Frank Ross)"),
    ("Admin Role Switcher", "Admin (RedZone Ops)"),
    ("Hero Title", "Find Your Prescribed Medicines."),
    ("Hero Subtitle", "Check Live Stock Before You Go."),
    ("AI Box Scan Button", "AI Box Scan"),
    ("Paste Link Button", "Paste Link"),
    ("Search Button", "Search"),
    ("Verified Kolkata Pharmacies", "Verified Kolkata Pharmacies"),
    ("Medicines Tracked", "Medicines Tracked"),
    ("3-Step Workflow", "How MedBridge Protects Your Time"),
    ("Confidence Engine", "Core Innovation: MedBridge Confidence Engine"),
    ("Pharmacist Confirmed Tier", "Pharmacy Confirmed"),
    ("Recently Updated Tier", "Recently Updated"),
    ("Tracked Medicines in Kolkata", "Tracked Medicines in Kolkata Network"),
    ("Augmentin 625 Duo", "Augmentin 625 Duo"),
    ("Glycomet-GP 2", "Glycomet-GP 2"),
    ("Telma 40", "Telma 40"),
    ("Pan 40", "Pan 40"),
    ("Medical Disclaimer", "Medical Disclaimer: MEDBRIDGE is an inventory discovery")
]

passed = 0
for name, query in checks:
    if query in html:
        print(f"[OK] {name}")
        passed += 1
    else:
        print(f"[FAIL] {name} (Missing: {query})")

print(f"\nVerification Results: {passed}/{len(checks)} passed.")

