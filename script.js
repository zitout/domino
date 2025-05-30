document.addEventListener('DOMContentLoaded', () => {
    const friendMissingDiv = document.getElementById('friend-missing');
    const leftMissingDiv = document.getElementById('left-missing');
    const rightMissingDiv = document.getElementById('right-missing');

    const startGameBtn = document.getElementById('start-game');
    const endGameBtn = document.getElementById('end-game');
    const inputBtns = document.querySelectorAll('.input-btn');

    const modal = document.getElementById('keypad-modal');
    const closeModalBtn = document.querySelector('.modal .close-btn'); // More specific selector
    const numberInput = document.getElementById('number-input');
    const submitNumbersBtn = document.getElementById('submit-numbers');

    let gameData = {
        friend: new Set(),
        left: new Set(),
        right: new Set()
    };
    let currentPlayerForInput = null;

    function updateDisplay() {
        friendMissingDiv.textContent = Array.from(gameData.friend).sort((a,b) => a-b).join(' ، ') || '-';
        leftMissingDiv.textContent = Array.from(gameData.left).sort((a,b) => a-b).join(' ، ') || '-';
        rightMissingDiv.textContent = Array.from(gameData.right).sort((a,b) => a-b).join(' ، ') || '-';
    }

    function resetGame(showPopup = true) {
        gameData.friend.clear();
        gameData.left.clear();
        gameData.right.clear();
        updateDisplay();
        if (showPopup) {
            alert("تم مسح البيانات. لعبة جديدة.");
        }
    }

    startGameBtn.addEventListener('click', () => resetGame(true));
    endGameBtn.addEventListener('click', () => {
        resetGame(true);
        // alert("انتهت اللعبة. يمكنك بدء لعبة جديدة."); // Alert from resetGame is enough
    });

    inputBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            currentPlayerForInput = e.target.dataset.player;
            if (!currentPlayerForInput || !gameData[currentPlayerForInput]) {
                console.error("Invalid player data:", currentPlayerForInput);
                return; // Prevent error if player data is somehow invalid
            }
            modal.style.display = 'block';
            numberInput.value = ''; // Clear previous input
            numberInput.focus();
        });
    });

    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    } else {
        console.error("Close button for modal not found!");
    }


    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    submitNumbersBtn.addEventListener('click', () => {
        if (!currentPlayerForInput) return;

        const numbersStr = numberInput.value.trim();
        // Allow empty string to clear (though not ideal UX, but prevents error for now)
        // Or ensure numbersStr is not empty before proceeding with match
        if (numbersStr === "" || numbersStr.match(/^[0-6]+$/)) {
            // If you want to clear for a player, you might need a different mechanism
            // For now, empty string won't add anything.
            if (numbersStr !== "") {
                for (let char of numbersStr) {
                    if (gameData[currentPlayerForInput]) {
                        gameData[currentPlayerForInput].add(parseInt(char));
                    }
                }
            }
            updateDisplay();
            modal.style.display = 'none';
        } else if (numbersStr !== "") { // Only show alert if input is non-empty and invalid
            alert("الرجاء إدخال أرقام صحيحة فقط (0 إلى 6).");
        }
    });
    
    numberInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            submitNumbersBtn.click(); 
        }
    });

    // Initial state
    resetGame(false); // Reset without popup on load
});
