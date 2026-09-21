// js/search.js

const destinations = [
    { name: "Marrakech", url: "marrakech.html", tags: ["marrakech", "rouge", "sud", "jamaa el fna", "palmeraie"] },
    { name: "Fès", url: "fes.html", tags: ["fes", "fès", "medina", "culture", "artisanat", "nord"] },
    { name: "Chefchaouen", url: "chefchaouen.html", tags: ["chefchaouen", "bleu", "montagne", "rif"] },
    { name: "Tanger", url: "tanger.html", tags: ["tanger", "mer", "detroit", "nord"] }
];

function searchDestinations() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    if (input.length < 1) {
        resultsContainer.style.display = 'none';
        return;
    }

    const filtered = destinations.filter(dest => 
        dest.name.toLowerCase().includes(input) || 
        dest.tags.some(tag => tag.includes(input))
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
    if (!document.getElementById('searchInput').contains(e.target)) {
        document.getElementById('searchResults').style.display = 'none';
    }
});
