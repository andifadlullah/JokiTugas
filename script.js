// ==========================================
// GANTI DENGAN NOMOR WHATSAPP KAMU
// ==========================================
const WHATSAPP_NUMBER = "6285758567260";

// ==========================================
// DATA LAYANAN
// ==========================================
const SERVICES = {
    makalah: {
        name: "MAKALAH",
        label: "Makalah",
        models: [
            { key: "lengkap", name: "Makalah", price: 50000 },
            { key: "ppt", name: "Makalah + PPT", price: 75000 }
        ],
        quantityLabel: "Jumlah Halaman",
        quantityUnit: "halaman",
        quantityOptions: [
            { value: 5, label: "1-4 Halaman" },
            { value: 10, label: "5-9 Halaman" },
            { value: 15, label: "10-14 Halaman" },
            { value: 20, label: "15-20 Halaman" },
            // { value: "custom", label: "Custom" }
        ]
    },
    ppt: {
        name: "PPT / PRESENTASI",
        label: "PPT / Presentasi",
        models: [
            { key: "sederhana", name: "PPT Biasa (Non Animasi)", price: 45000 },
            { key: "materi", name: "PPT + Animasi", price: 70000 }
        ],
        quantityLabel: "Jumlah Slide",
        quantityUnit: "slide",
        quantityOptions: [
            { value: 5, label: "1-4 Slide" },
            { value: 10, label: "5-9 Slide" },
            { value: 15, label: "10-14 Slide" },
            { value: 20, label: "15-20 Slide" },
            // { value: "custom", label: "Custom" }
        ]
    },
    coding: {
        name: "CODING",
        label: "Coding",
        models: [
            { key: "perbaikan", name: "Perbaikan Error", price: 25000 },
            { key: "sederhana", name: "Coding Sederhana", price: 35000 },
            { key: "project", name: "Project", price: 75000 },
            { key: "website", name: "Website", price: 100000 }
        ],
        languages: ["HTML", "CSS", "JavaScript", "Python", "Java", "C", "C++", "PHP", "SQL"],
        difficulties: [
            { key: "mudah", name: "Mudah", multiplier: 1 },
            { key: "sedang", name: "Sedang", multiplier: 1.5 },
            { key: "sulit", name: "Sulit", multiplier: 2.5 }
        ]
    },
    database: {
        name: "DATABASE",
        label: "Database",
        models: [
            { key: "membuat", name: "Membuat Database", price: 35000 },
            { key: "tabel", name: "Membuat Tabel & Relasi", price: 45000 },
            { key: "erd", name: "ERD + Database", price: 60000 },
            { key: "crud", name: "Database + CRUD", price: 85000 },
            { key: "project", name: "Database untuk Project", price: 100000 }
        ],
        dbTypes: ["MySQL", "PostgreSQL", "SQLite", "SQL Server", "MongoDB", "Lainnya"],
        difficulties: [
            { key: "mudah", name: "Mudah", add: 0 },
            { key: "sedang", name: "Sedang", add: 15000 },
            { key: "sulit", name: "Sulit", add: 30000 }
        ]
    }
};

// ==========================================
// STATE
// ==========================================
var state = {
    service: null,
    model: null,
    modelName: "",
    modelPrice: 0,
    quantity: null,
    quantityLabel: "",
    customQuantity: "",
    language: null,
    difficulty: null,
    difficultyName: "",
    linkProject: "",
    codingNotes: "",
    dbType: null,
    dbProjectName: "",
    dbTables: "",
    dbDesc: "",
    dbNotes: "",
    dbRef: "",
    price: null,
    name: "",
    whatsapp: "",
    title: "",
    notes: ""
};

// ==========================================
// UTILITY
// ==========================================
function formatPrice(n) {
    if (n === null || n === undefined) return "";
    return "Rp" + n.toLocaleString("id-ID");
}
function getQuantityMultiplier(qty) {
    if (qty === null || qty === undefined) return 1;
    if (qty <= 5) return 1;
    if (qty <= 10) return 1.5;
    if (qty <= 15) return 2;
    if (qty <= 20) return 2.5;
    return 2.5 + (qty - 20) * 0.15;
}
function getDataMultiplier(cat) {
    var map = { small: 1, medium: 1.5, large: 2.5, xlarge: 4 };
    return map[cat] || 1;
}
function getDifficultyMultiplier(diff) {
    var svc = SERVICES.coding;
    for (var i = 0; i < svc.difficulties.length; i++) {
        if (svc.difficulties[i].key === diff) return svc.difficulties[i].multiplier;
    }
    return 1;
}
function getDbDifficultyAdd(diff) {
    var svc = SERVICES.database;
    for (var i = 0; i < svc.difficulties.length; i++) {
        if (svc.difficulties[i].key === diff) return svc.difficulties[i].add;
    }
    return 0;
}

// ==========================================
// HITUNG HARGA
// ==========================================
function calculatePrice() {
    if (!state.model || !state.modelPrice) return null;
    var multiplier = 1;
    var addOn = 0;
    if (state.service === "coding") {
        if (state.difficulty) {
            multiplier = getDifficultyMultiplier(state.difficulty);
        }
    } else if (state.service === "database") {
        if (state.difficulty) {
            addOn = getDbDifficultyAdd(state.difficulty);
        }
        return state.modelPrice + addOn;
    } else if (state.service === "excel") {
        if (state.quantity) {
            multiplier = getDataMultiplier(state.quantity);
        }
    } else {
        if (state.quantity !== null) {
            multiplier = getQuantityMultiplier(state.quantity);
        }
    }
    return Math.round(state.modelPrice * multiplier / 1000) * 1000;
}

function updatePrice() {
    var el = document.getElementById("priceAmount");
    if (!el) return;
    state.price = calculatePrice();
    if (state.price) {
        el.textContent = formatPrice(state.price);
        el.classList.remove("placeholder");
    } else {
        el.textContent = "Pilih opsi di atas";
        el.classList.add("placeholder");
    }
}

// ==========================================
// RENDER HOME
// ==========================================
function renderHome() {
    var keys = Object.keys(SERVICES);
    var cards = "";
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var svc = SERVICES[key];
        var lowest = svc.models[0].price;
        cards += '<div class="service-card" data-service="' + key + '">' +
            '<div class="service-name">' + svc.name + '</div>' +
            '<div class="service-price">Mulai ' + formatPrice(lowest) + '</div>' +
            '</div>';
    }
    document.getElementById("home-section").innerHTML =
        '<div class="home-content">' +
        '<h1 class="home-title">Apa yang ingin kamu kerjakan?</h1>' +
        '<p class="home-subtitle">Pilih layanan yang kamu butuhkan.</p>' +
        '<div class="service-grid">' + cards + '</div>' +
        '</div>';
    var serviceCards = document.querySelectorAll(".service-card");
    for (var j = 0; j < serviceCards.length; j++) {
        serviceCards[j].addEventListener("click", function () {
            selectService(this.getAttribute("data-service"));
        });
    }
}

// ==========================================
// PILIH LAYANAN
// ==========================================
function selectService(key) {
    state.service = key;
    state.model = null;
    state.modelName = "";
    state.modelPrice = 0;
    state.quantity = null;
    state.quantityLabel = "";
    state.customQuantity = "";
    state.language = null;
    state.difficulty = null;
    state.difficultyName = "";
    state.linkProject = "";
    state.codingNotes = "";
    state.dbType = null;
    state.dbProjectName = "";
    state.dbTables = "";
    state.dbDesc = "";
    state.dbNotes = "";
    state.dbRef = "";
    state.price = null;

    document.getElementById("home-section").classList.add("hidden");
    document.getElementById("detail-section").classList.remove("hidden");
    renderDetail(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// RENDER DETAIL
// ==========================================
function renderDetail(key) {
    var svc = SERVICES[key];
    var html = "";
    html += '<button class="back-btn" id="backBtn">\u2190 Kembali</button>';
    html += '<h1 class="detail-title">' + svc.name + '</h1>';
    // MODEL SELECTION (skip for coding and database — they use custom grids)
    if (key !== "coding" && key !== "database") {
        html += '<div class="section-label">Pilih Jenis</div>';
        html += '<div class="model-grid" id="modelGrid">';
        for (var i = 0; i < svc.models.length; i++) {
            var m = svc.models[i];
            html += '<div class="model-card" data-model="' + m.key + '" data-price="' + m.price + '">' +
                '<span class="model-name">' + m.name + '</span>' +
                '<span class="model-price">Mulai ' + formatPrice(m.price) + '</span>' +
                '</div>';
        }
        html += '</div>';
    }
    // QUANTITY (non-coding, non-database)
    if (key !== "coding" && key !== "database" && svc.quantityOptions) {
        html += '<div class="form-group">';
        html += '<label class="form-label">' + svc.quantityLabel + '</label>';
        html += '<select class="form-select" id="quantitySelect">';
        html += '<option value="">Pilih...</option>';
        for (var q = 0; q < svc.quantityOptions.length; q++) {
            var opt = svc.quantityOptions[q];
            html += '<option value="' + opt.value + '">' + opt.label + '</option>';
        }
        html += '</select>';
        html += '<div id="customQtyWrap" class="hidden" style="margin-top:8px">';
        html += '<input type="number" class="form-input" id="customQty" placeholder="Masukkan jumlah" min="1">';
        html += '</div>';
        html += '</div>';
    }
    // CODING: LANGUAGE
    if (key === "coding") {
        html += '<div class="form-group">';
        html += '<label class="form-label">Bahasa Pemrograman</label>';
        html += '<select class="form-select" id="languageSelect">';
        html += '<option value="">Pilih bahasa...</option>';
        for (var l = 0; l < svc.languages.length; l++) {
            html += '<option value="' + svc.languages[l] + '">' + svc.languages[l] + '</option>';
        }
        html += '</select>';
        html += '</div>';
        // CODING: HELP TYPE
        html += '<div class="section-label">Jenis Bantuan</div>';
        html += '<div class="model-grid" id="helpGrid">';
        for (var h = 0; h < svc.models.length; h++) {
            var hm = svc.models[h];
            html += '<div class="model-card" data-model="' + hm.key + '" data-price="' + hm.price + '">' +
                '<span class="model-name">' + hm.name + '</span>' +
                '<span class="model-price">Mulai ' + formatPrice(hm.price) + '</span>' +
                '</div>';
        }
        html += '</div>';
        // CODING: DIFFICULTY
        html += '<div class="section-label">Tingkat Kesulitan</div>';
        html += '<div class="model-grid" id="diffGrid">';
        for (var d = 0; d < svc.difficulties.length; d++) {
            var df = svc.difficulties[d];
            html += '<div class="model-card" data-diff="' + df.key + '">' +
                '<span class="model-name">' + df.name + '</span>' +
                '</div>';
        }
        html += '</div>';
        // CODING: EXTRA FIELDS
        html += '<div class="form-group">';
        html += '<label class="form-label">Link Project / Repository</label>';
        html += '<input type="url" class="form-input" id="linkProject" placeholder="https://...">';
        html += '</div>';
        html += '<div class="form-group">';
        html += '<label class="form-label">Jelaskan Kebutuhan Coding</label>';
        html += '<textarea class="form-textarea" id="codingNotes" placeholder="Ceritakan apa yang perlu dikerjakan..."></textarea>';
        html += '</div>';
    }
    // DATABASE: TYPE, WORK TYPE, DIFFICULTY, EXTRA FIELDS
    if (key === "database") {
        html += '<div class="form-group">';
        html += '<label class="form-label">Jenis Database</label>';
        html += '<select class="form-select" id="dbTypeSelect">';
        html += '<option value="">Pilih database...</option>';
        for (var dt = 0; dt < svc.dbTypes.length; dt++) {
            html += '<option value="' + svc.dbTypes[dt] + '">' + svc.dbTypes[dt] + '</option>';
        }
        html += '</select>';
        html += '</div>';

        html += '<div class="section-label">Jenis Pengerjaan</div>';
        html += '<div class="model-grid" id="helpGrid">';
        for (var dk = 0; dk < svc.models.length; dk++) {
            var dm = svc.models[dk];
            html += '<div class="model-card" data-model="' + dm.key + '" data-price="' + dm.price + '">' +
                '<span class="model-name">' + dm.name + '</span>' +
                '<span class="model-price">Mulai ' + formatPrice(dm.price) + '</span>' +
                '</div>';
        }
        html += '</div>';
        html += '<div class="section-label">Tingkat Kesulitan</div>';
        html += '<div class="model-grid" id="diffGrid">';
        for (var dd = 0; dd < svc.difficulties.length; dd++) {
            var ddf = svc.difficulties[dd];
            var addLabel = ddf.add > 0 ? " (+" + formatPrice(ddf.add) + ")" : "";
            html += '<div class="model-card" data-diff="' + ddf.key + '">' +
                '<span class="model-name">' + ddf.name + addLabel + '</span>' +
                '</div>';
        }
        html += '</div>';
        html += '<div class="form-group">';
        html += '<label class="form-label">Nama Project</label>';
        html += '<input type="text" class="form-input" id="dbProjectName" placeholder="Contoh: Sistem Informasi Perpustakaan">';
        html += '</div>';
        html += '<div class="form-group">';
        html += '<label class="form-label">Jumlah Tabel</label>';
        html += '<input type="number" class="form-input" id="dbTables" placeholder="Contoh: 8" min="1">';
        html += '</div>';
        html += '<div class="form-group">';
        html += '<label class="form-label">Deskripsi Database</label>';
        html += '<textarea class="form-textarea" id="dbDesc" placeholder="Jelaskan kebutuhan database kamu..."></textarea>';
        html += '</div>';
        html += '<div class="form-group">';
        html += '<label class="form-label">Kebutuhan / Catatan</label>';
        html += '<textarea class="form-textarea" id="dbNotes" placeholder="Tambahan kebutuhan atau catatan..."></textarea>';
        html += '</div>';
        html += '<div class="form-group">';
        html += '<label class="form-label">Link Referensi / File</label>';
        html += '<input type="url" class="form-input" id="dbRef" placeholder="https://...">';
        html += '</div>';
    }
    // PRICE BOX
    html += '<div class="price-box">';
    html += '<div class="price-label">Estimasi Harga</div>';
    html += '<div class="price-amount placeholder" id="priceAmount">Pilih opsi di atas</div>';
    html += '</div>';
    // CUSTOMER FORM
    html += '<div class="section-label">Informasi</div>';
    html += '<div class="form-group">';
    html += '<label class="form-label">Nama</label>';
    html += '<input type="text" class="form-input" id="custName" placeholder="Nama lengkap kamu">';
    html += '</div>';
    html += '<div class="form-group">';
    html += '<label class="form-label">Judul / Nama Tugas</label>';
    html += '<input type="text" class="form-input" id="custTitle" placeholder="Judul tugas kamu">';
    html += '</div>';
    if (key !== "database") {
        html += '<div class="form-group">';
        html += '<label class="form-label">Catatan / Detail</label>';
        html += '<textarea class="form-textarea" id="custNotes" placeholder="Tambahkan catatan jika perlu..."></textarea>';
        html += '</div>';
    }
    // WHATSAPP BUTTON
    html += '<button class="whatsapp-btn" id="waBtn">PESAN VIA WHATSAPP \u2192</button>';
    document.getElementById("detail-content").innerHTML = html;
    attachListeners(key);
}

// ==========================================
// ATTACH EVENT LISTENERS
// ==========================================
function attachListeners(key) {
    document.getElementById("backBtn").addEventListener("click", goHome);
    var grids = ["modelGrid", "helpGrid", "diffGrid"];
    for (var g = 0; g < grids.length; g++) {
        var grid = document.getElementById(grids[g]);
        if (grid) {
            grid.addEventListener("click", function (e) {
                var card = e.target.closest(".model-card");
                if (!card) return;
                var isDiff = card.hasAttribute("data-diff");
                var siblings = card.parentElement.querySelectorAll(".model-card");
                for (var s = 0; s < siblings.length; s++) {
                    siblings[s].classList.remove("selected");
                }
                card.classList.add("selected");
                if (isDiff) {
                    state.difficulty = card.getAttribute("data-diff");
                    var rawName = card.querySelector(".model-name").textContent;
                    state.difficultyName = rawName.indexOf("(") > -1 ? rawName.substring(0, rawName.indexOf("(")).trim() : rawName;
                } else {
                    state.model = card.getAttribute("data-model");
                    state.modelName = card.querySelector(".model-name").textContent;
                    state.modelPrice = parseInt(card.getAttribute("data-price"));
                }
                updatePrice();
            });
        }
    }
    var qtySelect = document.getElementById("quantitySelect");
    if (qtySelect) {
        qtySelect.addEventListener("change", function () {
            var val = this.value;
            var wrap = document.getElementById("customQtyWrap");
            if (val === "custom") {
                wrap.classList.remove("hidden");
                state.quantity = null;
                state.quantityLabel = "";
            } else if (val !== "") {
                wrap.classList.add("hidden");
                state.quantity = parseInt(val);
                state.quantityLabel = this.options[this.selectedIndex].text;
            } else {
                wrap.classList.add("hidden");
                state.quantity = null;
                state.quantityLabel = "";
            }
            updatePrice();
        });
    }
    // CUSTOM QUANTITY
    var customQty = document.getElementById("customQty");
    if (customQty) {
        customQty.addEventListener("input", function () {
            var num = parseInt(this.value);
            var svc = SERVICES[state.service];
            if (num > 0) {
                state.quantity = num;
                state.quantityLabel = num + " " + svc.quantityUnit;
            } else {
                state.quantity = null;
                state.quantityLabel = "";
            }
            updatePrice();
        });
    }
    // LANGUAGE SELECT
    var langSelect = document.getElementById("languageSelect");
    if (langSelect) {
        langSelect.addEventListener("change", function () {
            state.language = this.value || null;
        });
    }
    // CUSTOMER FORM
    var custName = document.getElementById("custName");
    if (custName) custName.addEventListener("input", function () { state.name = this.value; });

    var custWa = document.getElementById("custWa");
    if (custWa) custWa.addEventListener("input", function () { state.whatsapp = this.value; });

    var custTitle = document.getElementById("custTitle");
    if (custTitle) custTitle.addEventListener("input", function () { state.title = this.value; });

    var custNotes = document.getElementById("custNotes");
    if (custNotes) custNotes.addEventListener("input", function () { state.notes = this.value; });

    // CODING EXTRA FIELDS
    var linkProject = document.getElementById("linkProject");
    if (linkProject) linkProject.addEventListener("input", function () { state.linkProject = this.value; });

    var codingNotes = document.getElementById("codingNotes");
    if (codingNotes) codingNotes.addEventListener("input", function () { state.codingNotes = this.value; });

    // DATABASE EXTRA FIELDS
    var dbTypeSelect = document.getElementById("dbTypeSelect");
    if (dbTypeSelect) dbTypeSelect.addEventListener("change", function () { state.dbType = this.value || null; });

    var dbProjectName = document.getElementById("dbProjectName");
    if (dbProjectName) dbProjectName.addEventListener("input", function () { state.dbProjectName = this.value; });

    var dbTables = document.getElementById("dbTables");
    if (dbTables) dbTables.addEventListener("input", function () { state.dbTables = this.value; });

    var dbDesc = document.getElementById("dbDesc");
    if (dbDesc) dbDesc.addEventListener("input", function () { state.dbDesc = this.value; });

    var dbNotes = document.getElementById("dbNotes");
    if (dbNotes) dbNotes.addEventListener("input", function () { state.dbNotes = this.value; });

    var dbRef = document.getElementById("dbRef");
    if (dbRef) dbRef.addEventListener("input", function () { state.dbRef = this.value; });
    // WHATSAPP BUTTON
    document.getElementById("waBtn").addEventListener("click", sendWhatsApp);
}
// ==========================================
// KEMBALI KE HOME
// ==========================================
function goHome() {
    state.service = null;
    state.model = null;
    state.modelName = "";
    state.modelPrice = 0;
    state.quantity = null;
    state.quantityLabel = "";
    state.customQuantity = "";
    state.language = null;
    state.difficulty = null;
    state.difficultyName = "";
    state.linkProject = "";
    state.codingNotes = "";
    state.dbType = null;
    state.dbProjectName = "";
    state.dbTables = "";
    state.dbDesc = "";
    state.dbNotes = "";
    state.dbRef = "";
    state.price = null;

    document.getElementById("home-section").classList.remove("hidden");
    document.getElementById("detail-section").classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}
// ==========================================
// RESET TOTAL
// ==========================================
function resetOrder() {
    state = {
        service: null,
        model: null,
        modelName: "",
        modelPrice: 0,
        quantity: null,
        quantityLabel: "",
        customQuantity: "",
        language: null,
        difficulty: null,
        difficultyName: "",
        linkProject: "",
        codingNotes: "",
        dbType: null,
        dbProjectName: "",
        dbTables: "",
        dbDesc: "",
        dbNotes: "",
        dbRef: "",
        price: null,
        name: "",
        whatsapp: "",
        title: "",
        notes: ""
    };

    document.getElementById("home-section").classList.remove("hidden");
    document.getElementById("detail-section").classList.add("hidden");
    window.scrollTo({ top: 0 });
}
// ==========================================
// BUAT PESAN WHATSAPP
// ==========================================
function generateMessage() {
    var svc = SERVICES[state.service];
    var lines = [];
    lines.push("Halo Bang Andi, saya ingin memesan bantuan tugas.");
    lines.push("");
    lines.push("DETAIL PESANAN");
    lines.push("Layanan: " + svc.label);
    if (state.service === "database") {
        lines.push("Jenis Database: " + (state.dbType || "-"));
        lines.push("Jenis Pengerjaan: " + state.modelName);
        lines.push("Tingkat Kesulitan: " + (state.difficultyName || "-"));
    } else if (state.service === "coding") {
        lines.push("Bahasa Pemrograman: " + (state.language || "-"));
        lines.push("Jenis Bantuan: " + state.modelName);
        lines.push("Tingkat Kesulitan: " + (state.difficultyName || "-"));
    } else {
        lines.push("Model: " + state.modelName);
        lines.push("Jumlah: " + (state.quantityLabel || "-"));
    }
    lines.push("");
    lines.push("ESTIMASI HARGA");
    lines.push(formatPrice(state.price || 0));
    lines.push("");
    lines.push("DATA CUSTOMER");
    lines.push("Nama: " + state.name);
    lines.push("WhatsApp: " + state.whatsapp);
    lines.push("Judul: " + state.title);
    if (state.service === "database") {
        lines.push("");
        lines.push("DATA PROJECT");
        lines.push("Nama Project: " + (state.dbProjectName || "-"));
        lines.push("Jumlah Tabel: " + (state.dbTables || "-"));
        lines.push("Deskripsi: " + (state.dbDesc || "-"));
        lines.push("Catatan: " + (state.dbNotes || "-"));
        lines.push("Link Referensi: " + (state.dbRef || "-"));
    } else if (state.service === "coding") {
        lines.push("Link Project: " + (state.linkProject || "-"));
        lines.push("Deskripsi: " + (state.codingNotes || "-"));
        lines.push("Catatan: " + (state.notes || "-"));
    } else {
        lines.push("Catatan: " + (state.notes || "-"));
    }
    lines.push("");
    lines.push("Mohon informasi lebih lanjut mengenai pesanan saya.");
    lines.push("Terima kasih.");
    return lines.join("\n");
}
// ==========================================
// KIRIM KE WHATSAPP
// ==========================================
function sendWhatsApp() {
    if (!state.model) {
        alert("Silakan pilih model/jenis layanan terlebih dahulu.");
        return;
    }
    if (state.service !== "coding" && state.service !== "database") {
        if (state.quantity === null) {
            alert("Silakan pilih jumlah terlebih dahulu.");
            return;
        }
    }
    if (state.service === "coding") {
        if (!state.language) {
            alert("Silakan pilih bahasa pemrograman.");
            return;
        }
        if (!state.difficulty) {
            alert("Silakan pilih tingkat kesulitan.");
            return;
        }
    }
    if (state.service === "database") {
        if (!state.dbType) {
            alert("Silakan pilih jenis database.");
            return;
        }
        if (!state.difficulty) {
            alert("Silakan pilih tingkat kesulitan.");
            return;
        }
    }
    if (!state.name.trim()) {
        alert("Silakan isi nama kamu.");
        return;
    }
    if (!state.title.trim()) {
        alert("Silakan isi judul/nama tugas.");
        return;
    }
    var message = generateMessage();
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank");
}
// ==========================================
// INISIALISASI
// ==========================================
document.getElementById("resetBtn").addEventListener("click", function () {
    var message = "Halo Bang Andi, saya ingin bertanya mengenai jasa yang tersedia.";
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank");
});
renderHome();