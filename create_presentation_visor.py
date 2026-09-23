"""
CivicAI — Smart Public Issue Resolution (Scrolltide Visor Edition)
Generates an attractive, modern, human-crafted 16:9 Widescreen PowerPoint Deck
inspired by the Scrolltide Visor template ("The rare light one"):
Luminous Alabaster light background (#F8FAFC), Electric Visor Blue accents (#0284C7),
Centerpiece 16:9 rounded lens frame, CIVIC VISION watermark, 3 fanned cards beneath the frame,
clean typography, high contrast, and crisp executive structure.
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_visor_deck(output_filename="CivicAI_Visor_Edition_Pitch_Deck.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Visor Light Palette Tokens
    BG_COLOR = RGBColor(248, 250, 252)          # #F8FAFC Luminous Alabaster / Slate 50
    CARD_BG = RGBColor(255, 255, 255)           # #FFFFFF Crisp Pure White
    CARD_BG_TINT = RGBColor(240, 249, 255)      # #F0F9FF Visor Foam Tint
    BORDER_LIGHT = RGBColor(226, 232, 240)      # #E2E8F0 Slate 200
    BORDER_CYAN = RGBColor(186, 230, 253)       # #BAE6FD Sky 200
    BORDER_ACCENT = RGBColor(2, 132, 199)       # #0284C7 Visor Blue
    ACCENT_BLUE = RGBColor(2, 132, 199)         # #0284C7 Electric Sky Blue
    ACCENT_CYAN = RGBColor(14, 165, 233)        # #0EA5E9 Sky 500
    ACCENT_EMERALD = RGBColor(16, 185, 129)     # #10B981 Emerald
    ACCENT_ROSE = RGBColor(239, 68, 68)         # #EF4444 Coral Red
    TEXT_INK = RGBColor(15, 23, 42)             # #0F172A Slate 900
    TEXT_BODY = RGBColor(51, 65, 85)            # #334155 Slate 700
    TEXT_MUTED = RGBColor(100, 116, 139)        # #64748B Slate 500
    WATERMARK_GRAY = RGBColor(241, 245, 249)    # #F1F5F9 Slate 100

    def apply_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def add_watermark(slide, text="CIVIC VISION"):
        wm = slide.shapes.add_textbox(Inches(0.5), Inches(0.5), Inches(12.333), Inches(2.0))
        tf = wm.text_frame
        tf.word_wrap = False
        p = tf.paragraphs[0]
        p.text = text
        p.font.size = Pt(84)
        p.font.bold = True
        p.font.color.rgb = WATERMARK_GRAY
        p.font.name = "Arial Black"
        p.alignment = PP_ALIGN.LEFT
        return wm

    def add_header(slide, kicker, title, subtitle=None):
        kicker_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.7), Inches(0.35))
        tf_k = kicker_box.text_frame
        tf_k.word_wrap = True
        tf_k.margin_left = tf_k.margin_top = tf_k.margin_right = tf_k.margin_bottom = 0
        p_k = tf_k.paragraphs[0]
        p_k.text = kicker.upper()
        p_k.font.size = Pt(11)
        p_k.font.bold = True
        p_k.font.color.rgb = ACCENT_BLUE
        p_k.font.name = "Consolas"

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.7), Inches(0.65))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(26)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_INK
        p_t.font.name = "Trebuchet MS"

        if subtitle:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.48), Inches(11.7), Inches(0.4))
            tf_s = sub_box.text_frame
            tf_s.word_wrap = True
            tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = 0
            p_s = tf_s.paragraphs[0]
            p_s.text = subtitle
            p_s.font.size = Pt(13)
            p_s.font.color.rgb = TEXT_MUTED
            p_s.font.name = "Segoe UI"

    def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=BORDER_LIGHT, border_width=1):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(border_width)
        return card

    # ==========================================
    # SLIDE 1: COVER (VISOR LENS FRAME & 3 FANNED CARDS)
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    apply_background(s1)
    add_watermark(s1, "CIVIC VISION")

    # Centerpiece 16:9 Lens Frame Card
    lens = add_card(s1, 1.2, 0.9, 10.933, 4.3, bg_color=CARD_BG, border_color=BORDER_CYAN, border_width=1.5)

    # Optic HUD Top Bar inside Lens Frame
    optic_bar = add_card(s1, 1.4, 1.1, 10.533, 0.45, bg_color=CARD_BG_TINT, border_color=BORDER_LIGHT)
    tf_bar = optic_bar.text_frame
    p_b = tf_bar.paragraphs[0]
    p_b.text = "● CIVICAI PLATFORM  |  OPTIC LENS 16:9  |  AUTONOMOUS PUBLIC RESOLUTION ENGINE"
    p_b.font.size = Pt(10)
    p_b.font.bold = True
    p_b.font.color.rgb = ACCENT_BLUE
    p_b.font.name = "Consolas"

    # Cover Title inside Lens
    c_title_box = s1.shapes.add_textbox(Inches(1.6), Inches(1.85), Inches(10.133), Inches(1.8))
    tf_ct = c_title_box.text_frame
    tf_ct.word_wrap = True
    p1 = tf_ct.paragraphs[0]
    p1.text = "CivicAI — Smart Public Issue Resolution"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_INK
    p1.font.name = "Trebuchet MS"

    p2 = tf_ct.add_paragraph()
    p2.text = "An AI-powered civic operating system that converts citizen-reported hazards into prioritized, department-ready actions and tracks them through computer vision verification until closed."
    p2.font.size = Pt(15)
    p2.font.color.rgb = TEXT_BODY
    p2.font.name = "Segoe UI"
    p2.space_before = Pt(12)

    # 3 Pill Badges inside Lens
    badges = [
        ("BBMP Municipal Roads", ACCENT_BLUE, CARD_BG_TINT),
        ("Guaranteed 24h SLA", RGBColor(180, 83, 9), RGBColor(254, 243, 199)),
        ("98.4% AI Vision Clearance", ACCENT_EMERALD, RGBColor(236, 253, 245))
    ]
    for idx, (b_text, b_color, b_bg) in enumerate(badges):
        b_shape = add_card(s1, 1.6 + (idx * 3.4), 4.4, 3.1, 0.45, bg_color=b_bg, border_color=b_color)
        tf_b = b_shape.text_frame
        p_badge = tf_b.paragraphs[0]
        p_badge.text = f"✓ {b_text}"
        p_badge.font.size = Pt(11)
        p_badge.font.bold = True
        p_badge.font.color.rgb = b_color
        p_badge.font.name = "Segoe UI"
        p_badge.alignment = PP_ALIGN.CENTER

    # Three Fanned Cards beneath Lens Frame (Left, Center, Right)
    fanned_cards = [
        ("01 / INTAKE HUD", "Visual Defect Detection & Spatial Clustering", "Extracts defect class, depth, severity, and clusters duplicates within 110m radius automatically.", 0.8),
        ("02 / TRIAGE ENGINE", "Mathematical Urgency & Dynamic Priority", "Replaces FIFO delays with real-time multi-factor formula weighting severity, transit routes & duplicates.", 4.9),
        ("03 / QUALITY AUDIT", "Closed-Loop Before vs After Verification", "Autonomous computer vision leveling clearance audit; ticket closes only upon citizen validation.", 9.0)
    ]
    for f_kicker, f_title, f_desc, f_left in fanned_cards:
        f_card = add_card(s1, f_left, 5.45, 3.533, 1.65, bg_color=CARD_BG, border_color=BORDER_LIGHT)
        tf_f = f_card.text_frame
        tf_f.margin_left = tf_f.margin_top = tf_f.margin_right = tf_f.margin_bottom = Inches(0.18)
        tf_f.word_wrap = True
        
        p_fk = tf_f.paragraphs[0]
        p_fk.text = f_kicker
        p_fk.font.size = Pt(9)
        p_fk.font.bold = True
        p_fk.font.color.rgb = ACCENT_BLUE
        p_fk.font.name = "Consolas"

        p_ft = tf_f.add_paragraph()
        p_ft.text = f_title
        p_ft.font.size = Pt(12)
        p_ft.font.bold = True
        p_ft.font.color.rgb = TEXT_INK
        p_ft.font.name = "Trebuchet MS"
        p_ft.space_before = Pt(4)

        p_fd = tf_f.add_paragraph()
        p_fd.text = f_desc
        p_fd.font.size = Pt(10)
        p_fd.font.color.rgb = TEXT_MUTED
        p_fd.font.name = "Segoe UI"
        p_fd.space_before = Pt(4)

    # ==========================================
    # SLIDE 2: THE CIVIC CRISIS (PROBLEM STATEMENT)
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    apply_background(s2)
    add_watermark(s2, "CIVIC CRISIS")
    add_header(s2, "The Fundamental Bottleneck", "Why Traditional Municipal Helplines Fail Both Citizens & City Halls",
               "Across Indian & global metros, public grievance portals suffer from 3 systemic structural failures.")

    problems = [
        ("FIFO Paralysis", "First-In-First-Out Queuing", "74%", "Backlog Stagnation",
         "Grievances are queued chronologically. A cosmetic street sign scratch filed at 8:00 AM blocks response teams while a lethal 4ft open crater on an arterial school route filed at 8:15 AM sits ignored.",
         RGBColor(254, 242, 242), RGBColor(254, 202, 202), ACCENT_ROSE),
        ("Crowdsource Spam", "Redundant Duplicate Tickets", "42%", "Wasted Call-Center Time",
         "When a severe road collapse occurs near a tech corridor, 30 citizens report it independently. Helplines treat these as 30 disconnected incidents, creating immense administrative gridlock.",
         RGBColor(255, 251, 235), RGBColor(253, 230, 138), RGBColor(217, 119, 6)),
        ("Ghost Closures", "Zero Proof & Fake Resolutions", "0%", "Contractor Accountability",
         "Under SLA pressure, municipal contractors falsely mark tickets 'Resolved' without photographic evidence. Citizens are notified of closure while the defect remains untouched on the road.",
         RGBColor(248, 250, 252), RGBColor(226, 232, 240), TEXT_INK),
    ]

    for idx, (p_tag, p_heading, p_stat, p_stat_label, p_desc, p_bg, p_border, p_color) in enumerate(problems):
        card = add_card(s2, 0.8 + (idx * 4.0), 2.1, 3.733, 4.8, bg_color=p_bg, border_color=p_border, border_width=1.5)
        tf = card.text_frame
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0.25)
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = p_tag.upper()
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = p_color
        p0.font.name = "Consolas"

        p1 = tf.add_paragraph()
        p1.text = p_stat
        p1.font.size = Pt(40)
        p1.font.bold = True
        p1.font.color.rgb = p_color
        p1.font.name = "Consolas"
        p1.space_before = Pt(8)

        p2 = tf.add_paragraph()
        p2.text = p_stat_label.upper()
        p2.font.size = Pt(10)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_MUTED
        p2.font.name = "Segoe UI"

        p3 = tf.add_paragraph()
        p3.text = p_heading
        p3.font.size = Pt(15)
        p3.font.bold = True
        p3.font.color.rgb = TEXT_INK
        p3.font.name = "Trebuchet MS"
        p3.space_before = Pt(14)

        p4 = tf.add_paragraph()
        p4.text = p_desc
        p4.font.size = Pt(11)
        p4.font.color.rgb = TEXT_BODY
        p4.font.name = "Segoe UI"
        p4.space_before = Pt(8)

    # ==========================================
    # SLIDE 3: SCREENS 1 & 2: CITIZEN INTAKE & AI HUD
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    apply_background(s3)
    add_watermark(s3, "SCREEN 1 & 2")
    add_header(s3, "Screens 1 & 2: Citizen Experience", "Frictionless Hazard Intake to Real-Time Neural Vision HUD",
               "Citizens upload photo/video or voice note; the convolutional vision model classifies and enriches data in under 2 seconds.")

    # Left: Intake Capabilities (Screen 1)
    card_s1 = add_card(s3, 0.8, 2.1, 5.6, 4.8, bg_color=CARD_BG, border_color=BORDER_LIGHT)
    tf_s1 = card_s1.text_frame
    tf_s1.margin_left = tf_s1.margin_top = tf_s1.margin_right = tf_s1.margin_bottom = Inches(0.25)
    tf_s1.word_wrap = True

    p_s1k = tf_s1.paragraphs[0]
    p_s1k.text = "SCREEN 1: CITIZEN INTAKE PORTAL"
    p_s1k.font.size = Pt(11)
    p_s1k.font.bold = True
    p_s1k.font.color.rgb = ACCENT_BLUE
    p_s1k.font.name = "Consolas"

    p_s1t = tf_s1.add_paragraph()
    p_s1t.text = "Zero Friction, Multimodal Reporting"
    p_s1t.font.size = Pt(18)
    p_s1t.font.bold = True
    p_s1t.font.color.rgb = TEXT_INK
    p_s1t.font.name = "Trebuchet MS"
    p_s1t.space_before = Pt(6)

    s1_features = [
        ("📍 Auto GPS Geofencing", "Detects latitude & longitude automatically with ward & zone mapping (e.g., Electronic City Phase 1)."),
        ("📸 High-Resolution Visual Evidence", "Captures asphalt fissures, manhole failures, overflowing waste with EXIF timestamp integrity."),
        ("🎙️ Voice Grievance Transcriber", "Web Speech API transcribes local multilingual voice complaints directly into standardized civic text."),
        ("⚡ One-Click Instant Dispatch", "No complex 15-field bureaucratic forms. Upload, speak, and tap 'AI Analyze & Report Issue'.")
    ]
    for feat_t, feat_d in s1_features:
        p_ft = tf_s1.add_paragraph()
        p_ft.text = f"{feat_t}: {feat_d}"
        p_ft.font.size = Pt(11)
        p_ft.font.color.rgb = TEXT_BODY
        p_ft.font.name = "Segoe UI"
        p_ft.space_before = Pt(8)

    # Right: AI Analysis HUD (Screen 2)
    card_s2 = add_card(s3, 6.7, 2.1, 5.8, 4.8, bg_color=CARD_BG_TINT, border_color=BORDER_CYAN, border_width=1.5)
    tf_s2 = card_s2.text_frame
    tf_s2.margin_left = tf_s2.margin_top = tf_s2.margin_right = tf_s2.margin_bottom = Inches(0.25)
    tf_s2.word_wrap = True

    p_s2k = tf_s2.paragraphs[0]
    p_s2k.text = "SCREEN 2: CONVOLUTIONAL VISION HUD"
    p_s2k.font.size = Pt(11)
    p_s2k.font.bold = True
    p_s2k.font.color.rgb = ACCENT_BLUE
    p_s2k.font.name = "Consolas"

    p_s2t = tf_s2.add_paragraph()
    p_s2t.text = "Automated Diagnostic Output"
    p_s2t.font.size = Pt(18)
    p_s2t.font.bold = True
    p_s2t.font.color.rgb = TEXT_INK
    p_s2t.font.name = "Trebuchet MS"
    p_s2t.space_before = Pt(6)

    hud_fields = [
        ("🔍 AI Detected Class", "Road Pothole (Confidence: 96.4%)"),
        ("⚠️ Severity Level", "HIGH — Deep crater exceeding 14cm depression"),
        ("🚗 Potential Public Impact", "High risk of two-wheeler skid & arterial traffic slowdown"),
        ("🔄 Spatial Cluster Analysis", "3 duplicate reports detected within 110m radius"),
        ("🏢 Auto-Assigned Department", "BBMP Municipal Roads (Ward 192)"),
        ("⏱️ SLA Protocol", "Guaranteed 24-Hour Municipal Repair Protocol")
    ]
    for h_label, h_val in hud_fields:
        p_hf = tf_s2.add_paragraph()
        p_hf.text = f"{h_label}: {h_val}"
        p_hf.font.size = Pt(11)
        p_hf.font.color.rgb = TEXT_INK
        p_hf.font.name = "Segoe UI"
        p_hf.space_before = Pt(7)

    # ==========================================
    # SLIDE 4: SCREEN 3: LIVE TRACKING & SLA STEPPER
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    apply_background(s4)
    add_watermark(s4, "SCREEN 3")
    add_header(s4, "Screen 3: Citizen Transparency", "Live 5-Stage Stepper & Guaranteed 24h SLA Tracking",
               "Every complaint receives an immutable ticket (#CA1024) with milestone-by-milestone accountability.")

    stepper_steps = [
        ("01", "Report Submitted", "GPS geotag, photo, and voice audio captured and logged to ledger.", True),
        ("02", "AI Verified", "Computer Vision classified defect type, estimated depth, and clustered nearby duplicates.", True),
        ("03", "Department Assigned", "Auto-routed directly to BBMP Municipal Roads with 24-hour repair window.", True),
        ("04", "Action Pending / In Progress", "Rapid Road Repair Unit #14 dispatched with bituminous cold mix equipment.", False),
        ("05", "Resolved & Verified", "Before/After AI vision clearance audit confirmed and signed off by citizen.", False)
    ]

    for idx, (num, step_title, step_desc, is_done) in enumerate(stepper_steps):
        s_bg = CARD_BG_TINT if is_done else CARD_BG
        s_border = BORDER_ACCENT if is_done else BORDER_LIGHT
        s_card = add_card(s4, 0.8 + (idx * 2.4), 2.1, 2.25, 3.6, bg_color=s_bg, border_color=s_border, border_width=1.5 if is_done else 1)
        tf_s = s_card.text_frame
        tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = Inches(0.18)
        tf_s.word_wrap = True

        p_n = tf_s.paragraphs[0]
        p_n.text = f"STAGE {num}"
        p_n.font.size = Pt(10)
        p_n.font.bold = True
        p_n.font.color.rgb = ACCENT_BLUE if is_done else TEXT_MUTED
        p_n.font.name = "Consolas"

        p_stat = tf_s.add_paragraph()
        p_stat.text = "✓ COMPLETED" if is_done else "● ACTIVE" if idx == 3 else "○ QUEUED"
        p_stat.font.size = Pt(10)
        p_stat.font.bold = True
        p_stat.font.color.rgb = ACCENT_EMERALD if is_done else ACCENT_BLUE if idx == 3 else TEXT_MUTED
        p_stat.font.name = "Consolas"
        p_stat.space_before = Pt(4)

        p_t = tf_s.add_paragraph()
        p_t.text = step_title
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_INK
        p_t.font.name = "Trebuchet MS"
        p_t.space_before = Pt(10)

        p_d = tf_s.add_paragraph()
        p_d.text = step_desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = TEXT_BODY
        p_d.font.name = "Segoe UI"
        p_d.space_before = Pt(6)

    # Bottom Banner: Notification Engine
    bot_banner = add_card(s4, 0.8, 5.9, 11.733, 1.0, bg_color=CARD_BG, border_color=BORDER_CYAN)
    tf_bb = bot_banner.text_frame
    tf_bb.margin_left = tf_bb.margin_top = tf_bb.margin_right = tf_bb.margin_bottom = Inches(0.18)
    tf_bb.word_wrap = True
    p_bb = tf_bb.paragraphs[0]
    p_bb.text = "🔔 AUTOMATED OMNICHANNEL CITIZEN NOTIFICATIONS (SMS & WHATSAPP)"
    p_bb.font.size = Pt(11)
    p_bb.font.bold = True
    p_bb.font.color.rgb = ACCENT_BLUE
    p_bb.font.name = "Consolas"

    p_bb2 = tf_bb.add_paragraph()
    p_bb2.text = "Citizens receive real-time push updates as the crew dispatches and closes the ticket. No more calling municipal switchboards to check ticket status."
    p_bb2.font.size = Pt(11)
    p_bb2.font.color.rgb = TEXT_BODY
    p_bb2.font.name = "Segoe UI"
    p_bb2.space_before = Pt(2)

    # ==========================================
    # SLIDE 5: SCREEN 4: MUNICIPAL ADMIN COMMAND CENTER
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    apply_background(s5)
    add_watermark(s5, "SCREEN 4")
    add_header(s5, "Screen 4: City Operations Grid", "Municipal Admin Command Center & Geospatial GIS Intelligence",
               "Unified situational awareness for municipal commissioners, zonal engineers, and contractor fleet supervisors.")

    # 4 KPI Counter Cards
    kpis = [
        ("TOTAL ISSUES", "1,284", "+12 today", "Aggregated across 198 wards", TEXT_INK, CARD_BG),
        ("AI VERIFIED", "936", "72.8% auto-cleared", "Zero spam confirmed by vision model", ACCENT_BLUE, CARD_BG_TINT),
        ("HIGH PRIORITY", "142", "SLA < 24h", "Immediate field dispatch required", ACCENT_ROSE, RGBColor(254, 242, 242)),
        ("RESOLVED", "817", "Citizen Verified", "Closed with before/after visual proof", ACCENT_EMERALD, RGBColor(236, 253, 245))
    ]
    for idx, (k_label, k_val, k_badge, k_sub, k_color, k_bg) in enumerate(kpis):
        k_card = add_card(s5, 0.8 + (idx * 3.0), 2.1, 2.733, 1.8, bg_color=k_bg, border_color=BORDER_LIGHT)
        tf_k = k_card.text_frame
        tf_k.margin_left = tf_k.margin_top = tf_k.margin_right = tf_k.margin_bottom = Inches(0.18)
        tf_k.word_wrap = True

        pk0 = tf_k.paragraphs[0]
        pk0.text = k_label
        pk0.font.size = Pt(10)
        pk0.font.bold = True
        pk0.font.color.rgb = TEXT_MUTED
        pk0.font.name = "Consolas"

        pk1 = tf_k.add_paragraph()
        pk1.text = k_val
        pk1.font.size = Pt(28)
        pk1.font.bold = True
        pk1.font.color.rgb = k_color
        pk1.font.name = "Consolas"
        pk1.space_before = Pt(4)

        pk2 = tf_k.add_paragraph()
        pk2.text = f"{k_badge} • {k_sub}"
        pk2.font.size = Pt(9)
        pk2.font.color.rgb = TEXT_BODY
        pk2.font.name = "Segoe UI"
        pk2.space_before = Pt(2)

    # Tactical GIS Map & Live Incident Drawer Section
    map_box = add_card(s5, 0.8, 4.1, 7.2, 2.8, bg_color=CARD_BG, border_color=BORDER_LIGHT)
    tf_mb = map_box.text_frame
    tf_mb.margin_left = tf_mb.margin_top = tf_mb.margin_right = tf_mb.margin_bottom = Inches(0.22)
    tf_mb.word_wrap = True
    pm0 = tf_mb.paragraphs[0]
    pm0.text = "🗺️ INTERACTIVE CARTODB POSITRON GIS METROPOLITAN GRID"
    pm0.font.size = Pt(11)
    pm0.font.bold = True
    pm0.font.color.rgb = ACCENT_BLUE
    pm0.font.name = "Consolas"

    map_bullets = [
        "Color-coded risk markers: 🔴 Critical Hazards | 🟠 High | 🟡 Medium | 🟢 Verified Resolved",
        "Spatial Cluster Grouping: Detects multi-report hotspot areas within 110-meter geofenced radius",
        "Zonal Filtering: Instant department toggle (Roads, Water & Sewerage, Electricity, Waste Management)",
        "One-click Inspector: Tapping any pin loads complete defect telemetry, photos, and crew dispatch controls"
    ]
    for b in map_bullets:
        pm = tf_mb.add_paragraph()
        pm.text = f"• {b}"
        pm.font.size = Pt(10.5)
        pm.font.color.rgb = TEXT_BODY
        pm.font.name = "Segoe UI"
        pm.space_before = Pt(4)

    # Right: Dispatch Inspector Drawer
    drawer_box = add_card(s5, 8.2, 4.1, 4.333, 2.8, bg_color=CARD_BG_TINT, border_color=BORDER_CYAN, border_width=1.5)
    tf_db = drawer_box.text_frame
    tf_db.margin_left = tf_db.margin_top = tf_db.margin_right = tf_db.margin_bottom = Inches(0.22)
    tf_db.word_wrap = True
    pd0 = tf_db.paragraphs[0]
    pd0.text = "FIELD DISPATCH TELEMETRY: #CA1024"
    pd0.font.size = Pt(11)
    pd0.font.bold = True
    pd0.font.color.rgb = ACCENT_BLUE
    pd0.font.name = "Consolas"

    drawer_bullets = [
        "Issue: Road Pothole (Depth: 14cm)",
        "Location: Electronic City Phase 1",
        "Priority Score: 94 / 100 (Rank #1 Citywide)",
        "Assigned Crew: Rapid Road Repair Unit #14",
        "SLA Window: 18h 42m Remaining",
        "Action: Direct dispatch trigger to field contractor tablets"
    ]
    for b in drawer_bullets:
        pd = tf_db.add_paragraph()
        pd.text = f"✓ {b}"
        pd.font.size = Pt(10)
        pd.font.color.rgb = TEXT_INK
        pd.font.name = "Segoe UI"
        pd.space_before = Pt(3)

    # ==========================================
    # SLIDE 6: SCREEN 5: AUTONOMOUS PRIORITY ENGINE
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    apply_background(s6)
    add_watermark(s6, "SCREEN 5")
    add_header(s6, "Screen 5: Intelligent Urgency Triage", "Autonomous Priority Engine: Eliminating FIFO Paralysis",
               "Instead of resolving complaints in chronological order, CivicAI computes mathematical risk scores (0-100).")

    # Formula Card (Left)
    card_f = add_card(s6, 0.8, 2.1, 6.8, 4.8, bg_color=CARD_BG, border_color=BORDER_CYAN, border_width=1.5)
    tf_cf = card_f.text_frame
    tf_cf.margin_left = tf_cf.margin_top = tf_cf.margin_right = tf_cf.margin_bottom = Inches(0.25)
    tf_cf.word_wrap = True

    p_fk = tf_cf.paragraphs[0]
    p_fk.text = "DYNAMIC MATHEMATICAL PRIORITY FORMULA"
    p_fk.font.size = Pt(11)
    p_fk.font.bold = True
    p_fk.font.color.rgb = ACCENT_BLUE
    p_fk.font.name = "Consolas"

    p_formula = tf_cf.add_paragraph()
    p_formula.text = "Priority Score = (Severity × 35%) + (Duplicates × 25%) + (Location × 20%) + (Public Impact × 20%)"
    p_formula.font.size = Pt(12)
    p_formula.font.bold = True
    p_formula.font.color.rgb = TEXT_INK
    p_formula.font.name = "Consolas"
    p_formula.space_before = Pt(10)

    weights = [
        ("1. Defect Severity Weight (35%)", "Deep asphalt craters, exposed live cables, and open drainage receive top mathematical urgency."),
        ("2. Duplicate Reports Cluster Density (25%)", "When multiple independent citizens report the same site, the spatial density multiplier elevates priority."),
        ("3. Location Importance (20%)", "Arterial transit roads, hospital corridors, school zones, and metro hubs receive critical weighting over quiet side-alleys."),
        ("4. Public Impact & Commuter Safety (20%)", "Calculates vehicular deceleration, peak-hour congestion multiplier, and risk to two-wheelers and pedestrians.")
    ]
    for w_title, w_desc in weights:
        pw_t = tf_cf.add_paragraph()
        pw_t.text = w_title
        pw_t.font.size = Pt(11)
        pw_t.font.bold = True
        pw_t.font.color.rgb = ACCENT_BLUE
        pw_t.font.name = "Trebuchet MS"
        pw_t.space_before = Pt(8)

        pw_d = tf_cf.add_paragraph()
        pw_d.text = w_desc
        pw_d.font.size = Pt(10)
        pw_d.font.color.rgb = TEXT_BODY
        pw_d.font.name = "Segoe UI"

    # Why It Matters (Right)
    card_r = add_card(s6, 7.8, 2.1, 4.733, 4.8, bg_color=CARD_BG_TINT, border_color=BORDER_LIGHT)
    tf_cr = card_r.text_frame
    tf_cr.margin_left = tf_cr.margin_top = tf_cr.margin_right = tf_cr.margin_bottom = Inches(0.25)
    tf_cr.word_wrap = True

    pr0 = tf_cr.paragraphs[0]
    pr0.text = "IMPACT ON CITY RESPONSE"
    pr0.font.size = Pt(11)
    pr0.font.bold = True
    pr0.font.color.rgb = ACCENT_BLUE
    pr0.font.name = "Consolas"

    impacts = [
        ("Zero Subjective Bias", "Eliminates political favoritism or call-center agent whim. Ranking is strictly objective and data-driven."),
        ("Dynamic Re-ranking", "As rain intensifies or duplicate reports pour in, the system dynamically pushes escalating hazards to Rank #1 in real time."),
        ("Sub-Second Execution", "The triage pipeline computes and ranks 1,000+ city incidents in under 0.14 seconds."),
        ("Contractor Route Optimization", "Crews receive prioritized work orders ordered by location proximity and urgency.")
    ]
    for i_t, i_d in impacts:
        pi_t = tf_cr.add_paragraph()
        pi_t.text = f"✓ {i_t}"
        pi_t.font.size = Pt(12)
        pi_t.font.bold = True
        pi_t.font.color.rgb = TEXT_INK
        pi_t.font.name = "Trebuchet MS"
        pi_t.space_before = Pt(10)

        pi_d = tf_cr.add_paragraph()
        pi_d.text = i_d
        pi_d.font.size = Pt(10)
        pi_d.font.color.rgb = TEXT_BODY
        pi_d.font.name = "Segoe UI"
        pi_d.space_before = Pt(2)

    # ==========================================
    # SLIDE 7: SCREEN 6: BEFORE VS AFTER VERIFICATION
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    apply_background(s7)
    add_watermark(s7, "SCREEN 6")
    add_header(s7, "Screen 6: Closed-Loop Accountability", "AI Before vs After Resolution Verification & Citizen Sign-Off",
               "Eliminates 'Ghost Closures' through photographic comparison and final citizen approval.")

    # 3 Workflow Cards
    audit_flow = [
        ("STAGE 1: EVIDENCE SUBMISSION", "Contractor Uploads 'After' Photo",
         "When the field contractor completes asphalt leveling, they are required to upload a completion photo directly at the geofenced site.",
         "Enforces geofence + timestamp proof", CARD_BG, BORDER_LIGHT),
        ("STAGE 2: COMPUTER VISION AUDIT", "Surface Grade & Clearance Scan",
         "The AI vision model runs comparative analysis against the original damage photo, measuring surface level, patch compactness, and obstruction removal.",
         "Threshold: >95% confidence (98.4% achieved)", CARD_BG_TINT, BORDER_CYAN),
        ("STAGE 3: CITIZEN SIGN-OFF", "Ultimate Citizen Sign-Off",
         "The citizen who filed the report receives the Before/After photo comparison. Ticket closes only when the citizen approves.",
         "👍 Resolved vs ❌ Still Not Fixed", RGBColor(236, 253, 245), RGBColor(167, 243, 208))
    ]
    for idx, (af_kicker, af_title, af_desc, af_metric, af_bg, af_border) in enumerate(audit_flow):
        af_card = add_card(s7, 0.8 + (idx * 4.0), 2.1, 3.733, 4.8, bg_color=af_bg, border_color=af_border, border_width=1.5)
        tf_af = af_card.text_frame
        tf_af.margin_left = tf_af.margin_top = tf_af.margin_right = tf_af.margin_bottom = Inches(0.25)
        tf_af.word_wrap = True

        p0 = tf_af.paragraphs[0]
        p0.text = af_kicker
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = ACCENT_BLUE
        p0.font.name = "Consolas"

        p1 = tf_af.add_paragraph()
        p1.text = af_title
        p1.font.size = Pt(16)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_INK
        p1.font.name = "Trebuchet MS"
        p1.space_before = Pt(8)

        p2 = tf_af.add_paragraph()
        p2.text = af_desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_BODY
        p2.font.name = "Segoe UI"
        p2.space_before = Pt(12)

        p3 = tf_af.add_paragraph()
        p3.text = f"KEY METRIC: {af_metric}"
        p3.font.size = Pt(10)
        p3.font.bold = True
        p3.font.color.rgb = ACCENT_EMERALD
        p3.font.name = "Consolas"
        p3.space_before = Pt(16)

    # ==========================================
    # SLIDE 8: SYSTEM ARCHITECTURE & CODEBASE
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    apply_background(s8)
    add_watermark(s8, "ARCHITECTURE")
    add_header(s8, "Full-Stack System Architecture", "Production-Ready, Modular Architecture with Zero-Dependency Fallback",
               "Engineered for sub-second performance, high availability, and seamless dual-screen synchronization.")

    arch_layers = [
        ("Frontend Application", "React 18 + Vite + Tailwind CSS + Lucide Icons",
         "Responsive single-page application with 6 core screens, interactive Before/After image comparison slider, Web Speech API integration, and audio cues."),
        ("Geospatial & GIS Layer", "Leaflet.js + CartoDB Positron Vector Basemaps",
         "High-performance client-side map rendering with custom pulsing div-markers, bounding box geofencing, and multi-ward geospatial clustering."),
        ("Backend Services", "Python FastAPI + Uvicorn Async Server",
         "REST API endpoints for triage, priority scoring, resolution auditing, and automated fallback logic ensuring demo stability under any network condition."),
        ("Presentation Sync Bus", "HTML5 BroadcastChannel API",
         "Enables dual-screen synchronized demos (e.g. projecting live map while controlling via tablet) without requiring external WebSocket infrastructure."),
        ("Automated Recording Mode", "Custom 45s Tour Engine with Animated Virtual Cursor",
         "Simulates realistic citizen-to-admin workflow with timed clicks, sound effects, and floating HUD for zero-effort live presentations.")
    ]

    for idx, (a_title, a_tech, a_desc) in enumerate(arch_layers):
        a_card = add_card(s8, 0.8, 2.05 + (idx * 0.98), 11.733, 0.88, bg_color=CARD_BG, border_color=BORDER_LIGHT)
        tf_a = a_card.text_frame
        tf_a.margin_left = tf_a.margin_top = tf_a.margin_right = tf_a.margin_bottom = Inches(0.14)
        tf_a.word_wrap = True

        pa0 = tf_a.paragraphs[0]
        pa0.text = f"{a_title.upper()}  •  {a_tech}"
        pa0.font.size = Pt(11)
        pa0.font.bold = True
        pa0.font.color.rgb = ACCENT_BLUE
        pa0.font.name = "Consolas"

        pa1 = tf_a.add_paragraph()
        pa1.text = a_desc
        pa1.font.size = Pt(10)
        pa1.font.color.rgb = TEXT_BODY
        pa1.font.name = "Segoe UI"
        pa1.space_before = Pt(2)

    # ==========================================
    # SLIDE 9: MEASURABLE IMPACT & ROADMAP
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    apply_background(s9)
    add_watermark(s9, "IMPACT")
    add_header(s9, "Measurable Civic Impact & Scalability", "Transforming Urban Governance into Measurable, Trustworthy Public Service",
               "CivicAI delivers measurable operational ROI to municipal corporations and restores civic confidence.")

    # 4 Big Metric Cards
    metrics = [
        ("68%", "Faster Dispatch", "Direct automated routing to department crews bypasses manual triage delays entirely.", ACCENT_BLUE),
        ("92%", "Deduplication", "Redundant citizen complaints clustered automatically into single actionable work orders.", ACCENT_CYAN),
        ("0%", "Ghost Closures", "Closed-loop AI Before/After clearance audit and citizen approval ensure work is actually completed.", ACCENT_EMERALD),
        ("100%", "Citizen Trust", "Transparent SLA countdown and real-time tracking restore trust between citizens and civic authorities.", TEXT_INK)
    ]
    for idx, (m_val, m_title, m_desc, m_color) in enumerate(metrics):
        m_card = add_card(s9, 0.8 + (idx * 3.0), 2.1, 2.733, 2.6, bg_color=CARD_BG, border_color=BORDER_LIGHT)
        tf_m = m_card.text_frame
        tf_m.margin_left = tf_m.margin_top = tf_m.margin_right = tf_m.margin_bottom = Inches(0.2)
        tf_m.word_wrap = True

        pm0 = tf_m.paragraphs[0]
        pm0.text = m_val
        pm0.font.size = Pt(36)
        pm0.font.bold = True
        pm0.font.color.rgb = m_color
        pm0.font.name = "Consolas"

        pm1 = tf_m.add_paragraph()
        pm1.text = m_title
        pm1.font.size = Pt(13)
        pm1.font.bold = True
        pm1.font.color.rgb = TEXT_INK
        pm1.font.name = "Trebuchet MS"
        pm1.space_before = Pt(4)

        pm2 = tf_m.add_paragraph()
        pm2.text = m_desc
        pm2.font.size = Pt(10)
        pm2.font.color.rgb = TEXT_BODY
        pm2.font.name = "Segoe UI"
        pm2.space_before = Pt(4)

    # Pan-City Scalability Roadmap Box
    road_box = add_card(s9, 0.8, 4.9, 11.733, 2.0, bg_color=CARD_BG_TINT, border_color=BORDER_CYAN, border_width=1.5)
    tf_rb = road_box.text_frame
    tf_rb.margin_left = tf_rb.margin_top = tf_rb.margin_right = tf_rb.margin_bottom = Inches(0.22)
    tf_rb.word_wrap = True

    prb0 = tf_rb.paragraphs[0]
    prb0.text = "PAN-CITY SCALABILITY & EXPANSION ROADMAP"
    prb0.font.size = Pt(11)
    prb0.font.bold = True
    prb0.font.color.rgb = ACCENT_BLUE
    prb0.font.name = "Consolas"

    roadmap_steps = [
        ("Phase 1: Pilot Deployment", "Electronic City & Whitefield tech corridors (15 Wards) for road defect & manhole triage."),
        ("Phase 2: BBMP Pan-Bengaluru", "Integration with BBMP Sahaya Helpline & BWSSB water authority across all 198 wards."),
        ("Phase 3: National Smart Cities", "Deployment across Tier-1 municipal corporations (Delhi MCD, Mumbai BMC, Hyderabad GHMC).")
    ]
    for r_title, r_desc in roadmap_steps:
        prb = tf_rb.add_paragraph()
        prb.text = f"• {r_title}: {r_desc}"
        prb.font.size = Pt(10.5)
        prb.font.color.rgb = TEXT_INK
        prb.font.name = "Segoe UI"
        prb.space_before = Pt(3)

    prs.save(output_filename)
    print(f"[OK] Visor Edition Pitch Deck successfully generated: {output_filename}")

if __name__ == "__main__":
    build_visor_deck()
