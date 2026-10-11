import React, { useState, useRef } from 'react';
import {
  Download,
  Smartphone,
  Check,
  Copy,
  Upload,
  RotateCcw,
  Sparkles,
  Layers,
  FileCode,
  Play,
  ShieldCheck,
  Eye,
  CheckCircle2,
  FolderArchive
} from 'lucide-react';
import JSZip from 'jszip';

interface BrandingSectionProps {
  logoUrl: string;
  onCustomLogoChange: (url: string | null) => void;
  onTriggerSplash: () => void;
  isCustomLogo: boolean;
}

type AdaptiveMask = 'circle' | 'squircle' | 'rounded' | 'teardrop';

export const BrandingSection: React.FC<BrandingSectionProps> = ({
  logoUrl,
  onCustomLogoChange,
  onTriggerSplash,
  isCustomLogo,
}) => {
  const [activeMask, setActiveMask] = useState<AdaptiveMask>('circle');
  const [showSafeZone, setShowSafeZone] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isGeneratingZip, setIsGeneratingZip] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onCustomLogoChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const getMaskClass = (mask: AdaptiveMask) => {
    switch (mask) {
      case 'circle':
        return 'rounded-full';
      case 'squircle':
        return 'rounded-[32%]';
      case 'rounded':
        return 'rounded-2xl';
      case 'teardrop':
        return 'rounded-full rounded-br-md';
      default:
        return 'rounded-full';
    }
  };

  // Generate canvas icon buffer for dynamic custom or official logo
  const renderCanvasIcon = (size: number, isRound: boolean): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (isRound) {
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.clip();
        }
        ctx.drawImage(img, 0, 0, size, size);
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      };
      img.src = logoUrl;
    });
  };

  // Generate dynamic Android Zip for the current logo (whether official or uploaded)
  const handleDownloadZip = async () => {
    if (!isCustomLogo) {
      // Direct server-rendered pristine zip
      const link = document.createElement('a');
      link.href = '/android-launcher-assets.zip';
      link.download = 'diploma_engineering_calculator_android_assets.zip';
      link.click();
      return;
    }

    // Generate custom package dynamically using JSZip and HTML5 Canvas
    setIsGeneratingZip(true);
    try {
      const zip = new JSZip();
      const res = zip.folder('res')!;

      const densities = [
        { name: 'mipmap-mdpi', size: 48 },
        { name: 'mipmap-hdpi', size: 72 },
        { name: 'mipmap-xhdpi', size: 96 },
        { name: 'mipmap-xxhdpi', size: 144 },
        { name: 'mipmap-xxxhdpi', size: 192 },
      ];

      for (const d of densities) {
        const folder = res.folder(d.name)!;
        const squareBlob = await renderCanvasIcon(d.size, false);
        const roundBlob = await renderCanvasIcon(d.size, true);
        folder.file('ic_launcher.png', squareBlob);
        folder.file('ic_launcher_round.png', roundBlob);
      }

      // 512 Play store
      const playstoreBlob = await renderCanvasIcon(512, false);
      zip.file('playstore-icon-512.png', playstoreBlob);

      // Adaptive XMLs
      const anydpi = res.folder('mipmap-anydpi-v26')!;
      anydpi.file('ic_launcher.xml', adaptiveXmlSnippet);
      anydpi.file('ic_launcher_round.xml', adaptiveXmlSnippet);

      const values = res.folder('values')!;
      values.file(
        'ic_launcher_background.xml',
        `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0F172A</color>\n</resources>`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'diploma_engineering_custom_android_assets.zip';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const adaptiveXmlSnippet = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>`;

  const manifestXmlSnippet = `<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:label="@string/app_name"
    android:theme="@style/AppTheme">`;

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Logo Showcase Box: Strict 1:1 aspect ratio, centered, un-stretched, zero text over artwork */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 bg-slate-950 rounded-2xl p-3 shadow-2xl border-2 border-blue-400/40 flex items-center justify-center relative group">
            <img
              src={logoUrl}
              alt="Official MathSphere Logo"
              className="w-full h-full object-contain select-none"
            />
            {isCustomLogo && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                Custom
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-sm border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Official Brand Identity & Launcher Standard
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              MathSphere
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Consistently applied across the Android Launcher Icon (adaptive safe-zone calibrated), application splash screen, and header. Zero logo distortion, centered presentation, and pure iconography.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5 justify-center md:justify-start">
              <button
                onClick={onTriggerSplash}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                Preview Splash Screen
              </button>

              <button
                onClick={handleDownloadZip}
                disabled={isGeneratingZip}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <FolderArchive className="w-3.5 h-3.5 text-blue-600" />
                {isGeneratingZip ? 'Generating Package...' : 'Download Android Launcher Assets (.zip)'}
              </button>

              <a
                href={logoUrl}
                download="diploma_engineering_logo.svg"
                className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Master Logo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Upload/Replace Official Logo Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`p-5 rounded-2xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
          dragOver
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
        }`}
      >
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Official Logo File Uploader
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag & drop any image file (PNG, JPG, SVG) here, or browse from your device. Updates branding instantly everywhere.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>

          {isCustomLogo && (
            <button
              onClick={() => onCustomLogoChange(null)}
              className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
              title="Reset to default official emblem"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Official Logo
            </button>
          )}
        </div>
      </div>

      {/* Android Adaptive Launcher Icon Simulator */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Android Adaptive Launcher Icon Simulator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verify proper centering, 1:1 aspect ratio, and safe-zone margin under all Android OEM mask shapes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSafeZone(!showSafeZone)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                showSafeZone
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-600 dark:text-blue-400'
                  : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {showSafeZone ? 'Hide Safe Zone Guide' : 'Show Safe Zone Guide'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Live Launcher Simulation Phone Canvas */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">
            {/* Mask Shape Toggle */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
              {(['circle', 'squircle', 'rounded', 'teardrop'] as AdaptiveMask[]).map((mask) => (
                <button
                  key={mask}
                  onClick={() => setActiveMask(mask)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                    activeMask === mask
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {mask}
                </button>
              ))}
            </div>

            {/* Icon Mask Container */}
            <div className="relative flex items-center justify-center">
              <div
                className={`w-36 h-36 sm:w-40 sm:h-40 shadow-2xl transition-all duration-300 overflow-hidden bg-slate-950 border-4 border-slate-800 relative flex items-center justify-center ${getMaskClass(
                  activeMask
                )}`}
              >
                <img
                  src={logoUrl}
                  alt="Adaptive Icon Live Simulation"
                  className="w-full h-full object-contain select-none"
                />

                {/* 72dp Android Safe Zone Circle Guide Overlay */}
                {showSafeZone && (
                  <div
                    className="absolute inset-[17%] rounded-full border-2 border-dashed border-emerald-400/80 pointer-events-none flex items-center justify-center"
                    title="72dp Android Safe Zone (Content stays fully inside)"
                  >
                    <span className="text-[9px] font-mono font-bold text-emerald-400 bg-slate-950/80 px-1 rounded">
                      72dp Safe
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">
                Android {activeMask} Launcher Icon
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                108dp Canvas (432×432 px) with centered 72dp safe core
              </p>
            </div>
          </div>

          {/* Android Adaptive Layer Specs */}
          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Android Adaptive Icon Architecture (API 26+)</span>
            </div>

            <p className="leading-relaxed">
              Android Adaptive Icons consist of two distinct layers configured together: a foreground emblem layer and a background layer. The system dynamically crops both layers to the device's selected launcher mask (Circle on Pixel, Squircle on Samsung One UI).
            </p>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-900 dark:text-white">Centered Safe Zone:</b> 72dp diameter circle guarantees that no portion of the diploma cap, gear, or math reticle is clipped.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-900 dark:text-white">No Text Over Logo:</b> All labeling is in the app launcher metadata, leaving the logo clean and recognizable.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-900 dark:text-white">1:1 Strict Aspect Ratio:</b> Handled via SVG viewBox and explicit width/height constraints to eliminate stretching.
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="/android/ic_launcher_foreground.png"
                download="ic_launcher_foreground.png"
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" />
                Foreground Layer (432px)
              </a>

              <a
                href="/android/ic_launcher_background.png"
                download="ic_launcher_background.png"
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500 transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" />
                Background Layer (432px)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Android Mipmap Densities Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Generated Android Launcher Icon Densities
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Standard resolution mipmap folders for Android Studio <code className="font-mono">app/src/main/res/</code>
            </p>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isGeneratingZip}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {isGeneratingZip ? 'Preparing...' : 'Download All (.zip)'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'mdpi', size: '48×48', factor: '1× Baseline', path: '/android/mipmap-mdpi/ic_launcher.png' },
            { name: 'hdpi', size: '72×72', factor: '1.5× High', path: '/android/mipmap-hdpi/ic_launcher.png' },
            { name: 'xhdpi', size: '96×96', factor: '2.0× Extra High', path: '/android/mipmap-xhdpi/ic_launcher.png' },
            { name: 'xxhdpi', size: '144×144', factor: '3.0× Ultra High', path: '/android/mipmap-xxhdpi/ic_launcher.png' },
            { name: 'xxxhdpi', size: '192×192', factor: '4.0× Max High', path: '/android/mipmap-xxxhdpi/ic_launcher.png' },
            { name: 'Play Store', size: '512×512', factor: 'Store 32-bit', path: '/android/playstore-icon.png' },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700/80 flex flex-col items-center text-center space-y-2"
            >
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase">
                {item.name}
              </span>

              <div className="w-14 h-14 bg-slate-950 rounded-xl p-1.5 flex items-center justify-center border border-slate-800 shadow-inner">
                <img
                  src={logoUrl}
                  alt={`${item.name} launcher icon`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                <div className="font-bold text-slate-700 dark:text-slate-300">{item.size}</div>
                <div className="text-[9px] text-blue-500 font-mono">{item.factor}</div>
              </div>

              <a
                href={item.path}
                download={`ic_launcher_${item.name}.png`}
                className="w-full py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-[10px] font-semibold text-slate-700 dark:text-slate-200 transition flex items-center justify-center gap-1 shadow-sm"
              >
                <Download className="w-3 h-3" />
                PNG
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Android Studio XML Code Helper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Adaptive Icon Definition */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-blue-500" />
              res/mipmap-anydpi-v26/ic_launcher.xml
            </span>
            <button
              onClick={() => handleCopy(adaptiveXmlSnippet, 'adaptiveXml')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedCode === 'adaptiveXml' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copiedCode === 'adaptiveXml' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-3 rounded-lg bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
            {adaptiveXmlSnippet}
          </pre>
        </div>

        {/* AndroidManifest.xml Entry */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-blue-500" />
              AndroidManifest.xml Application Entry
            </span>
            <button
              onClick={() => handleCopy(manifestXmlSnippet, 'manifestXml')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedCode === 'manifestXml' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              {copiedCode === 'manifestXml' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-3 rounded-lg bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
            {manifestXmlSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
