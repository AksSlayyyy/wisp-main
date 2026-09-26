function getWispAppearance() {
  try { return WispAppearance.normalize(JSON.parse(state.builderDrafts.appearance || '{}')); }
  catch { return WispAppearance.normalize(); }
}
function saveWispAppearance(value) {
  const a = WispAppearance.normalize(value);
  state.builderDrafts.appearance = JSON.stringify(a);
  cleanupBuilderMergeDownloadUrl();
  state.builderMergeStatus = 'idle';
  scheduleBuilderDraftSync({ status: 'draft' });
  return a;
}
async function rasterizeWispLogo(blob) {
  if (blob.size > 5 * 1024 * 1024) throw new Error('Choose a logo smaller than 5 MB.');
  if (!['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(blob.type)) throw new Error('Choose a PNG, JPG, SVG, or WebP image.');
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('This image could not be read.');
    const canvas = document.createElement('canvas');
    let size = 1000;
    let data;
    do {
      const scale = Math.min(1, size / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      data = canvas.toDataURL('image/png');
      size *= .8;
    } while (data.length > 550000 && size > 200);
    if (data.length > 550000) throw new Error('Please use a simpler or smaller logo.');
    return { logoData: data, height: Math.min(180, 202 * image.naturalHeight / image.naturalWidth), width: Math.min(202, 180 * image.naturalWidth / image.naturalHeight) };
  } finally { URL.revokeObjectURL(url); }
}
async function getCompanyWispLogo() {
  const url = state.settingsLogo?.previewUrl;
  if (!url) throw new Error('Add a company logo in Settings, or upload a separate WISP logo here.');
  const response = await fetch(url);
  if (!response.ok) throw new Error('The company logo could not be loaded. Refresh and try again.');
  return { ...await rasterizeWispLogo(await response.blob()), logoSource: 'company', logoName: state.settingsLogo?.name || 'Company logo' };
}
async function prepareWispAppearance() {
  if (state.builderDrafts.appearance) return;
  let value = getWispAppearance();
  if (state.settingsLogo?.previewUrl) value = { ...value, ...await getCompanyWispLogo() };
  saveWispAppearance(value);
}
function renderWispAppearanceEditor() {
  const a = getWispAppearance();
  const fontSelect = (key, label) => `<label class="wa-field">${label}<select data-wa-field="${key}">${WispAppearance.fonts.map(([id, name]) => `<option value="${id}" ${a[key] === id ? 'selected' : ''}>${name}</option>`).join('')}</select></label>`;
  const color = (key, label) => `<label class="wa-color"><span>${label}</span><input type="color" aria-label="${label}" data-wa-field="${key}" value="${a[key]}"><code data-wa-color="${key}">${a[key].toUpperCase()}</code></label>`;
  return `<section class="wa-editor" data-wa-editor>
    <div class="wa-intro"><h3>Make this WISP your own</h3><p>Set your document's identity. The cover below uses the same layout, fonts, and page coordinates as your PDF.</p></div>
    <div class="wa-layout"><div class="wa-controls">
      <section class="wa-group"><h4>Cover logo</h4><label class="wa-switch"><span>Show logo on the first page</span><input type="checkbox" data-wa-field="logoEnabled" ${a.logoEnabled ? 'checked' : ''}></label>
      <div class="wa-logo-controls" ${a.logoEnabled ? '' : 'hidden'}><label class="wa-field">Logo source<select data-wa-source><option value="company" ${a.logoSource === 'company' ? 'selected' : ''}>Company logo</option><option value="custom" ${a.logoSource === 'custom' ? 'selected' : ''}>Separate WISP logo</option></select></label>
      <p class="wa-hint" data-wa-logo-name>${escapeHtml(a.logoName || 'No logo selected')}</p>
      <button class="btn secondary small" type="button" data-wa-company ${a.logoSource === 'company' ? '' : 'hidden'}>Use current company logo</button>
      <label class="wa-upload" ${a.logoSource === 'custom' ? '' : 'hidden'}>Choose logo<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" data-wa-upload></label>
      <p class="wa-hint">PNG, JPG, SVG, or WebP. Up to 5 MB. Your company profile stays unchanged.</p>
      <label class="wa-field">Logo width <span data-wa-size>${Math.round(a.width)} pt</span><input type="range" min="36" max="360" value="${a.width}" data-wa-width></label>
      <div class="wa-position"><label class="wa-field">Horizontal (pt)<input type="number" data-wa-field="x" step="1" value="${Math.round(a.x)}"></label><label class="wa-field">Vertical (pt)<input type="number" data-wa-field="y" step="1" value="${Math.round(a.y)}"></label></div>
      <button class="wa-text-button" type="button" data-wa-center>Center logo horizontally</button></div></section>
      <section class="wa-group"><h4>Typography</h4>${fontSelect('headingFont', 'Headings')}${fontSelect('bodyFont', 'Body text')}<p class="wa-hint">12 embedded font families. Applied throughout the WISP; uploaded attachments keep their original formatting.</p></section>
      <section class="wa-group"><h4>Document colors</h4>${color('headingColor','Headings')}${color('bodyColor','Body text')}${color('topBarColor','Top page bar')}${color('bottomBarColor','Bottom page bar')}</section>
      <button class="wa-text-button" type="button" data-wa-reset>Reset layout, fonts, and colors</button>
    </div><div class="wa-preview-column"><div class="wa-preview-toolbar"><strong>Cover preview</strong><span>US Letter · 8.5 × 11 in</span></div>
      <div class="wa-preview-mat"><div class="wa-paper-viewport"><iframe title="WISP cover preview: drag the logo to position it" sandbox="allow-same-origin" data-wa-preview></iframe></div></div>
      <p class="wa-hint">Drag the logo to position it. Focus it and use arrow keys for fine adjustments (Shift for larger steps).</p>
      <p class="wa-status" role="status" aria-live="polite" data-wa-status></p>
      <button class="btn secondary small" type="button" data-wa-proof>Review actual rendered PDF</button>
    </div></div></section>`;
}
function bindWispAppearanceEditor() {
  const root = document.querySelector('[data-wa-editor]');
  if (!root || root.dataset.bound) return;
  root.dataset.bound = 'true';
  const iframe = root.querySelector('[data-wa-preview]');
  const status = root.querySelector('[data-wa-status]');
  let a = getWispAppearance();
  let revision = 0;
  const message = (text, error = false) => { status.textContent = text; status.classList.toggle('is-error', error); };
  const syncControls = () => {
    root.querySelectorAll('[data-wa-field]').forEach(input => { if (input.type === 'checkbox') input.checked = a[input.dataset.waField]; else input.value = a[input.dataset.waField]; });
    root.querySelectorAll('[data-wa-color]').forEach(code => { code.textContent = a[code.dataset.waColor].toUpperCase(); });
    root.querySelector('[data-wa-source]').value = a.logoSource;
    root.querySelector('.wa-logo-controls').hidden = !a.logoEnabled;
    root.querySelector('[data-wa-company]').hidden = a.logoSource !== 'company';
    root.querySelector('.wa-upload').hidden = a.logoSource !== 'custom';
    root.querySelector('[data-wa-logo-name]').textContent = a.logoName || 'No logo selected';
    root.querySelector('[data-wa-size]').textContent = `${Math.round(a.width)} pt`;
    root.querySelector('[data-wa-width]').value = a.width;
  };
  const scaleFrame = () => {
    const viewport = root.querySelector('.wa-paper-viewport');
    iframe.style.transform = `scale(${viewport.clientWidth / 816})`;
  };
  const paint = () => {
    const companyName = state.form.companyName || state.firmProfile?.name || 'Your firm';
    // No independent approximation: this exact markup and CSS also produces the PDF cover.
    iframe.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#fff} ${WispAppearance.fontCss(a, (id, weight) => new URL(`/assets/fonts/wisp/${id}-${weight}.woff2`, location.origin).href)} ${WispAppearance.coverCss(a)} .wisp-cover-logo{cursor:grab;touch-action:none}.wisp-cover-logo:hover,.wisp-cover-logo:focus{outline:1px dashed #0c8461;outline-offset:4px}</style></head><body>${WispAppearance.coverHtml(a,companyName)}</body></html>`;
    scaleFrame();
  };
  const change = (patch, repaint = true) => {
    revision++;
    a = saveWispAppearance({ ...a, ...patch });
    syncControls();
    if (repaint) paint();
    message(a.logoEnabled && !a.logoData ? 'No logo is selected. Choose a logo or turn it off.' : 'Draft updated. Changes save automatically.');
  };
  const logoTask = async task => {
    const ticket = ++revision;
    message('Preparing logo…');
    root.querySelectorAll('[data-wa-company],[data-wa-upload]').forEach(el => el.disabled = true);
    try { const result = await task(); if (root.isConnected && ticket === revision) change(result); }
    catch (error) { if (root.isConnected && ticket === revision) message(error.message || 'Unable to load logo.', true); }
    finally { root.querySelectorAll('[data-wa-company],[data-wa-upload]').forEach(el => el.disabled = false); }
  };
  root.querySelectorAll('[data-wa-field]').forEach(input => input.addEventListener('change', () => change({ [input.dataset.waField]: input.type === 'checkbox' ? input.checked : input.type === 'number' ? Number(input.value) : input.value })));
  root.querySelector('[data-wa-source]').addEventListener('change', event => {
    change({ logoSource: event.target.value, logoData: '', logoName: '' });
    if (event.target.value === 'company') void logoTask(getCompanyWispLogo);
  });
  root.querySelector('[data-wa-company]').addEventListener('click', () => void logoTask(getCompanyWispLogo));
  root.querySelector('[data-wa-upload]').addEventListener('change', event => {
    const file = event.target.files[0];
    event.target.value = '';
    if (file) void logoTask(async () => ({ ...await rasterizeWispLogo(file), logoSource: 'custom', logoName: file.name }));
  });
  root.querySelector('[data-wa-width]').addEventListener('input', event => {
    const width = Number(event.target.value);
    change({ width, height: width * a.height / a.width });
  });
  root.querySelector('[data-wa-center]').addEventListener('click', () => change({ x: 306 }));
  root.querySelector('[data-wa-reset]').addEventListener('click', () => change({ ...WispAppearance.defaults, logoEnabled:a.logoEnabled, logoSource:a.logoSource, logoData:a.logoData, logoName:a.logoName }));
  root.querySelector('[data-wa-proof]').addEventListener('click', () => { state.builderReviewReturnTopic = 'appearance'; handleAction('review-builder-draft'); });
  iframe.addEventListener('load', () => {
    const doc = iframe.contentDocument;
    if (!doc) return;
    const logo = doc.querySelector('.wisp-cover-logo');
    if (!logo) return;
    logo.tabIndex = 0;
    logo.setAttribute('aria-label', 'Move cover logo with arrow keys');
    const position = () => { logo.style.left = `${a.x-a.width/2}pt`; logo.style.top = `${a.y-a.height/2}pt`; };
    let drag;
    logo.addEventListener('pointerdown', event => {
      event.preventDefault(); logo.focus(); logo.setPointerCapture(event.pointerId);
      drag = { x:event.clientX, y:event.clientY, initialX:a.x, initialY:a.y };
    });
    logo.addEventListener('pointermove', event => {
      if (!drag) return;
      a = WispAppearance.normalize({ ...a, x:drag.initialX+(event.clientX-drag.x)*.75, y:drag.initialY+(event.clientY-drag.y)*.75 });
      position();
    });
    const finish = () => { if (!drag) return; drag = null; change({ x:a.x,y:a.y }, false); checkOverlap(); };
    logo.addEventListener('pointerup', finish);
    logo.addEventListener('pointercancel', finish);
    logo.addEventListener('lostpointercapture', finish);
    logo.addEventListener('keydown', event => {
      const directions = {ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
      if (!directions[event.key]) return;
      event.preventDefault(); const [x,y] = directions[event.key]; const step=event.shiftKey?10:1;
      change({x:a.x+x*step,y:a.y+y*step},false); position(); checkOverlap();
    });
    function checkOverlap() {
      const l=logo.getBoundingClientRect(), t=doc.querySelector('.wisp-cover-copy').getBoundingClientRect();
      if(l.top<t.bottom&&l.bottom>t.top&&l.left<t.right&&l.right>t.left) message('The logo overlaps the cover text. Move it below or beside the text.',true);
    }
    doc.fonts.ready.then(checkOverlap);
  });
  const observer = new ResizeObserver(() => { if (!root.isConnected) observer.disconnect(); else scaleFrame(); });
  observer.observe(root.querySelector('.wa-paper-viewport'));
  paint();
  if (!state.builderDrafts.appearance && state.settingsLogo?.previewUrl) void logoTask(getCompanyWispLogo);
}
