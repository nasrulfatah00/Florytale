/* =========================================
   LOGIKA HALAMAN ORDER CHEKI (FINAL - LENGKAP)
   - Split Kolom Google Sheets
   - Saklar Buka/Tutup Toko
   - Notifikasi Sukses Pemanggilan Nama
   ========================================= */

// 🔴 SAKLAR UTAMA: BUKA/TUTUP FORM CHEKI 🔴
// Ubah menjadi 'true' jika sedang ada event (form terbuka).
// Ubah menjadi 'false' jika sedang tidak ada event (form ditutup).
const isFormBuka = true; 

const chekiMembers = [
    { id: "devi", name: "Devi", img: "img/devi.jpg" },
    { id: "risma", name: "Risma", img: "img/risma.jpg" },
    { id: "tiara", name: "Tiara", img: "img/tiara.jpg" },
    { id: "ziella", name: "Ziella", img: "img/ziella.jpg" },
    { id: "caca", name: "Caca", img: "img/caca.jpg" },
    { id: "diva", name: "Diva", img: "img/diva.jpg" }
];

let cart = {}; 
let groupQty = 1; 

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. LOGIKA SAKLAR BUKA/TUTUP ---
    const orderForm = document.getElementById("chekiOrderForm");
    const closedMsg = document.getElementById("closedMessageContainer");
    const memberArea = document.getElementById("memberSelectionArea");
    
    if (isFormBuka === false) {
        // Jika saklar FALSE (Tutup), sembunyikan form & tampilkan pesan maaf
        if (orderForm) orderForm.style.display = "none";
        if (memberArea) memberArea.style.display = "none";
        if (closedMsg) closedMsg.style.display = "block";
        return; // Hentikan script di sini, tidak perlu meload fungsi form
    }

    // 1. GENERATE KARTU MEMBER KE DALAM GRID
    const gridContainer = document.getElementById("memberGrid");
    if(gridContainer) {
        gridContainer.innerHTML = ""; 
        chekiMembers.forEach(member => {
            const cardHTML = `
                <div class="cheki-card" id="card-${member.id}" onclick="toggleMember('${member.id}')">
                    <i class="fa-solid fa-check check-icon"></i>
                    <img src="${member.img}" alt="${member.name}">
                    <div class="cheki-card-info">
                        <h4>${member.name}</h4>
                        <div class="qty-control">
                            <button type="button" class="qty-btn" onclick="updateQty('${member.id}', -1, event)">-</button>
                            <span class="qty-display" id="qty-${member.id}">1</span>
                            <button type="button" class="qty-btn" onclick="updateQty('${member.id}', 1, event)">+</button>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.innerHTML += cardHTML;
        });
    }

    // 2. LOGIKA MUNCUL/SEMBUNYI MENU & FOTO MEMBER
    const tipeChekiSelect = document.getElementById("tipeCheki");
    if(tipeChekiSelect) {
        tipeChekiSelect.addEventListener("change", function() {
            const tipe = this.value;
            const jenisContainer = document.getElementById("jenisChekiContainer");
            const jumlahContainer = document.getElementById("jumlahGroupContainer");

            if (tipe === "Reguler") {
                if(jenisContainer) jenisContainer.style.display = "block";
                if(jumlahContainer) jumlahContainer.style.display = "none";
                if(memberArea) memberArea.style.display = "block"; 
            } 
            else if (tipe === "Group") {
                if(jenisContainer) jenisContainer.style.display = "none";
                if(jumlahContainer) jumlahContainer.style.display = "block";
                if(memberArea) memberArea.style.display = "none";
            }
            updateSummaryUI(); 
        });
    }

    // 3. TAMPILKAN NAMA FILE SAAT UPLOAD
    const buktiBayarInput = document.getElementById("buktiBayar");
    if(buktiBayarInput) {
        buktiBayarInput.addEventListener("change", function() {
            const fileNameDisplay = document.getElementById("fileNameDisplay");
            if(this.files && this.files.length > 0) {
                fileNameDisplay.innerHTML = `<i class="fa-solid fa-image"></i> Gambar terpilih: ${this.files[0].name}`;
            } else {
                fileNameDisplay.innerHTML = "";
            }
        });
    }

    // 4. MENGIRIM DATA KE GOOGLE SHEETS
    if(orderForm) {
        orderForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const tipe = document.getElementById("tipeCheki").value;
            
            // Validasi Pilihan
            if(tipe === "Reguler" && Object.keys(cart).length === 0) {
                alert("Silakan pilih minimal 1 member dari foto di atas!");
                return;
            }
            const fileInput = document.getElementById("buktiBayar");
            if(fileInput.files.length === 0) {
                alert("Harap upload bukti pembayaran!");
                return;
            }

            // --- UBAH TOMBOL JADI LOADING ---
            const submitBtn = document.querySelector(".submit-order-btn");
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sedang Mengirim...';
            submitBtn.disabled = true; 

            // --- SIAPKAN DATA PESANAN (Variabel Dipecah) ---
            let jenisChekiVal = "-";
            let memberListStr = "";
            let totalQty = 0;
            let totalHarga = 0;

            if (tipe === "Reguler") {
                jenisChekiVal = document.getElementById("jenisCheki").value;
                let memberArr = [];
                for (const [id, qty] of Object.entries(cart)) {
                    const member = chekiMembers.find(m => m.id === id);
                    memberArr.push(`${member.name} (x${qty})`);
                    totalQty += qty;
                    totalHarga += (qty * 25000);
                }
                memberListStr = memberArr.join(", ");
            } else if (tipe === "Group") {
                jenisChekiVal = "-";
                memberListStr = "Group Cheki";
                totalQty = groupQty;
                totalHarga = groupQty * 35000;
            }

            // --- PROSES UBAH GAMBAR JADI TEKS & KIRIM DATA ---
            const reader = new FileReader();
            reader.onload = function() {
                const payload = {
                    namaEvent: document.getElementById("eventSelect").value,
                    nama: document.getElementById("nama").value,
                    email: document.getElementById("email").value,
                    phone: document.getElementById("phone").value,
                    ig: document.getElementById("ig").value || "-",
                    
                    // --- DATA YANG DIPECAH ---
                    tipeCheki: tipe,
                    jenisCheki: jenisChekiVal,
                    memberPesanan: memberListStr,
                    jumlahCheki: totalQty,
                    
                    catatan: document.getElementById("catatan").value || "-",
                    totalHarga: `Rp ${totalHarga.toLocaleString('id-ID')}`,
                    fileName: fileInput.files[0].name,
                    mimeType: fileInput.files[0].type,
                    fileBase64: reader.result 
                };

                // URL Web App Anda yang sudah benar
                const scriptURL = 'https://script.google.com/macros/s/AKfycbzOKWeSBTDKEj-hVKQIbendyQUKvN4kJX-6JUN9DrrKm5_DA1Q0hVjjLBpmA2u23vN22g/exec';

                // Kirim data ke Google Script
                fetch(scriptURL, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    mode: 'no-cors' // Tembus blokir Google
                })
                .then(() => {
                    // --- LOGIKA MUNCULKAN HALAMAN SUKSES ESTETIK ---
                    const namaPemesan = document.getElementById("nama").value;
                    
                    // Sembunyikan Form & Foto
                    document.getElementById("chekiOrderForm").style.display = "none";
                    if(document.getElementById("memberSelectionArea")) {
                        document.getElementById("memberSelectionArea").style.display = "none";
                    }
                    
                    // Masukkan Nama & Munculkan Kotak Sukses
                    if(document.getElementById("successNameDisplay") && document.getElementById("successMessageContainer")) {
                        document.getElementById("successNameDisplay").innerText = namaPemesan;
                        document.getElementById("successMessageContainer").style.display = "block";
                        
                        // Scroll otomatis ke kotak sukses
                        window.scrollTo({ top: document.getElementById("successMessageContainer").offsetTop - 80, behavior: 'smooth' });
                    }
                })
                .catch(error => {
                    alert("Terjadi kesalahan jaringan! Pastikan internet lancar.");
                    submitBtn.innerHTML = originalBtnText; 
                    submitBtn.disabled = false;
                });
            };

            reader.readAsDataURL(fileInput.files[0]);
        });
    }
    
    updateSummaryUI();
});

// --- FUNGSI KLIK KARTU (REGULER) ---
function toggleMember(memberId) {
    const card = document.getElementById(`card-${memberId}`);
    if (!cart[memberId]) {
        cart[memberId] = 1;
        card.classList.add("selected");
        document.getElementById(`qty-${memberId}`).innerText = 1;
    } else {
        delete cart[memberId];
        card.classList.remove("selected");
    }
    updateSummaryUI();
}

// --- FUNGSI PLUS MINUS KARTU FOTO (REGULER) ---
function updateQty(memberId, delta, event) {
    event.stopPropagation(); 
    if (cart[memberId]) {
        cart[memberId] += delta;
        if (cart[memberId] <= 0) {
            delete cart[memberId];
            document.getElementById(`card-${memberId}`).classList.remove("selected");
        } else {
            document.getElementById(`qty-${memberId}`).innerText = cart[memberId];
        }
        updateSummaryUI();
    }
}

// --- FUNGSI PLUS MINUS JUMLAH GROUP CHEKI ---
function updateGroupQty(delta) {
    groupQty += delta;
    if (groupQty < 1) groupQty = 1; // Minimal pesan 1
    const qtyDisplay = document.getElementById("groupQtyDisplay");
    if(qtyDisplay) qtyDisplay.innerText = groupQty;
    
    updateSummaryUI();
}

// --- FUNGSI UPDATE NOTA (SUMMARY) ---
function updateSummaryUI() {
    const listContainer = document.getElementById("orderItemsList");
    const totalDisplay = document.getElementById("totalPrice");
    const tipeElement = document.getElementById("tipeCheki");
    const tipe = tipeElement ? tipeElement.value : "";
    
    let totalPrice = 0;
    if(!listContainer || !totalDisplay) return;

    listContainer.innerHTML = ""; 

    if (!tipe) {
        listContainer.innerHTML = '<p class="empty-cart-msg">Silakan pilih Tipe Cheki terlebih dahulu.</p>';
        totalDisplay.innerText = "Rp 0";
        return;
    }

    if (tipe === "Reguler") {
        if (Object.keys(cart).length === 0) {
            listContainer.innerHTML = '<p class="empty-cart-msg">Belum ada foto member yang dipilih.</p>';
            totalDisplay.innerText = "Rp 0";
            return;
        }

        for (const [id, qty] of Object.entries(cart)) {
            const member = chekiMembers.find(m => m.id === id);
            const subtotal = qty * 25000;
            totalPrice += subtotal;

            listContainer.innerHTML += `
                <div class="order-item-row">
                    <span>${member.name} (x${qty})</span>
                    <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
                </div>
            `;
        }
    } 
    else if (tipe === "Group") {
        const subtotal = groupQty * 35000;
        totalPrice = subtotal;
        
        listContainer.innerHTML = `
            <div class="order-item-row">
                <span>Cheki Group (x${groupQty})</span>
                <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
            </div>
        `;
    }

    totalDisplay.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
}
