//nav bar toggling and dropdown
//for nav toggling
document.addEventListener('DOMContentLoaded', () => {

    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-bar');
    const navLinks = document.querySelectorAll('.nav-bar li');
    const body = document.querySelector('body');


    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        body.classList.toggle('nav-active');
    });
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            body.classList.remove('nav-active');
        });
    });
})

//for nav company drawer
document.addEventListener('DOMContentLoaded', () =>{
    const companyHeader = document.querySelector('.company-header');
    const companyDropDown = document.querySelector('.company-drop_down');

    companyHeader.addEventListener('click', () =>{
        companyDropDown.classList.toggle('show');
    })
})

/*Function for FAQ drawer*/
document.addEventListener('DOMContentLoaded', () => {
    const drawerHeaders = document.querySelectorAll('.drawer-head');
    drawerHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const drawer = header.nextElementSibling;
            if (drawer && drawer.classList.contains('drawer')) {
                header.classList.toggle('headerActive');
                drawer.classList.toggle('open');
                console.log('drawer has been clicked');
            }
        });
    });
});

//fuction for left-nav bar in logged in pages
document.addEventListener('DOMContentLoaded', function () {
    const bugger = document.querySelectorAll('.bugger');
    const leftMenu = document.querySelector('.menu-left');
    const logo = document.querySelector('.logo');
    const nav = document.querySelector('.nav-bar');
    const menuIcons = document.querySelector('.menu-icons');

    bugger.forEach(each => {
        each.removeEventListener('click', () => { }); // Clear existing listeners
        each.addEventListener('click', () => {
            //console.log('left menu is clicked');
            console.log('left menu is clicked at:', new Date().toISOString());
            leftMenu.classList.toggle('left-menu-active');
            logo.classList.toggle('logo-active');
            nav.classList.toggle('nav-active');
            menuIcons.classList.toggle('menu-icons-active');
        });
    });
});

//check password strenght
document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const strengthMessage = document.getElementById('strengthMessage');
    const submitButton = document.getElementById('sign-up-button');

    passwordInput.addEventListener('input', function () {
        const password = passwordInput.value;
        console.log('Password is on duty:', password);

        // Password strength patterns
        const weakPattern = /.{1,7}/; // Weak: less than 8 characters
        const strongPattern = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/; // Moderate: letters and numbers

        // Analyze and display strength
        if (password === '') {
            strengthMessage.textContent = 'Password cannot be empty';
            strengthMessage.className = 'weak';
            submitButton.disabled = true; // Disable the submit button
        } else if (password.length >= 20) {
            strengthMessage.textContent = 'Password cannot exceed 20 characters';
            strengthMessage.className = 'weak';
            passwordInput.value = password.slice(0, 20);
            submitButton.disabled = true; // Disable the submit button
        } else if (weakPattern.test(password) && password.length < 8) {
            strengthMessage.textContent = 'Weak';
            strengthMessage.className = 'weak';
            submitButton.disabled = true; // Disable the submit button
        } else if (strongPattern.test(password)) {
            strengthMessage.textContent = 'Strong';
            strengthMessage.className = 'strong';
            submitButton.disabled = false; // Enable the submit button
        } else {
            strengthMessage.textContent = ''; // Clear message
            submitButton.disabled = true; // Disable the submit button
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

//fucntion for validating the file size of the uploaded profile photo
// This function checks the file size of the uploaded profile photo
document.addEventListener('DOMContentLoaded', () => {
    // Handle file size validation for the signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            const fileInput = document.getElementById('profile-photo');
            if (fileInput) {
                const file = fileInput.files[0];
                if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
                    e.preventDefault();
                    alert('The uploaded file is too large. Please upload a file smaller than 3MB.');
                }
            }
        });
    }

    // Handle file size validation for the deposit form
    const depositForm = document.getElementById('deposit-form');
    if (depositForm) {
        depositForm.addEventListener('submit', function (e) {
            const fileInput = document.getElementById('deposit-receipt');
            if (fileInput) {
                const file = fileInput.files[0];
                if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
                    e.preventDefault();
                    alert('The uploaded file is too large. Please upload a file smaller than 3MB.');
                }
            }
        });
    }
});

// Function to handle plan selection and autofill for deposit form
// This function will be called when the plan type is selected
document.addEventListener('DOMContentLoaded', function () {
    const planTypeSelect = document.getElementById('plan-type');
    const planName = document.getElementById('nameHidden');
    const percentageEarningInput = document.getElementById('percentage-earning');
    const amountInput = document.getElementById('plan-amount');
    const errorMessage = document.querySelector('.error-message-for-amount');
    const planDuration = document.getElementById('investment-duration');
    const referralBonus = document.getElementById('referal-bonus');
    const planIdInput = document.getElementById('plan-id');
    const dailyProfitHiddenInput = document.getElementById('dailyProfitHidden');
    const durationHiddenInput = document.getElementById('durationHidden');
    const referralBonusHiddenInput = document.getElementById('referralBonusHidden');
    const totalProfit = document.getElementById('total-profit');
    const totalProfitHidden = document.getElementById('totalProfitHidden');

    // Parse the plans data passed from the server
    const plans = JSON.parse(document.getElementById('plans-data').textContent);

    let currentAmountHandler = null;
    let currentPlan = null;

    function calculateTotalProfit(amount, dailyProfit, duration) {
        // amount: number, dailyProfit: percent (e.g. 5 for 5%), duration: days
        if (!amount || !dailyProfit || !duration) return '';
        const profit = (amount * (dailyProfit / 100)) * duration;
        return profit.toFixed(2); // 2 decimal places
    }

    function updateTotalProfit() {
        if (!currentPlan) {
            totalProfit.value = '';
            totalProfitHidden.value = '';
            return;
        }
        const amount = parseFloat(amountInput.value);
        const dailyProfit = parseFloat(currentPlan.dailyProfit);
        const duration = parseInt(currentPlan.duration, 10);
        if (isNaN(amount) || isNaN(dailyProfit) || isNaN(duration)) {
            totalProfit.value = '';
            totalProfitHidden.value = '';
            return;
        }
        totalProfit.value = calculateTotalProfit(amount, dailyProfit, duration);
        totalProfitHidden.value = totalProfit.value; // Update hidden input
    }

    function autofillPlan(planId) {
        const selectedPlanData = plans.find(plan => String(plan._id) === String(planId));

        // Remove previous input event listener
        if (currentAmountHandler) {
            amountInput.removeEventListener('input', currentAmountHandler);
            currentAmountHandler = null;
        }

        currentPlan = selectedPlanData;

        if (selectedPlanData) {
            planName.value = selectedPlanData.name;
            percentageEarningInput.value = selectedPlanData.dailyProfit;
            dailyProfitHiddenInput.value = selectedPlanData.dailyProfit;
            amountInput.value = selectedPlanData.minDeposit;
            planDuration.value = selectedPlanData.duration;
            durationHiddenInput.value = selectedPlanData.duration;
            referralBonus.value = selectedPlanData.referralBonus;
            referralBonusHiddenInput.value = selectedPlanData.referralBonus;
            planIdInput.value = selectedPlanData._id;
            errorMessage.textContent = '';

            // Add new input event listener for validation and profit calculation
            currentAmountHandler = function () {
                const enteredAmount = parseFloat(amountInput.value);
                if (enteredAmount < selectedPlanData.minDeposit) {
                    errorMessage.textContent = `You cannot invest lower than the minimum amount of $${selectedPlanData.minDeposit} for the ${selectedPlanData.name}.`;
                } else if (enteredAmount > selectedPlanData.maxDeposit) {
                    errorMessage.textContent = `You cannot invest higher than the Maximum amount of $${selectedPlanData.maxDeposit} for the ${selectedPlanData.name}.`;
                } else {
                    errorMessage.textContent = '';
                }
                updateTotalProfit();
            };
            amountInput.addEventListener('input', currentAmountHandler);

            // Initial calculation
            updateTotalProfit();
        } else {
            planName.value = '';
            percentageEarningInput.value = '';
            dailyProfitHiddenInput.value = '';
            amountInput.value = '';
            planDuration.value = '';
            durationHiddenInput.value = '';
            referralBonus.value = '';
            referralBonusHiddenInput.value = '';
            planIdInput.value = '';
            errorMessage.textContent = '';
            totalProfit.value = '';
            totalProfitHidden.value = '';
            currentPlan = null;
        }
    }

    planTypeSelect.addEventListener('change', function () {
        autofillPlan(this.value);
    });

    // Autofill if a plan is preselected on page load
    if (planTypeSelect.value) {
        autofillPlan(planTypeSelect.value);
    }

    const depositTable = document.querySelectorAll('.deposit-cards')
    const depositDetails = document.getElementById('deposit-details');
    const detailDepositReceipt = document.getElementById('detail-deposit-receipt');
    const detailplanName = document.getElementById('detail-plan-name');
    const detailCoinType = document.getElementById('detail-coin-type');
    const detailAmount = document.getElementById('detail-amount');
    const detailDailyProfit = document.getElementById('detail-daily-profit');
    const detailDuration = document.getElementById('detail-duration');
    const detailStatus = document.getElementById('detail-status');
    const detailDate = document.getElementById('detail-date');
    const detailTotalProfit = document.getElementById('detail-total-profit');
    const detailEndDate = document.getElementById('detail-end-date');
    //const withdrawalRequest = document.getElementById('withdrawal-request');

    const deposits = JSON.parse(document.getElementById('deposits-data').textContent);
    depositTable.forEach((card, index) => {
        card.addEventListener('click', () => {
            const deposit = deposits[index];

            detailDepositReceipt.src = deposit.transactionReceipt;
            detailplanName.textContent = deposit.name;
            detailCoinType.textContent = deposit.coinType;
            detailAmount.textContent = `$${deposit.amount.toFixed(2)}`;
            detailDailyProfit.textContent = `${deposit.dailyProfit}%`;

            // Remove previous status classes
            detailStatus.classList.remove('status-unconfirmed', 'status-confirmed', 'status-completed');
            // Set status text and color class
            if (deposit.status === 'unconfirmed') {
                detailStatus.textContent = 'Unconfirmed';
                detailEndDate.textContent = 'unconfirmed';
                detailStatus.classList.add('status-unconfirmed');
            } else if (deposit.status === 'confirmed') {
                detailStatus.textContent = 'Confirmed';
                detailEndDate.textContent = new Date(deposit.endDate).toLocaleDateString();
                detailStatus.classList.add('status-confirmed');
            } else if (deposit.status === 'completed') {
                detailStatus.textContent = 'Completed';
                detailEndDate.textContent = new Date(deposit.endDate).toLocaleDateString();
                detailStatus.classList.add('status-completed');
            } else {
                // Default for other statuses
                detailStatus.textContent = deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1);
                detailEndDate.textContent = new Date(deposit.endDate).toLocaleDateString();
            }

            detailDuration.textContent = `${deposit.duration} days`;
            detailDate.textContent = new Date(deposit.date).toLocaleDateString();
            detailTotalProfit.textContent = `$${deposit.totalProfit}`;

            console.log('Deposit card clicked:', index);
            depositDetails.style.display = 'block';
        });
    })
    const closeDetailsButton = document.getElementById('close-deposit-details');
    closeDetailsButton.addEventListener('click', () => {
        depositDetails.style.display = 'none';
    });


});


/**
document.addEventListener('DOMContentLoaded', () => {
    const historyCard = document.querySelectorAll('.history');
    const transactionModal = document.getElementById('transaction-history-details');
    const transactionReceipt = document.getElementById('transaction-receipt');
    const detailPlanName = document.getElementById('detail-plan-name');
    const detailCoinType = document.getElementById('detail-coin-type');
    const detailAmount = document.getElementById('detail-amount');
    const detailDailyProfit = document.getElementById('detail-daily-profit');
    const detailDuration = document.getElementById('detail-duration');
    const detailStatus = document.querySelector('.detail-status');
    const detailDate = document.getElementById('detail-date');
    const detailTotalProfit = document.getElementById('detail-total-profit');
    const detailEndDate = document.getElementById('detail-end-date');
    const detailAccountNumber = document.getElementById('detail-account-number');
    const detailAccountName = document.getElementById('detail-account-name');
    const detailAccountNumberContainer = document.querySelector('.detail-account-number-container');
    const detailAccountNameContainer = document.querySelector('.detail-account-name-container');

    //label declaration detail-account-number-container
    const detailPlanNameLabel = document.querySelector('.detail-plan-name-label');
    const detailCoinTypeLabel = document.querySelector('.detail-coin-type-label');
    const detailAccountNameLabel = document.querySelector('.detail-account-name-label');
    const detailAccountNumberLabel = document.querySelector('.detail-account-number-label');

    const transactions = JSON.parse(document.getElementById('history-data').textContent);
    historyCard.forEach((each, index) => {
        each.addEventListener('click', () => {
            // console.log('index is clicked:', index);
            const transaction = transactions[index];

            const type = transaction.type;
            if (type === 'deposit') {
                detailAccountNumberContainer.style.display = 'none';
                detailAccountNameContainer.style.display = 'none';
                transactionReceipt.src = transaction.transactionReceipt;
                detailPlanNameLabel.textContent = 'Plan name:';
                detailPlanName.textContent = transaction.name;
                detailCoinTypeLabel.textContent = 'Coin Deposited:';
                detailCoinType.textContent = transaction.currency;
                detailAmount.textContent = `$${transaction.amount}`;
                detailDailyProfit.textContent = `${transaction.dailyProfit}%`;
                detailDuration.textContent = `${transaction.duration} days`;
                detailTotalProfit.textContent = `$${transaction.totalProfit}`;
                detailDate.textContent = new Date(transaction.date).toLocaleDateString();
                let status = transaction.status;
                if (status === 'unconfirmed') {
                    detailStatus.textContent = 'Unconfirmed';
                    detailEndDate.textContent = 'unconfirmed';
                    detailStatus.classList.remove('status-confirmed', 'status-completed');
                    detailStatus.classList.add('status-unconfirmed');
                } else if (status === 'confirmed') {
                    detailStatus.textContent = 'Confirmed';
                    detailEndDate.textContent = 'Confirmed';
                    detailStatus.classList.remove('status-unconfirmed', 'status-completed');
                    detailStatus.classList.add('status-confirmed');
                } else if (status === 'completed') {
                    detailStatus.textContent = 'Completed';
                    detailEndDate.textContent = new Date(transaction.date).toLocaleDateString();
                    detailStatus.classList.remove('status-unconfirmed', 'status-confirmed');
                    detailStatus.classList.add('status-completed');
                } else {
                    // Default for other statuses
                    detailStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
                    detailEndDate.textContent = new Date(transaction.date).toLocaleDateString();
                }
            } else if (type === 'withdrawal') {
                transactionReceipt.src = transaction.transactionReceipt;
                detailPlanNameLabel.textContent = 'Method:';
                detailPlanName.textContent = transaction.method;
                if (transaction.method === 'bank') {
                    detailCoinTypeLabel.textContent = 'Bank Name';
                    detailCoinType.textContent = transaction.bankName;
                    detailAccountNameLabel.textContent = 'Account Name:';
                    detailAccountName.textContent = transaction.acountName;
                    detailAccountNumberLabel.textContent = 'Account Number:';
                    detailAccountNumber.textContent = transaction.acountNumber;
                } else if (transaction.method === 'crypto') {
                    detailCoinTypeLabel.textContent = 'Wallet Name:';
                    detailCoinType.textContent = transaction.walletName;
                    detailAccountNumberContainer.style.display = 'none';
                    detailAccountNameLabel.textContent = 'Wallet Adress:';
                    detailAccountName.textContent = transaction.walletAddress;
                }
                detailAmount.textContent = `$${transaction.amount}`;

            }


            transactionModal.style.display = 'block';
        })
    })


    const closeTransactionDetails = document.getElementById('close-transaction-details');
    closeTransactionDetails.addEventListener('click', () => {
        transactionModal.style.display = 'none';
    });
})
    **/


