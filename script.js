async function searchResult() {
    const rawInput = document.getElementById('searchInput').value.trim();
    const resultSheet = document.getElementById('resultSheet');
    const actionButtons = document.getElementById('actionButtons');
    const errorMessage = document.getElementById('errorMessage');

    // Reset UI
    resultSheet.style.display = 'none';
    actionButtons.style.display = 'none';
    errorMessage.style.display = 'none';

    if (!rawInput) {
        alert("Please enter a Name or Instagram ID.");
        return;
    }

    // Normalize input: Remove '@' and convert to lowercase for comparison
    const searchTerm = rawInput.replace('@', '').toLowerCase();

    try {
        // Add timestamp to prevent caching issues
        const response = await fetch('data.json?t=' + new Date().getTime());
        const data = await response.json();

        // SEARCH LOGIC: Check matches in "Instagram ID" OR "Creator Name"
        const creator = data.find(item => {
            const idMatch = item["Instagram ID"] && item["Instagram ID"].toString().toLowerCase().trim() === searchTerm;
            const nameMatch = item["Creator Name"] && item["Creator Name"].toString().toLowerCase().trim().includes(searchTerm);
            
            return idMatch || nameMatch;
        });

        if (creator) {
            // Fill Data
            document.getElementById('r_name').textContent = creator["Creator Name"] || "-";
            document.getElementById('r_id').textContent = "@" + creator["Instagram ID"];
            document.getElementById('r_batch').textContent = creator["Batch No"] || "N/A";
            document.getElementById('r_rank').textContent = "#" + (creator["Rank"] || "-");

            // Scores
            document.getElementById('r_reach').textContent = creator["Reach Score (40)"] || "0";
            document.getElementById('r_engagement').textContent = creator["Engagement Score (30)"] || "0";
            document.getElementById('r_creativity').textContent = creator["Creativity Score (20)"] || "0";
            document.getElementById('r_discipline').textContent = creator["Discipline Score (10)"] || "0";
            document.getElementById('r_final').textContent = creator["Final Score (100)"] || "0";

            // Show Result & Print Button
            resultSheet.style.display = 'block';
            actionButtons.style.display = 'block';
            
            // Scroll to result for mobile users
            resultSheet.scrollIntoView({ behavior: 'smooth' });
        } else {
            errorMessage.style.display = 'block';
        }

    } catch (error) {
        console.error('Error:', error);
        alert('System Error: Could not load data.json.');
    }
}
