document.addEventListener('DOMContentLoaded', () => {
    const playerZones = document.querySelectorAll('.player-zone');
    // const keypadOverlay = document.getElementById('keypad-overlay'); // قد لا نحتاجه
    // const keypadButtons = document.querySelectorAll('.keypad button'); // قد لا نحتاجه
    const resetAllButton = document.getElementById('reset-all');

    // الكشف عن جهاز اللمس
    const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);

    let currentTargetZone = null;
    // currentInput لن يستخدم بنفس الطريقة
    // let currentInput = "";

    loadData();

    if (isTouchDevice) {
        // إخفاء أو إزالة لوحة المفاتيح القديمة إذا كانت لا تزال في HTML
        const keypadOverlay = document.getElementById('keypad-overlay');
        if (keypadOverlay) keypadOverlay.style.display = 'none';

        playerZones.forEach(zone => {
            zone.addEventListener('click', handleZoneClickForMobile); // 'click' يعمل للمس أيضاً
        });

        // منطق إزالة رقم عند النقر عليه مباشرة
        playerZones.forEach(zone => {
            const displayElement = zone.querySelector('.numbers-display');
            displayElement.addEventListener('click', (event) => {
                event.stopPropagation(); // منع الفقاعة إلى معالج المنطقة نفسها
                handleNumberDisplayClick(event, zone, displayElement);
            });
        });

    } else {
        // سلوك لأجهزة الكمبيوتر (يمكن إبقاء لوحة المفاتيح القديمة أو عرض رسالة)
        console.log("جهاز كمبيوتر مكتبي، نظام الإدخال باللمس المباشر غير مفعل.");
        // هنا يمكنك إبقاء منطق لوحة المفاتيح القديم إذا أردت
        // playerZones.forEach(zone => {
        //     zone.addEventListener('click', () => {
        //         currentTargetZone = zone;
        //         currentInput = ""; // للتوافق مع الكود القديم إذا تم استخدامه
        //         const keypadOverlay = document.getElementById('keypad-overlay');
        //         if (keypadOverlay) keypadOverlay.style.display = 'flex';
        //     });
        // });
        // keypadButtons.forEach(button => { /* ... الكود القديم للوحة المفاتيح ... */ });
        //  keypadOverlay.addEventListener('click', (e) => { /* ... */ });

        // أو جعل المناطق غير قابلة للاستخدام
        playerZones.forEach(zone => {
            zone.style.cursor = 'not-allowed';
            zone.title = "هذه الميزة محسنة لأجهزة اللمس.";
        });
        // إخفاء لوحة المفاتيح إذا كانت موجودة
        const keypadOverlay = document.getElementById('keypad-overlay');
        if (keypadOverlay) keypadOverlay.style.display = 'none';

    }


    function handleZoneClickForMobile(event) {
        currentTargetZone = event.currentTarget; // المنطقة التي تم النقر عليها
        const rect = currentTargetZone.getBoundingClientRect(); // أبعاد وموقع المنطقة

        // إحداثيات النقر بالنسبة للمنطقة نفسها
        // event.clientX/Y هي بالنسبة لإطار العرض viewport
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const zoneWidth = rect.width;
        const zoneHeight = rect.height;

        // تحديد الرقم بناءً على موقع النقر
        // هذا تقسيم بسيط، يمكن تحسينه
        // نفترض تقسيم المنطقة إلى 3 أعمدة و 3 صفوف (تقريبي)
        let selectedNumber = -1;

        // الصف العلوي
        if (clickY < zoneHeight / 3) {
            if (clickX < zoneWidth / 3) selectedNumber = 1;
            else if (clickX < (zoneWidth * 2) / 3) selectedNumber = 2;
            else selectedNumber = 3;
        }
        // الصف الأوسط
        else if (clickY < (zoneHeight * 2) / 3) {
            if (clickX < zoneWidth / 3) selectedNumber = 4;
            else if (clickX < (zoneWidth * 2) / 3) selectedNumber = 0;
            else selectedNumber = 5;
        }
        // الصف السفلي
        else {
            if (clickX < zoneWidth / 3) selectedNumber = 6;
            // المنطقتان الأخريان في الأسفل يمكن تخصيصهما لاحقًا (مثلاً للمسح)
            // else if (clickX < (zoneWidth * 2) / 3) { /* action for middle-bottom */ }
            // else { /* action for right-bottom */ }
        }

        if (selectedNumber !== -1) {
            addNumberToZone(currentTargetZone, selectedNumber);
        }
    }

    function addNumberToZone(zone, number) {
        const displayElement = zone.querySelector('.numbers-display');
        let existingNumbersText = displayElement.textContent;
        let existingNumbersSet = new Set();

        if (existingNumbersText && existingNumbersText.trim() !== "" && existingNumbersText.trim() !== '-') {
            existingNumbersText.split('-').forEach(numStr => {
                if (numStr.trim() !== "" && !isNaN(parseInt(numStr.trim()))) {
                    existingNumbersSet.add(parseInt(numStr.trim()));
                }
            });
        }

        if (!existingNumbersSet.has(number)) {
            if (existingNumbersSet.size < 7) {
                existingNumbersSet.add(number);
            } else {
                console.log("Limit of 7 unique numbers reached for this zone.");
                // يمكنك عرض تنبيه خفيف هنا إذا أردت، مثلاً اهتزاز خفيف أو تغيير لون للحظة
                // navigator.vibrate(50); // يتطلب صلاحية وقد لا يعمل دائماً
                zone.classList.add('zone-error-pulse');
                setTimeout(() => zone.classList.remove('zone-error-pulse'), 300);
                return; // لا تقم بأي شيء آخر إذا كان الحد ممتلئًا
            }
        } else {
            // الرقم موجود بالفعل، ربما لا تفعل شيئًا أو تعطي إشارة
            console.log("Number already exists in this zone.");
            // navigator.vibrate(20);
            zone.classList.add('zone-notice-pulse');
            setTimeout(() => zone.classList.remove('zone-notice-pulse'), 300);
            return;
        }

        let sortedNumbersArray = Array.from(existingNumbersSet).sort((a, b) => a - b);
        displayElement.textContent = sortedNumbersArray.join('-');

        saveData();
        updateDisplayWithSpans(displayElement); // لتسهيل النقر على الأرقام لإزالتها
    }

    function handleNumberDisplayClick(event, zone, displayElement) {
        if (!isTouchDevice) return; // هذه الميزة فقط للهواتف

        const clickedElement = event.target;
        if (clickedElement.tagName === 'SPAN' && clickedElement.classList.contains('removable-number')) {
            const numberToRemove = parseInt(clickedElement.dataset.number);
            if (!isNaN(numberToRemove)) {
                removeNumberFromZone(zone, displayElement, numberToRemove);
            }
        }
    }

    function removeNumberFromZone(zone, displayElement, numberToRemove) {
        let existingNumbersText = displayElement.textContent;
        let existingNumbersSet = new Set();

        if (existingNumbersText && existingNumbersText.trim() !== "" && existingNumbersText.trim() !== '-') {
            existingNumbersText.split('-').forEach(numStr => {
                if (numStr.trim() !== "" && !isNaN(parseInt(numStr.trim()))) {
                    existingNumbersSet.add(parseInt(numStr.trim()));
                }
            });
        }

        if (existingNumbersSet.has(numberToRemove)) {
            existingNumbersSet.delete(numberToRemove);
            let sortedNumbersArray = Array.from(existingNumbersSet).sort((a, b) => a - b);
            displayElement.textContent = sortedNumbersArray.join('-');
            saveData();
            updateDisplayWithSpans(displayElement); // تحديث الـ spans
        }
    }
    
    // دالة لتحديث عرض الأرقام باستخدام SPANs لتسهيل الحذف
    function updateDisplayWithSpans(displayElement) {
        const numbersText = displayElement.textContent;
        if (numbersText && numbersText.trim() !== "" && numbersText.trim() !== '-') {
            const numbersArray = numbersText.split('-');
            displayElement.innerHTML = ''; // مسح المحتوى الحالي
            numbersArray.forEach((numStr, index) => {
                if (numStr.trim() !== "") {
                    const span = document.createElement('span');
                    span.textContent = numStr;
                    span.classList.add('removable-number');
                    span.dataset.number = numStr; // لتسهيل التعرف على الرقم
                    displayElement.appendChild(span);
                    if (index < numbersArray.length - 1) {
                        // إضافة الفاصل '-' مرة أخرى كنص عادي، إلا إذا كان آخر رقم
                        // أو التأكد من أن الأرقام التي لا تحتوي على فاصل تعمل بشكل جيد
                        const nextNumStr = (numbersArray[index+1] || "").trim();
                        if (nextNumStr !== "") {
                             displayElement.appendChild(document.createTextNode('-'));
                        }
                    }
                }
            });
        } else {
            displayElement.innerHTML = ''; // اتركها فارغة إذا لا توجد أرقام
        }
    }


    resetAllButton.addEventListener('click', () => {
        if (confirm("هل أنت متأكد أنك تريد مسح جميع الأرقام؟")) {
            playerZones.forEach(zone => {
                const display = zone.querySelector('.numbers-display');
                display.textContent = '';
                updateDisplayWithSpans(display); // تحديث بعد المسح
            });
            saveData();
            // updateInitialDisplay(); //  تأكد من أن هذا يتم استدعاؤه بشكل صحيح أو مدمج
        }
    });

    function saveData() {
        const dataToSave = {};
        playerZones.forEach(zone => {
            const playerId = zone.dataset.player; // 'friend', 'left', 'right'
            // نحفظ النص الخام، وعند التحميل نعيد بناء الـ spans
            dataToSave[playerId] = zone.querySelector('.numbers-display').textContent;
        });
        localStorage.setItem('dominoHelperData', JSON.stringify(dataToSave));
    }

    function loadData() {
        const savedData = localStorage.getItem('dominoHelperData');
        if (savedData) {
            const data = JSON.parse(savedData);
            document.getElementById('friend-numbers').textContent = data.friend || '';
            document.getElementById('left-numbers').textContent = data.left || '';
            document.getElementById('right-numbers').textContent = data.right || '';
        }
        // تحديث العرض الأولي باستخدام spans
        playerZones.forEach(zone => {
            updateDisplayWithSpans(zone.querySelector('.numbers-display'));
        });
    }

    // الكود الخاص بلوحة المفاتيح القديمة (إذا قررت الإبقاء عليه للكمبيوتر)
    // ... (يمكنك نسخ ولصق الكود المتعلق بـ keypadOverlay و keypadButtons هنا داخل else لـ !isTouchDevice)
    // ... مع التأكد من أن currentTargetZone و currentInput يتم تعيينهما بشكل صحيح
    // ... وأن دالة closeKeypad تعمل كما هو متوقع.

    // ملاحظة: الدالة updateInitialDisplay() تم دمج وظيفتها في نهاية loadData
    // وكذلك في resetAllButton.

});
