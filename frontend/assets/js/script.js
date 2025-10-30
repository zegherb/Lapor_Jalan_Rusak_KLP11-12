 // === Filter Tabs & Statistik (history.html) ===
const tabs  = document.querySelectorAll('#filterTabs .nav-link');
const items = document.querySelectorAll('.ljr-report-item');

// helper aman untuk set teks (tidak error kalau elemen tidak ada)
const setText = (id, val) => {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
};

tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = (btn.dataset.filter || 'all').toLowerCase();

    items.forEach(card => {
      const status = (card.dataset.status || '').toLowerCase();
      if (filter === 'all' || filter === status) {
        card.classList.remove('d-none');
      } else {
        card.classList.add('d-none');
      }
    });

    // (opsional) kalau kamu ingin statistik mengikuti FILTER,
    // panggil refreshStats(true) di sini.
    // Default-nya statistik menampilkan total SEMUA laporan.
    // refreshStats(true);
  });
});

function refreshStats(useVisible = false) {
  // sumber data: semua item, atau hanya yang terlihat (jika useVisible = true)
  const source = useVisible
    ? [...items].filter(i => !i.classList.contains('d-none'))
    : [...items];

  const total        = source.length;
  const menunggu     = source.filter(i => (i.dataset.status || '').toLowerCase() === 'menunggu').length;
  const diverifikasi = source.filter(i => (i.dataset.status || '').toLowerCase() === 'diverifikasi').length;
  const proses       = source.filter(i => (i.dataset.status || '').toLowerCase() === 'proses').length;
  const selesai      = source.filter(i => (i.dataset.status || '').toLowerCase() === 'selesai').length;
  const ditolak      = source.filter(i => (i.dataset.status || '').toLowerCase() === 'ditolak').length;

  setText('stat-total', total);
  setText('stat-menunggu', menunggu);
  setText('stat-diverifikasi', diverifikasi); // tambahkan kartu ini di HTML kalau mau tampil
  setText('stat-proses', proses);
  setText('stat-selesai', selesai);
  setText('stat-ditolak', ditolak);           // tambahkan kartu ini di HTML kalau mau tampil
}

// panggil awal (statistik untuk SEMUA item)
refreshStats();


//  const form = document.getElementById('verify_email');
//     const popup = document.getElementById('popup');

//     form.addEventListener('submit', function(event){
//         event.preventDefault();
//         popup.classList.remove('d-none');

//         setTimeout(() => {
//         popup.classList.add('d-none');
//     },  3000);
//     });


// history
// === LJR Detail Modal Binder ===
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".ljr-report-item");
  const detailButtons = document.querySelectorAll(".ljr-btn-detail");

  // Modal elements
  const mdTitle = document.getElementById("md-title");
  const mdImage = document.getElementById("md-image");
  const mdStatus = document.getElementById("md-status");
  const mdSeverity = document.getElementById("md-severity");
  const mdCoords = document.getElementById("md-coords");
  const mdMap = document.getElementById("md-map");
  const mdMeta = document.getElementById("md-meta");
  const mdNotes = document.getElementById("md-notes");
  const modalEl = document.getElementById("ljrDetailModal");
  const bsModal = new bootstrap.Modal(modalEl);

  // helper: reset & apply badge class
  function setStatusBadge(el, status) {
    el.className = "badge rounded-pill"; // reset
    const map = {
      menunggu: "ljr-badge-menunggu",
      proses: "ljr-badge-proses",
      selesai: "ljr-badge-selesai",
      ditolak: "ljr-badge-ditolak", // pakai kelasmu jika ada di CSS
    };
    const k = String(status || "").toLowerCase();
    if (map[k]) el.classList.add(map[k]);
    else el.classList.add("text-bg-secondary");
    el.textContent = (status || "Status").replace(/\b\w/g, s => s.toUpperCase());
  }

  function setSeverityBadge(el, sevText, sevClass) {
    el.className = "badge"; // reset
    // Jaga agar warna mengikuti kelas severity milikmu (high/mid/low)
    if (sevClass?.contains("ljr-sev-high")) el.classList.add("ljr-sev-high");
    else if (sevClass?.contains("ljr-sev-mid")) el.classList.add("ljr-sev-mid");
    else if (sevClass?.contains("ljr-sev-low")) el.classList.add("ljr-sev-low");
    else el.classList.add("text-bg-secondary");
    el.textContent = sevText || "Severity";
  }

  // ambil lokasi & tanggal dari baris meta kecil di kartu
  function extractMeta(container) {
    const spans = container.querySelectorAll("span");
    let lokasi = "", tanggal = "";
    spans.forEach(sp => {
      const t = sp.textContent.trim();
      if (t.includes("Kota") || t.includes("Kab.") || t.includes("Kendari")) lokasi = t.replace(/^\s*📍?/, "");
      if (/\d{1,2}\s\w+\s\d{4}/.test(t) || t.match(/\d{2}\s\w+\s\d{4}/)) tanggal = t;
    });
    return { lokasi, tanggal };
  }

  detailButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // card terdekat
      const card = btn.closest(".ljr-report-item");
      if (!card) return;

      // judul
      const title = card.querySelector(".card-title")?.textContent?.trim() || "Detail Laporan";
      mdTitle.textContent = title;

      // foto
      const img = card.querySelector("img");
      if (img) {
        mdImage.src = img.getAttribute("src");
        mdImage.alt = img.getAttribute("alt") || "Foto laporan";
      }

      // status (ambil dari data-status)
      const status = card.getAttribute("data-status") || "menunggu";
      setStatusBadge(mdStatus, status);

      // severity (ambil dari badge di gambar)
      const sevEl = card.querySelector(".ljr-severity-badge");
      const sevText = sevEl?.textContent?.trim();
      setSeverityBadge(mdSeverity, sevText, sevEl?.classList);

      // koordinat + link maps
      const lat = card.getAttribute("data-lat");
      const lng = card.getAttribute("data-lng");
      const hasCoords = lat && lng;
      mdCoords.textContent = hasCoords ? `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}` : "-";
      mdMap.href = hasCoords ? `https://www.google.com/maps?q=${lat},${lng}` : "javascript:void(0)";
      mdMap.classList.toggle("disabled", !hasCoords);

      // meta: lokasi & tanggal
      const metaRow = card.querySelector(".text-secondary.small");
      const { lokasi, tanggal } = metaRow ? extractMeta(metaRow) : { lokasi: "", tanggal: "" };
      mdMeta.innerHTML = `
        <i class="bi bi-geo-alt"></i> <span>${lokasi || "-"}</span>
        &nbsp;&nbsp;•&nbsp;&nbsp;
        <i class="bi bi-calendar-event"></i> <span>${tanggal || "-"}</span>
      `;

      // catatan (deskripsi paragraf)
      const notes = card.querySelector(".card-text")?.textContent?.trim() || "-";
      mdNotes.textContent = notes;

      // tampilkan modal
      bsModal.show();
    });
  });

  // ====== (opsional) Filter Tabs & Statistik ======
  // Biarkan apa adanya jika kamu sudah punya script lainnya.
  // Di sini hanya contoh ringan untuk memastikan konsistensi.
  (function attachFilters() {
    const tabs = document.querySelectorAll("#filterTabs .nav-link");
    if (!tabs.length) return;
    tabs.forEach(btn => {
      btn.addEventListener("click", () => {
        tabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter?.toLowerCase() || "all";
        document.querySelectorAll(".ljr-report-item").forEach(card => {
          const st = (card.getAttribute("data-status") || "").toLowerCase();
          card.classList.toggle("d-none", !(filter === "all" || filter === st));
        });
      });
    });
  })();
});


