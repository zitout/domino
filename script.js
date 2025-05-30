document.addEventListener('DOMContentLoaded', () => {
    const playerZones = document.querySelectorAll('.player-zone');
    const keypadOverlay = document.getElementById('keypad-overlay');
    const keypadButtons = document.querySelectorAll('.keypad button');
    const resetAllButton = document.getElementById('reset-all');

    let currentTargetZone = null; // المنطقة التي يتم إدخال الأرقام لها
    let currentInput = ""; // الأرقام المدخلة حاليًا في لوحة المفاتيح

    // تحميل البيانات المحفوظة إن وجدت
    loadData();

    playerZones.forEach(zone => {
        zone.addEventListener('click', () => {
            currentTargetZone = zone;
            // currentInput = zone.querySelector('.numbers-display').textContent.replace(/-/g, ''); // تحميل الأرقام الموجودة (اختياري)
            currentInput = ""; // ابدأ دائمًا بإدخال جديد
            keypadOverlay.style.display = 'flex';
        });
    });

    keypadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const keyValue = button.dataset.key;

            if (keyValue === 'confirm') {
                if (currentTargetZone && currentInput.length > 0) {
                    const displayElement = currentTargetZone.querySelector('.numbers-display');
                    // إذا كان هناك أرقام سابقة، أضف فاصل
                    let existingNumbers = displayElement.textContent;
                    if (existingNumbers && existingNumbers !== '-' && existingNumbers.trim() !== "") {
                        displayElement.textContent += '-' + currentInput.split('').join('-');
                    } else {
                        displayElement.textContent = currentInput.split('').join('-');
                    }
                    saveData(); // حفظ البيانات
                }
                closeKeypad();
            } else if (keyValue === 'backspace') {
                currentInput = currentInput.slice(0, -1);
                // يمكن إضافة عرض مؤقت للأرقام المدخلة في لوحة المفاتيح نفسها
                console.log("Current keypad input:", currentInput); // للتجربة
            } else if (keyValue >= '0' && keyValue <= '6') { // فقط أرقام الدومينو
                if (currentInput.length < 7) { // حد أقصى لعدد الأرقام (مثلاً 7 أحجار)
                    currentInput += keyValue;
                    console.log("Current keypad input:", currentInput); // للتجربة
                }
            }
            // لا نغلق اللوحة بعد كل رقم، فقط عند التأكيد أو الإلغاء
        });
    });

    // إغلاق لوحة المفاتيح عند الضغط خارجها (اختياري)
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
                zone.querySelector('.numbers-display').textContent = ''; // أو '-' إذا أردت
            });
            saveData(); // حفظ الحالة الفارغة
        }
    });

    // ----- localStorage Persistence -----
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
            // تعيين قيمة ابتدائية إذا لم توجد بيانات محفوظة
            playerZones.forEach(zone => {
                zone.querySelector('.numbers-display').textContent = '';
            });
        }
    }

    // استدعاء أولي لضمان عرض الشرطة إذا كانت فارغة بعد التحميل
     playerZones.forEach(zone => {
        const display = zone.querySelector('.numbers-display');
        if (!display.textContent.trim()) {
            // display.textContent = '-'; // يمكنك تفعيل هذا السطر إذا أردت عرض "-" للأماكن الفارغة دائمًا
        }
    });

});
