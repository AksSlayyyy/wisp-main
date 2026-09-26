/* Shared, deterministic cover geometry for the browser and Chromium PDF renderer. */
(function (root) {
  const fonts = [
    ['source-serif-4', 'Source Serif 4'], ['libre-baskerville', 'Libre Baskerville'],
    ['lora', 'Lora'], ['merriweather', 'Merriweather'], ['inter', 'Inter'],
    ['manrope', 'Manrope'], ['source-sans-3', 'Source Sans 3'], ['roboto', 'Roboto'],
    ['open-sans', 'Open Sans'], ['lato', 'Lato'], ['work-sans', 'Work Sans'], ['ibm-plex-sans', 'IBM Plex Sans'],
  ];
  const defaults = Object.freeze({ version: 1, logoEnabled: true, logoSource: 'company', logoData: '', logoName: '', x: 306, y: 390, width: 202, height: 108, headingFont: 'source-serif-4', bodyFont: 'inter', headingColor: '#10253a', bodyColor: '#26384b', topBarColor: '#153f6d', bottomBarColor: '#153f6d' });
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp = (n, min, max, fallback) => Number.isFinite(Number(n)) ? Math.min(max, Math.max(min, Number(n))) : fallback;
  function normalize(value = {}) {
    if (!value || typeof value !== 'object') value = {};
    const a = { ...defaults };
    a.logoEnabled = value.logoEnabled !== false;
    a.logoSource = value.logoSource === 'custom' ? 'custom' : 'company';
    // Only browser-decoded, rasterized PNGs are accepted. No URLs or active SVG.
    a.logoData = typeof value.logoData === 'string' && value.logoData.length <= 550000 && /^data:image\/png;base64,iVBORw0KGgo[A-Za-z0-9+/=]+$/.test(value.logoData) ? value.logoData : '';
    a.logoName = String(value.logoName || '').slice(0, 160);
    a.width = clamp(value.width, 36, 360, defaults.width);
    a.height = clamp(value.height, 18, 240, defaults.height);
    a.x = clamp(value.x, a.width / 2 + 18, 594 - a.width / 2, defaults.x);
    a.y = clamp(value.y, a.height / 2 + 36, 756 - a.height / 2, defaults.y);
    for (const key of ['headingFont','bodyFont']) a[key] = fonts.some(([id]) => id === value[key]) ? value[key] : defaults[key];
    for (const key of ['headingColor','bodyColor','topBarColor','bottomBarColor']) a[key] = /^#[0-9a-f]{6}$/i.test(value[key] || '') ? value[key] : defaults[key];
    return a;
  }
  function fontCss(value, resolve = (id, weight) => `/assets/fonts/wisp/${id}-${weight}.woff2`) {
    const a = normalize(value);
    return [...new Set([a.headingFont, a.bodyFont])].flatMap(id => [400, 700].map(weight => `@font-face{font-family:"Wisp-${id}";font-style:normal;font-weight:${weight};font-display:block;src:url("${resolve(id, weight)}") format("woff2");}`)).join('\n');
  }
  function coverCss(value) {
    const a = normalize(value);
    return `.wisp-cover{box-sizing:border-box;position:relative;width:612pt;height:792pt;overflow:hidden;background:#fff;color:${a.bodyColor};font-family:"Wisp-${a.bodyFont}";font-size:7.5pt;line-height:1.4;}
      .wisp-cover *{box-sizing:border-box}.wisp-cover-top,.wisp-cover-bottom{position:absolute;left:0;width:100%;height:30.24pt;background:${a.topBarColor};top:0;}
      .wisp-cover-bottom{top:auto;bottom:0;background:${a.bottomBarColor};height:16pt;}
      .wisp-cover-copy{position:absolute;top:82pt;left:44.64pt;right:44.64pt;text-align:center;}
      .wisp-cover h1{margin:0;font:700 20.25pt/1.14 "Wisp-${a.headingFont}";color:${a.headingColor};}
      .wisp-cover-for{margin:17.28pt 0 0;font-size:8.25pt;letter-spacing:.22em;font-weight:700;text-transform:uppercase;}
      .wisp-cover-firm{margin:8.64pt 0 18.72pt;font:400 20.25pt/1.1 "Wisp-${a.headingFont}";color:${a.headingColor};overflow-wrap:anywhere;}
      .wisp-cover-note{margin:0 0 6pt;font-size:7.5pt;line-height:1.4;}
      .wisp-cover-logo{position:absolute;left:${a.x-a.width/2}pt;top:${a.y-a.height/2}pt;width:${a.width}pt;height:${a.height}pt;object-fit:contain;display:block;margin:0;}`;
  }
  function coverHtml(value, companyName) {
    const a = normalize(value);
    return `<article class="wisp-cover"><div class="wisp-cover-top"></div><div class="wisp-cover-copy"><h1>Written Information Security Plan (WISP)</h1><p class="wisp-cover-for">For</p><p class="wisp-cover-firm">${escape(companyName)}</p><p class="wisp-cover-note">This Document is for general distribution and is available to all employees.</p><p class="wisp-cover-note">This Document is available to Clients by request and with consent of the Firm's Data Security Coordinator.</p></div>${a.logoEnabled && a.logoData ? `<img class="wisp-cover-logo" src="${a.logoData}" alt="Firm logo" draggable="false">` : ''}<div class="wisp-cover-bottom"></div></article>`;
  }
  function documentCss(value) {
    const a = normalize(value);
    return `body,.export-flow-sheet{font-family:"Wisp-${a.bodyFont}";color:${a.bodyColor};}
      .export-docx-heading,.export-docx-subheading{font-family:"Wisp-${a.headingFont}";color:${a.headingColor};}
      .export-docx-paragraph,.export-docx-centered,.export-docx-signature,.export-docx-list,.export-docx-resource-link,.export-docx-resource-link a,.export-signature-name,.export-signature-title,.export-docx-overline{color:${a.bodyColor};}
      .export-flow-sheet{padding-bottom:.52in;background:linear-gradient(${a.topBarColor},${a.topBarColor}) top/100% .42in no-repeat,linear-gradient(${a.bottomBarColor},${a.bottomBarColor}) bottom/100% 16pt no-repeat,#fff;}
      .wisp-document-bottom{position:fixed;left:0;right:0;bottom:0;height:16pt;background:${a.bottomBarColor};z-index:10;}
      .export-docx-list.is-ordered li::marker{color:${a.headingColor};}`;
  }
  root.WispAppearance = Object.freeze({ fonts, defaults, normalize, fontCss, coverCss, coverHtml, documentCss });
})(globalThis);
