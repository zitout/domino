document.addEventListener('DOMContentLoaded', () => {
    const playerZones = document.querySelectorAll('.player-zone');
    const keypadOverlay = document.getElementById('keypad-overlay');
    const keypadButtons = document.querySelectorAll('.keypad button');
    const resetAllButton = document.getElementById('reset-all');

    let currentTargetZone = null;
    let currentInput = ""; // الأرقام المدخلة من لوحة المفاتيح

    loadData();

    playerZones.forEach(zone => {
        zone.addEventListener('click', () => {
            currentTargetZone = zone;
            currentInput = "";
            keypadOverlay.style.display = 'flex';
        });
    });

    keypadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const keyValue = button.dataset.key;

                       if (keyValue === 'confirm') {
                if (currentTargetZone && currentInput.length > 0) {
                    const displayElement = currentTargetZone.querySelector('.numbers-display');
                    let existingNumbersText = displayElement.textContent;
                    
                    let existingNumbersSet = new Set();
                    if (existingNumbersText && existingNumbersText.trim() !== "" && existingNumbersText.trim() !== '-') {
                        existingNumbersText.split('-').forEach(numStr => {
                            // التحقق الإضافي هنا مهم
                            if (numStr.trim() !== "" && !isNaN(parseInt(numStr.trim()))) {
                                existingNumbersSet.add(parseInt(numStr.trim()));
                            }
                        });
                    }

                    for (let char of currentInput) {
                        const newNum = parseInt(char);
                        // التحقق الإضافي هنا مهم
                        if (!isNaN(newNum) && !existingNumbersSet.has(newNum)) {
                            if (existingNumbersSet.size < 7) {
                                existingNumbersSet.add(newNum);
                            } else {
                                // يمكنك إزالة هذا الـ alert إذا كان مزعجًا، أو تعديله
                                // alert("لا يمكن إضافة أكثر من 7 أرقام فريدة لكل منطقة."); 
                                console.log("Limit of 7 unique numbers reached.");
                                break; 
                            }
                        }
                    }
                    
                    let sortedNumbersArray = Array.from(existingNumbersSet).sort((a, b) => a - b);
                    displayElement.textContent = sortedNumbersArray.join('-');
                    
                    // إذا كانت المجموعة فارغة بعد كل العمليات، ربما نجعل النص فارغًا أو "-"
                    if (sortedNumbersArray.length === 0) {
                        // displayElement.textContent = '-'; // أو ''
                    }

                    saveData();
                }
                closeKeypad();
            
            } else if (keyValue === 'backspace') {
                currentInput = currentInput.slice(0, -1);
                console.log("Current keypad input (after backspace):", currentInput);
            } else if (keyValue >= '0' && keyValue <= '6') {
                // هنا في currentInput، يمكن أن تتكرر الأرقام مؤقتًا قبل التأكيد
                // لكن يجب ألا نسمح بإدخال نفس الرقم مرتين متتاليتين في currentInput إذا أردت
                // أو يمكننا منع التكرار في currentInput نفسه قبل التأكيد
                if (currentInput.length < 7) { // الحد الأقصى لطول الإدخال المؤقت
                    // اختياري: منع إضافة نفس الرقم إذا كان هو آخر رقم في currentInput
                    // if (currentInput.length === 0 || currentInput[currentInput.length - 1] !== keyValue) {
                         currentInput += keyValue;
                    // }
                    console.log("Current keypad input (after digit):", currentInput);
                }
            }
        });
    });

    keypadOverlay.addEventListener('click', (e) => {
        if (e.target === keypadOverlay) {
            closeKeypad();
        }
    });

    function closeKeypad() {
        keypadOverlay.style.display = 'none';
        currentInput = "";
        currentTargetZone = null;
    }

    resetAllButton.addEventListener('click', () => {
        if (confirm("هل أنت متأكد أنك تريد مسح جميع الأرقام؟")) {
            playerZones.forEach(zone => {
                zone.querySelector('.numbers-display').textContent = '';
            });
            saveData();
            updateInitialDisplay(); // تحديث العرض بعد المسح
        }
    });

    function saveData() {
        const dataToSave = {
            friend: document.getElementById('friend-numbers').textContent,
            left: document.getElementById('left-numbers').textContent,
            right: document.getElementById('right-numbers').textContent,
        };
        localStorage.setItem('dominoHelperData', JSON.stringify(dataToSave));
    }

    function loadData() {
        const savedData = localStorage.getItem('dominoHelperData');
        if (savedData) {
            const data = JSON.parse(savedData);
            document.getElementById('friend-numbers').textContent = data.friend || '';
            document.getElementById('left-numbers').textContent = data.left || '';
            document.getElementById('right-numbers').textContent = data.right || '';
        } else {
            playerZones.forEach(zone => {
                zone.querySelector('.numbers-display').textContent = '';
            });
        }
        updateInitialDisplay();
    }
    
    function updateInitialDisplay() {
         playerZones.forEach(zone => {
             const display = zone.querySelector('.numbers-display');
             if (!display.textContent.trim()) {
                 // display.textContent = '-'; // يمكنك تفعيل هذا إذا أردت "-" في المناطق الفارغة
             }
         });
    }
});
