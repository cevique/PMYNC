import membersData from './data/members.json' with { type: "json" };

const itemsPerPage = 3;
let currentPage = 1;
let currentType = 'Leadership';
let currentFilters = {
  search: '',
  region: '',
  sector: '',
  year: ''
};

// DOM Elements
const searchInput = document.getElementById('memberSearch');
const regionFilter = document.getElementById('regionFilter');
const sectorFilter = document.getElementById('sectorFilter');
const yearFilter = document.getElementById('yearFilter');
const typeButtons = document.querySelectorAll('.memberType');
const membersGrid = document.getElementById('membersGrid');
const showingCount = document.getElementById('showingCount');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// Initialize
function init() {
  setupEventListeners();
  render();
}

function setupEventListeners() {
  searchInput.addEventListener('input', (e) => {
    currentFilters.search = e.target.value.toLowerCase();
    resetPagination();
    render();
  });

  regionFilter.addEventListener('change', (e) => {
    currentFilters.region = e.target.value;
    resetPagination();
    render();
  });

  sectorFilter.addEventListener('change', (e) => {
    currentFilters.sector = e.target.value;
    resetPagination();
    render();
  });

  yearFilter.addEventListener('change', (e) => {
    currentFilters.year = e.target.value;
    resetPagination();
    render();
  });

  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update type
      currentType = btn.dataset.type;
      resetPagination();
      render();
    });
  });

  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    render(true);
  });
}

function resetPagination() {
  currentPage = 1;
  membersGrid.innerHTML = ''; // Clear grid on filter change
}

function getFilteredMembers() {
  return membersData.filter(member => {
    // Filter by Type
    if (member.type !== currentType) return false;

    // Filter by Search (Name or City)
    if (currentFilters.search) {
      const searchLower = currentFilters.search;
      const nameMatch = member.name.toLowerCase().includes(searchLower);
      const cityMatch = member.city.toLowerCase().includes(searchLower);
      if (!nameMatch && !cityMatch) return false;
    }

    // Filter by Region
    if (currentFilters.region && member.province !== currentFilters.region) return false;

    // Filter by Sector
    if (currentFilters.sector && member.sector !== currentFilters.sector) return false;

    // Filter by Year
    if (currentFilters.year && member.year !== currentFilters.year) return false;

    return true;
  });
}

function render(append = false) {
  const filtered = getFilteredMembers();
  const total = filtered.length;
  
  // Calculate slice
  const start = 0;
  const end = currentPage * itemsPerPage;
  const toShow = filtered.slice(start, end);
  
  // Update Count
  showingCount.textContent = `Showing ${Math.min(end, total)} out of ${total} members`;

  // Render Cards
  if (!append) membersGrid.innerHTML = '';
  
  // If appending, we only want to render the NEW items
  // But simpler logic for now: if append is true, we re-render everything up to current page * limit?
  // Or better: just render the slice. 
  // Actually, if I clear innerHTML on reset, I can just render `toShow`. 
  // But if I click "Load More", I want to append. 
  // Let's just re-render all visible for simplicity or optimize.
  // Optimization: Only render the new page slice if appending.
  
  let itemsToRender = toShow;
  if (append) {
    const prevEnd = (currentPage - 1) * itemsPerPage;
    itemsToRender = filtered.slice(prevEnd, end);
  }

  itemsToRender.forEach(member => {
    const card = createMemberCard(member);
    membersGrid.appendChild(card);
  });

  // Handle Load More Button
  if (end >= total) {
    loadMoreBtn.classList.add('hidden');
  } else {
    loadMoreBtn.classList.remove('hidden');
  }
}

function createMemberCard(member) {
  const card = document.createElement('div');
  card.className = 'member-card';
  
  card.innerHTML = `
    <div class="card-image">
      <img src="${member.image}" alt="${member.name}" onerror="this.src='./src/assets/default-avatar.png'">
    </div>
    <div class="card-content">
      <h3>${member.name}</h3>
      <p class="location">${member.city}, ${member.province}</p>
      
      <div class="detail-section">
        <h4>Designation</h4>
        <p class="designationpara">${member.designation}</p>
      </div>
      
      <div class="detail-section">
        <h4>Sector</h4>
        <p class="sectorpara">${member.sector}</p>
      </div>
      
      <div class="card-footer">
        <div class="line"></div>
      </div>
    </div>
  `;
  
  return card;
}

// Run
init();
