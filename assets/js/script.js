 const tabs = document.querySelectorAll('#filterTabs .nav-link');
    const items = document.querySelectorAll('.ljr-report-item');

    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        items.forEach(card => {
          const status = card.getAttribute('data-status'); 
          if (filter === 'all' || filter === status) {
            card.classList.remove('d-none');
          } else {
            card.classList.add('d-none');
          }
        });
      });
    });

    function refreshStats() {
      const total = items.length;
      const menunggu = [...items].filter(i => i.dataset.status === 'menunggu').length;
      const proses = [...items].filter(i => i.dataset.status === 'proses').length;
      const selesai = [...items].filter(i => i.dataset.status === 'selesai').length;
      document.getElementById('stat-total').textContent = total;
      document.getElementById('stat-menunggu').textContent = menunggu;
      document.getElementById('stat-proses').textContent = proses;
      document.getElementById('stat-selesai').textContent = selesai;
    }
    refreshStats();