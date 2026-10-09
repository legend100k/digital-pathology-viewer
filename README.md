# PathoView Studio — Digital Pathology Whole Slide Viewer (WSI)

A clinical-grade, modern, and ergonomic web-based Digital Pathology Viewer designed specifically for pathologists, reviewers, and researchers to navigate, inspect, compare, and annotate gigapixel Whole Slide Images (WSI) with sub-micron precision.

Built strictly according to the **Digital Pathology Viewer Business Requirements Document (BRD)**.

---

## 🌟 Key Capabilities & Features

### 1. Whole Slide Viewer (FR-001, FR-002, FR-003, FR-004, FR-005)
- **Deep Zoom & Pan**: Continuous smooth zoom from macro whole slide overview (1.25x) down to 40x cellular resolution.
- **Objective Magnification Pills**: Instant jump to clinical microscope standards: `1.25x (Macro)`, `2.5x (Scanning)`, `5x (Low Power)`, `10x (Intermediate)`, `20x (High Power)`, and `40x (Oil/Cellular)`.
- **Calibrated Scale Bar**: Real-time physical distance indicator dynamically calibrated to the slide's resolution (e.g. \(50\,\mu\text{m}\), \(100\,\mu\text{m}\), \(500\,\mu\text{m}\), \(1\,\text{mm}\)).
- **Minimap / Thumbnail Navigator**: Interactive overview box in bottom-right corner showing full macro specimen with red field-of-view bounding box; click or drag to reposition viewport instantly.
- **Rotation**: 90° clockwise and counter-clockwise rotation plus continuous rotation tracking.
- **Full Screen Mode**: Full-screen microscope viewing mode (toggle with button or F11).

### 2. Annotation & Quantitative Markings Suite (FR-006, FR-007)
- **Point / Pin Marker (`P`)**: Mark mitotic figures, calcifications, or single cells with count tracking.
- **Rectangle Bounding Box (`R`)**: Draw rectangular regions with live width, height, and area calculations in \(\mu\text{m}\) and \(\mu\text{m}^2\).
- **Polygon Perimeter (`L`)**: Multi-vertex area tracing for complex anatomical borders.
- **Freehand Contour (`F`)**: Organic pencil tool for tracing tumor invasion margins, necrotic foci, and desmoplasia.
- **Calibrated Ruler (`M`)**: Precise point-to-point measurement of surgical clearance margins and tumor dimensions.
- **Clinical Taxonomy Colors**:
  - Malignant / Invasive (Crimson Red `#EF4444`)
  - Suspicious / Atypical (Amber Yellow `#F59E0B`)
  - Benign / Normal (Emerald Green `#10B981`)
  - Mitotic Figure (Golden Yellow `#EAB308`)
  - Necrosis / Infarction (Deep Violet `#8B5CF6`)
  - Stroma / Desmoplasia (Sky Cyan `#06B6D4`)
- **Annotation Management**:
  - Filter by category and search by label or clinical notes.
  - Show / hide individual annotations or bulk toggle all.
  - In-place edit of labels and diagnosis notes.
  - Delete action.
  - One-click export to standard JSON or QuPath-compatible GeoJSON.
  - File import to load external annotation datasets.

### 3. Multi-Slide Layout & Synchronized Navigation (FR-009, FR-010)
- **Layouts**:
  - `1x1`: Single primary high-resolution viewport.
  - `1x2`: Side-by-side comparative split screen (ideal for H&E vs IHC biomarker comparison, or pre- vs post-treatment biopsies).
  - `2x2`: Quad comparative grid.
- **Synchronized Navigation Lock (`S`)**: When locked, panning or zooming in any viewport automatically mirrors across all viewports in real time.

### 4. DICOM & WSI Metadata Panel (FR-008)
- Displays complete DICOM hierarchy: Study Instance UID, Series Instance UID, SOP Instance UID.
- Optical parameters: Objective Magnification, Native Dimensions (\(76,800 \times 52,400\,\text{px}\)), Microns Per Pixel (MPP), Scanner Model, Scan Timestamp.
- Clinical Case Info: Patient ID (de-identified), Age, Gender, Anatomic Specimen Site, Clinical Diagnosis, and Microscopic Findings checklist.

### 5. Pathologist Workflow & Ergonomics
- **Reading Room Dark Mode & Clinical Light Mode**: Reduces eye fatigue during long reading sessions.
- **Microscope Optics Adjustments**: Sliders for Brightness, Contrast, Stain Saturation, and Color Channel Inversion.
- **Diagnostic Pathology Report Generator**: Generates a formal surgical pathology review summary complete with patient metadata, microscopic findings, quantitative markings table, conclusion text, and print/PDF export.
- **Keyboard Shortcuts**: Single-key microscope controls (`Space`/`H` = Pan, `P` = Point, `R` = Rect, `L` = Poly, `F` = Freehand, `M` = Ruler, `S` = Sync, `Esc` = Reset).

---

## 🚀 Running the Project

```bash
# Navigate to project directory
cd C:\Users\ASUS\.gemini\antigravity\scratch\digital-pathology-viewer

# Run development server
npm run dev

# Or run preview build on port 3000
npm run preview -- --port 3000
```

Or simply double-click `start-viewer.bat` on Windows.
