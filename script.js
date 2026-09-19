const I18N = {
  en: {
    navCatalog: "Catalog", navHow: "How to order", navCheckout: "Checkout", cart: "Cart",
    eyebrow: "B2B wholesale · Eastern Province",
    heroTitle: "Soft drinks, water, and snacks for shops and restaurants.",
    heroLede: "Order by the carton from Dammam.",
    browse: "Browse catalog", goCheckout: "Go to checkout", howTitle: "How it works",
    how1: "Choose cartons from the catalog.", how2: "Enter company details. No card numbers on this site.",
    how3: "Send the order by WhatsApp or email.", catalogTitle: "Available products",
    updateHint: "Edit products.json to change prices.", checkoutTitle: "Checkout",
    checkoutHint: "HTTPS order form. Pay by bank transfer or invoice.",
    fCompany: "Company name", fCr: "CR / VAT number", fContact: "Contact person", fPhone: "Phone",
    fEmail: "Email", fAddress: "Delivery address (Dammam area)", fPay: "Payment method", fNotes: "Notes",
    sendWa: "Send order on WhatsApp", sendEmail: "Send by email",
    footerNote: "Prices are wholesale and exclude VAT unless stated.",
    all: "All categories", add: "Add", out: "Out of stock", min: "Min", empty: "Cart is empty.",
    subtotal: "Subtotal", vat: "VAT 15%", total: "Total", minOrder: "Minimum order"
  },
  ar: {
    navCatalog: "المنتجات", navHow: "طريقة الطلب", navCheckout: "إتمام الطلب", cart: "السلة",
    eyebrow: "بيع جملة · المنطقة الشرقية",
    heroTitle: "مشروبات ومياه ووجبات خفيفة للمحلات والمطاعم.",
    heroLede: "اطلب بالكرتون من الدمام.",
    browse: "عرض المنتجات", goCheckout: "إتمام الطلب", howTitle: "طريقة العمل",
    how1: "اختر الكراتين.", how2: "أدخل بيانات المنشأة.", how3: "أرسل الطلب واتساب أو إيميل.",
    catalogTitle: "المنتجات المتوفرة", updateHint: "عدّل products.json لتغيير الأسعار.", checkoutTitle: "إتمام الطلب",
    checkoutHint: "نموذج طلب آمن. الدفع تحويل أو فاتورة.",
    fCompany: "اسم المنشأة", fCr: "السجل / الرقم الضريبي", fContact: "اسم المسؤول", fPhone: "الجوال",
    fEmail: "البريد", fAddress: "عنوان التوصيل", fPay: "طريقة الدفع", fNotes: "ملاحظات",
    sendWa: "إرسال واتساب", sendEmail: "إرسال بالإيميل",
    footerNote: "الأسعار جملة وغير شاملة الضريبة إلا إذا ذكر خلاف ذلك.",
    all: "كل التصنيفات", add: "إضافة", out: "غير متوفر", min: "الحد", empty: "السلة فارغة.",
    subtotal: "المجموع", vat: "ضريبة 15%", total: "الإجمالي", minOrder: "حد أدنى للطلب"
  }
};
let lang = "en";
let data = null;
const cart = JSON.parse(localStorage.getItem("tab-cart") || "{}");
const $ = (id) => document.getElementById(id);
function money(n) {
  return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-SA", { style: "currency", currency: "SAR" }).format(n);
}
function t(key) { return I18N[lang][key]; }
function productName(p) { return lang === "ar" ? p.nameAr : p.name; }
function packName(p) { return lang === "ar" ? p.packAr : p.pack; }
function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $("langBtn").textContent = lang === "ar" ? "English" : "عربي";
  if (data) {
    $("companyName").textContent = lang === "ar" ? data.company.nameAr : data.company.name;
    $("companyCity").textContent = lang === "ar" ? data.company.cityAr : data.company.city;
    $("search").placeholder = lang === "ar" ? "بحث" : "Search products";
  }
  renderCategories(); renderGrid(); renderCart(); renderSummary();
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
  const subtotal = items.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  const vat = subtotal * (data?.company.vatRate || 0.15);
  return { items, subtotal, vat, total: subtotal + vat };
}
function addToCart(id, qty) {
  const product = data.products.find((p) => p.id === id);
  if (!product || !product.inStock) return;
  cart[id] = Math.max(product.minQty, (cart[id] || 0) + qty);
  saveCart(); renderCart(); renderSummary();
}
function saveCartAndRefresh() { saveCart(); renderCart(); renderSummary(); }
function renderCategories() {
  const select = $("category");
  const current = select.value;
  select.innerHTML = `<option value="">${t("all")}</option>`;
  data.categories.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = lang === "ar" ? c.nameAr : c.name;
    select.appendChild(opt);
  });
  if ([...select.options].some((o) => o.value === current)) select.value = current;
}
function renderGrid() {
  const q = $("search").value.trim().toLowerCase();
  const cat = $("category").value;
  const list = data.products.filter((p) => {
    const hay = `${p.name} ${p.nameAr} ${p.pack} ${p.packAr}`.toLowerCase();
    return (!cat || p.category === cat) && (!q || hay.includes(q));
  });
  $("grid").innerHTML = list.map((p) => `
    <article class="card">
      <h3>${productName(p)}</h3>
      <p class="meta">${packName(p)}</p>
      <p class="price">${money(p.price)}</p>
      <p class="meta">${t("min")} ${p.minQty}</p>
      ${p.inStock ? `<div class="row"><input type="number" min="${p.minQty}" value="${p.minQty}" id="qty-${p.id}"><button class="btn primary" data-add="${p.id}">${t("add")}</button></div>` : `<p class="oos">${t("out")}</p>`}
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
  $("footerLine").textContent = `${data.company.name} · ${data.company.city}`;
}
function orderText(form) {
  const fd = new FormData(form);
  const { items, subtotal, vat, total } = totals();
  const lines = items.map(({ product, qty }) => `- ${product.name} / ${product.nameAr} | ${qty} x ${product.price.toFixed(2)} SAR`);
  return [`Wholesale order — ${data.company.name}`, `Company: ${fd.get("company")}`, `CR/VAT: ${fd.get("cr") || "-"}`, `Contact: ${fd.get("contact")} | ${fd.get("phone")}`, `Email: ${fd.get("email") || "-"}`, `Address: ${fd.get("address")}`, `Payment: ${fd.get("pay")}`, `Notes: ${fd.get("notes") || "-"}`, "", "Items:", ...lines, "", `Subtotal: ${subtotal.toFixed(2)} SAR`, `VAT 15%: ${vat.toFixed(2)} SAR`, `Total: ${total.toFixed(2)} SAR`].join("\n");
}
function validateOrder() {
  const { subtotal } = totals();
  if (!cartItems().length) { alert(t("empty")); return false; }
  if (subtotal < data.company.minOrderSAR) { alert(`${t("minOrder")} ${money(data.company.minOrderSAR)}`); return false; }
  return true;
}
$("langBtn").addEventListener("click", () => { lang = lang === "en" ? "ar" : "en"; applyLang(); });
$("cartBtn").addEventListener("click", () => { $("drawer").hidden = false; });
$("cartBtnMobile")?.addEventListener("click", () => { $("drawer").hidden = false; });
$("closeCart").addEventListener("click", () => { $("drawer").hidden = true; });
$("toCheckout").addEventListener("click", () => { $("drawer").hidden = true; });
$("grid").addEventListener("click", (e) => {
  const id = e.target.dataset.add;
  if (!id) return;
  addToCart(id, Number(document.getElementById(`qty-${id}`).value || 1));
});
$("cartLines").addEventListener("click", (e) => {
  const id = e.target.dataset.remove;
  if (!id) return;
  delete cart[id]; saveCartAndRefresh();
});
$("search").addEventListener("input", renderGrid);
$("category").addEventListener("change", renderGrid);
$("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateOrder()) return;
  window.open(`https://wa.me/${data.company.whatsapp}?text=${encodeURIComponent(orderText(e.target))}`, "_blank");
});
$("emailBtn").addEventListener("click", () => {
  if (!validateOrder()) return;
  const form = $("orderForm");
  if (!form.reportValidity()) return;
  window.location.href = `mailto:${data.company.email}?subject=${encodeURIComponent("Wholesale order")}&body=${encodeURIComponent(orderText(form))}`;
});
fetch("products.json").then((r) => r.json()).then((json) => { data = json; applyLang(); });
