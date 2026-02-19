async function searchResult() {
    const rawInput = document.getElementById('searchInput').value;
    const resultSheet = document.getElementById('resultSheet');
    const actionArea = document.getElementById('actionArea');
    const errorMessage = document.getElementById('errorMessage');

    resultSheet.style.display = 'none';
    actionArea.style.display = 'none';
    errorMessage.style.display = 'none';

    if (!rawInput) {
        alert("Please enter a username!");
        return;
    }

    // CLEAN INPUT
    const searchTerm = rawInput.replace(/@/g, '').trim().toLowerCase();

    try {
        const response = await fetch('data.json?t=' + new Date().getTime());
        const data = await response.json();

        // MATCH LOGIC
        const creator = data.find(item => {
            if (!item["Instagram ID"]) return false;
            // Compare cleaned DB ID with cleaned Input
            const dbId = item["Instagram ID"].toString().replace(/@/g, '').trim().toLowerCase();
            return dbId === searchTerm;
        });

        if (creator) {
            // --- FIXING THE DOUBLE @ ISSUE ---
            // 1. Get ID from DB
            let rawHandle = creator["Instagram ID"].toString();
            // 2. Remove any @ that might be there
            let cleanHandle = rawHandle.replace(/@/g, '').trim();
            // 3. Add exactly one @ for display
            let finalHandleDisplay = "@" + cleanHandle;

            // Fill Data
            document.getElementById('r_name').textContent = creator["Creator Name"] || "Creator";
            document.getElementById('r_id').textContent = finalHandleDisplay; // <--- FIXED
            document.getElementById('r_batch').textContent = creator["Batch No"] || "Batch B1";
            document.getElementById('r_rank').textContent = "#" + (creator["Rank"] || "-");

            const scoreReach = creator["Reach Score (40)"] || 0;
            const scoreEng = creator["Engagement Score (30)"] || 0;
            const scoreCreat = creator["Creativity Score (20)"] || 0;
            const scoreDisc = creator["Discipline Score (10)"] || 0;
            const scoreFinal = creator["Final Score (100)"] || 0;

            document.getElementById('r_reach').textContent = scoreReach;
            document.getElementById('r_engagement').textContent = scoreEng;
            document.getElementById('r_creativity').textContent = scoreCreat;
            document.getElementById('r_discipline').textContent = scoreDisc;
            document.getElementById('r_final').textContent = scoreFinal + "/100";

            document.getElementById('r_views').textContent = creator["Total Views"] || 0;
            document.getElementById('r_eng_total').textContent = creator["Total Engagement"] || 0;

            // Show Result
            resultSheet.style.display = 'block';
            actionArea.style.display = 'block';

            // Animate
            setTimeout(() => {
                document.getElementById('bar_reach').style.width = ((scoreReach / 40) * 100) + "%";
                document.getElementById('bar_engagement').style.width = ((scoreEng / 30) * 100) + "%";
                document.getElementById('bar_creativity').style.width = ((scoreCreat / 20) * 100) + "%";
                document.getElementById('bar_discipline').style.width = ((scoreDisc / 10) * 100) + "%";
            }, 100);

            resultSheet.scrollIntoView({ behavior: 'smooth' });
            triggerConfetti();

        } else {
            errorMessage.style.display = 'block';
        }

    } catch (error) {
        console.error('Data Error:', error);
        alert('System Error. Please check data.json file.');
    }
}

function triggerConfetti() {
    var duration = 3000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };
    function random(min, max) { return Math.random() * (max - min) + min; }
    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      var particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}
