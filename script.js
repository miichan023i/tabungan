// Menyimpan data utama
let state = {
  target: 1000000,
  balance: 0,
  transactions: []
};

// Fungsi format Rupiah
const formatIDR = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
};

// Fungsi update layar utama
function updateUI() {
  document.getElementById('balance-display').innerText = formatIDR(state.balance);
  document.getElementById('target-display').innerText = 'Target: ' + formatIDR(state.target);

  const progressPercentage = state.target > 0 ? Math.min((state.balance / state.target) * 100, 100) : 0;
  document.getElementById('progress-bar').style.width = progressPercentage + '%';
  document.getElementById('progress-text').innerText = progressPercentage.toFixed(1) + '%';

  const historyContainer = document.getElementById('history-container');
  
  if (state.transactions.length === 0) {
    historyContainer.innerHTML = `
      <div class="text-center py-8 text-slate-400 text-sm">
        <p>Belum ada catatan nih.</p>
        <p>Ayo mulai nabung bareng Miko!</p>
      </div>
    `;
  } else {
    historyContainer.innerHTML = state.transactions.map(t => `
      <div class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-pink-50 transition group mb-3">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-full ${t.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}">
            <i data-lucide="${t.type === 'in' ? 'plus' : 'minus'}" class="w-4 h-4"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-slate-800">${t.note}</p>
            <p class="text-xs text-slate-400">${t.date}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-bold text-sm ${t.type === 'in' ? 'text-green-600' : 'text-rose-600'}">
            ${t.type === 'in' ? '+' : '-'}${formatIDR(t.amount)}
          </span>
          <button onclick="deleteTransaction('${t.id}')" class="text-slate-300 hover:text-rose-500 transition opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Render ulang icon Lucide setiap update
  lucide.createIcons();
}

// Fungsi Tambah/Ambil Uang
function addTransaction(type) {
  const amountInput = document.getElementById('input-amount');
  const noteInput = document.getElementById('input-note');
  const amount = Number(amountInput.value);

  if (!amount || isNaN(amount) || amount <= 0) return;

  const newTx = {
    id: Date.now().toString(),
    type: type,
    amount: amount,
    note: noteInput.value || (type === 'in' ? 'Nabung' : 'Pengeluaran'),
    date: new Date().toLocaleString('id-ID')
  };

  state.transactions.unshift(newTx);
  
  if (type === 'in') {
    state.balance += amount;
  } else {
    state.balance -= amount;
  }

  amountInput.value = '';
  noteInput.value = '';
  
  updateUI();
}

// Fungsi Hapus Transaksi
function deleteTransaction(id) {
  const index = state.transactions.findIndex(t => t.id === id);
  if (index > -1) {
    const tx = state.transactions[index];
    if (tx.type === 'in') {
      state.balance -= tx.amount;
    } else {
      state.balance += tx.amount;
    }
    state.transactions.splice(index, 1);
    updateUI();
  }
}

// Fungsi Menampilkan/Menyembunyikan edit target
function toggleTargetEdit() {
  const viewMode = document.getElementById('target-view');
  const editMode = document.getElementById('target-edit');
  const input = document.getElementById('input-target');

  if (editMode.classList.contains('hidden')) {
    editMode.classList.remove('hidden');
    viewMode.classList.add('hidden');
    input.value = state.target;
  } else {
    editMode.classList.add('hidden');
    viewMode.classList.remove('hidden');
  }
}

// Fungsi Simpan Target Baru
function saveTarget(e) {
  e.preventDefault();
  const newTarget = Number(document.getElementById('input-target').value);
  if (newTarget > 0) {
    state.target = newTarget;
    toggleTargetEdit();
    updateUI();
  }
}

// Jalankan updateUI saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
});
