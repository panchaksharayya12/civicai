"""
CivicAI — Smart Public Issue Resolution (Beacon Edition)
Generates 16:9 Widescreen PowerPoint Deck inspired by Scrolltide Beacon template:
Noir Obsidian background, Amber Light Column, Luxury typography, 4 Floating Claims.
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_filename="CivicAI_Beacon_Edition_Pitch_Deck.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Beacon Palette
    BG_COLOR = RGBColor(7, 8, 12)          # #07080C Deep Noir Obsidian
    CARD_BG = RGBColor(14, 16, 24)         # #0E1018 Smoky Glass Card
    CARD_BORDER = RGBColor(45, 40, 30)     # Subtle warm border
    BORDER_AMBER = RGBColor(245, 158, 11)  # Amber gold border
    ACCENT_AMBER = RGBColor(245, 158, 11)  # #F59E0B Warm Amber
    ACCENT_GOLD = RGBColor(251, 191, 36)   # #FBBF24 Radiant Gold
    ACCENT_CREAM = RGBColor(254, 243, 199) # #FEF3C7 Champagne Cream
    ACCENT_GREEN = RGBColor(16, 185, 129)  # #10B981 Emerald
    ACCENT_ROSE = RGBColor(239, 68, 68)    # #EF4444 Coral Red
    TEXT_WHITE = RGBColor(255, 255, 255)
    TEXT_MUTED = RGBColor(156, 163, 175)   # #9CA3AF Slate 400
    TEXT_LIGHT = RGBColor(229, 231, 235)   # #E5E7EB Slate 200

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def add_header(slide, kicker, title, subtitle=None):
        kicker_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.7), Inches(0.4))
        tf_k = kicker_box.text_frame
        tf_k.word_wrap = True
        tf_k.margin_left = tf_k.margin_top = tf_k.margin_right = tf_k.margin_bottom = 0
        p_k = tf_k.paragraphs[0]
        p_k.text = kicker.upper()
        p_k.font.size = Pt(11)
        p_k.font.bold = True
        p_k.font.color.rgb = ACCENT_AMBER
        p_k.font.name = "Segoe UI"

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.7), Inches(0.65))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(26)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE
        p_t.font.name = "Georgia"

        if subtitle:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(0.4))
            tf_s = sub_box.text_frame
            tf_s.word_wrap = True
            tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = 0
            p_s = tf_s.paragraphs[0]
            p_s.text = subtitle
            p_s.font.size = Pt(13)
            p_s.font.color.rgb = TEXT_MUTED
            p_s.font.name = "Segoe UI"

    def add_card(slide, left, top, width, height, border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = border_color
        card.line.width = Pt(1)
        return card

    # ==========================================
    # SLIDE 1: COVER (BEACON AMBER LIGHT COLUMN)
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Glowing vertical amber beam simulation
    beam = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.0), 0, Inches(1.333), Inches(7.5))
    beam.fill.solid()
    beam.fill.fore_color.rgb = RGBColor(28, 22, 12)
    beam.line.fill.background()

    # Center beam ray
    beam_ray = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.45), 0, Inches(0.4), Inches(7.5))
    beam_ray.fill.solid()
    beam_ray.fill.fore_color.rgb = RGBColor(48, 36, 15)
    beam_ray.line.fill.background()

    # Accent decorative gold line
    bar = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(0.12), Inches(3.8))
    bar.fill.solid()
    bar.fill.fore_color.rgb = ACCENT_AMBER
    bar.line.fill.background()

    t_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(3.8))
    tf1 = t_box.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "✦ BEACON EDITION // AUTONOMOUS CIVIC GOVTECH"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_AMBER
    p.font.name = "Segoe UI"

    p2 = tf1.add_paragraph()
    p2.text = "CivicAI — Smart Public Issue Resolution"
    p2.font.size = Pt(38)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE
    p2.font.name = "Georgia"
    p2.space_before = Pt(12)

    p3 = tf1.add_paragraph()
    p3.text = "A New Beacon for Municipal Governance: Computer Vision Defect Triage, Algorithmic Urgency & Verified Site Closure."
    p3.font.size = Pt(17)
    p3.font.color.rgb = ACCENT_CREAM
    p3.font.name = "Segoe UI"
    p3.space_before = Pt(14)

    # 4 Floating Claims on Cover
    claims = [
        "✦ 96.4% Vision Confidence",
        "✦ 110m Deduplication",
        "✦ Zero Ghost Closures",
        "✦ 24h Guaranteed SLA"
    ]
    for i, cl in enumerate(claims):
        add_card(s1, 1.2 + i * 2.8, 4.7, 2.6, 0.6, BORDER_AMBER)
        bx = s1.shapes.add_textbox(Inches(1.25 + i * 2.8), Inches(4.8), Inches(2.5), Inches(0.4))
        p_c = bx.text_frame.paragraphs[0]
        p_c.text = cl
        p_c.font.size = Pt(10)
        p_c.font.bold = True
        p_c.font.color.rgb = ACCENT_AMBER

    add_card(s1, 1.2, 5.7, 11.0, 1.0)
    meta_box = s1.shapes.add_textbox(Inches(1.5), Inches(5.85), Inches(10.4), Inches(0.7))
    tf_meta = meta_box.text_frame
    p_meta = tf_meta.paragraphs[0]
    p_meta.text = "PROTOTYPE SPECIFICATION & DEMO DECK  •  BENGALURU SMART CITY PILOT  •  TICKET #CA1024 SHOWCASE"
    p_meta.font.size = Pt(11)
    p_meta.font.bold = True
    p_meta.font.color.rgb = ACCENT_GOLD

    p_meta2 = tf_meta.add_paragraph()
    p_meta2.text = "Designed for Hackathon Presentation  |  React Frontend  •  Python FastAPI Engine  •  Leaflet Tactical GIS"
    p_meta2.font.size = Pt(11)
    p_meta2.font.color.rgb = TEXT_MUTED
    p_meta2.space_before = Pt(4)

    # ==========================================
    # SLIDE 2: THE BROKEN REALITY (THE CRISIS)
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "The Ground Reality", "Municipal Helplines Don't Suffer from Lack of Complaints — They Drown in Them", "Traditional municipal portals fail because they treat every grievance with blind first-in-first-out logic.")

    col_w = 3.65
    gap = 0.38
    start_x = 0.8
    card_y = 2.2
    card_h = 4.6

    add_card(s2, start_x, card_y, col_w, card_h, ACCENT_ROSE)
    p1_box = s2.shapes.add_textbox(Inches(start_x + 0.3), Inches(card_y + 0.4), Inches(col_w - 0.6), Inches(card_h - 0.8))
    tf_p1 = p1_box.text_frame
    tf_p1.word_wrap = True
    tf_p1.paragraphs[0].text = "SYSTEMIC FAILURE #1"
    tf_p1.paragraphs[0].font.size = Pt(11)
    tf_p1.paragraphs[0].font.bold = True
    tf_p1.paragraphs[0].font.color.rgb = ACCENT_ROSE

    h1 = tf_p1.add_paragraph()
    h1.text = "First-In-First-Out Queue Paralysis"
    h1.font.size = Pt(18)
    h1.font.bold = True
    h1.font.color.rgb = TEXT_WHITE
    h1.font.name = "Georgia"
    h1.space_before = Pt(8)

    b1 = tf_p1.add_paragraph()
    b1.text = "Grievance portals queue reports chronologically without assessing risk. A trivial cosmetic complaint filed at 8:00 AM gets processed before a lethal 4-foot open drainage manhole on a school corridor."
    b1.font.size = Pt(13)
    b1.font.color.rgb = TEXT_MUTED
    b1.space_before = Pt(12)

    stat1 = tf_p1.add_paragraph()
    stat1.text = "Result: High-hazard delays & avoidable casualties"
    stat1.font.size = Pt(12)
    stat1.font.bold = True
    stat1.font.color.rgb = ACCENT_ROSE
    stat1.space_before = Pt(16)

    # Problem 2
    add_card(s2, start_x + (col_w + gap), card_y, col_w, card_h, ACCENT_AMBER)
    p2_box = s2.shapes.add_textbox(Inches(start_x + (col_w + gap) + 0.3), Inches(card_y + 0.4), Inches(col_w - 0.6), Inches(card_h - 0.8))
    tf_p2 = p2_box.text_frame
    tf_p2.word_wrap = True
    tf_p2.paragraphs[0].text = "SYSTEMIC FAILURE #2"
    tf_p2.paragraphs[0].font.size = Pt(11)
    tf_p2.paragraphs[0].font.bold = True
    tf_p2.paragraphs[0].font.color.rgb = ACCENT_AMBER

    h2 = tf_p2.add_paragraph()
    h2.text = "42% Duplicate Report Spam"
    h2.font.size = Pt(18)
    h2.font.bold = True
    h2.font.color.rgb = TEXT_WHITE
    h2.font.name = "Georgia"
    h2.space_before = Pt(8)

    b2 = tf_p2.add_paragraph()
    b2.text = "When an arterial road pothole appears near Infosys Gate 3, dozens of commuters photograph and submit it. Authorities receive 25 separate tickets, wasting hours cross-checking redundant complaints."
    b2.font.size = Pt(13)
    b2.font.color.rgb = TEXT_MUTED
    b2.space_before = Pt(12)

    stat2 = tf_p2.add_paragraph()
    stat2.text = "Result: Call center burnout & delayed response"
    stat2.font.size = Pt(12)
    stat2.font.bold = True
    stat2.font.color.rgb = ACCENT_AMBER
    stat2.space_before = Pt(16)

    # Problem 3
    add_card(s2, start_x + (col_w + gap) * 2, card_y, col_w, card_h, ACCENT_GOLD)
    p3_box = s2.shapes.add_textbox(Inches(start_x + (col_w + gap) * 2 + 0.3), Inches(card_y + 0.4), Inches(col_w - 0.6), Inches(card_h - 0.8))
    tf_p3 = p3_box.text_frame
    tf_p3.word_wrap = True
    tf_p3.paragraphs[0].text = "SYSTEMIC FAILURE #3"
    tf_p3.paragraphs[0].font.size = Pt(11)
    tf_p3.paragraphs[0].font.bold = True
    tf_p3.paragraphs[0].font.color.rgb = ACCENT_GOLD

    h3 = tf_p3.add_paragraph()
    h3.text = "\"Ghost Closures\" & Zero Trust"
    h3.font.size = Pt(18)
    h3.font.bold = True
    h3.font.color.rgb = TEXT_WHITE
    h3.font.name = "Georgia"
    h3.space_before = Pt(8)

    b3 = tf_p3.add_paragraph()
    b3.text = "Contractors routinely mark tickets \"Resolved\" without submitting photographic proof. Citizens return to find the defect untouched, leading to cynicism, distrust, and repeated re-filing."
    b3.font.size = Pt(13)
    b3.font.color.rgb = TEXT_MUTED
    b3.space_before = Pt(12)

    stat3 = tf_p3.add_paragraph()
    stat3.text = "Result: Total breakdown of citizen confidence"
    stat3.font.size = Pt(12)
    stat3.font.bold = True
    stat3.font.color.rgb = ACCENT_GOLD
    stat3.space_before = Pt(16)

    # ==========================================
    # SLIDE 3: THE BEACON SOLUTION
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "The CivicAI Solution", "An Autonomous Action Engine That Bridges Citizens and Authorities", "Converts public grievances into department-ready actions and tracks them until verified resolution.")

    add_card(s3, 0.8, 2.1, 11.73, 1.2, BORDER_AMBER)
    c_box = s3.shapes.add_textbox(Inches(1.1), Inches(2.25), Inches(11.1), Inches(0.9))
    tf_c = c_box.text_frame
    tf_c.word_wrap = True
    p_c1 = tf_c.paragraphs[0]
    p_c1.text = "THE BEACON CLOSED-LOOP ARCHITECTURE"
    p_c1.font.size = Pt(11)
    p_c1.font.bold = True
    p_c1.font.color.rgb = ACCENT_AMBER
    p_c2 = tf_c.add_paragraph()
    p_c2.text = "Citizen Report (Photo + Voice)  ➜  Computer Vision Triage  ➜  Spatial Deduplication (110m)  ➜  Priority Dispatch  ➜  Before/After AI Audit  ➜  Citizen Confirmation"
    p_c2.font.size = Pt(13)
    p_c2.font.bold = True
    p_c2.font.color.rgb = TEXT_WHITE
    p_c2.space_before = Pt(4)

    # 3 Pillars
    col_w3 = 3.65
    gap3 = 0.38
    y3 = 3.6
    h3_card = 3.3

    add_card(s3, 0.8, y3, col_w3, h3_card)
    box_pil1 = s3.shapes.add_textbox(Inches(1.05), Inches(y3 + 0.3), Inches(col_w3 - 0.5), Inches(h3_card - 0.6))
    tf_pil1 = box_pil1.text_frame
    tf_pil1.word_wrap = True
    tf_pil1.paragraphs[0].text = "1. MULTIMODAL INTAKE"
    tf_pil1.paragraphs[0].font.size = Pt(11)
    tf_pil1.paragraphs[0].font.bold = True
    tf_pil1.paragraphs[0].font.color.rgb = ACCENT_AMBER
    p_pt1 = tf_pil1.add_paragraph()
    p_pt1.text = "Zero-Friction Reporting"
    p_pt1.font.size = Pt(17)
    p_pt1.font.bold = True
    p_pt1.font.color.rgb = TEXT_WHITE
    p_pt1.font.name = "Georgia"
    p_pt1.space_before = Pt(6)
    p_pd1 = tf_pil1.add_paragraph()
    p_pd1.text = "• Instant GPS Geolocation auto-detection\n• Drag-and-drop defect photo & video upload\n• Real-time speech-to-text voice complaints\n• 1-Click presets for instant testing"
    p_pd1.font.size = Pt(12)
    p_pd1.font.color.rgb = TEXT_MUTED
    p_pd1.space_before = Pt(8)

    add_card(s3, 0.8 + col_w3 + gap3, y3, col_w3, h3_card)
    box_pil2 = s3.shapes.add_textbox(Inches(1.05 + col_w3 + gap3), Inches(y3 + 0.3), Inches(col_w3 - 0.5), Inches(h3_card - 0.6))
    tf_pil2 = box_pil2.text_frame
    tf_pil2.word_wrap = True
    tf_pil2.paragraphs[0].text = "2. AI PRIORITY ENGINE"
    tf_pil2.paragraphs[0].font.size = Pt(11)
    tf_pil2.paragraphs[0].font.bold = True
    tf_pil2.paragraphs[0].font.color.rgb = ACCENT_GOLD
    p_pt2 = tf_pil2.add_paragraph()
    p_pt2.text = "Intelligent Risk Triage"
    p_pt2.font.size = Pt(17)
    p_pt2.font.bold = True
    p_pt2.font.color.rgb = TEXT_WHITE
    p_pt2.font.name = "Georgia"
    p_pt2.space_before = Pt(6)
    p_pd2 = tf_pil2.add_paragraph()
    p_pd2.text = "• Computer vision defect classification\n• Automated spatial duplicate clustering (110m)\n• Mathematical urgency scoring formula\n• Auto-routing to BBMP / BWSSB / BESCOM"
    p_pd2.font.size = Pt(12)
    p_pd2.font.color.rgb = TEXT_MUTED
    p_pd2.space_before = Pt(8)

    add_card(s3, 0.8 + (col_w3 + gap3) * 2, y3, col_w3, h3_card)
    box_pil3 = s3.shapes.add_textbox(Inches(1.05 + (col_w3 + gap3) * 2), Inches(y3 + 0.3), Inches(col_w3 - 0.5), Inches(h3_card - 0.6))
    tf_pil3 = box_pil3.text_frame
    tf_pil3.word_wrap = True
    tf_pil3.paragraphs[0].text = "3. VERIFIED RESOLUTION"
    tf_pil3.paragraphs[0].font.size = Pt(11)
    tf_pil3.paragraphs[0].font.bold = True
    tf_pil3.paragraphs[0].font.color.rgb = ACCENT_GREEN
    p_pt3 = tf_pil3.add_paragraph()
    p_pt3.text = "Zero Ghost Closures"
    p_pt3.font.size = Pt(17)
    p_pt3.font.bold = True
    p_pt3.font.color.rgb = TEXT_WHITE
    p_pt3.font.name = "Georgia"
    p_pt3.space_before = Pt(6)
    p_pd3 = tf_pil3.add_paragraph()
    p_pd3.text = "• Authority uploads \"After Repair\" photo\n• AI Before vs After surface comparison\n• 98.4% defect clearance verification\n• Citizen final veto (Confirm or Re-escalate)"
    p_pd3.font.size = Pt(12)
    p_pd3.font.color.rgb = TEXT_MUTED
    p_pd3.space_before = Pt(8)

    # ==========================================
    # SLIDE 4: SCREENS 1 & 2
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "Screen Breakdown: Intake & Vision HUD", "From Citizen Upload to Real-Time Neural Diagnostics", "Screens 1 & 2 demonstrate seamless photo submission and instant computer vision classification.")

    w4 = 5.68
    add_card(s4, 0.8, 2.1, w4, 4.8)
    sc1_box = s4.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(w4 - 0.6), Inches(4.4))
    tf_sc1 = sc1_box.text_frame
    tf_sc1.word_wrap = True
    tf_sc1.paragraphs[0].text = "SCREEN 1 // CITIZEN PORTAL"
    tf_sc1.paragraphs[0].font.size = Pt(11)
    tf_sc1.paragraphs[0].font.bold = True
    tf_sc1.paragraphs[0].font.color.rgb = ACCENT_AMBER

    p_sc1_h = tf_sc1.add_paragraph()
    p_sc1_h.text = "Citizen Issue Reporting"
    p_sc1_h.font.size = Pt(20)
    p_sc1_h.font.bold = True
    p_sc1_h.font.color.rgb = TEXT_WHITE
    p_sc1_h.font.name = "Georgia"
    p_sc1_h.space_before = Pt(6)

    p_sc1_b = tf_sc1.add_paragraph()
    p_sc1_b.text = (
        "📍 Detect/Select Location: Auto GPS resolves to 'Electronic City Phase 1, Near Infosys Gate 3, Bengaluru' (12.8452° N, 77.6602° E)\n\n"
        "📸 Photo / Video Upload: Drag-and-drop file uploader with live preview and 4 one-click hackathon presets (Pothole, Manhole, Garbage, Streetlight)\n\n"
        "🎙️ Voice Complaint: Web Speech API transcribes spoken citizen complaints with live audio frequency wave animation\n\n"
        "✍️ Describe Issue: Contextual problem description with smart prompts\n\n"
        "🚀 Action: 'AI Analyze & Report Issue' button triggers inference HUD"
    )
    p_sc1_b.font.size = Pt(12)
    p_sc1_b.font.color.rgb = TEXT_LIGHT
    p_sc1_b.space_before = Pt(10)

    add_card(s4, 6.85, 2.1, w4, 4.8, BORDER_AMBER)
    sc2_box = s4.shapes.add_textbox(Inches(7.15), Inches(2.3), Inches(w4 - 0.6), Inches(4.4))
    tf_sc2 = sc2_box.text_frame
    tf_sc2.word_wrap = True
    tf_sc2.paragraphs[0].text = "SCREEN 2 // AI ANALYSIS HUD"
    tf_sc2.paragraphs[0].font.size = Pt(11)
    tf_sc2.paragraphs[0].font.bold = True
    tf_sc2.paragraphs[0].font.color.rgb = ACCENT_AMBER

    p_sc2_h = tf_sc2.add_paragraph()
    p_sc2_h.text = "Neural Computer Vision Scanner"
    p_sc2_h.font.size = Pt(20)
    p_sc2_h.font.bold = True
    p_sc2_h.font.color.rgb = TEXT_WHITE
    p_sc2_h.font.name = "Georgia"
    p_sc2_h.space_before = Pt(6)

    p_sc2_b = tf_sc2.add_paragraph()
    p_sc2_b.text = (
        "🔍 AI Detected: Road Pothole (Confidence: 96.4%)\n"
        "⚠️ Severity: High (88/100, Depth: ~12cm)\n"
        "📍 Location: Electronic City Phase 1 (Arterial Corridor)\n"
        "🚗 Potential Impact: Traffic & vehicle safety (high accident hazard)\n"
        "🔄 Duplicate Reports: 3 nearby within 110m radius\n"
        "🏢 Assigned Department: Municipal Roads (BBMP Works)\n"
        "⏱️ Inference Latency: 142ms\n\n"
        "Then: Citizen clicks 'Submit Complaint' ➜ System generates Ticket #CA1024"
    )
    p_sc2_b.font.size = Pt(12)
    p_sc2_b.font.color.rgb = TEXT_LIGHT
    p_sc2_b.space_before = Pt(10)

    # ==========================================
    # SLIDE 5: SCREENS 3 & 4
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Screen Breakdown: Operations & Oversight", "Live Citizen Stepper & Tactical City Command Center", "Screens 3 & 4 provide complete visibility for citizens and military-grade coordination for municipal officials.")

    add_card(s5, 0.8, 2.1, w4, 4.8)
    sc3_box = s5.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(w4 - 0.6), Inches(4.4))
    tf_sc3 = sc3_box.text_frame
    tf_sc3.word_wrap = True
    tf_sc3.paragraphs[0].text = "SCREEN 3 // LIVE TRACKING"
    tf_sc3.paragraphs[0].font.size = Pt(11)
    tf_sc3.paragraphs[0].font.bold = True
    tf_sc3.paragraphs[0].font.color.rgb = ACCENT_AMBER

    p_sc3_h = tf_sc3.add_paragraph()
    p_sc3_h.text = "Complaint #CA1024 Live Tracker"
    p_sc3_h.font.size = Pt(20)
    p_sc3_h.font.bold = True
    p_sc3_h.font.color.rgb = TEXT_WHITE
    p_sc3_h.font.name = "Georgia"
    p_sc3_h.space_before = Pt(6)

    p_sc3_b = tf_sc3.add_paragraph()
    p_sc3_b.text = (
        "✓  Report Submitted (09:14 AM — Citizen photo & voice logged)\n\n"
        "✓  AI Verified (09:15 AM — Vision classified defect, duplicates linked)\n\n"
        "✓  Department Assigned (09:18 AM — Municipal Roads BBMP Works)\n\n"
        "●  Action Pending / In Progress (Crew: Rapid Road Repair Unit #14)\n\n"
        "○  Resolved (Awaiting Before/After AI photo verification)\n\n"
        "SLA Countdown: 18h 42m remaining on guaranteed 24h repair window"
    )
    p_sc3_b.font.size = Pt(12)
    p_sc3_b.font.color.rgb = TEXT_LIGHT
    p_sc3_b.space_before = Pt(10)

    add_card(s5, 6.85, 2.1, w4, 4.8)
    sc4_box = s5.shapes.add_textbox(Inches(7.15), Inches(2.3), Inches(w4 - 0.6), Inches(4.4))
    tf_sc4 = sc4_box.text_frame
    tf_sc4.word_wrap = True
    tf_sc4.paragraphs[0].text = "SCREEN 4 // GOVERNMENT DASHBOARD"
    tf_sc4.paragraphs[0].font.size = Pt(11)
    tf_sc4.paragraphs[0].font.bold = True
    tf_sc4.paragraphs[0].font.color.rgb = ACCENT_GOLD

    p_sc4_h = tf_sc4.add_paragraph()
    p_sc4_h.text = "City Command Center & Tactical Map"
    p_sc4_h.font.size = Pt(20)
    p_sc4_h.font.bold = True
    p_sc4_h.font.color.rgb = TEXT_WHITE
    p_sc4_h.font.name = "Georgia"
    p_sc4_h.space_before = Pt(6)

    p_sc4_b = tf_sc4.add_paragraph()
    p_sc4_b.text = (
        "Big Municipal KPI Counters:\n"
        "• TOTAL ISSUES: 1,284\n"
        "• AI VERIFIED: 936 (72.8% automated triage rate)\n"
        "• HIGH PRIORITY: 142 (Urgent response SLA < 24h)\n"
        "• RESOLVED: 817 (Verified closed)\n\n"
        "Interactive Tactical City Map:\n"
        "🔴 Critical (Pulsing radar ring, e.g. Open Manhole #CA1019)\n"
        "🟠 High (e.g. Road Pothole #CA1024)\n"
        "🟡 Medium (e.g. Streetlight #CA1012)\n"
        "🟢 Resolved (e.g. Garbage Dump #CA1015)\n\n"
        "Clicking any pin opens Inspector Drawer with full AI diagnostics!"
    )
    p_sc4_b.font.size = Pt(11)
    p_sc4_b.font.color.rgb = TEXT_LIGHT
    p_sc4_b.space_before = Pt(8)

    # ==========================================
    # SLIDE 6: SCREEN 5 (PRIORITY ENGINE)
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Screen 5: AI Priority Engine", "Dynamic Mathematical Triage: What Gets Fixed First", "Instead of authorities drowning in hundreds of complaints, the system calculates priority mathematically.")

    add_card(s6, 0.8, 2.0, 11.73, 1.4, BORDER_AMBER)
    f_box = s6.shapes.add_textbox(Inches(1.1), Inches(2.15), Inches(11.1), Inches(1.1))
    tf_f = f_box.text_frame
    tf_f.word_wrap = True
    tf_f.paragraphs[0].text = "PRIORITY ENGINE FORMULA // DYNAMIC RISK SCORING MODEL"
    tf_f.paragraphs[0].font.size = Pt(11)
    tf_f.paragraphs[0].font.bold = True
    tf_f.paragraphs[0].font.color.rgb = ACCENT_AMBER

    p_f2 = tf_f.add_paragraph()
    p_f2.text = "Priority Score = (Severity × 35%) + (Duplicates × 25%) + (Location Importance × 20%) + (Public Impact × 20%)"
    p_f2.font.size = Pt(17)
    p_f2.font.bold = True
    p_f2.font.color.rgb = TEXT_WHITE
    p_f2.space_before = Pt(6)

    p_f3 = tf_f.add_paragraph()
    p_f3.text = "Calculates mathematical urgency so emergency crews dispatch to critical arterial hazards before cosmetic issues."
    p_f3.font.size = Pt(11)
    p_f3.font.color.rgb = TEXT_MUTED
    p_f3.space_before = Pt(4)

    w6 = 2.75
    gap6 = 0.24
    h6 = 3.3
    y6 = 3.65

    factors = [
        ("1. SEVERITY (35%)", ACCENT_ROSE, "Physical Defect Scale", "Evaluates depth, perimeter breach, road base erosion, and collapse risk. A 12cm crater scores 88/100, while hairline surface cracks score 20/100."),
        ("2. DUPLICATES (25%)", ACCENT_AMBER, "Spatial Clustering (110m)", "Automatically aggregates redundant citizen photos within 110m. Rather than 5 duplicate tickets, it increases the urgency multiplier of the primary ticket."),
        ("3. LOCATION (20%)", ACCENT_GOLD, "Corridor Significance", "Correlates coordinates with city transit data. Arterial roads, Metro pillars, tech park corridors, and school zones receive elevated priority weight."),
        ("4. IMPACT (20%)", ACCENT_GREEN, "Commuter & Life Safety", "Quantifies potential harm: two-wheeler skidding risk, peak-hour traffic bottleneck multiplier, and night blind spots.")
    ]

    for idx, (f_title, f_col, f_head, f_desc) in enumerate(factors):
        x = 0.8 + idx * (w6 + gap6)
        add_card(s6, x, y6, w6, h6)
        f_bx = s6.shapes.add_textbox(Inches(x + 0.2), Inches(y6 + 0.25), Inches(w6 - 0.4), Inches(h6 - 0.5))
        tf_item = f_bx.text_frame
        tf_item.word_wrap = True
        tf_item.paragraphs[0].text = f_title
        tf_item.paragraphs[0].font.size = Pt(11)
        tf_item.paragraphs[0].font.bold = True
        tf_item.paragraphs[0].font.color.rgb = f_col

        p_h = tf_item.add_paragraph()
        p_h.text = f_head
        p_h.font.size = Pt(14)
        p_h.font.bold = True
        p_h.font.color.rgb = TEXT_WHITE
        p_h.font.name = "Georgia"
        p_h.space_before = Pt(6)

        p_d = tf_item.add_paragraph()
        p_d.text = f_desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.space_before = Pt(8)

    # ==========================================
    # SLIDE 7: SCREEN 6 (RESOLUTION VERIFICATION)
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Screen 6: Resolution Verification", "Closed-Loop Accountability: Before vs After Quality Audit", "Authority uploads an \"after repair\" photo. AI verifies physical restoration. Citizen has final confirmation veto.")

    w7 = 5.68
    add_card(s7, 0.8, 2.1, w7, 4.8)
    v1_box = s7.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(w7 - 0.6), Inches(4.4))
    tf_v1 = v1_box.text_frame
    tf_v1.word_wrap = True
    tf_v1.paragraphs[0].text = "COMPUTER VISION AUDIT"
    tf_v1.paragraphs[0].font.size = Pt(11)
    tf_v1.paragraphs[0].font.bold = True
    tf_v1.paragraphs[0].font.color.rgb = ACCENT_AMBER

    p_v1_h = tf_v1.add_paragraph()
    p_v1_h.text = "Before ➔ After Visual Comparison"
    p_v1_h.font.size = Pt(20)
    p_v1_h.font.bold = True
    p_v1_h.font.color.rgb = TEXT_WHITE
    p_v1_h.font.name = "Georgia"
    p_v1_h.space_before = Pt(6)

    p_v1_b = tf_v1.add_paragraph()
    p_v1_b.text = (
        "1. Authority Action:\n"
        "Contractor/crew uploads 'After Repair' photo upon field completion.\n\n"
        "2. Interactive Split Slider:\n"
        "Judges and citizens can drag an interactive Before/After comparison slider to inspect the restored asphalt surface.\n\n"
        "3. AI Surface Verification:\n"
        "• Surface Leveling Delta: 0.2cm (PASSED)\n"
        "• Defect Clearance Score: 98.4%\n"
        "• Defect Area Leveled with dense bituminous hot-mix\n\n"
        "AI Verdict: ✅ Issue appears resolved"
    )
    p_v1_b.font.size = Pt(12)
    p_v1_b.font.color.rgb = TEXT_LIGHT
    p_v1_b.space_before = Pt(10)

    add_card(s7, 6.85, 2.1, w7, 4.8, BORDER_AMBER)
    v2_box = s7.shapes.add_textbox(Inches(7.15), Inches(2.3), Inches(w7 - 0.6), Inches(4.4))
    tf_v2 = v2_box.text_frame
    tf_v2.word_wrap = True
    tf_v2.paragraphs[0].text = "CITIZEN GOVERNANCE SIGN-OFF"
    tf_v2.paragraphs[0].font.size = Pt(11)
    tf_v2.paragraphs[0].font.bold = True
    tf_v2.paragraphs[0].font.color.rgb = ACCENT_GREEN

    p_v2_h = tf_v2.add_paragraph()
    p_v2_h.text = "Citizen Confirmation & Ticket Closure"
    p_v2_h.font.size = Pt(20)
    p_v2_h.font.bold = True
    p_v2_h.font.color.rgb = TEXT_WHITE
    p_v2_h.font.name = "Georgia"
    p_v2_h.space_before = Pt(6)

    p_v2_b = tf_v2.add_paragraph()
    p_v2_b.text = (
        "The reporting citizen receives an SMS/web alert with Before & After evidence and holds final authority:\n\n"
        "👍  Resolved:\n"
        "Citizen confirms satisfactory site closure.\n"
        "• Triggers celebration confetti\n"
        "• Increments city Resolved counter (817 ➔ 818)\n"
        "• Formally closes Ticket #CA1024\n\n"
        "❌  Still not fixed:\n"
        "Citizen flags that defect persists or repair was sub-standard.\n"
        "• Immediately reopens ticket to 'In Progress'\n"
        "• Applies high-urgency penalty to department SLA\n"
        "• Eliminates contractor 'ghost closures' permanently!"
    )
    p_v2_b.font.size = Pt(12)
    p_v2_b.font.color.rgb = TEXT_LIGHT
    p_v2_b.space_before = Pt(10)

    # ==========================================
    # SLIDE 8: 60-SECOND DEMO ROADMAP
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Hackathon Demo Flow", "The 60-Second End-to-End Presentation Tour", "A complete, connected demonstration proving real functionality instead of a static mockup.")

    steps = [
        ("Step 1", "Upload Photo", "Citizen captures road crater at Electronic City Gate 3 with voice note."),
        ("Step 2", "AI Detects Defect", "Vision model identifies \"Road Pothole\" with 96.4% confidence & bounding box."),
        ("Step 3", "Calculates Severity", "High severity (88/100) computed based on depth and vehicular hazard."),
        ("Step 4", "Clusters Duplicates", "Detects 3 existing reports within 110m; auto-merges to prevent spam."),
        ("Step 5", "Assigns Department", "Auto-routes to Municipal Roads with guaranteed 24-hour SLA window."),
        ("Step 6", "Appears on Live Map", "Pulsing red/orange tactical pin appears on City Admin command center."),
        ("Step 7", "Admin Dispatches Crew", "Admin changes status to In Progress; crew uploads repair photo."),
        ("Step 8", "AI Verifies & Citizen Confirms", "AI verifies 98.4% clearance; citizen clicks \"👍 Resolved\" to close ticket.")
    ]

    col_w8 = 2.75
    row_h8 = 2.2
    gap_x8 = 0.24
    gap_y8 = 0.25
    y_start8 = 2.1

    for idx, (st_num, st_title, st_desc) in enumerate(steps):
        row = idx // 4
        col = idx % 4
        x = 0.8 + col * (col_w8 + gap_x8)
        y = y_start8 + row * (row_h8 + gap_y8)

        add_card(s8, x, y, col_w8, row_h8)
        b_box = s8.shapes.add_textbox(Inches(x + 0.2), Inches(y + 0.15), Inches(col_w8 - 0.4), Inches(row_h8 - 0.3))
        tf_b = b_box.text_frame
        tf_b.word_wrap = True
        tf_b.paragraphs[0].text = st_num.upper()
        tf_b.paragraphs[0].font.size = Pt(10)
        tf_b.paragraphs[0].font.bold = True
        tf_b.paragraphs[0].font.color.rgb = ACCENT_AMBER

        p_t = tf_b.add_paragraph()
        p_t.text = st_title
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE
        p_t.font.name = "Georgia"
        p_t.space_before = Pt(4)

        p_d = tf_b.add_paragraph()
        p_d.text = st_desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.space_before = Pt(4)

    # ==========================================
    # SLIDE 9: TECHNICAL ARCHITECTURE
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "Technical Architecture", "Production-Ready Stack Built for Resilience & Scale", "Engineered with offline failover, cross-screen synchronization, and high-performance inference.")

    tech_cards = [
        ("FRONTEND CLIENT", ACCENT_AMBER, "React 18 + Vite + Tailwind", [
            "• Lightning-fast Vite dev & production build",
            "• Scrolltide Beacon amber palette styling",
            "• Web Speech API voice speech-to-text",
            "• Web Audio API soundwave frequency synth",
            "• Lucide modern SVG iconography"
        ]),
        ("GEOSPATIAL & GIS", ACCENT_GOLD, "Leaflet + CartoDB Dark GIS", [
            "• Tactical dark tile rendering (CartoDB)",
            "• Radar pulse animations for Critical hazards",
            "• 110m spatial clustering radius",
            "• Geolocation reverse geocoding",
            "• Interactive click-to-inspect drawer"
        ]),
        ("BACKEND INFERENCE", ACCENT_GREEN, "Python FastAPI + Computer Vision", [
            "• High-performance async REST API",
            "• Image defect classification pipeline",
            "• Before/After surface clearance analysis",
            "• Zero-dependency fallback HTTP server",
            "• Conversational CivicBot Assistant API"
        ]),
        ("REAL-TIME SYNC", ACCENT_CREAM, "BroadcastChannel + LocalStorage", [
            "• Dual-Screen presentation support",
            "• Citizen phone tab syncs with Admin laptop",
            "• Zero lag state broadcast across tabs",
            "• Canvas Confetti celebration feedback",
            "• 100% offline hackathon presentation mode"
        ])
    ]

    w9 = 2.75
    gap9 = 0.24
    h9 = 4.8
    y9 = 2.1

    for idx, (t_kicker, t_col, t_head, t_points) in enumerate(tech_cards):
        x = 0.8 + idx * (w9 + gap9)
        add_card(s9, x, y9, w9, h9)
        bx = s9.shapes.add_textbox(Inches(x + 0.2), Inches(y9 + 0.25), Inches(w9 - 0.4), Inches(h9 - 0.5))
        tf_t = bx.text_frame
        tf_t.word_wrap = True
        tf_t.paragraphs[0].text = t_kicker
        tf_t.paragraphs[0].font.size = Pt(11)
        tf_t.paragraphs[0].font.bold = True
        tf_t.paragraphs[0].font.color.rgb = t_col

        p_h = tf_t.add_paragraph()
        p_h.text = t_head
        p_h.font.size = Pt(15)
        p_h.font.bold = True
        p_h.font.color.rgb = TEXT_WHITE
        p_h.font.name = "Georgia"
        p_h.space_before = Pt(6)

        p_pts = tf_t.add_paragraph()
        p_pts.text = "\n\n".join(t_points)
        p_pts.font.size = Pt(11)
        p_pts.font.color.rgb = TEXT_MUTED
        p_pts.space_before = Pt(12)

    # ==========================================
    # SLIDE 10: IMPACT & ROADMAP
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "Civic Impact & Value Proposition", "Measurable Municipal Transformation & Scalability", "CivicAI turns public grievances from a municipal liability into measurable civic performance.")

    metrics = [
        ("68%", "Faster Dispatch", "Direct automated routing eliminates manual call-center sorting bottlenecks."),
        ("92%", "Spam Reduction", "Nearby duplicates within 110m are merged into single high-urgency clusters."),
        ("0%", "Ghost Closures", "Guaranteed by mandatory Before/After AI image verification and citizen sign-off."),
        ("24h", "Strict SLA Adherence", "Real-time countdown timer creates accountability for department field teams.")
    ]

    w10 = 2.75
    gap10 = 0.24
    h10 = 2.2
    y10 = 2.1

    for idx, (m_val, m_head, m_desc) in enumerate(metrics):
        x = 0.8 + idx * (w10 + gap10)
        add_card(s10, x, y10, w10, h10)
        bx = s10.shapes.add_textbox(Inches(x + 0.2), Inches(y10 + 0.2), Inches(w10 - 0.4), Inches(h10 - 0.4))
        tf_m = bx.text_frame
        tf_m.word_wrap = True
        tf_m.paragraphs[0].text = m_val
        tf_m.paragraphs[0].font.size = Pt(36)
        tf_m.paragraphs[0].font.bold = True
        tf_m.paragraphs[0].font.color.rgb = ACCENT_AMBER if idx % 2 == 0 else ACCENT_GOLD

        p_h = tf_m.add_paragraph()
        p_h.text = m_head
        p_h.font.size = Pt(14)
        p_h.font.bold = True
        p_h.font.color.rgb = TEXT_WHITE
        p_h.font.name = "Georgia"
        p_h.space_before = Pt(4)

        p_d = tf_m.add_paragraph()
        p_d.text = m_desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.space_before = Pt(4)

    add_card(s10, 0.8, 4.6, 11.73, 2.3, BORDER_AMBER)
    fut_box = s10.shapes.add_textbox(Inches(1.1), Inches(4.75), Inches(11.1), Inches(2.0))
    tf_fut = fut_box.text_frame
    tf_fut.word_wrap = True
    tf_fut.paragraphs[0].text = "PILOT DEPLOYMENT & FUTURE ROADMAP // BBMP SMART CITY EXPANSION"
    tf_fut.paragraphs[0].font.size = Pt(11)
    tf_fut.paragraphs[0].font.bold = True
    tf_fut.paragraphs[0].font.color.rgb = ACCENT_AMBER

    p_f_h = tf_fut.add_paragraph()
    p_f_h.text = "From Bangalore Pilot to Nationwide Municipal Standard"
    p_f_h.font.size = Pt(17)
    p_f_h.font.bold = True
    p_f_h.font.color.rgb = TEXT_WHITE
    p_f_h.font.name = "Georgia"
    p_f_h.space_before = Pt(4)

    p_f_b = tf_fut.add_paragraph()
    p_f_b.text = (
        "• Phase 1 (Current Prototype): Electronic City & Indiranagar pilot covering Road Potholes, Manholes, Waste, and Streetlights.\n"
        "• Phase 2 (IoT & Dashcam Integration): Integration with municipal bus cameras for automated passive road defect scanning.\n"
        "• Phase 3 (Predictive Maintenance): Machine learning predicting road degradation before severe pothole cratering occurs.\n"
        "• Phase 4 (Open Civic API): Integration with WhatsApp for 1-click citizen reporting without app download requirements."
    )
    p_f_b.font.size = Pt(11)
    p_f_b.font.color.rgb = TEXT_LIGHT
    p_f_b.space_before = Pt(6)

    prs.save(output_filename)
    print(f"Successfully generated Beacon Edition PowerPoint pitch deck: {output_filename}")

if __name__ == "__main__":
    create_deck()
