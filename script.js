async function searchResult() {
    const rawInput = document.getElementById('searchInput').value;
    const resultSheet = document.getElementById('resultSheet');
    const actionArea = document.getElementById('actionArea');
    const errorMessage = document.getElementById('errorMessage');

    // Reset UI
    resultSheet.style.display = 'none';
    actionArea.style.display = 'none';
    errorMessage.style.display = 'none';

    if (!rawInput) {
        alert("Please enter a username!");
        return;
    }

    // 1. CLEAN THE INPUT: Remove '@', remove spaces, make lowercase
    // Example: User types " @Rahul_01 " -> becomes "rahul_01"
    const searchTerm = rawInput.replace(/@/g, '').trim().toLowerCase();

    try {
        // Fetch Data
        // We add a timestamp (?t=...) to force the browser to get the latest file
        const response = await fetch('data.json?t=' + new Date().getTime());
        const data = await response.json();

        // 2. FIND THE MATCH
        const creator = data.find(item => {
            // Safety check: make sure the row has an ID
            if (!item["Instagram ID"]) return false;

            // Clean the DATABASE value too
            // Example: Database has "@rahul_01" -> becomes "rahul_01"
            const dbId = item["Instagram ID"].toString().replace(/@/g, '').trim().toLowerCase();

            // Compare cleaned Input vs Cleaned Database Value
            return dbId === searchTerm;
        });

        if (creator) {
            // --- FOUND! POPULATE DATA ---
            
            // Basic Info
            document.getElementById('r_name').textContent = creator["Creator Name"] || "Creator";
            // Show the ID exactly as it is in the database (with @ if it has it)
            document.getElementById('r_id').textContent = creator["Instagram ID"]; 
            document.getElementById('r_batch').textContent = creator["Batch No"] || "Batch B1";
            document.getElementById('r_rank').textContent = "#" + (creator["Rank"] || "-");

            // Scores
            // Using '|| 0' ensures if a cell is empty, it shows 0 instead of blank
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

            // Stats
            document.getElementById('r_views').textContent = creator["Total Views"] || 0;
            document.getElementById('r_eng_total').textContent = creator["Total Engagement"] || 0;

            // --- ANIMATE BARS ---
            resultSheet.style.display = 'block';
            actionArea.style.display = 'block';

            // Wait 100ms for the box to appear, then animate width
            setTimeout(() => {
                document.getElementById('bar_reach').style.width = ((scoreReach / 40) * 100) + "%";
                document.getElementById('bar_engagement').style.width = ((scoreEng / 30) * 100) + "%";
                document.getElementById('bar_creativity').style.width = ((scoreCreat / 20) * 100) + "%";
                document.getElementById('bar_discipline').style.width = ((scoreDisc / 10) * 100) + "%";
            }, 100);

            // Scroll to result
            resultSheet.scrollIntoView({ behavior: 'smooth' });

            // Trigger Confetti
            triggerConfetti();

        } else {
            // Not Found
            errorMessage.style.display = 'block';
        }

    } catch (error) {
        console.error('Data Error:', error);
        alert('Could not load results. Please check your internet or data.json file.');
    }
}

// Confetti Animation Function
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
