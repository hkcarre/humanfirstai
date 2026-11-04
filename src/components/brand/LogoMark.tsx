import React from 'react';
import { LogoRoute } from '../../types/brand';

export interface LogoMarkProps {
  route?: LogoRoute;
  colorScheme?: 'full' | 'ink' | 'teal' | 'sunrise' | 'white' | 'black' | 'photocopy';
  lockup?: 'symbol' | 'horizontal' | 'stacked' | 'descriptor' | 'chapter';
  chapterName?: string;
  size?: number; // base size in pixels
  showClearSpace?: boolean;
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({
  route = 'open-door',
  colorScheme = 'full',
  lockup = 'horizontal',
  chapterName = 'Nairobi',
  size = 48,
  showClearSpace = false,
  className = '',
}) => {
  // Resolve primary, accent and secondary colors based on colorScheme
  let primaryColor = '#1F2A44'; // Deep Ink
  let accentColor = '#FF8A3D';  // Sunrise
  let tealColor = '#187F72';    // Teal
  let beamColor = 'rgba(255, 138, 61, 0.22)';
  let textColor = '#1F2A44';
  let mutedTextColor = '#5B6987';
  let dividerColor = 'rgba(31, 42, 68, 0.25)';

  if (colorScheme === 'ink') {
    primaryColor = '#1F2A44';
    accentColor = '#1F2A44';
    tealColor = '#1F2A44';
    beamColor = 'rgba(31, 42, 68, 0.12)';
    textColor = '#1F2A44';
    mutedTextColor = '#4A5568';
    dividerColor = 'rgba(31, 42, 68, 0.3)';
  } else if (colorScheme === 'teal') {
    primaryColor = '#187F72';
    accentColor = '#187F72';
    tealColor = '#187F72';
    beamColor = 'rgba(26, 140, 126, 0.15)';
    textColor = '#187F72';
    mutedTextColor = '#187F72';
    dividerColor = 'rgba(26, 140, 126, 0.3)';
  } else if (colorScheme === 'sunrise') {
    primaryColor = '#FF8A3D';
    accentColor = '#FF8A3D';
    tealColor = '#FF8A3D';
    beamColor = 'rgba(255, 138, 61, 0.2)';
    textColor = '#FF8A3D';
    mutedTextColor = '#FF8A3D';
    dividerColor = 'rgba(255, 138, 61, 0.4)';
  } else if (colorScheme === 'white') {
    primaryColor = '#FFFFFF';
    accentColor = '#FF8A3D';
    tealColor = '#7CC4F2';
    beamColor = 'rgba(255, 255, 255, 0.25)';
    textColor = '#FFFFFF';
    mutedTextColor = '#E2E8F0';
    dividerColor = 'rgba(255, 255, 255, 0.35)';
  } else if (colorScheme === 'black' || colorScheme === 'photocopy') {
    primaryColor = '#000000';
    accentColor = '#000000';
    tealColor = '#000000';
    beamColor = colorScheme === 'photocopy' ? 'rgba(0, 0, 0, 0.18)' : 'rgba(0, 0, 0, 0.08)';
    textColor = '#000000';
    mutedTextColor = '#333333';
    dividerColor = '#000000';
  }

  // Symbol renderer
  const renderSymbol = (dim: number) => {
    if (route === 'open-door') {
      // The Open Door — v2. Canonical geometry: see docs/03-logo.md and
      // tools/lib/brand.mjs, which generates every exported logo file.
      //
      // 64u construction grid, every value on a 0.5u step. The lit opening is
      // enclosed by ink on all four sides, so Sunrise (2.19:1 on cream) never
      // meets a light background directly — WCAG 1.4.11 holds by construction.
      const micro = dim <= 24;              // separate build, not a scaled one
      const stroke = micro ? 6 : 5;
      const half = stroke / 2;
      const frameL = 24.5, frameR = 54.5;   // frame centreline, r = 15
      const openL = frameL + half;
      const openR = frameR - half;
      const rIn = 15 - half;
      const leafR = Math.round((frameL - half - 2) * 2) / 2;
      const showLit = colorScheme === 'full' || colorScheme === 'white';
      const litFill = showLit ? accentColor : primaryColor;

      return (
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Human First AI — the Open Door mark"
          className="shrink-0 transition-transform duration-200"
        >
          <title>Human First AI — the Open Door mark</title>

          {/* The lit opening */}
          {showLit && (
            <path
              d={`M${openL},51.5 L${openL},30 A${rIn},${rIn} 0 0 1 ${openR},30 L${openR},51.5 Z`}
              fill={litFill}
            />
          )}

          {/* The arched doorway frame */}
          <path
            d={`M${frameL},51.5 L${frameL},30 A15,15 0 0 1 ${frameR},30 L${frameR},51.5`}
            fill="none"
            stroke={primaryColor}
            strokeWidth={stroke}
          />

          {/* The door, swung open at exactly 30° */}
          <path d={`M${leafR},51.5 L${leafR},16.5 L7,9 L7,51.5 Z`} fill={primaryColor} />

          {/* The handle — the only detail dropped in the micro build */}
          {!micro && <circle cx="10.5" cy="34" r="2.4" fill={litFill} />}

          {/* The ground it stands on */}
          <rect x="3" y="51.5" width="58" height={micro ? 4 : 3.5} fill={primaryColor} />
        </svg>
      );
    }

    if (route === 'many-as-one') {
      // Route 2: Many As One (Concentric communal arcs gathering into an open ring)
      return (
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M 50 18 A 32 32 0 0 1 82 50"
            stroke={primaryColor}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 82 56 A 32 32 0 0 1 34 78"
            stroke={colorScheme === 'full' ? accentColor : primaryColor}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 26 70 A 32 32 0 0 1 24 38"
            stroke={colorScheme === 'full' ? tealColor : primaryColor}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="8"
            fill={colorScheme === 'full' ? accentColor : primaryColor}
          />
        </svg>
      );
    }

    if (route === 'monogram') {
      // Route 3: Human-Led Monogram ('H' where the crossbar bridges an open human archway)
      return (
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          {/* Left Pillar */}
          <rect x="22" y="20" width="8" height="60" rx="4" fill={primaryColor} />
          {/* Right Pillar */}
          <rect x="70" y="20" width="8" height="60" rx="4" fill={primaryColor} />
          {/* Bridging Arch / Threshold */}
          <path
            d="M 30 52 C 30 38, 70 38, 70 52"
            stroke={colorScheme === 'full' ? tealColor : primaryColor}
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Central Human Silhouette Head & Body */}
          <circle
            cx="50"
            cy="46"
            r="6"
            fill={colorScheme === 'full' ? accentColor : primaryColor}
          />
          <path
            d="M 42 66 C 42 56, 58 56, 58 66 V 80 H 42 Z"
            fill={colorScheme === 'full' ? accentColor : primaryColor}
          />
        </svg>
      );
    }

    // Route 4: The Shared Dawn
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <line x1="16" y1="76" x2="84" y2="76" stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
        <path
          d="M 28 76 A 22 22 0 0 1 72 76 Z"
          fill={colorScheme === 'full' ? accentColor : primaryColor}
        />
        <path
          d="M 50 26 V 40"
          stroke={colorScheme === 'full' ? tealColor : primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 32 36 L 40 46"
          stroke={primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 68 36 L 60 46"
          stroke={primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  // Typography scaling derived from base size
  const titleFontSize = Math.max(14, Math.round(size * 0.44));
  const subFontSize = Math.max(9, Math.round(size * 0.24));

  // Wordmark element with "Human" leading visually
  const renderWordmark = () => (
    <div className="flex flex-col justify-center leading-none select-none">
      <div className="flex items-baseline tracking-tight">
        {/* "Human" leads by weight. That is the argument of the brand, set as type. */}
        <span
          style={{
            fontSize: `${titleFontSize}px`,
            fontWeight: 800,
            color: textColor,
            letterSpacing: '-0.02em',
          }}
          className="font-brand"
        >
          Human
        </span>
        <span
          style={{
            fontSize: `${titleFontSize}px`,
            fontWeight: 500,
            color: textColor,
            letterSpacing: '-0.02em',
            marginLeft: `${Math.max(4, Math.round(size * 0.1))}px`,
          }}
          className="font-brand"
        >
          First
        </span>
        {/* "AI" is smaller, quieter, and never in Sunrise — 2.19:1 on cream is
            unreadable, and v1 set the brand's quietest word in it at full size. */}
        <span
          style={{
            fontSize: `${titleFontSize * 0.84}px`,
            fontWeight: 700,
            color: textColor,
            letterSpacing: '0.03em',
            marginLeft: `${Math.max(6, Math.round(size * 0.12))}px`,
          }}
          className="font-brand uppercase"
        >
          AI
        </span>
      </div>

      {lockup === 'descriptor' && (
        <span
          style={{
            fontSize: `${subFontSize}px`,
            fontWeight: 600,
            letterSpacing: '0.18em',
            color: mutedTextColor,
            marginTop: `${Math.max(2, Math.round(size * 0.06))}px`,
          }}
          className="font-brand uppercase"
        >
          Global Movement
        </span>
      )}
    </div>
  );

  // Clear space overlay box (1X padding where X is capital 'H' height)
  const clearSpacePadding = Math.round(size * 0.35);

  const content = (
    <div
      className={`inline-flex items-center transition-all ${
        colorScheme === 'photocopy' ? 'contrast-150 grayscale' : ''
      } ${className}`}
    >
      {lockup === 'symbol' && renderSymbol(size)}

      {lockup === 'horizontal' && (
        <div className="inline-flex items-center" style={{ gap: `${Math.max(8, Math.round(size * 0.22))}px` }}>
          {renderSymbol(size)}
          {renderWordmark()}
        </div>
      )}

      {lockup === 'stacked' && (
        <div className="inline-flex flex-col items-center text-center" style={{ gap: `${Math.max(6, Math.round(size * 0.18))}px` }}>
          {renderSymbol(size)}
          {renderWordmark()}
        </div>
      )}

      {lockup === 'descriptor' && (
        <div className="inline-flex items-center" style={{ gap: `${Math.max(8, Math.round(size * 0.22))}px` }}>
          {renderSymbol(size)}
          {renderWordmark()}
        </div>
      )}

      {lockup === 'chapter' && (
        <div className="inline-flex items-center flex-wrap" style={{ gap: `${Math.max(8, Math.round(size * 0.22))}px` }}>
          {renderSymbol(size)}
          {renderWordmark()}
          <div
            style={{
              width: '1.5px',
              height: `${titleFontSize * 0.9}px`,
              backgroundColor: dividerColor,
              margin: `0 ${Math.max(2, Math.round(size * 0.08))}px`,
            }}
          />
          <span
            style={{
              fontSize: `${titleFontSize * 0.9}px`,
              fontWeight: 500,
              color: colorScheme === 'full' ? tealColor : mutedTextColor,
              letterSpacing: '-0.01em',
            }}
            className="font-brand"
          >
            {chapterName}
          </span>
        </div>
      )}
    </div>
  );

  if (!showClearSpace) {
    return content;
  }

  // Visualizing the clear space boundary box
  return (
    <div className="relative inline-block border border-dashed border-[#FF8A3D]/60 bg-[#FF8A3D]/5 rounded p-2">
      <div
        className="absolute top-1 left-1 text-[10px] font-mono text-[#FF8A3D] font-bold px-1 rounded bg-white/80"
        title="Clear Space = X-height of capital 'H'"
      >
        X Clear Space
      </div>
      <div style={{ padding: `${clearSpacePadding}px` }}>{content}</div>
    </div>
  );
};
