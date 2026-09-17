// Auto-diekstrak & di-recolor dari public/section2.svg (asli dari CorelDRAW).
// Geometri (path/clip-path/tekstur window base64) dipertahankan persis;
// hanya warna gradient & warna solid yang diubah agar memakai CSS custom
// properties (lihat --s2-* di index.css) sehingga tetap mudah di-recolor
// tanpa menyentuh markup SVG ini lagi.
// Dipecah jadi 4 <g> layer (far / castles / hills / front) untuk parallax.
const SECTION2_SVG_MARKUP = `<svg viewBox="0 0 2560 1440" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="section2-full-svg">
<defs>
  <style type="text/css">
   <![CDATA[
    .str0 {stroke:black;stroke-width:2.36;stroke-miterlimit:22.9256}
    .fil21 {fill:var(--s2-fg, #0c1119)}
    .fil4 {fill:var(--s2-glow, #fff3c7)}
    .fil5 {fill:var(--s2-glow, #fff3c7)}
    .fil0 {fill:url(#id8)}
    .fil1 {fill:url(#id9)}
    .fil15 {fill:url(#id10)}
    .fil6 {fill:url(#id11)}
    .fil3 {fill:url(#id12)}
    .fil13 {fill:url(#id13)}
    .fil12 {fill:url(#id14)}
    .fil10 {fill:url(#id15)}
    .fil9 {fill:url(#id16)}
    .fil17 {fill:url(#id17)}
    .fil7 {fill:url(#id18)}
    .fil11 {fill:url(#id19)}
    .fil14 {fill:url(#id20)}
    .fil16 {fill:url(#id21)}
    .fil2 {fill:url(#id22)}
    .fil18 {fill:url(#id23)}
    .fil8 {fill:url(#id24)}
    .fil20 {fill:url(#id25)}
    .fil19 {fill:url(#id26)}
   ]]>
  </style>
  <linearGradient id="id8" gradientUnits="userSpaceOnUse" x1="1272.64" y1="-0.04" x2="1287.36" y2="1440.04">
   <stop offset="0" style="stop-opacity:1; stop-color:var(--s2-sky-top, #04070d)"/>
   <stop offset="1" style="stop-opacity:1; stop-color:var(--s2-sky-bottom, #16233f)"/>
  </linearGradient>
  <linearGradient id="id9" gradientUnits="userSpaceOnUse" x1="1355.62" y1="549.77" x2="1366.3" y2="1440.17">
   <stop offset="0" style="stop-opacity:1; stop-color:var(--s2-farhill-top, #0a3140)"/>
   <stop offset="1" style="stop-opacity:1; stop-color:var(--s2-farhill-bottom, #05090d)"/>
  </linearGradient>
  <linearGradient id="id10" gradientUnits="userSpaceOnUse" x1="1953.88" y1="881.57" x2="1963.09" y2="955.46">
   <stop offset="0" style="stop-opacity:1; stop-color:var(--s2-gold-a, #fde68a)"/>
   <stop offset="1" style="stop-opacity:1; stop-color:var(--s2-gold-b, #b45309)"/>
  </linearGradient>
  <linearGradient id="id11" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="858.82" y1="872.22" x2="901.05" y2="1039.09">
  </linearGradient>
  <linearGradient id="id12" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="695.79" y1="967.72" x2="712.44" y2="1094.04">
  </linearGradient>
  <linearGradient id="id13" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="1918.67" y1="768.7" x2="1942.98" y2="864.74">
  </linearGradient>
  <linearGradient id="id14" gradientUnits="objectBoundingBox" xlink:href="#id10" x1="42.3674%" y1="0.543558%" x2="57.633%" y2="99.4569%">
  </linearGradient>
  <linearGradient id="id15" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="883.68" y1="1007.67" x2="899.67" y2="1136.07">
  </linearGradient>
  <linearGradient id="id16" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="804.13" y1="997.58" x2="820.78" y2="1123.9">
  </linearGradient>
  <linearGradient id="id17" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="2374.65" y1="450.64" x2="2390.65" y2="695.88">
  </linearGradient>
  <linearGradient id="id18" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="832.38" y1="916.87" x2="849.03" y2="1043.18">
  </linearGradient>
  <linearGradient id="id19" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="1764.65" y1="819.52" x2="1788.96" y2="915.55">
  </linearGradient>
  <linearGradient id="id20" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="1811.79" y1="862.4" x2="1821.37" y2="935.09">
  </linearGradient>
  <linearGradient id="id21" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="2219.6" y1="327.11" x2="2305.81" y2="667.74">
  </linearGradient>
  <linearGradient id="id22" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="722.23" y1="923.07" x2="764.46" y2="1089.94">
  </linearGradient>
  <linearGradient id="id23" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="2466.94" y1="389.39" x2="2532.07" y2="730.02">
  </linearGradient>
  <linearGradient id="id24" gradientUnits="userSpaceOnUse" xlink:href="#id10" x1="975.36" y1="770.52" x2="1061.57" y2="1111.15">
  </linearGradient>
  <linearGradient id="id25" gradientUnits="userSpaceOnUse" x1="1133.55" y1="-42.58" x2="1426.45" y2="1482.58">
   <stop offset="0" style="stop-opacity:1; stop-color:var(--s2-innerhill-top, #0c4a5f)"/>
   <stop offset="1" style="stop-opacity:1; stop-color:var(--s2-innerhill-bottom, #04141c)"/>
  </linearGradient>
  <linearGradient id="id26" gradientUnits="userSpaceOnUse" x1="1058.75" y1="32.3" x2="1501.25" y2="1407.7">
   <stop offset="0" style="stop-opacity:1; stop-color:var(--s2-midhill-top, #093a4c)"/>
   <stop offset="1" style="stop-opacity:1; stop-color:var(--s2-midhill-bottom, #030d13)"/>
  </linearGradient>
 </defs>
<g id="s2-layer-far" class="section2-gpu">
<rect id="sky" class="fil0" width="2560" height="1440"/>
<path id="deep" class="fil1" d="M2560 549.94l0 890.06 -2395.54 0 -2.55 0c1.12,-20.78 7.43,-55.69 28.6,-80.34 134.92,-157.05 98.55,-60.9 190.29,-121.26 46.97,-30.9 21.82,-35.02 71.66,-40.16 -7.92,-59.78 94.55,-77.6 136,-83.61 44.46,-6.45 137.89,-69.91 254.28,-70.63 68.6,-0.42 376.47,22.59 417.37,-29.71 25.73,-32.89 191.31,-41.73 263.32,-91.89 103.85,-72.33 380.89,-288.75 490.06,-286.4 164.03,3.54 308.12,84.72 462.97,-60 7.12,-6.65 42.96,1.82 83.54,-26.06z"/>
</g>
<g id="s2-layer-castles" class="section2-gpu">
<g id="near-village">
   <g>
    <polygon class="fil2" points="718.62,918.28 736.09,918.28 736.09,898.32 750.6,898.32 750.6,918.28 768.07,918.28 768.07,898.32 782.57,898.32 782.57,918.28 782.57,918.28 782.57,1094.73 704.12,1094.73 704.12,918.28 704.12,898.32 718.62,898.32 "/>
    <path class="fil3" d="M704.11 967.03l0.01 0c29.99,0 54.52,24.53 54.52,54.52l0 73.18 -109.05 0 0 -73.18c0,-29.99 24.54,-54.52 54.52,-54.52z"/>
    <path class="fil4" d="M687.66 1094.73l30.96 0 0 -31.02c0,-8.51 -6.97,-15.48 -15.48,-15.48l0 0c-8.52,0 -15.48,6.97 -15.48,15.48l0 31.02z"/>
    <rect class="fil5" x="665.07" y="1018.76" width="18.33" height="23.22"/>
    <rect class="fil4" x="750.6" y="931.32" width="18.33" height="35.71"/>
   </g>
   <g>
    <polygon class="fil6" points="855.21,867.43 872.68,867.43 872.68,847.47 887.19,847.47 887.19,867.43 904.66,867.43 904.66,847.47 919.16,847.47 919.16,867.43 919.16,867.43 919.16,1043.88 840.71,1043.88 840.71,867.43 840.71,847.47 855.21,847.47 "/>
    <path class="fil7" d="M840.7 916.17l0.01 0c29.99,0 54.52,24.54 54.52,54.53l0 73.18 -109.05 0 0 -73.18c0,-29.99 24.53,-54.53 54.52,-54.53z"/>
    <path class="fil4" d="M824.25 1043.88l30.96 0 0 -31.02c0,-8.52 -6.97,-15.48 -15.48,-15.48l0 0c-8.52,0 -15.48,6.96 -15.48,15.48l0 31.02z"/>
    <rect class="fil5" x="801.66" y="967.91" width="18.33" height="23.22"/>
    <rect class="fil4" x="887.18" y="880.47" width="18.33" height="35.71"/>
   </g>
   <rect class="fil5" x="1067.52" y="985.76" width="18.33" height="23.22"/>
   <g>
    <polygon class="fil8" points="967.99,760.75 1003.66,760.75 1003.66,720 1033.26,720 1033.26,760.75 1068.94,760.75 1068.94,720 1098.54,720 1098.54,760.75 1098.54,760.75 1098.54,1120.92 938.39,1120.92 938.39,760.75 938.39,720 967.99,720 "/>
    <rect class="fil4" x="1033.26" y="787.35" width="37.42" height="72.89"/>
   </g>
   <path class="fil9" d="M812.45 996.89l0 0c29.99,0 54.53,24.54 54.53,54.53l0 73.18 -109.05 0 0 -73.18c0,-29.99 24.53,-54.53 54.52,-54.53z"/>
   <path class="fil4" d="M795.99 1124.6l30.96 0 0 -31.02c0,-8.52 -6.96,-15.48 -15.48,-15.48l0 0c-8.51,0 -15.48,6.96 -15.48,15.48l0 31.02z"/>
   <rect class="fil5" x="773.41" y="1048.63" width="18.33" height="23.22"/>
   <g>
    <polygon class="fil10" points="833.14,1135.79 950.21,1136.66 950.21,1007.09 833.14,1040.1 "/>
    <path class="fil4" d="M876.19 1135.87l30.96 0 0 -31.01c0,-8.52 -6.96,-15.48 -15.48,-15.48l0 0c-8.51,0 -15.48,6.96 -15.48,15.48l0 31.01z"/>
    <rect class="fil5" x="910" y="1048.63" width="18.33" height="23.22"/>
   </g>
  </g>
  <g id="mount-village">
   <g>
    <polygon class="fil11" points="1762.58,816.76 1772.64,816.76 1772.64,805.27 1780.98,805.27 1780.98,816.76 1791.04,816.76 1791.04,805.27 1799.38,805.27 1799.38,816.76 1799.38,816.76 1799.38,918.31 1754.23,918.31 1754.23,816.76 1754.23,805.27 1762.58,805.27 "/>
    <path class="fil12" d="M1754.23 844.81l0 0c17.26,0 31.38,14.12 31.38,31.38l0 42.12 -62.76 0 0 -42.12c0,-17.26 14.12,-31.38 31.38,-31.38z"/>
    <path class="fil4" d="M1744.76 918.31l17.82 0 0 -17.85c0,-4.91 -4.01,-8.91 -8.91,-8.91l0 0c-4.9,0 -8.91,4 -8.91,8.91l0 17.85z"/>
    <rect class="fil5" x="1731.76" y="874.59" width="10.55" height="13.36"/>
    <rect class="fil4" x="1780.98" y="824.26" width="10.55" height="20.55"/>
   </g>
   <g>
    <polygon class="fil13" points="1916.6,765.95 1926.65,765.95 1926.65,754.46 1935,754.46 1935,765.95 1945.06,765.95 1945.06,754.46 1953.4,754.46 1953.4,765.95 1953.4,765.95 1953.4,867.49 1908.25,867.49 1908.25,765.95 1908.25,754.46 1916.6,754.46 "/>
    <path class="fil12" d="M1908.25 794l0 0c17.26,0 31.38,14.12 31.38,31.38l0 42.11 -62.76 0 0 -42.11c0,-17.26 14.12,-31.38 31.38,-31.38z"/>
    <path class="fil4" d="M1898.78 867.49l17.82 0 0 -17.85c0,-4.9 -4.01,-8.91 -8.91,-8.91l0 0c-4.9,0 -8.91,4.01 -8.91,8.91l0 17.85z"/>
    <rect class="fil5" x="1885.78" y="823.77" width="10.55" height="13.36"/>
    <rect class="fil4" x="1935" y="773.45" width="10.55" height="20.55"/>
   </g>
   <g>
    <path class="fil14" d="M1816.58 862l0 0c17.26,0 31.38,14.12 31.38,31.38l0 42.11 -62.76 0 0 -42.11c0,-17.26 14.12,-31.38 31.38,-31.38z"/>
    <path class="fil4" d="M1807.11 935.49l17.81 0 0 -17.85c0,-4.9 -4,-8.91 -8.9,-8.91l0 0c-4.91,0 -8.91,4.01 -8.91,8.91l0 17.85z"/>
    <rect class="fil5" x="1794.11" y="891.77" width="10.55" height="13.36"/>
   </g>
   <g>
    <polygon class="fil15" points="1924.8,955.3 1992.17,955.8 1992.17,881.23 1924.8,900.23 "/>
    <path class="fil4" d="M1949.58 955.35l17.81 0 0 -17.85c0,-4.9 -4,-8.91 -8.9,-8.91l-0.01 0c-4.9,0 -8.9,4.01 -8.9,8.91l0 17.85z"/>
    <rect class="fil5" x="1969.03" y="905.14" width="10.55" height="13.36"/>
   </g>
  </g>
  <g id="castle">
   <g>
    <polygon class="fil16" points="2212.23,317.34 2247.9,317.34 2247.9,276.59 2277.51,276.59 2277.51,317.34 2313.18,317.34 2313.18,276.59 2342.78,276.59 2342.78,317.34 2342.78,317.34 2342.78,677.51 2182.63,677.51 2182.63,317.34 2182.63,276.59 2212.23,276.59 "/>
    <rect class="fil4" x="2277.5" y="343.94" width="37.42" height="72.89"/>
   </g>
   <g>
    <rect class="fil17" x="2277.7" y="450.36" width="209.9" height="245.8"/>
    <path class="fil4" d="M2350.97 696.16l59.59 0 0 -59.7c0,-16.39 -13.4,-29.8 -29.79,-29.8l0 0c-16.39,0 -29.8,13.41 -29.8,29.8l0 59.7z"/>
    <rect class="fil5" x="2307.5" y="549.94" width="35.28" height="44.69"/>
   </g>
   <g>
    <polygon class="fil18" points="2461.37,379.62 2488.32,379.62 2488.32,338.87 2510.69,338.87 2510.69,379.62 2537.64,379.62 2537.64,338.87 2560,338.87 2560,379.62 2560,379.62 2560,739.79 2439.01,739.79 2439.01,379.62 2439.01,338.87 2461.37,338.87 "/>
    <rect class="fil4" x="2510.69" y="406.23" width="28.27" height="72.89"/>
   </g>
  </g>
  
</g>
<g id="s2-layer-hills" class="section2-gpu">
<path id="mid" class="fil19" d="M2560 712.57l0 341.95c-5.17,0.25 -10.16,-1.54 -15.68,2.96 -19.3,15.74 -57.44,-2.54 -65.66,-3.49 -20.93,-2.41 -34.14,-15.9 -48,-26.97 -78.36,-62.58 -1.51,-32.84 -23.49,-51.37 -40.88,-34.47 -11.05,-38.89 -94.51,-43.48 -45.27,-2.49 -50.89,-41.28 -37.66,-41.83 5.88,-0.25 14.57,-57.1 14.46,-57.32 -17.51,-34.5 14.19,-35.59 -36.46,-65.71 -23.52,-13.99 -52.49,-20.62 -57.03,-24.46 -4.96,-4.2 -113.13,-69.08 -69.99,-78.68 47.54,-10.59 35.21,-29.83 83.82,-29.83 71.06,0 106.05,36.66 151.38,36 110.86,-1.62 69.81,38 149.65,38 9.14,0 29.96,1.14 49.17,4.23z"/>
<path id="inner" class="fil20" d="M2560 767.17l0 634.14c-15.06,6.34 -33.76,10.41 -49.02,23.5 -15.78,13.53 -18.48,0.76 -6.21,7.54 -1.17,2.97 -2.83,5.48 -4.89,7.65l-634.69 0c-106.47,-14.17 -210.61,-25.15 -238.64,-25.14 -46.19,0.02 -286.88,-42.03 -323.49,-62.17 -131.65,-72.43 -143.57,-94.56 -245.63,-188.51 -30.48,-28.06 -80.52,-27.16 -109.33,-61.49 -1.52,-1.81 -7.41,-7.09 -8.04,-7 -14.65,2.25 71.47,2.07 84.05,-9 7.37,-6.48 127.56,-15.53 148.47,-23.48 30.52,-11.61 122.63,-11.44 156.13,-37.03 14.46,-11.06 132.04,-53.2 155.79,-56.63 7.33,-11.4 119.98,-6.29 165.39,-41.54 18.64,-14.48 116.62,-29.18 150.18,-12.35 7.36,3.69 135.15,9.8 160.82,26.52 1.23,0.79 185.39,-1.22 203.39,5.48 32.5,12.1 74.68,-69.16 112.37,-82.11 0.46,-0.16 81.84,-56.63 98.76,-60.17 0.94,-2.45 99.75,-69.82 142.45,-45.72 3.64,2.06 23.12,2.56 42.14,7.51z"/>
</g>
<g id="s2-layer-front" class="section2-gpu">
<path id="framebawah" class="fil21" d="M2560 1027.04l0 412.96 -2560 0 0 -483.52c54.72,10.96 107.34,25.33 182.4,35.86 199.24,27.97 75.62,76.94 321.03,88.01 143.26,6.45 794.1,-0.95 879.31,30.62 19.96,7.4 7.41,28.44 101.03,46.06 34.98,6.59 44.76,35.92 144.35,52.34 39.9,6.59 36.4,12.42 96,20 101.46,12.92 294.13,42.53 380,-9.37 45.31,-27.39 21.1,30.84 148.34,-86.97 162,-149.99 139.23,-62.7 218.63,-93.03 39.04,-14.91 56.89,-14.42 88.91,-12.96z"/>
</g>
</svg>`;

export default SECTION2_SVG_MARKUP;
