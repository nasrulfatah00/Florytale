/* =========================================
   1. DATABASE MEMBER & MODAL LOGIC (GLOBAL)
   ========================================= */

// Variabel untuk melacak status Slider (Fitur Baru)
let currentMemberId = null; 
let currentImgIndex = 0;    

// Data Lengkap Member 
const membersData = {
    devi: {
        name: "Devi",
        flower: "Purple Aster",
        color: "#9b59b6", 
        img: "img/devi.jpg", 
        // UBAH DISINI: Tambahkan koma untuk foto kedua, cth: ["img/DeviX.jpg", "img/Devi_Pose2.jpg"]
        imgPop: ["img/devix.jpg", "img/deviy.jpg", "img/deviz.jpg"], 
        bio: "layaknya bunga aster, aku akan menjadi bintang yang penuh pesona dan kelembutan.",
        birthday: "19 September",
        zodiac: "Virgo",
        like: "Read Manhwa & Watch any exciting series",
        status: "Active", 
        instagram: "https://www.instagram.com/devoxo__",
        twitter: "https://x.com/devoxo_",
        tiktok: "https://www.tiktok.com/@devoxo_"
    },
    risma: {
        name: "Risma",
        flower: "Yellow Edelweis",
        color: "#f1c40f",
        img: "img/risma.jpg",
        imgPop: ["img/rismax.jpg", "img/rismay.jpg", "img/rismaz.jpg"], // Tambah foto lain di dalam kurung siku ini
        bio: "seperti bunga edelweis,biarkan diriku menjadi sumber kebahagiaan abadi untukmu,hai hai aku rismaa.",
        birthday: "13 July",
        zodiac: "Cancer",
        like: "listening lany, medieval theme dan cat",
        status: "Active",
        instagram: "https://www.instagram.com/1dlerismaaa",
        twitter: "#",
        tiktok: "https://www.tiktok.com/@1dlerismaaa"
    },
    tiara: {
        name: "Tiara",
        flower: "Orange Peony",
        color: "#e67e22",
        img: "img/tiara.jpg",
        imgPop: ["img/tiarax.jpg", "img/tiaray.jpg", "img/tiaraz.jpg"],
        bio: "bagaikan peony yang mekar dan penuh pesona, aku datang membawa cerita dan cinta halo semua aku tiara.",
        birthday: "18 November",
        zodiac: "Scorpio",
        like: "Attack on Titan, Listening Jazz & Sleepaholic",
        status: "Active",
        instagram: "https://www.instagram.com/raawzzn",
        twitter: "#",
        tiktok: "https://www.tiktok.com/@pjsworld.com"
    },
    ziella: {
        name: "Ziella",
        flower: "Green Rose",
        color: "#27ae60",
        img: "img/ziella.jpg",
        imgPop: ["img/ziellax.jpg", "img/ziellay.jpg", "img/ziellaz.jpg"],
        bio: "bagaikan bunga mawar hijau yang akan selalu menjadi sudut pandang matamu ke arahku, halow semuanya aku zielaa.",
        birthday: "28 March",
        zodiac: "Aries",
        like: "all about make up and yap about anything",
        status: "Active",
        instagram: "https://www.instagram.com/0nle.vnpaziell",
        twitter: "#",
        tiktok: "https://www.tiktok.com/@0nle.vnpa"
    },
    caca: {
        name: "Caca",
        flower: "Blue Iris",
        color: "#2980b9",
        img: "img/caca.jpg",
        imgPop: ["img/cacax.jpg", "img/cacay.jpg", "img/cacaz.jpg"],
        bio: "seperti birunya bunga iris yang mekar membawa harapan, aku akan membawa mu merasakan kehangatan cahayaku.",
        birthday: "18 Desember",
        zodiac: "Sagitarius",
        like: "Watching C-Drama & Anything about Kpop",
        status: "Active",
        instagram: "https://www.instagram.com/matchacaaaaaaaaa",
        twitter: "#",
        tiktok: "https://www.tiktok.com/@matchacaaaaaaaaaa"
    },
    diva: {
        name: "Diva",
        flower: "Red Camellia",
        color: "#df1a04",
        img: "img/diva.jpg",
        imgPop: ["img/divax.jpg", "img/divay.jpg", "img/divaz.jpg"],
        bio: "Seperti Kamelia yang tetap mekar di musim dingin, aku akan selalu menghangatkan hati kamu kapan pun dan dimanapun",
        birthday: "1 January",
        zodiac: "Capricorn",
        like: "Gaming & Cat",
        status: "Active",
        instagram: "https://www.instagram.com/lullabyyy_96",
        twitter: "#",
        tiktok: "#"
    },
    cassie: {
        name: "Cassie",
        flower: "White Lily",
        color: "#b6b6b6",
        img: "img/cassie.jpg",
        imgPop: ["img/cassiex.jpg", "img/cassiey.jpg", "img/cassiez.jpg"],
        bio: "bagaikan bunga lily yang indah dan menenangkan aku ingin membuat kalian semua tersenyum dan bahagia",
        birthday: "29 November",
        zodiac: "Sagitarius",
        like: "Gaming & Watching streamer gaming",
        status: "Hiatus",
        instagram: "https://www.instagram.com/cassiesthr",
        twitter: "#",
        tiktok: "https://www.tiktok.com/@cassiesthr"
    }
};

// --- FUNGSI BUKA MODAL ---
function openMember(memberId) {
    const data = membersData[memberId];
    const modal = document.getElementById('memberModal');

    if (data && modal) {
        // Reset state slider
        currentMemberId = memberId;
        currentImgIndex = 0; 

        // 1. Setup Gambar & Tombol Slider
        const imgEl = document.getElementById('modalImg');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        // Pastikan format gambar adalah Array agar slider bekerja
        let images = Array.isArray(data.imgPop) ? data.imgPop : [data.imgPop];
        
        // Tampilkan foto pertama
        imgEl.src = images[0];

        // Sembunyikan tombol panah jika fotonya cuma 1
        if (images.length > 1) {
            if(prevBtn) prevBtn.classList.remove('hide-btn');
            if(nextBtn) nextBtn.classList.remove('hide-btn');
        } else {
            if(prevBtn) prevBtn.classList.add('hide-btn');
            if(nextBtn) nextBtn.classList.add('hide-btn');
        }
        
        // 2. Isi Teks Utama
        document.getElementById('modalName').innerText = data.name;
        
        const flowerEl = document.getElementById('modalFlower');
        flowerEl.innerText = data.flower;
        flowerEl.style.color = data.color; 
        
        document.getElementById('modalBio').innerText = data.bio;

        // 3. Isi Stats (Birthday, Zodiac, Like, Status)
        document.getElementById('modalBirthday').innerText = data.birthday;
        document.getElementById('modalZodiac').innerText = data.zodiac;
        document.getElementById('modalLike').innerText = data.like;
        
        // Logic Status
        const statusEl = document.getElementById('modalStatus');
        statusEl.innerText = data.status;
        
        if(data.status === 'Hiatus') {
            statusEl.style.color = 'red';
        } else {
            statusEl.style.color = '#333';
        }

        // 4. Reset & Isi Sosmed (Clickable)
        const socialContainer = document.getElementById('modalSocials');
        socialContainer.innerHTML = ''; 

        // Instagram
        if(data.instagram && data.instagram !== '#') {
            socialContainer.innerHTML += `
                <a href="${data.instagram}" target="_blank" title="Instagram">
                    <i class="fa-brands fa-instagram"></i>
                </a>`;
        }
        
        // Twitter / X
        if(data.twitter && data.twitter !== '#') {
            socialContainer.innerHTML += `
                <a href="${data.twitter}" target="_blank" title="Twitter / X">
                    <i class="fa-brands fa-x-twitter"></i>
                </a>`;
        }
        
        // TikTok
        if(data.tiktok && data.tiktok !== '#') {
            socialContainer.innerHTML += `
                <a href="${data.tiktok}" target="_blank" title="TikTok">
                    <i class="fa-brands fa-tiktok"></i>
                </a>`;
        }

        // Tampilkan Modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Matikan scroll background
    } else {
        console.error("Data member tidak ditemukan: " + memberId);
    }
}

// --- FUNGSI GANTI SLIDE (NEXT/PREV) ---
function changeSlide(direction) {
    if (!currentMemberId) return;

    const data = membersData[currentMemberId];
    // Pastikan images dalam bentuk array
    let images = Array.isArray(data.imgPop) ? data.imgPop : [data.imgPop];

    // Update Index
    currentImgIndex += direction;

    // Logic Loop (Kalau habis, balik ke awal/akhir)
    if (currentImgIndex >= images.length) {
        currentImgIndex = 0;
    } else if (currentImgIndex < 0) {
        currentImgIndex = images.length - 1;
    }

    // Ganti Source Gambar
    document.getElementById('modalImg').src = images[currentImgIndex];
}

// --- FUNGSI TUTUP MODAL ---
function closeModal() {
    const modal = document.getElementById('memberModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Hidupkan scroll lagi
    }
}

// Tutup Modal jika klik di area gelap (luar kartu)
window.onclick = function(event) {
    const modal = document.getElementById('memberModal');
    if (event.target == modal) {
        closeModal();
    }
}

/* =========================================
   2. DOM EVENTS (SCROLL & MENU)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- A. LOGIC SCROLL (Header Transparan ke Pink) ---
    const handleScroll = () => {
        if (window.scrollY > 10) {
            document.body.classList.add('window-scroll');
        } else {
            document.body.classList.remove('window-scroll');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Jalankan sekali di awal

    // --- B. LOGIC MENU (Hamburger & Full Screen) ---
    const menuTrigger = document.getElementById('menu-trigger');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuTrigger) {
        menuTrigger.addEventListener('click', () => {
            document.body.classList.toggle('drawer-visible');
        });
    }

    // Tutup menu otomatis saat link diklik
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('drawer-visible');
        });
    });
});