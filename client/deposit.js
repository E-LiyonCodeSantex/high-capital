//date format
/*

document.addEventListener('DOMContentLoaded', () =>{
        function formatDate(raw) {
            const date = new Date(raw);
            if (isNaN(date.getTime())) return "";

            const day = date.getDate();                     // 15
            const year = date.getFullYear();                // 2025
            const time = date.toTimeString().split(' ')[0]; // 11:58:27

            return `${day} ${year} ${time}`;
        }

        document.querySelectorAll('.mainDate').forEach(function (el) {
            const raw = el.getAttribute('data-date');
            el.textContent = raw && raw !== "null" ? formatDate(raw) : "";
        });

        document.querySelectorAll('.endDate').forEach(function (el) {
            const raw = el.getAttribute('data-date');
            el.textContent = raw && raw !== "null" ? formatDate(raw) : "completed";
        });
})

//zoom image handler
document.addEventListener('DOMContentLoaded', () =>{
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
            closeZoom.addEventListener('click', () => {
                zoomModal.style.display = 'none';
                zoomedImage.src = '';
            });
            zoomModal.addEventListener('click', (e) => {
                if (e.target === zoomModal) {
                    zoomModal.style.display = 'none';
                    zoomedImage.src = '';
                }
                zoomModal.style.display = 'none';
                zoomedImage.src = '';
            });
        }
})
        */


// Function to handle wallet and bank selection in the deposit form
// This script handles the selection of wallets and banks in the deposit form
document.addEventListener('DOMContentLoaded', function () {
    const methodSelect = document.querySelector('select[name="method"]');
    const cryptoFields = document.getElementById('crypto-fields');
    const bankFields = document.getElementById('bank-fields');
    const selectWallet = document.getElementById('select-wallet');
    const walletAddressInput = document.getElementById('wallet-address');
    const walletAddressHidden = document.getElementById('wallet-address-hidden');
    const bankSelect = document.getElementById('bank-select');
    const bankAccountInput = document.getElementById('bank-account-number');
    const bankAccountName = document.getElementById('bank-account-name');
    const depositForm = document.querySelector('.deposit-form');
        const cryptoReceipt = document.getElementById('receipt-upload-crypto');
    const bankReceipt = document.getElementById('receipt-upload-bank');

    // 🔁 Switch visibility based on selected method
    methodSelect.addEventListener('change', function () {
        if (this.value === 'crypto') {
            cryptoFields.style.display = 'block';
            bankFields.style.display = 'none';
            selectWallet.setAttribute('required', '');
            walletAddressHidden.setAttribute('required', '');
             cryptoReceipt.setAttribute('required', '');

            bankReceipt.removeAttribute('required');
            bankSelect.removeAttribute('required');
            bankAccountInput.removeAttribute('required');
            bankAccountName.removeAttribute('required');
        } else if (this.value === 'bank') {
            bankFields.style.display = 'block';
            cryptoFields.style.display = 'none';
            bankSelect.setAttribute('required', '');
            bankAccountInput.setAttribute('required', '');
            bankAccountName.setAttribute('required', '');
            bankReceipt.setAttribute('required', '');
        
            selectWallet.removeAttribute('required');
            walletAddressHidden.removeAttribute('required');
            cryptoReceipt.removeAttribute('required');
        } else {
            cryptoFields.style.display = 'none';
            bankFields.style.display = 'none';
             bankReceipt.removeAttribute('required');
            cryptoReceipt.removeAttribute('required');
        }
    });

    // 📦 Populate wallet address on wallet selection
    if (selectWallet) {
        selectWallet.addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            const address = selectedOption.getAttribute('data-address');
            walletAddressInput.value = address;
            walletAddressHidden.value = address;
        });
    }

    // 🏦 Populate account details on bank selection
    if (bankSelect) {
        bankSelect.addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            const accountNum = selectedOption.getAttribute('data-account');
            const accountName = selectedOption.getAttribute('data-name');
            bankAccountInput.value = accountNum;
            bankAccountName.value = accountName;
        });
    }

    // 📋 Copy to clipboard helper
    window.copyToClipboard = function (elementId) {
        const input = document.getElementById(elementId);
        if (input) {
            navigator.clipboard.writeText(input.value)
                .then(() => alert('Copied to clipboard!'))
                .catch(err => console.error('Copy failed:', err));
        }
    };
});
