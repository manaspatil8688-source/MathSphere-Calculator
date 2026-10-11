import os
import subprocess

# Define the Master Full Logo SVG (512x512)
master_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>

    <!-- Glowing Radial Backlight -->
    <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#2563eb" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0"/>
    </radialGradient>

    <!-- Gear Metallic Blue Gradient -->
    <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="50%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1e40af"/>
    </linearGradient>

    <!-- Inner Core Gradient -->
    <linearGradient id="coreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>

    <!-- Gold Accent Gradient for Academic Tassel & Highlights -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>

    <!-- Mortarboard Cap Shading -->
    <linearGradient id="capTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="40%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>

    <linearGradient id="capRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e40af"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <filter id="subtleShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Base Rounded Container for Adaptive Safe Canvas -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  
  <!-- Outer Tech Border Ring -->
  <rect x="12" y="12" width="488" height="488" rx="100" fill="none" stroke="#3b82f6" stroke-width="2" stroke-opacity="0.35"/>
  <rect x="24" y="24" width="464" height="464" rx="88" fill="none" stroke="#1d4ed8" stroke-width="1.5" stroke-dasharray="8 8" stroke-opacity="0.25"/>

  <!-- Center Ambient Glow -->
  <circle cx="256" cy="265" r="185" fill="url(#glowGrad)"/>

  <!-- TECHNICAL BLUEPRINT GRID ACCENTS -->
  <g opacity="0.15" stroke="#93c5fd" stroke-width="1.2">
    <!-- Concentric Technical Radar Circles -->
    <circle cx="256" cy="275" r="148" fill="none" stroke-dasharray="4 6"/>
    <circle cx="256" cy="275" r="110" fill="none"/>
    <circle cx="256" cy="275" r="70" fill="none" stroke-dasharray="3 4"/>
    <!-- Crosshairs -->
    <line x1="256" y1="95" x2="256" y2="445"/>
    <line x1="85" y1="275" x2="427" y2="275"/>
    <!-- Degree ticks -->
    <line x1="256" y1="120" x2="256" y2="128" stroke-width="2"/>
    <line x1="256" y1="422" x2="256" y2="430" stroke-width="2"/>
    <line x1="103" y1="275" x2="111" y2="275" stroke-width="2"/>
    <line x1="401" y1="275" x2="409" y2="275" stroke-width="2"/>
  </g>

  <!-- ================= MASTER ICON EMBLEM (SAFE-ZONE CENTERED) ================= -->
  <g filter="url(#shadowFilter)">

    <!-- ENGINEERING PRECISION GEAR (12-Teeth Cog) -->
    <g transform="translate(256, 280)">
      <!-- Outer Gear Body -->
      <path d="
        M -24 -115 L 24 -115 L 28 -88 A 92 92 0 0 1 65 -73 L 89 -87 L 123 -53 L 109 -29 A 92 92 0 0 1 124 8 L 151 12 L 151 60 L 124 64 A 92 92 0 0 1 109 101 L 123 125 L 89 159 L 65 145 A 92 92 0 0 1 28 160 L 24 187 L -24 187 L -28 160 A 92 92 0 0 1 -65 145 L -89 159 L -123 125 L -109 101 A 92 92 0 0 1 -124 64 L -151 60 L -151 12 L -124 8 A 92 92 0 0 1 -109 -29 L -123 -53 L -89 -87 L -65 -73 A 92 92 0 0 1 -28 -88 Z
      " fill="url(#gearGrad)" stroke="#93c5fd" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Inner Precision Rim -->
      <circle cx="0" cy="36" r="68" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
      <circle cx="0" cy="36" r="54" fill="url(#bgGrad)" stroke="#1d4ed8" stroke-width="1.5" stroke-dasharray="5 4"/>

      <!-- Technical Compass / Calculation Reticle Core -->
      <g stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round">
        <!-- Drafting Compass Pivot Point -->
        <circle cx="0" cy="18" r="5" fill="url(#goldGrad)" stroke="#ca8a04" stroke-width="1.5"/>
        <!-- Compass Legs -->
        <line x1="0" y1="18" x2="-22" y2="58"/>
        <line x1="0" y1="18" x2="22" y2="58"/>
        <!-- Caliper Cross Bar -->
        <path d="M -14 38 Q 0 44 14 38" fill="none" stroke="url(#goldGrad)" stroke-width="2"/>
        <!-- Center Precision Dot -->
        <circle cx="0" cy="36" r="2.5" fill="#fde047"/>
      </g>
    </g>

    <!-- DIPLOMA ACADEMIC GRADUATION CAP (MORTARBOARD) -->
    <g transform="translate(256, 172)" filter="url(#subtleShadow)">
      <!-- Cap Skull Cap Underneath -->
      <path d="M -58 14 C -58 46 58 46 58 14 C 58 24 42 42 0 46 C -42 42 -58 24 -58 14 Z" fill="url(#capRimGrad)" stroke="#1e3a8a" stroke-width="1.5"/>

      <!-- Cap Diamond Top (Rhombus) with 3D Depth -->
      <!-- Lower 3D Edge Bevel -->
      <path d="M 0 -38 L 138 2 L 0 42 L -138 2 Z" fill="#1e3a8a"/>
      <path d="M -138 2 L 0 42 L 138 2 L 138 10 L 0 50 L -138 10 Z" fill="#0f172a"/>
      
      <!-- Top Face of Mortarboard -->
      <path d="M 0 -42 L 138 -2 L 0 38 L -138 -2 Z" fill="url(#capTopGrad)" stroke="#7dd3fc" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Subtle Geometric Top Highlight Facet -->
      <path d="M 0 -42 L 138 -2 L 0 38 Z" fill="#ffffff" fill-opacity="0.12"/>

      <!-- Center Gold Button -->
      <ellipse cx="0" cy="-2" rx="9" ry="7" fill="url(#goldGrad)" stroke="#a16207" stroke-width="1.5"/>

      <!-- Golden Academic Tassel Ribbon & Fob -->
      <g stroke="url(#goldGrad)" fill="none" stroke-linecap="round">
        <!-- Tassel String draping across and hanging down the right edge -->
        <path d="M 0 -2 Q 65 -14 104 12 Q 118 24 116 52" stroke-width="3"/>
        <!-- Tassel Band -->
        <ellipse cx="116" cy="52" rx="4" ry="2.5" fill="#ca8a04"/>
        <!-- Tassel Fringe Body -->
        <path d="M 112 54 L 110 82 L 122 82 L 120 54 Z" fill="url(#goldGrad)" stroke="#ca8a04" stroke-width="1"/>
      </g>
    </g>

    <!-- Golden Diploma Ribbon Badge of Excellence at Bottom -->
    <g transform="translate(256, 400)">
      <circle cx="0" cy="0" r="16" fill="url(#goldGrad)" stroke="#a16207" stroke-width="2"/>
      <polygon points="0,-9 2.5,-3 8.5,-3 3.8,1 5.5,7 0,3.5 -5.5,7 -3.8,1 -8.5,-3 -2.5,-3" fill="#ffffff"/>
      <!-- Small left and right ribbon tails -->
      <path d="M -14 6 L -24 22 L -14 18 L -6 22 Z" fill="url(#goldGrad)" stroke="#a16207" stroke-width="1"/>
      <path d="M 14 6 L 24 22 L 14 18 L 6 22 Z" fill="url(#goldGrad)" stroke="#a16207" stroke-width="1"/>
    </g>

  </g>
</svg>
'''

# Android Adaptive Icon Foreground SVG (432x432, transparent background, emblem perfectly centered in 260px safe circle)
foreground_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="100%" height="100%">
  <defs>
    <linearGradient id="afGlowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="afGearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="50%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1e40af"/>
    </linearGradient>
    <linearGradient id="afGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="afCapTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="40%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="afCapRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e40af"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <filter id="afShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.55"/>
    </filter>
  </defs>

  <!-- Safe Zone Guide: 260px circle centered at (216, 216). Scaled emblem fits cleanly inside. -->
  <g transform="translate(216, 216) scale(0.68) translate(-256, -265)" filter="url(#afShadow)">
    <!-- Glow -->
    <circle cx="256" cy="275" r="140" fill="url(#afGlowGrad)"/>

    <!-- Gear -->
    <g transform="translate(256, 280)">
      <path d="
        M -24 -115 L 24 -115 L 28 -88 A 92 92 0 0 1 65 -73 L 89 -87 L 123 -53 L 109 -29 A 92 92 0 0 1 124 8 L 151 12 L 151 60 L 124 64 A 92 92 0 0 1 109 101 L 123 125 L 89 159 L 65 145 A 92 92 0 0 1 28 160 L 24 187 L -24 187 L -28 160 A 92 92 0 0 1 -65 145 L -89 159 L -123 125 L -109 101 A 92 92 0 0 1 -124 64 L -151 60 L -151 12 L -124 8 A 92 92 0 0 1 -109 -29 L -123 -53 L -89 -87 L -65 -73 A 92 92 0 0 1 -28 -88 Z
      " fill="url(#afGearGrad)" stroke="#93c5fd" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="0" cy="36" r="68" fill="#0f172a" stroke="#38bdf8" stroke-width="3.5"/>
      <circle cx="0" cy="36" r="54" fill="#0b132b" stroke="#1d4ed8" stroke-width="2" stroke-dasharray="6 4"/>
      <g stroke="#38bdf8" stroke-width="3" stroke-linecap="round">
        <circle cx="0" cy="18" r="6" fill="url(#afGoldGrad)" stroke="#ca8a04" stroke-width="1.5"/>
        <line x1="0" y1="18" x2="-22" y2="58"/>
        <line x1="0" y1="18" x2="22" y2="58"/>
        <path d="M -14 38 Q 0 44 14 38" fill="none" stroke="url(#afGoldGrad)" stroke-width="2.5"/>
        <circle cx="0" cy="36" r="3" fill="#fde047"/>
      </g>
    </g>

    <!-- Mortarboard -->
    <g transform="translate(256, 172)">
      <path d="M -58 14 C -58 46 58 46 58 14 C 58 24 42 42 0 46 C -42 42 -58 24 -58 14 Z" fill="url(#afCapRimGrad)" stroke="#1e3a8a" stroke-width="2"/>
      <path d="M -138 2 L 0 42 L 138 2 L 138 10 L 0 50 L -138 10 Z" fill="#0f172a"/>
      <path d="M 0 -42 L 138 -2 L 0 38 L -138 -2 Z" fill="url(#afCapTopGrad)" stroke="#7dd3fc" stroke-width="3" stroke-linejoin="round"/>
      <path d="M 0 -42 L 138 -2 L 0 38 Z" fill="#ffffff" fill-opacity="0.14"/>
      <ellipse cx="0" cy="-2" rx="10" ry="8" fill="url(#afGoldGrad)" stroke="#a16207" stroke-width="1.5"/>
      <g stroke="url(#afGoldGrad)" fill="none" stroke-linecap="round">
        <path d="M 0 -2 Q 65 -14 104 12 Q 118 24 116 52" stroke-width="3.5"/>
        <ellipse cx="116" cy="52" rx="4.5" ry="3" fill="#ca8a04"/>
        <path d="M 112 54 L 110 82 L 122 82 L 120 54 Z" fill="url(#afGoldGrad)" stroke="#ca8a04" stroke-width="1"/>
      </g>
    </g>

    <!-- Golden Diploma Ribbon Badge -->
    <g transform="translate(256, 400)">
      <circle cx="0" cy="0" r="18" fill="url(#afGoldGrad)" stroke="#a16207" stroke-width="2"/>
      <polygon points="0,-10 3,-3 9,-3 4.2,1.5 6,8 0,4 -6,8 -4.2,1.5 -9,-3 -3,-3" fill="#ffffff"/>
      <path d="M -15 6 L -26 23 L -15 19 L -7 23 Z" fill="url(#afGoldGrad)" stroke="#a16207" stroke-width="1"/>
      <path d="M 15 6 L 26 23 L 15 19 L 7 23 Z" fill="url(#afGoldGrad)" stroke="#a16207" stroke-width="1"/>
    </g>
  </g>
</svg>
'''

# Android Adaptive Icon Background SVG (432x432)
background_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="100%" height="100%">
  <defs>
    <linearGradient id="abgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="60%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>
    <radialGradient id="abgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="432" height="432" fill="url(#abgGrad)"/>
  <circle cx="216" cy="216" r="170" fill="url(#abgGlow)"/>
  <g opacity="0.12" stroke="#60a5fa" stroke-width="1">
    <circle cx="216" cy="216" r="140" fill="none" stroke-dasharray="4 6"/>
    <circle cx="216" cy="216" r="100" fill="none"/>
    <circle cx="216" cy="216" r="60" fill="none" stroke-dasharray="3 4"/>
    <line x1="216" y1="20" x2="216" y2="412"/>
    <line x1="20" y1="216" x2="412" y2="216"/>
  </g>
</svg>
'''

# Write SVG files
base_dir = '/app/applet'
with open(f'{base_dir}/public/logo.svg', 'w') as f:
    f.write(master_svg)

with open(f'{base_dir}/public/ic_launcher_foreground.svg', 'w') as f:
    f.write(foreground_svg)

with open(f'{base_dir}/public/ic_launcher_background.svg', 'w') as f:
    f.write(background_svg)

# Also generate favicon and web manifest assets
sizes = {
    'public/favicon.ico': 48,
    'public/favicon.png': 64,
    'public/icon-192.png': 192,
    'public/icon-512.png': 512,
    'public/android/playstore-icon.png': 512,
    'public/android/mipmap-mdpi/ic_launcher.png': 48,
    'public/android/mipmap-hdpi/ic_launcher.png': 72,
    'public/android/mipmap-xhdpi/ic_launcher.png': 96,
    'public/android/mipmap-xxhdpi/ic_launcher.png': 144,
    'public/android/mipmap-xxxhdpi/ic_launcher.png': 192,
}

for path, size in sizes.items():
    full_path = f"{base_dir}/{path}"
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    cmd = ["convert", "-background", "none", f"{base_dir}/public/logo.svg", "-resize", f"{size}x{size}", full_path]
    subprocess.run(cmd, check=True)
    print(f"Generated {full_path} ({size}x{size})")

# Generate adaptive foreground and background raster PNGs (432x432)
subprocess.run(["convert", "-background", "none", f"{base_dir}/public/ic_launcher_foreground.svg", "-resize", "432x432", f"{base_dir}/public/android/ic_launcher_foreground.png"], check=True)
subprocess.run(["convert", "-background", "none", f"{base_dir}/public/ic_launcher_background.svg", "-resize", "432x432", f"{base_dir}/public/android/ic_launcher_background.png"], check=True)

# Generate round launcher icons for each density (with circle clip)
round_densities = [
    ('mipmap-mdpi', 48),
    ('mipmap-hdpi', 72),
    ('mipmap-xhdpi', 96),
    ('mipmap-xxhdpi', 144),
    ('mipmap-xxxhdpi', 192),
]

for dname, dsize in round_densities:
    out_round = f"{base_dir}/public/android/{dname}/ic_launcher_round.png"
    # Clip to circle using ImageMagick
    cmd = [
        "convert",
        f"{base_dir}/public/android/{dname}/ic_launcher.png",
        "(",
        "+clone",
        "-alpha", "extract",
        "-draw", f"fill black polygon 0,0 0,{dsize} {dsize},{dsize} {dsize},0 fill white circle {dsize/2},{dsize/2} {dsize/2},1",
        ")",
        "-alpha", "off",
        "-compose", "CopyOpacity",
        "-composite",
        out_round
    ]
    subprocess.run(cmd, check=True)
    print(f"Generated round icon {out_round}")

print("All Android launcher icons and logo assets generated successfully!")
