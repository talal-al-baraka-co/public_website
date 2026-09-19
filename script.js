const I18N = {
  ar: {
    navCatalog: "المنتجات", navHow: "طريقة الطلب", navCheckout: "إتمام الطلب", cart: "السلة",
    call: "اتصال", whatsapp: "واتساب",
    eyebrow: "تجارة وتوزيع جملة · المنطقة الشرقية",
    heroTitle: "شريككم لتوريد المشروبات والوجبات الخفيفة للمحلات والمطاعم.",
    heroLede: "توريد بالكرتون من الدمام. أسعار جملة، توصيل حسب الاتفاق، والدفع عند الاستلام أو تحويل بنكي بعد الفاتورة.",
    browse: "عرض المنتجات", goCheckout: "إتمام الطلب",
    trust1: "للمحلات والمطاعم والتموين", trust2: "حد أدنى للطلب 500 ريال", trust3: "الدفع عند الاستلام أو تحويل بنكي",
    howTitle: "طريقة الطلب",
    how1: "اختاروا الكراتين من القائمة حسب احتياج محلكم.",
    how2: "أدخلوا بيانات المنشأة وعنوان التوصيل في الدمام.",
    how3: "أرسلوا الطلب واتساب. نأكد التوفر ونرسل فاتورة الضريبة.",
    catalogTitle: "المنتجات المتوفرة", checkoutTitle: "إتمام الطلب",
    checkoutHint: "بعد إرسال الطلب نأكد الكمية ونصدر الفاتورة. الدفع عند الاستلام أو تحويل بنكي.",
    fCompany: "اسم المنشأة", fCr: "السجل التجاري / الرقم الضريبي", fContact: "اسم المسؤول",
    fPhone: "الجوال", fAddress: "عنوان التوصيل في الدمام", fPay: "طريقة الدفع", fNotes: "ملاحظات",
    sendWa: "إرسال الطلب واتساب",
    all: "كل التصنيفات", add: "إضافة", out: "غير متوفر", min: "الحد", empty: "السلة فارغة.",
    subtotal: "المجموع", vat: "ضريبة 15%", total: "الإجمالي", minOrder: "حد أدنى للطلب",
    payCod: "الدفع عند الاستلام", payBank: "تحويل بنكي بعد الفاتورة"
  },
  en: {
    navCatalog: "Catalog", navHow: "How to order", navCheckout: "Checkout", cart: "Cart",
    call: "Call", whatsapp: "WhatsApp",
    eyebrow: "Wholesale trading · Eastern Province",
    heroTitle: "Your partner for beverages and snacks to shops and restaurants.",
    heroLede: "Carton supply from Dammam. Cash on delivery or bank transfer after invoice.",
    browse: "Browse products", goCheckout: "Checkout",
    trust1: "For shops, restaurants, and catering", trust2: "Minimum order SAR 500", trust3: "COD or bank transfer",
    howTitle: "How to order", how1: "Choose cartons from the list.", how2: "Enter company details and Dammam address.", how3: "Send the order on WhatsApp.",
    catalogTitle: "Available products", checkoutTitle: "Checkout",
    checkoutHint: "We confirm quantity and issue the invoice. Pay cash on delivery or by bank transfer.",
    fCompany: "Company name", fCr: "CR / VAT number", fContact: "Contact person",
    fPhone: "Phone", fAddress: "Delivery address in Dammam", fPay: "Payment method", fNotes: "Notes",
    sendWa: "Send order on WhatsApp",
    all: "All categories", add: "Add", out: "Out of stock", min: "Min", empty: "Cart is empty.",
    subtotal: "Subtotal", vat: "VAT 15%", total: "Total", minOrder: "Minimum order",
    payCod: "Cash on delivery", payBank: "Bank transfer after invoice"
  }
};
let lang = "ar";
let data = null;
const cart = JSON.parse(localStorage.getItem("tab-cart") || "{}");
const $ = (id) => document.getElementById(id);
const t = (key) => I18N[lang][key];
const productName = (p) => lang === "ar" ? p.nameAr : p.name;
const packName = (p) => lang === "ar" ? p.packAr : p.pack;
function money(n) {
  return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-SA", { style: "currency", currency: "SAR" }).format(n);
}
function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $("langBtn").textContent = lang === "ar" ? "English" : "عربي";
  const pay = document.querySelector("select[name=pay]");
  if (pay && pay.options.length >= 2) { pay.options[0].textContent = t("payCod"); pay.options[1].textContent = t("payBank"); }
  if (data) {
    const c = data.company;
    $("companyName").textContent = lang === "ar" ? c.nameAr : c.name;
    $("companyTag").textContent = lang === "ar" ? c.taglineAr : c.tagline;
    $("stripCity").textContent = lang === "ar" ? c.cityAr : c.city;
    $("search").placeholder = lang === "ar" ? "بحث" : "Search";
    const tel = `tel:${c.phone}`;
    const wa = `https://wa.me/${c.whatsapp}`;
    $("stripPhone").href = tel; $("stripPhone").textContent = c.phoneDisplay;
    $("callBtn").href = tel; $("waHero").href = wa;
    $("footerPhone").href = tel; $("footerPhone").textContent = c.phoneDisplay; $("footerWa").href = wa;
    $("footerLine").textContent = `${lang === "ar" ? c.nameAr : c.name} · ${lang === "ar" ? c.cityAr : c.city}`;
    renderCategories(); renderGrid(); renderCart(); renderSummary();
  }
}
function saveCart() { localStorage.setItem("tab-cart", JSON.stringify(cart)); }
function cartItems() {
  if (!data) return [];
  return Object.entries(cart).map(([id, qty]) => {
    const product = data.products.find((p) => p.id === id);
    return product ? { product, qty } : null;
  }).filter(Boolean);
}
function totals() {
  const items = cartItems();
  const subtotal = items.reduce((s, { product, qty }) => s + product.price * qty, 0);
  const vat = subtotal * (data?.company.vatRate || 0.15);
  return { items, subtotal, vat, total: subtotal + vat };
}
function addToCart(id, qty) {
  const product = data.products.find((p) => p.id === id);
  if (!product || !product.inStock) return;
  cart[id] = Math.max(product.minQty, (cart[id] || 0) + qty);
  saveCart(); renderCart(); renderSummary();
}
function renderCategories() {
  const select = $("category"); const current = select.value;
  select.innerHTML = `<option value="">${t("all")}</option>`;
  data.categories.forEach((c) => {
    const opt = document.createElement("option"); opt.value = c.id;
    opt.textContent = lang === "ar" ? c.nameAr : c.name; select.appendChild(opt);
  });
  if ([...select.options].some((o) => o.value === current)) select.value = current;
}
function imgSrc(p) { return p.image || `images/${p.id}.jpg`; }
function renderGrid() {
  const q = $("search").value.trim().toLowerCase();
  const cat = $("category").value;
  const list = data.products.filter((p) => {
    const hay = `${p.name} ${p.nameAr} ${p.pack} ${p.packAr}`.toLowerCase();
    return (!cat || p.category === cat) && (!q || hay.includes(q));
  });
  $("grid").innerHTML = list.map((p) => `
    <article class="card">
      <img src="${imgSrc(p)}" alt="${productName(p)}" onerror="this.style.display='none'">
      <div class="body">
        <h3>${productName(p)}</h3>
        <p class="meta">${packName(p)}</p>
        <p class="price">${money(p.price)}</p>
        <p class="meta">${t("min")} ${p.minQty}</p>
        ${p.inStock ? `<div class="row"><input type="number" min="${p.minQty}" value="${p.minQty}" id="qty-${p.id}"><button class="btn primary" data-add="${p.id}">${t("add")}</button></div>` : `<p class="oos">${t("out")}</p>`}
      </div>
    </article>`).join("");
}
function renderCart() {
  const { items, total } = totals();
  $("cartCount").textContent = items.reduce((n, i) => n + i.qty, 0);
  if (!items.length) { $("cartLines").innerHTML = `<p class="meta">${t("empty")}</p>`; return; }
  $("cartLines").innerHTML = items.map(({ product, qty }) => `
    <div class="line"><div><strong>${productName(product)}</strong><div class="meta">${qty} × ${money(product.price)}</div></div>
    <button class="lang" data-remove="${product.id}">×</button></div>`).join("") + `<p class="price">${t("total")}: ${money(total)}</p>`;
}
function renderSummary() {
  const { items, subtotal, vat, total } = totals();
  $("minNote").textContent = subtotal < data.company.minOrderSAR ? `${t("minOrder")}: ${money(data.company.minOrderSAR)}` : "";
  $("summary").innerHTML = `${items.length ? items.map(({ product, qty }) => `<div class="line"><span>${productName(product)} × ${qty}</span><span>${money(product.price * qty)}</span></div>`).join("") : `<p class="meta">${t("empty")}</p>`}
    <div class="line"><span>${t("subtotal")}</span><span>${money(subtotal)}</span></div>
    <div class="line"><span>${t("vat")}</span><span>${money(vat)}</span></div>
    <div class="line"><strong>${t("total")}</strong><strong>${money(total)}</strong></div>`;
}
function orderText(form) {
  const fd = new FormData(form);
  const { items, subtotal, vat, total } = totals();
  const lines = items.map(({ product, qty }) => `- ${product.name} / ${product.nameAr} | ${qty} x ${product.price.toFixed(2)} SAR`);
  return [`طلب جملة — ${data.company.nameAr}`, `المنشأة: ${fd.get("company")}`, `السجل/الضريبة: ${fd.get("cr") || "-"}`, `المسؤول: ${fd.get("contact")} | ${fd.get("phone")}`, `العنوان: ${fd.get("address")}`, `الدفع: ${fd.get("pay")}`, `ملاحظات: ${fd.get("notes") || "-"}`, "", "الأصناف:", ...lines, "", `المجموع: ${subtotal.toFixed(2)} SAR`, `الضريبة 15%: ${vat.toFixed(2)} SAR`, `الإجمالي: ${total.toFixed(2)} SAR`].join("\n");
}
function validateOrder() {
  const { subtotal } = totals();
  if (!cartItems().length) { alert(t("empty")); return false; }
  if (subtotal < data.company.minOrderSAR) { alert(`${t("minOrder")} ${money(data.company.minOrderSAR)}`); return false; }
  return true;
}
$("langBtn").addEventListener("click", () => { lang = lang === "ar" ? "en" : "ar"; applyLang(); });
$("cartBtn").addEventListener("click", () => { $("drawer").hidden = false; });
$("cartBtnMobile")?.addEventListener("click", () => { $("drawer").hidden = false; });
$("closeCart").addEventListener("click", () => { $("drawer").hidden = true; });
$("toCheckout").addEventListener("click", () => { $("drawer").hidden = true; });
$("grid").addEventListener("click", (e) => {
  const id = e.target.dataset.add; if (!id) return;
  addToCart(id, Number(document.getElementById(`qty-${id}`).value || 1));
});
$("cartLines").addEventListener("click", (e) => {
  const id = e.target.dataset.remove; if (!id) return;
  delete cart[id]; saveCart(); renderCart(); renderSummary();
});
$("search").addEventListener("input", renderGrid);
$("category").addEventListener("change", renderGrid);
$("orderForm").addEventListener("submit", (e) => {
  e.preventDefault(); if (!validateOrder()) return;
  window.open(`https://wa.me/${data.company.whatsapp}?text=${encodeURIComponent(orderText(e.target))}`, "_blank");
});
fetch("products.json").then((r) => r.json()).then((json) => { data = json; applyLang(); });
