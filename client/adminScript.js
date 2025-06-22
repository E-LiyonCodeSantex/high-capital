// This script handles the navigation menu in the admin panel
// It adds an 'active' class to the clicked menu item and removes it from others
document.addEventListener("DOMContentLoaded", function () {
  const listItems = document.querySelectorAll('nav ul li');

  listItems.forEach((item) => {
    item.addEventListener('click', () => {
      // Remove the 'active' class from all list items
      listItems.forEach((li) => li.classList.remove('active'));
      // Add the 'active' class to the clicked item
      item.classList.add('active');
    });
  });
});

// This script handles the display of the navigation bar on mobile devices
document.addEventListener("DOMContentLoaded", function () {
  const menuBar = document.querySelector(".menu-bar"); // Select menu bar icon
  const closeNav = document.querySelector(".close-nav"); // Select close nav icon
  const sideNav = document.querySelector(".side-nav"); // Select navigation bar

  // Show navigation when menu bar is clicked
  menuBar.addEventListener("click", function () {
    sideNav.classList.add("side-bar-active"); // Add active class to show nav
    menuBar.style.display = "none"; // Hide menu bar icon
    console.log("Navigation menu opened");
  });

  // Hide navigation when close nav icon is clicked
  closeNav.addEventListener("click", function () {
    sideNav.classList.remove("side-bar-active"); // Remove active class to hide nav
    menuBar.style.display = "block"; // Hide menu bar icon
    console.log("Navigation menu closed");
  });

  // Hide navigation when clicking outside
  document.addEventListener("click", function (event) {
    if (!sideNav.contains(event.target) && !menuBar.contains(event.target)) {
      sideNav.classList.remove("side-bar-active"); // Ensure nav closes if clicked outside
      menuBar.style.display = "block"; // Show menu bar icon again
    }
  });
});

//show and hide password function
document.addEventListener('DOMContentLoaded', function () {
  const togglePasswordIcons = document.querySelectorAll('.toggle-password'); // Select all toggle icons

  togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', function () {
      // Find the associated input field (previous sibling)
      const passwordInput = this.previousElementSibling;

      // Toggle the type attribute between 'password' and 'text'
      const currentType = passwordInput.getAttribute('type');
      if (currentType === 'password') {
        passwordInput.setAttribute('type', 'text');
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash'); // Change icon to eye-slash
      } else {
        passwordInput.setAttribute('type', 'password');
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye'); // Change icon back to eye
      }
    });
  });
});

// This script handles the display of user details in the admin panel
// It shows a detailed card with user information when a user card is clicked
document.addEventListener("DOMContentLoaded", function () {
  const userCards = document.querySelectorAll('.users-card'); // Select all user cards
  const detailedCard = document.querySelector('.detailed-card'); // Select the detailed card container
  const detailedName = document.getElementById('user-name'); // Name field in the detailed card
  const detailedEmail = document.getElementById('user-email'); // Email field in the detailed card
  const detailedImg = document.getElementById('user-imgs'); // Image in the detailed card
  const detailedBitcoin = document.getElementById('user-bitcoin'); // Bitcoin wallet field
  const detailedUsdt = document.getElementById('user-usdt'); // USDT wallet field
  const detailedEthereum = document.getElementById('user-ethereum'); // Ethereum wallet field
  const detailedLastLogin = document.getElementById('user-last-login'); // Last login field
  const detailedIsActive = document.getElementById('user-is-active'); // Active status field

  // Add click event listeners to all user cards
  userCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const user = users[index]; // Get the user data from the users array

      // Populate the detailed card with user details
      detailedName.textContent = user.name || 'No name provided';
      detailedEmail.textContent = user.email || 'No email provided';
      detailedImg.src = user.profilePhoto || '/photos/default-user.jpg';
      detailedBitcoin.textContent = user.bitcoinWallet || 'No Bitcoin Wallet Provided';
      detailedUsdt.textContent = user.usdtWallet || 'No USDT Wallet Provided';
      detailedEthereum.textContent = user.ethereumWallet || 'No Ethereum Wallet Provided';
      detailedLastLogin.textContent = user.lastLogin
        ? new Date(user.lastLogin).toLocaleString()
        : 'No last login data available';

      // Show "Active" if lastActiveAt is within 5 minutes
      detailedIsActive.textContent =
        user.lastActiveAt && (new Date() - new Date(user.lastActiveAt) < 5 * 60 * 1000)
          ? 'Online'
          : 'Offline';

      document.getElementById('check-transactions-btn').dataset.userId = user._id;
      // Show the detailed card
      detailedCard.style.display = 'block';
    });
  });

  // Close the detailed card when the close button is clicked
  const closeButton = document.querySelector('.close-button');
  closeButton.addEventListener('click', () => {
    detailedCard.style.display = 'none';
  });

  const transactionsModal = document.getElementById('transactions-modal');
  const transactionsList = document.getElementById('transactions-list');
  const closeTransactions = document.getElementById('close-transactions');
  const checkTransactionsBtn = document.getElementById('check-transactions-btn');

  if (checkTransactionsBtn) {
    checkTransactionsBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const userId = this.dataset.userId;
      if (!userId) {
        transactionsList.innerHTML = '<p>No user selected.</p>';
        transactionsModal.style.display = 'block';
        return;
      }

      fetch(`/admin/user/${userId}/transactions`)
        .then(res => res.json())
        .then(data => {
          let depositsHtml = '';
          let withdrawalsHtml = '';


          // Build deposits HTML
          if (!data.deposits || data.deposits.length === 0) {
            depositsHtml = '<p>No deposits found.</p>';
          } else {
            depositsHtml = '<div class="user-deposit-card ul"> <div class="transaction-identifier"> <p > Deposit</p></div>';
            data.deposits.forEach(dep => {
              depositsHtml += `
        <ul>
          <li>
            <p>Transaction ID: <span class="green">${dep._id}</span></p>
            <p>Transaction Date: <span class="green">${dep.date}</span></p>
            <p>Transaction Type: <span class="green">${dep.coinType}</span></p>
            <p>Amount: <span class="green">${dep.amount}</span></p>
            <p>Status: <span class="orange-color">${dep.status}</span></p>
            <p>Transaction Receipt:
              <img src="${dep.transactionReceipt}" alt="Transaction Receipt" width="100px" height="100px"
                  class="green image" />
            </p>
          </li>
        </ul>`;
            });
            depositsHtml += '</div>';
          }

          // Build withdrawals HTML
          if (!data.withdrawals || data.withdrawals.length === 0) {
            withdrawalsHtml = '<p>No withdrawals found.</p>';
          } else {
            withdrawalsHtml = '<div class=" user-deposit-card ul"> <div class="transaction-identifier"> <p > Deposit</p></div>';
            identifier.textContent = 'Withdrawal';
            data.withdrawals.forEach(wd => {
              withdrawalsHtml += `
              <p>Withdrawal</p>
        <ul>
          <li>
            <p>Transaction ID: <span class="normal-size green">${wd._id}</span></p>
            <p>Transaction Date: <span class="normal-size green">${wd.date}</span></p>
            <p>Transaction Type: <span class="normal-size green">${wd.coinType}</span></p>
            <p>Amount: <span class="normal-size green">${wd.amount}</span></p>
            <p>Status:<span class="time-counter status">${wd.status}</span></p>
            <p>Transaction Receipt:
              <img src="${wd.transactionReceipt}" alt="Transaction Receipt" width="100px" height="100px"
                  class="green image" />
            </p>
          </li>
        </ul>`;
            });
            withdrawalsHtml += '</div>';
          }

          // Show deposits by default
          transactionsList.innerHTML = depositsHtml;
          transactionsModal.style.display = 'block';
          detailedCard.style.display = 'none';

          // Toggle between deposits and withdrawals
          document.getElementById('transaction-deposit').onclick = function () {
            transactionsList.innerHTML = depositsHtml;
          };
          document.getElementById('transaction-withdrawal').onclick = function () {
            transactionsList.innerHTML = withdrawalsHtml;
          };
        })
        .catch((error) => {
          transactionsList.innerHTML = '<p>Error loading transactions.</p>';
          console.error('Error fetching transactions:', error);
          transactionsModal.style.display = 'block';
        });
    });
  }

  if (closeTransactions) {
    closeTransactions.addEventListener('click', function () {
      transactionsModal.style.display = 'none';
      detailedCard.style.display = 'none';
    });
  }

  // --- Receipt Image Zoom Modal ---
  const receiptImg = document.querySelectorAll('.image');
  const zoomModal = document.getElementById('image-zoom-modal');
  const zoomedImage = document.getElementById('zoomed-image');
  const closeZoom = document.getElementById('close-zoom');
  if (receiptImg && zoomModal && zoomedImage && closeZoom) {
    receiptImg.forEach(img => {
      img.addEventListener('click', () => {
        console.log('Image clicked:', img.src);
        zoomedImage.src = img.src;
        zoomModal.style.display = 'flex';
      });
    });
    /*receiptImg.addEventListener('click', () => {
      zoomedImage.src = receiptImg.src;
      zoomModal.style.display = 'flex';
    });*/
    closeZoom.addEventListener('click', () => {
      zoomModal.style.display = 'none';
      zoomedImage.src = '';
    });
    zoomModal.addEventListener('click', (e) => {
      if (e.target === zoomModal) {
        zoomModal.style.display = 'none';
        zoomedImage.src = '';
      }
    });
  }
  // Event delegation for all .image clicks (works for dynamic images too)
  document.body.addEventListener('click', function (e) {
    if (e.target.classList.contains('image')) {
      const zoomModal = document.getElementById('image-zoom-modal');
      const zoomedImage = document.getElementById('zoomed-image');
      if (zoomModal && zoomedImage) {
        zoomedImage.src = e.target.src;
        zoomModal.style.display = 'flex';
      }
    }
  });
});

//function for Adding/Editing and deleting investment plans
// This function handles the addition, editing and deletion of investment plans
document.addEventListener('DOMContentLoaded', () => {
  const addPlanButton = document.querySelector('.add-plan');
  const editPlanButtons = document.querySelectorAll('.edit-plan');
  const modal = document.getElementById('plan-modal');
  const closeModalButton = document.querySelector('.close-modal');
  const planForm = document.getElementById('plan-form');
  const modalTitle = document.getElementById('modal-title');
  const planIdInput = document.getElementById('plan-id');

  // Open modal for adding a new plan
  addPlanButton.addEventListener('click', () => {
    modalTitle.textContent = 'Add New Plan';
    planForm.reset();
    planIdInput.value = ''; // Clear the hidden input for plan ID
    modal.classList.remove('hidden');
  });

  // Open modal for editing a plan
  editPlanButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const planId = button.getAttribute('data-id');
      modalTitle.textContent = 'Edit Plan';

      try {
        const response = await fetch(`/admin/investment-plans/${planId}`);
        const plan = await response.json();

        // Populate the form with the plan data
        planIdInput.value = plan._id;
        document.getElementById('plan-name').value = plan.name;
        document.getElementById('min-deposit').value = plan.minDeposit;
        document.getElementById('max-deposit').value = plan.maxDeposit;
        document.getElementById('daily-profit').value = plan.dailyProfit;
        document.getElementById('duration').value = plan.duration;
        document.getElementById('referral-bonus').value = plan.referralBonus;

        modal.classList.remove('hidden');
      } catch (error) {
        console.error('Error fetching plan data:', error);
      }
    });
  });

  // Close modal
  closeModalButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Handle form submission
  planForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(planForm);
    const planData = Object.fromEntries(formData.entries());
    const planId = planIdInput.value;

    try {
      const response = await fetch(planId ? `/admin/investment-plans/${planId}` : '/admin/investment-plans', {
        method: planId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData),
      });

      if (response.ok) {
        alert(planId ? 'Plan updated successfully!' : 'Plan created successfully!');
        location.reload(); // Refresh the page to show updated plans
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error submitting plan form:', error);
    }
  });

  //delete investment plan
  const deletePlanButtons = document.querySelectorAll('.delete-plan');
  deletePlanButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const planId = button.getAttribute('data-id');

      if (confirm('Are you sure you want to delete this plan?')) {
        try {
          const response = await fetch(`/admin/investment-plans/${planId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            alert('Plan deleted successfully!');
            location.reload(); // Refresh the page to show updated plans
          } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
          }
        } catch (error) {
          console.error('Error deleting plan:', error);
        }
      }
    });
  });

});

//function for creating, editing and deleting wallet adresses
// This function handles the addition, editing and deletion of wallet adresses
document.addEventListener('DOMContentLoaded', () => {
  const addWalletButton = document.querySelector('.wallet-adress');
  const editWalletButtons = document.querySelectorAll('.edit-wallet');
  const walletModal = document.getElementById('wallet-modal');
  /*const walletContainer = document.querySelector('.my-plan')*/
  const closeWalletModalButton = document.querySelector('.close-wallet-modal');
  const walletForm = document.getElementById('Wallet-form');
  const walletModalTitle = document.getElementById('wallet-modal-title');
  const WalletIdInput = document.getElementById('Wallet-id');

  // Open walletModal for adding a new wallet adress
  addWalletButton.addEventListener('click', () => {
    walletModalTitle.textContent = 'Add New Plan';
    walletForm.reset();
    WalletIdInput.value = ''; // Clear the hidden input for plan ID
    walletModal.classList.remove('hidden');
  });

  // Open walletModal for editing a wallet adress
  editWalletButtons.forEach(walletButton => {
    walletButton.addEventListener('click', async () => {
      const walletId = walletButton.getAttribute('data-id');
      walletModalTitle.textContent = 'Edit Wallet';

      try {
        const response = await fetch(`/admin/WalletManagement/${walletId}`);
        const wallet = await response.json();

        // Populate the form with the wallet adress data
        WalletIdInput.value = wallet._id;
        document.getElementById('wallet-name').value = wallet.name;
        document.getElementById('wallet-adress').value = wallet.adress;

        walletModal.classList.remove('hidden');
      } catch (error) {
        console.error('Error fetching Wallet adress:', error);
      }
    });
  });

  // Close walletModal
  closeWalletModalButton.addEventListener('click', () => {
    walletModal.classList.add('hidden');
  });

  // Handle form submission
  walletForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const walletFormData = new FormData(walletForm);
    const walletData = Object.fromEntries(walletFormData.entries());
    const walletId = WalletIdInput.value;

    try {
      const response = await fetch(walletId ? `/admin/WalletManagement/${walletId}` : '/admin/WalletManagement', {
        method: walletId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(walletData),
      });

      if (response.ok) {
        alert(walletId ? 'Wallet updated successfully!' : 'Wallet created successfully!');
        location.reload(); // Refresh the page to show updated plans
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error submitting plan form:', error);
    }
  });

  //delete wallet
  const deleteWalletButtons = document.querySelectorAll('.delete-wallet');
  deleteWalletButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const walletId = button.getAttribute('data-id');

      if (confirm('Are you sure you want to delete this wallet?')) {
        try {
          const response = await fetch(`/admin/WalletManagement/${walletId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            alert('Wallet deleted successfully!');
            location.reload(); // Refresh the page to show updated plans
          } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
          }
        } catch (error) {
          console.error('Error deleting wallet:', error);
        }
      }
    });
  });
});

//function for displaying the daily profit of the selected plan
document.addEventListener('DOMContentLoaded', function () {
  const planTypeSelect = document.getElementById('plan-type');
  const percentageEarningInput = document.getElementById('percentage-earning');

  // Parse the plans data passed from the server
  const plans = JSON.parse(document.getElementById('plans-data').textContent);

  planTypeSelect.addEventListener('change', function () {
    const selectedPlan = planTypeSelect.options[planTypeSelect.selectedIndex].text;

    const selectedPlanData = plans.find(plan => plan.name === selectedPlan);
    if (selectedPlanData) {
      percentageEarningInput.value = selectedPlanData.dailyProfit;
    } else {
      percentageEarningInput.value = '';
    }
  });
});

// This script handles the deposit management in the admin panel
// It includes functionalities for displaying deposit details, activating deposits, deleting deposits, and showing a zoomed image of the receipt and toggling unconfirmed deposits
document.addEventListener("DOMContentLoaded", function () {
  // --- State for timers ---
  const timers = {};
  let detailsBalanceTimer = null; // Only for details view

  // --- DOM Elements ---
  const depositCards = document.querySelectorAll('.deposit-card');
  const depositDetailsCard = document.querySelector('.deposit-details');
  const depositorName = document.getElementById('depositor-name');
  const depositorEmail = document.getElementById('depositor-email');
  const depositorImg = document.getElementById('depositor-img');
  const depositPlanName = document.getElementById('deposit-plan-name');
  const depositPlanCoin = document.getElementById('deposit-plan-coin');
  const depositPlanDailyProfit = document.getElementById('deposit-plan-daily-profit');
  const depositPlanAmount = document.getElementById('deposit-plan-amount');
  const depositPlanDuration = document.getElementById('deposit-plan-duration');
  const depositPlanDate = document.getElementById('deposit-plan-date');
  const depositPlanReferalBonus = document.getElementById('deposit-plan-referral-bonus');
  const depositReceipt = document.getElementById('deposit-receipt');
  const deleteDeposit = document.getElementById('delete-deposit');
  const closeDepositButton = document.getElementById('close-button');
  const detailStatus = document.getElementById('detail-status');

  // --- Helper: Update status and button everywhere ---
  function updateStatusEverywhere(depositId, status) {
    document.querySelectorAll(`.confirm-deposit[data-deposit-id="${depositId}"]`).forEach(btn => {
      detailStatus.classList.remove('status-confirmed', 'status-completed', 'status-unconfirmed');
      if (status === 'confirmed') {
        detailStatus.classList.add('status-confirmed');
        detailStatus.textContent = 'Confirmed';
        btn.innerHTML = 'Activated';
      } else if (status === 'completed') {
        detailStatus.classList.add('status-completed');
        detailStatus.textContent = 'Completed';
        btn.innerHTML = 'Completed';
      } else {
        detailStatus.classList.add('status-unconfirmed');
        detailStatus.textContent = 'unconfirmed';
        btn.innerHTML = 'Activate';
      }
      const card = btn.closest('.deposit-card, .deposit-details');
      if (card) {
        const statusElem = card.querySelector('.status');
        if (statusElem) statusElem.textContent = status;
      }
    });
  }

  // --- Helper: Card countdowns only ---
  function updateCountdownEverywhere(depositId, endDate) {
    document.querySelectorAll(`.deposit-card .duration-count-down[data-deposit-id="${depositId}"]`).forEach(counter => {
      function updateCardCountdown() {
        const now = new Date();
        const timeLeft = endDate - now;
        if (timeLeft <= 0) {
          counter.textContent = 'Expired';
          updateStatusEverywhere(depositId, 'completed');
          clearInterval(timers[depositId]);
          return;
        }
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        counter.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
      clearInterval(timers[depositId]);
      timers[depositId] = setInterval(updateCardCountdown, 1000);
      updateCardCountdown();
    });
  }

  // --- Details view countdown and balance ---
  function startDetailsCountdownAndBalance(deposit) {
    if (detailsBalanceTimer) clearInterval(detailsBalanceTimer);
    const detailsCountdown = document.querySelector('.deposit-details .duration-count-down');
    const totalBalanceElem = document.querySelector('.deposit-details #total-balance');
    if (!detailsCountdown || !totalBalanceElem) return;
    detailsCountdown.dataset.depositId = deposit._id;
    detailsCountdown.dataset.endDate = deposit.endDate;
    detailsCountdown.dataset.status = deposit.status;

    function update() {
      const now = new Date();
      const endDate = new Date(deposit.endDate);
      const timeLeft = endDate - now;
      if (timeLeft <= 0) {
        detailsCountdown.textContent = 'Expired';
        updateStatusEverywhere(deposit._id, 'completed');
        updateTotalBalance(deposit, endDate, true);
        clearInterval(detailsBalanceTimer);
        return;
      }
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      detailsCountdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      updateTotalBalance(deposit, endDate);
    }
    update();
    detailsBalanceTimer = setInterval(update, 1000);
  }

  // --- Update total balance in details view ---
  function updateTotalBalance(deposit, endDate, isFinal = false) {
    const totalBalanceElem = document.querySelector('.deposit-details #total-balance');
    if (!totalBalanceElem) return;
    const now = new Date();
    let elapsedMs = Math.min(now - new Date(deposit.date), endDate - new Date(deposit.date));
    if (elapsedMs < 0) elapsedMs = 0;
    const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const elapsedDays = elapsedHours / 24;
    const profit = deposit.amount * (Number(deposit.dailyProfit) / 100) * elapsedDays;
    const total = deposit.amount + profit;
    totalBalanceElem.textContent = `$${total.toFixed(2)}`;
    if (isFinal) {
      totalBalanceElem.textContent = `$${(deposit.amount + deposit.amount * (Number(deposit.dailyProfit) / 100) * deposit.duration).toFixed(2)}`;
    }
  }

  // --- On page load, resume countdowns and set correct button/status for cards only ---
  document.querySelectorAll('.deposit-card .duration-count-down').forEach(counter => {
    const depositId = counter.dataset.depositId;
    const endDateStr = counter.dataset.endDate;
    const status = counter.dataset.status;
    if (status === 'confirmed' && endDateStr) {
      const endDate = new Date(endDateStr);
      updateStatusEverywhere(depositId, 'confirmed');
      updateCountdownEverywhere(depositId, endDate);
    } else if (status === 'completed') {
      updateStatusEverywhere(depositId, 'completed');
      counter.textContent = 'Expired';
    } else {
      updateStatusEverywhere(depositId, status);
    }
  });

  // --- Deposit Card Click: Show Details ---
  depositCards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('confirm-deposit')) return;
      const deposit = deposits[index];
      depositorName.textContent = deposit.user.name;
      depositorEmail.textContent = deposit.user.email;
      depositorImg.src = deposit.user.profilePhoto;
      depositPlanName.textContent = deposit.name;
      depositPlanCoin.textContent = deposit.coinType;
      depositPlanDailyProfit.textContent = `${deposit.dailyProfit}%`;
      depositPlanAmount.textContent = `$${deposit.amount}`;
      depositPlanDuration.textContent = `${deposit.duration} days`;
      depositPlanReferalBonus.textContent = `${deposit.referralBonus}%`;
      depositPlanDate.textContent = new Date(deposit.date).toLocaleDateString();
      depositReceipt.src = deposit.transactionReceipt;
      document.querySelectorAll('.deposit-details .confirm-deposit').forEach(btn => {
        btn.dataset.depositId = deposit._id;
        detailStatus.classList.remove('status-confirmed', 'status-completed', 'status-unconfirmed');
        // Set correct icon/text for details view button
        if (deposit.status === 'confirmed') {
          detailStatus.classList.add('status-confirmed');
          detailStatus.textContent = 'Confirmed';
          btn.innerHTML = 'Activated';
        } else if (deposit.status === 'completed') {
          detailStatus.classList.add('status-completed');
          detailStatus.textContent = 'Completed';
          btn.innerHTML = 'Completed';
        } else {
          detailStatus.classList.add('status-unconfirmed');
          detailStatus.textContent = 'Unconfirmed';
          btn.innerHTML = 'Activate';
        }
      });
      if (deleteDeposit) deleteDeposit.dataset.depositId = deposit._id;

      // --- Start countdown and balance ONLY for details view ---
      if (deposit.status === 'confirmed' && deposit.endDate) {
        startDetailsCountdownAndBalance(deposit);
      } else if (deposit.status === 'completed') {
        updateTotalBalance(deposit, new Date(deposit.endDate), true);
        if (detailsBalanceTimer) clearInterval(detailsBalanceTimer);
        const detailsCountdown = document.querySelector('.deposit-details .duration-count-down');
        if (detailsCountdown) detailsCountdown.textContent = 'Expired';
      } else {
        if (detailsBalanceTimer) clearInterval(detailsBalanceTimer);
        const totalBalanceElem = document.querySelector('.deposit-details #total-balance');
        if (totalBalanceElem) totalBalanceElem.textContent = `$${deposit.amount.toFixed(2)}`;
        const detailsCountdown = document.querySelector('.deposit-details .duration-count-down');
        if (detailsCountdown) detailsCountdown.textContent = '';
      }
      depositDetailsCard.style.display = 'block';
    });
  });

  // --- Close Details Card ---
  if (closeDepositButton) {
    closeDepositButton.addEventListener('click', () => {
      depositDetailsCard.style.display = 'none';
      if (detailsBalanceTimer) clearInterval(detailsBalanceTimer);
    });
  }

  // --- Activate Logic (Event Delegation) ---
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.confirm-deposit');
    if (!btn) return;
    const depositId = btn.dataset.depositId;

    // Only activate if not already activated or completed
    if (btn.disabled || btn.innerHTML === 'Activated' || btn.innerHTML === 'Completed') return;

    fetch(`/admin/activateDeposit/${depositId}`, { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }
        // Update status everywhere to confirmed
        updateStatusEverywhere(depositId, 'confirmed');
        const endDate = new Date(data.endDate);

        // Change all relevant buttons to "Activated" and disable them
        document.querySelectorAll(`.confirm-deposit[data-deposit-id="${depositId}"]`).forEach(b => {
          b.innerHTML = 'Activated';
          b.disabled = true;
        });

        // Start countdown for all cards
        updateCountdownEverywhere(depositId, endDate);

        // If details view is open for this deposit, start its timer too
        const deposit = deposits.find(d => d._id === depositId);
        if (depositDetailsCard.style.display === 'block' && deposit && deposit._id === depositId) {
          startDetailsCountdownAndBalance(deposit);
        }
      })
      .catch(error => alert('Error activating deposit: ' + error));
  });

  // --- Delete Deposit ---
  if (deleteDeposit) {
    deleteDeposit.addEventListener('click', () => {
      const depositId = deleteDeposit.dataset.depositId;
      const depositCard = document.querySelector(`.deposit-card [data-deposit-id="${depositId}"]`)?.closest('.deposit-card');
      if (depositCard) depositCard.remove();
      fetch(`/admin/deleteDeposit/${depositId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error deleting deposit:', error));
      depositDetailsCard.style.display = 'none';
    });
  }

  // --- Receipt Image Zoom Modal ---
  const receiptImg = document.querySelectorAll('.image');
  const zoomModal = document.getElementById('image-zoom-modal');
  const zoomedImage = document.getElementById('zoomed-image');
  const closeZoom = document.getElementById('close-zoom');
  if (receiptImg && zoomModal && zoomedImage && closeZoom) {
    receiptImg.forEach(img => {
      img.addEventListener('click', () => {
        console.log('Image clicked:', img.src);
        zoomedImage.src = img.src;
        zoomModal.style.display = 'flex';
      });
    });
    /*receiptImg.addEventListener('click', () => {
      zoomedImage.src = receiptImg.src;
      zoomModal.style.display = 'flex';
    });*/
    closeZoom.addEventListener('click', () => {
      zoomModal.style.display = 'none';
      zoomedImage.src = '';
    });
    zoomModal.addEventListener('click', (e) => {
      if (e.target === zoomModal) {
        zoomModal.style.display = 'none';
        zoomedImage.src = '';
      }
    });
  }

  // --- Toggle Unconfirmed Deposits ---
  const toggleBtn = document.getElementById('toggle-unconfirmed');
  let showingUnconfirmed = false;
  const noUnconfirmedMsg = document.getElementById('no-unconfirmed-message');
  toggleBtn.addEventListener('click', function (e) {
    e.preventDefault();
    showingUnconfirmed = !showingUnconfirmed;

    if (showingUnconfirmed) {
      // Show only unconfirmed
      let found = false;
      depositCards.forEach(card => {
        if (card.dataset.status === 'pending' || card.dataset.status === 'unconfirmed') {
          card.style.display = '';
          found = true;
        } else {
          card.style.display = 'none';
        }
      });
      toggleBtn.textContent = 'Get all deposit';
      if (!found) {
        noUnconfirmedMsg.style.display = 'block';
      } else {
        noUnconfirmedMsg.style.display = 'none';
      }
    } else {
      // Show all
      depositCards.forEach(card => card.style.display = '');
      toggleBtn.textContent = 'Get all uncomfirmed deposit';
      noUnconfirmedMsg.style.display = 'none';
    }
  });

  // --- Enhance: Remove confirmed deposit from unconfirmed view immediately ---
  // This is already handled in the activate logic above, but we can add a check here too
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.confirm-deposit');
    if (!btn) return;
    const depositId = btn.dataset.depositId;

    // Only activate if not already activated or completed
    if (btn.disabled || btn.innerHTML === 'Activated' || btn.innerHTML === 'Completed') return;

    fetch(`/admin/activateDeposit/${depositId}`, { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }
        updateStatusEverywhere(depositId, 'confirmed');
        const endDate = new Date(data.endDate);

        document.querySelectorAll(`.confirm-deposit[data-deposit-id="${depositId}"]`).forEach(b => {
          b.innerHTML = 'Activated';
          b.disabled = true;
        });

        updateCountdownEverywhere(depositId, endDate);

        const deposit = deposits.find(d => d._id === depositId);
        if (depositDetailsCard.style.display === 'block' && deposit && deposit._id === depositId) {
          startDetailsCountdownAndBalance(deposit);
        }

        // --- If in unconfirmed view, hide this card immediately ---
        if (showingUnconfirmed) {
          document.querySelectorAll(`.deposit-card`).forEach(card => {
            if (card.querySelector(`.confirm-deposit[data-deposit-id="${depositId}"]`)) {
              card.style.display = 'none';
              // Optionally, update the card's data-status so it will show up when toggling back to all
              card.dataset.status = 'confirmed';
            }
          });
          // Check if there are any unconfirmed left
          let anyUnconfirmed = false;
          depositCards.forEach(card => {
            if (card.dataset.status === 'pending' || card.dataset.status === 'unconfirmed') {
              if (card.style.display !== 'none') anyUnconfirmed = true;
            }
          });
          if (!anyUnconfirmed) {
            noUnconfirmedMsg.style.display = 'block';
          }
        }
      })
      .catch(error => alert('Error activating deposit: ' + error));
  });

});

// This script handles the withdrawal management in the admin panel
// It includes functionalities for displaying withdrawal details, processing withdrawals, deleting withdrawals, and showing a zoomed image of the receipt
document.addEventListener("DOMContentLoaded", function () {

  let currentWithdrawalId = null;
  // --- DOM Elements ---
  const transactionsModal = document.querySelector('.deposit-withdrawal-container');
  const withdrawalCards = document.querySelectorAll('.withdrawal-card');
  const withdrawalDetailsCard = document.getElementById('withdrawal-details');
  const withdrawerName = document.getElementById('withdrawer-name');
  const withdrawerEmail = document.getElementById('withdrawer-email');
  const withdrawerImg = document.getElementById('withdrawer-img');
  const withdrawerAmount = document.getElementById('withdrawer-amount');
  const withdrawerMethod = document.getElementById('withdrawer-method');
  const withdrawerWalletBbank = document.getElementById('withdrawer-wallet-bank');
  const withdrawerAdressNumber = document.getElementById('withdrawer-adress-number');
  const withdrawerStatus = document.getElementById('withdrawer-status');
  const withdrawalRequestedAt = document.getElementById('withdrawal-requested-at');
  const closeWithdrawalButton = document.getElementById('close-button');
  const processWithdrawal = document.querySelectorAll('.process-withdrawal');
  const receiptInput = document.getElementById('withdrawer-receipt-upload');
  const confirmBtn = document.querySelector('.Submit-withdrawal');
  const withdrawalReceipt = document.getElementById('wihdrawal-receipt');
  const viewReceiptBtn = document.getElementById('view-receipt');
  const receiptMassage = document.querySelector('.receipt-massage');
  const withdrawalReceiptLable = document.getElementById('withdrawal-receipt-lable');

  // Listen for file input changes
  receiptInput.addEventListener('change', function () {
    if (this.files && this.files.length > 0 && currentWithdrawalId) {
      viewReceiptBtn.style.display = 'inline-block';
      document.querySelectorAll(`.confirm-withdrawal[data-withdrawal-id="${currentWithdrawalId}"]`).forEach(btn => {
        btn.style.display = 'block'; // Show confirm button if a file is selected
        btn.dataset.withdrawalId = currentWithdrawalId; // Ensure the button has the correct withdrawal ID
      });
    } else {
      viewReceiptBtn.style.display = 'none';
    }
  });

  const imageZoomingModal = document.getElementById('image-zooming');
  document.getElementById('view-receipt').addEventListener('click', function () {
    const file = receiptInput.files[0];
    const preview = document.getElementById('image-when-zoomed');
    if (!file) {
      preview.innerHTML = '<span style="color:#D32F2F;">No file selected.</span>';
      imageZoomingModal.style.display = 'flex';
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      if (file.type.startsWith('image/')) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Receipt Image" >`;
      } else if (file.type === 'application/pdf') {
        preview.innerHTML = `<embed src="${e.target.result}" type="application/pdf" />`;
      } else {
        preview.innerHTML = '<span>Unsupported file type.</span>';
      }
      imageZoomingModal.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('close-zoom').addEventListener('click', () => {
    imageZoomingModal.style.display = 'none';
  });
  document.getElementById('image-when-zoomed').addEventListener('click', (e) => {
    imageZoomingModal.style.display = 'none';
  });

  // --- Helper: Update status and button everywhere ---
  function updateStatusEverywhere(withdrawalId, status) {
    document.querySelectorAll(`.confirm-withdrawal[data-withdrawal-id="${withdrawalId}"]`).forEach(btn => {
      if (status === 'Successful') {
        btn.style.display = 'none';
      } else {
        btn.style.display = 'block';
      }
      const card = btn.closest('.withdrawal-card, .withdrawal-details');
      if (card) {
        const statusElem = card.querySelector('.withdrawer-status');
        if (statusElem) {
          statusElem.textContent = status;
          setStatusColor(statusElem, status);
        }
      }
    });
  }

  function setStatusColor(statusElem, status) {
    if (!statusElem) return;
    if (status === 'pending') {
      statusElem.style.color = '#D32F2F';
      statusElem.classList.remove('text-warning');
    } else {
      statusElem.style.color = ''; // Reset to default
      statusElem.classList.add('text-warning');
    }
  }

  // --- On page load, set correct button/status for cards only ---
  document.querySelectorAll('.withdrawal-card .withdrawer-status').forEach(card => {
    //console.log('Card data:', card.dataset);
    //console.log('Card dataset:', card.dataset.withdrawalId, card.dataset.status);
    const withdrawalId = card.dataset.withdrawalId;
    const status = card.dataset.status;
    if (status === 'Successful') {
      updateStatusEverywhere(withdrawalId, 'Successful');
    } else {
      updateStatusEverywhere(withdrawalId, status);
    }
  });

  const accountNameContainer = document.getElementById('acount-Name-container');
  const accountName = document.getElementById('account-Name');
  accountNameContainer.style.display = 'none'; // Hide account name by default
  // --- Withdrawal Card Click: Show Details ---
  withdrawalCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      //console.log('Withdrawal card clicked:', index);
      //if (e.target.classList.contains('process-withdrawal')) return;
      receiptInput.value = ''; // Reset the file input
      viewReceiptBtn.style.display = 'none'; // Hide view receipt button

      const withdrawal = withdrawals[index];
      currentWithdrawalId = withdrawal._id;
      withdrawerName.textContent = withdrawal.user.name;
      withdrawerEmail.textContent = withdrawal.user.email;
      withdrawerImg.src = withdrawal.user.profilePhoto;
      withdrawerMethod.textContent = withdrawal.method;
      if (withdrawal.method === 'bank') {
        withdrawerWalletBbank.textContent = withdrawal.bankName;
        withdrawerAdressNumber.textContent = withdrawal.acountNumber;
        accountNameContainer.style.display = 'flex'; // Show account name for bank method
        accountName.textContent = withdrawal.acountName;
      } else {
        withdrawerWalletBbank.textContent = withdrawal.walletName;
        withdrawerAdressNumber.textContent = withdrawal.walletAddress;
        accountNameContainer.style.display = 'none';
      }
      withdrawerStatus.textContent = withdrawal.status;
      withdrawerAmount.textContent = `$${withdrawal.amount}`;
      withdrawalRequestedAt.textContent = withdrawal.requestedAt;
      let receipt = withdrawal.wihdrawalReceipt;
      if (!receipt || receipt === 'undefined') {
        withdrawalReceiptLable.textContent = 'Upload Withdrawal Receipt here (PDF or Image):';
        receiptMassage.style.display = 'block';
        receiptMassage.textContent = 'No receipt uploaded';
        withdrawalReceipt.style.display = 'none';
      } else {
        withdrawalReceiptLable.textContent = 'Change Withdrawal Receipt here (PDF or Image):';
        receiptMassage.style.display = 'none';
        withdrawalReceipt.style.display = 'block';
        withdrawalReceipt.src = withdrawal.wihdrawalReceipt;
      }
      document.querySelectorAll('.withdrawal-details .confirm-withdrawal').forEach(btn => {
        btn.dataset.withdrawalId = withdrawal._id;
        if (withdrawal.status === 'Successful') {
          btn.style.display = 'none';
        } else {
          btn.style.display = 'block';
        }
      });
      setStatusColor(withdrawerStatus, withdrawal.status);
      withdrawalDetailsCard.style.display = 'block';
    });
  });

  // --- Close Details Card ---
  if (closeWithdrawalButton) {
    closeWithdrawalButton.addEventListener('click', () => {
      withdrawalDetailsCard.style.display = 'none';
    });
  }

  // --- Process Withdrawal Logic (Event Delegation) ---
  // This handles the click on the "Process Withdrawal" button
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('.Submit-withdrawal');
    if (!btn) return;
    const withdrawalId = btn.dataset.withdrawalId;
    const file = receiptInput.files[0];
    if (!file) {
      alert('Please upload a receipt.');
      return;
    }

    const formData = new FormData();
    formData.append('withdrawal-receipt', file);

    fetch(`/admin/ProcessWithdrawal/${withdrawalId}`, { method: 'POST', body: formData })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }
        // Update status everywhere to confirmed
        updateStatusEverywhere(withdrawalId, 'Successful');
        const processedAt = new Date(data.processedAt);
        withdrawerStatus.textContent = 'Successful';

        // hide all buttons
        document.querySelectorAll(`.confirm-withdrawal[data-withdrawal-id="${withdrawalId}"]`).forEach(btn => {
          btn.style.display = 'none';

          withdrawalDetailsCard.style.display = 'none';
          viewReceiptBtn.style.display = 'none';
        });

        const withdrawal = withdrawals.find(d => d._id === withdrawalId);
        // --- If in unconfirmed view, hide this card immediately ---
        if (showingUnconfirmed) {
          document.querySelectorAll(`.withdrawal-card`).forEach(card => {
            if (card.querySelector(`.withdrawal-card[data-withdrawal-id="${withdrawalId}"]`)) {
              card.style.display = 'none';
              // Optionally, update the card's data-status so it will show up when toggling back to all
              card.dataset.status = 'Successful';
            }
          });
          // Check if there are any unconfirmed left
          let anyUnconfirmed = false;
          withdrawalCards.forEach(card => {
            if (card.dataset.status === 'pending') {
              if (card.style.display !== 'none') anyUnconfirmed = true;
            }
          });
          if (!anyUnconfirmed) {
            noUnconfirmedMsg.style.display = 'block';
          }
        }
        const card = document.querySelector(`.withdrawal-card[data-withdrawal-id="${withdrawalId}"]`);
        if (card) card.remove();
      })
      .catch(error => alert('Error aproving withdrawal: ' + error));
  });

  // --- Toggle Unconfirmed Deposits ---
  const toggleBtn = document.getElementById('toggle-unconfirmed');
  let showingUnconfirmed = false;
  const noUnconfirmedMsg = document.getElementById('no-unconfirmed-message');
  toggleBtn.addEventListener('click', function (e) {
    e.preventDefault();
    showingUnconfirmed = !showingUnconfirmed;

    if (showingUnconfirmed) {
      // Show only unconfirmed
      let found = false;
      withdrawalCards.forEach(card => {
        if (card.dataset.status === 'pending') {
          card.style.display = '';
          found = true;
        } else {
          card.style.display = 'none';
        }
      });
      toggleBtn.textContent = 'Get all withdrawal requests';
      if (!found) {
        noUnconfirmedMsg.textContent = 'No unapproved withdrawals found';
      } else {
        noUnconfirmedMsg.style.display = 'none';
      }
    } else {
      // Show all
      withdrawalCards.forEach(card => card.style.display = '');
      toggleBtn.textContent = 'Get all unapproved requests';
      noUnconfirmedMsg.style.display = 'none';
    }
  });


});




