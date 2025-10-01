(function(){
  const path = location.pathname.split('/').pop();
  document.querySelectorAll('.navbar .nav-link').forEach(a=>{
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (href.startsWith('#') && href===location.hash)) a.classList.add('active');
  });
})();

function initMap(){
  const mapEl = document.getElementById('map');
  const latInput = document.getElementById('latitude');
  const lngInput = document.getElementById('longitude');
  if (!mapEl) return;
  const initPos = { lat: -6.200000, lng: 106.816666 }; // Jakarta
  const map = new google.maps.Map(mapEl, { zoom: 12, center: initPos });
  const marker = new google.maps.Marker({ position: initPos, map, draggable: true });

  function setInputs(pos){ if(latInput) latInput.value = pos.lat.toFixed(6); if(lngInput) lngInput.value = pos.lng.toFixed(6); }
  setInputs(initPos);

  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition((pos)=>{
      const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      map.setCenter(p); marker.setPosition(p); setInputs(p);
    });
  }
  map.addListener('click', (e)=>{ marker.setPosition(e.latLng); setInputs({lat:e.latLng.lat(), lng:e.latLng.lng()}); });
  marker.addListener('dragend', ()=>{ const p = marker.getPosition(); setInputs({lat:p.lat(), lng:p.lng()}); });
}
