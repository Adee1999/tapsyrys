import './style.css';
import { PRODUCTS } from './config';
import { calcPrice, formatPrice } from './calculator';
import { uploadImage } from './cloudinary';
import { openWhatsApp } from './whatsapp';
import type { OrderState, ProductKey } from './types';

// ─── State ───────────────────────────────────────────────
const state: OrderState = {
  productKey: 'banner',
  materialId: PRODUCTS.banner.materials[0].id,
  widthCm: 0,
  heightCm: 0,
  qty: 1,
  title: '',
  notes: '',
  imageUrl: null,
  imageUploading: false,
};

// ─── DOM helpers ─────────────────────────────────────────
function el<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function show(id: string, visible: boolean): void {
  el(id).classList.toggle('result__row--hidden', !visible);
}

// ─── Render ──────────────────────────────────────────────
function renderApp(): void {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <header class="hdr">
      <div class="hdr-ico">📋</div>
      <div>
        <div class="hdr-name">Тапсырыс беру</div>
        <div class="hdr-sub">tapsyrys.seriktesbol.com — Баннер • Стенд</div>
      </div>
    </header>

    <main class="wrap">
      <!-- Product tabs -->
      <div class="tabs" id="tabs"></div>


      <div class="grid">
        <!-- Left column -->
        <div>
          <!-- Text card -->
          <div class="card">
            <div class="sec-title">Баннердегі мәтін</div>
            <div class="fg">
              <label for="f-title">📝 Тақырып / Негізгі мәтін</label>
              <input class="inp" id="f-title" placeholder="мысалы: «Сатылады» немесе компания аты" />
            </div>
            <div class="fg">
              <label for="f-notes">💬 Қосымша ескертпе (түс, шрифт, орналасу т.б.)</label>
              <textarea class="ta" id="f-notes" placeholder="мысалы: қызыл фон, ақ әріп..."></textarea>
            </div>
          </div>

          <!-- Image upload card -->
          <div class="card">
            <div class="sec-title">Дизайн суреті (міндетті емес)</div>
            <div class="upload-box" id="upload-box">
              <div class="upload-box__ico">🖼️</div>
              <div class="upload-box__txt">Сурет жүктеу үшін басыңыз</div>
              <div class="upload-box__sub">JPG, PNG (макс. 10 МБ)</div>
            </div>
            <input type="file" id="img-input" accept="image/*" style="display:none" />
          </div>

          <!-- Size + material + qty card -->
          <div class="card">
            <div class="sec-title">Өлшем</div>
            <div class="row2">
              <div class="fg">
                <label for="f-w">↔️ Ені (см)</label>
                <input class="inp" type="number" id="f-w" placeholder="мысалы: 200" min="1" step="1" />
              </div>
              <div class="fg">
                <label for="f-h">↕️ Биіктігі (см)</label>
                <input class="inp" type="number" id="f-h" placeholder="мысалы: 100" min="1" step="1" />
              </div>
            </div>
            <div class="area-hint" id="area-hint">Жалпы аудан: —</div>

            <div class="sec-title" style="margin-top:20px">Материал</div>
            <div class="mat-grid" id="mat-grid"></div>

            <div class="sec-title" style="margin-top:20px">Саны</div>
            <div class="qty-ctrl">
              <button class="qty-btn" id="qty-minus">−</button>
              <input class="inp qty-inp" type="number" id="f-qty" value="1" min="1" />
              <button class="qty-btn" id="qty-plus">+</button>
            </div>
          </div>
        </div>

        <!-- Right column — result -->
        <div class="result">
          <div class="result__title">Тапсырыс қорытындысы</div>
          <div class="result__product" id="r-product">—</div>

          <div class="result__row" id="r-row-title">
            <span>Мәтін</span><span id="r-title">—</span>
          </div>
          <div class="result__row" id="r-row-mat">
            <span>Материал</span><span id="r-mat">—</span>
          </div>
          <div class="result__row" id="r-row-area">
            <span>Аудан / Бағасы</span><span id="r-area">—</span>
          </div>
          <div class="result__row" id="r-row-qty">
            <span>Саны</span><span id="r-qty">—</span>
          </div>
          <div class="result__row" id="r-row-img">
            <span>Сурет</span><span>✅ Жүктелді</span>
          </div>

          <div class="result__total">
            <div class="result__total-lbl">ЖАЛПЫ СОМА</div>
            <div class="result__total-val" id="r-total">—</div>
            <div class="result__per-unit" id="r-perunit"></div>
          </div>

          <button class="btn-order" id="btn-order">📲 Тапсырыс беру (WhatsApp)</button>
          <div class="result__note">
            Бағалар шамамен көрсетілген, нақты баға тапсырыс растағанда белгіленеді
          </div>
        </div>
      </div>

      <footer style="text-align:center;padding:28px 0 8px;font-size:12px;color:#AAA;">
        © ${new Date().getFullYear()} seriktesbol.com &nbsp;·&nbsp;
        <a href="/privacy.html" style="color:#A8A296;text-decoration:none;">Құпиялылық саясаты</a>
      </footer>
    </main>
  `;
}

// ─── Tabs ────────────────────────────────────────────────
function renderTabs(): void {
  const container = el('tabs');
  container.innerHTML = (Object.entries(PRODUCTS) as [ProductKey, typeof PRODUCTS[ProductKey]][])
    .map(([key, p]) => `
      <button
        class="tab ${key === state.productKey ? 'tab--active' : ''}"
        data-key="${key}"
      >
        <span class="tab__ico">${p.icon}</span>
        <span class="tab__name">${p.name}</span>
        <span class="tab__sub">м² бойынша</span>
      </button>
    `)
    .join('');

  container.querySelectorAll<HTMLButtonElement>('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key as ProductKey;
      state.productKey = key;
      state.materialId = PRODUCTS[key].materials[0].id;
      renderTabs();
      renderMaterials();
      updateResult();
    });
  });
}

// ─── Materials ───────────────────────────────────────────
function renderMaterials(): void {
  const product = PRODUCTS[state.productKey];
  el('mat-grid').innerHTML = product.materials.map(m => `
    <div
      class="mat-card ${m.id === state.materialId ? 'mat-card--active' : ''}"
      data-mat="${m.id}"
    >
      <div class="mat-card__name">${m.name}</div>
      <div class="mat-card__price">${formatPrice(m.pricePerM2)} / м²</div>
    </div>
  `).join('');

  el('mat-grid').querySelectorAll<HTMLDivElement>('.mat-card').forEach(card => {
    card.addEventListener('click', () => {
      state.materialId = card.dataset.mat!;
      renderMaterials();
      updateResult();
    });
  });
}

// ─── Result panel ────────────────────────────────────────
function updateResult(): void {
  const product  = PRODUCTS[state.productKey];
  const material = product.materials.find(m => m.id === state.materialId)
    ?? product.materials[0];

  const hasSize  = state.widthCm > 0 && state.heightCm > 0;
  const { areaM2, total } = calcPrice(
    state.productKey, state.materialId,
    state.widthCm, state.heightCm, state.qty
  );

  // Area hint
  el('area-hint').textContent = hasSize
    ? `Жалпы аудан: ${areaM2.toFixed(2)} м²`
    : 'Жалпы аудан: —';

  // Product name
  el('r-product').textContent = hasSize
    ? `${product.name} ${state.widthCm} × ${state.heightCm} см`
    : product.name;

  // Title row
  const hasTitle = state.title.trim().length > 0;
  show('r-row-title', hasTitle);
  if (hasTitle) el('r-title').textContent = state.title.trim();

  // Material
  el('r-mat').textContent = material.name;

  // Area row
  el('r-area').textContent = hasSize
    ? `${areaM2.toFixed(2)} м² × ${formatPrice(material.pricePerM2)}`
    : '—';

  // Qty
  el('r-qty').textContent = `${state.qty} дана`;

  // Image row
  show('r-row-img', state.imageUrl !== null);

  // Total
  el('r-total').textContent = hasSize ? formatPrice(total) : '—';
  el('r-perunit').textContent = hasSize && state.qty > 1
    ? `≈ ${formatPrice(total / state.qty)} / дана`
    : '';
}

// ─── Image upload ────────────────────────────────────────
function initUpload(): void {
  const box      = el<HTMLDivElement>('upload-box');
  const input    = el<HTMLInputElement>('img-input');

  box.addEventListener('click', () => {
    if (!state.imageUploading) input.click();
  });

  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;

    // Preview immediately
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target!.result as string;
      box.classList.add('upload-box--filled');
      box.innerHTML = `
        <img class="upload-preview" src="${src}" alt="preview" />
        <button class="upload-remove" id="btn-remove-img" title="Жою">✕</button>
        <div class="upload-status" id="upload-status">⏳ Жүктелуде...</div>
      `;
      el('btn-remove-img').addEventListener('click', e => {
        e.stopPropagation();
        resetUpload();
      });
      updateResult();
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    state.imageUploading = true;
    try {
      const result = await uploadImage(file);
      state.imageUrl = result.url;
      const statusEl = document.getElementById('upload-status');
      if (statusEl) {
        statusEl.textContent = '✅ Сурет жүктелді';
        statusEl.style.color = '#6FCF97';
      }
    } catch (err) {
      state.imageUrl = null;
      const statusEl = document.getElementById('upload-status');
      if (statusEl) {
        statusEl.textContent = '❌ ' + (err instanceof Error ? err.message : 'Қате');
        statusEl.style.color = '#EB5757';
      }
    } finally {
      state.imageUploading = false;
      updateResult();
    }
  });
}

function resetUpload(): void {
  const box = el<HTMLDivElement>('upload-box');
  state.imageUrl = null;
  state.imageUploading = false;
  el<HTMLInputElement>('img-input').value = '';
  box.classList.remove('upload-box--filled');
  box.innerHTML = `
    <div class="upload-box__ico">🖼️</div>
    <div class="upload-box__txt">Сурет жүктеу үшін басыңыз</div>
    <div class="upload-box__sub">JPG, PNG (макс. 10 МБ)</div>
  `;
  updateResult();
}

// ─── WhatsApp ────────────────────────────────────────────
function initOrder(): void {
  el('btn-order').addEventListener('click', () => {
    if (state.imageUploading) {
      alert('⏳ Сурет әлі жүктеліп жатыр, бірнеше секунд күтіңіз.');
      return;
    }
    openWhatsApp(state);
  });
}

// ─── Input bindings ──────────────────────────────────────
function initInputs(): void {
  el<HTMLInputElement>('f-title').addEventListener('input', e => {
    state.title = (e.target as HTMLInputElement).value;
    updateResult();
  });
  el<HTMLTextAreaElement>('f-notes').addEventListener('input', e => {
    state.notes = (e.target as HTMLTextAreaElement).value;
  });
  el<HTMLInputElement>('f-w').addEventListener('input', e => {
    state.widthCm = parseFloat((e.target as HTMLInputElement).value) || 0;
    updateResult();
  });
  el<HTMLInputElement>('f-h').addEventListener('input', e => {
    state.heightCm = parseFloat((e.target as HTMLInputElement).value) || 0;
    updateResult();
  });
  el<HTMLInputElement>('f-qty').addEventListener('input', e => {
    state.qty = Math.max(1, parseInt((e.target as HTMLInputElement).value) || 1);
    updateResult();
  });
  el('qty-minus').addEventListener('click', () => {
    if (state.qty > 1) {
      state.qty--;
      el<HTMLInputElement>('f-qty').value = String(state.qty);
      updateResult();
    }
  });
  el('qty-plus').addEventListener('click', () => {
    state.qty++;
    el<HTMLInputElement>('f-qty').value = String(state.qty);
    updateResult();
  });
}

// ─── Boot ────────────────────────────────────────────────
renderApp();
renderTabs();
renderMaterials();
updateResult();
initInputs();
initUpload();
initOrder();
