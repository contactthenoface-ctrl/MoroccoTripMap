// js/search.js

const destinations = [
    { name: "Marrakech", arabicName: "مراكش", url: "marrakech.html", tags: ["marrakech", "rouge", "sud", "jamaa el fna", "palmeraie", "مراكش", "مدينة"] },
    { name: "Fès", arabicName: "فاس", url: "fes.html", tags: ["fes", "fès", "medina", "culture", "artisanat", "nord", "فاس"] },
    { name: "Chefchaouen", arabicName: "شفشاون", url: "chefchaouen.html", tags: ["chefchaouen", "bleu", "montagne", "rif", "شفشاون", "المدينة الزرقاء"] },
    { name: "Tanger", arabicName: "طنجة", url: "tanger.html", tags: ["tanger", "mer", "detroit", "nord", "طنجة"] }
];

function searchDestinations() {
    const input = document.getElementById('searchInput').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    if (input.length < 1) {
        resultsContainer.style.display = 'none';
        return;
    }

    const filtered = destinations.filter(dest => 
        dest.name.toLowerCase().includes(input) || 
        (dest.arabicName && dest.arabicName.includes(input)) ||
        dest.tags.some(tag => tag.toLowerCase().includes(input))
    );

    if (filtered.length > 0) {
        filtered.forEach(dest => {
            const link = document.createElement('a');
            link.href = dest.url;
            link.textContent = dest.name + " 🔗";
            resultsContainer.appendChild(link);
        });
        resultsContainer.style.display = 'block';
    } else {
        resultsContainer.style.display = 'none';
    }
}

document.addEventListener('click', function(e) {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    if (searchInput && searchResults && !searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});
