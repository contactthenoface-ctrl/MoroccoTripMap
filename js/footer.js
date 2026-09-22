document.addEventListener("DOMContentLoaded", function() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    footerPlaceholder.innerHTML = `
    <footer class="bg-sombre text-creme/80 border-t border-sable/15 pt-12 pb-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <!-- Brand / About -->
                <div class="md:col-span-1 space-y-4">
                    <div class="flex items-center gap-3">
                        <img alt="MoroccoTripMap Logo" class="h-10 w-auto object-contain brightness-0 invert" src="images/logo.webp"/>
                        <span class="text-xl font-bold text-creme tracking-tight">Morocco<span class="text-vert">TripMap</span></span>
                    </div>
                    <p class="text-sm text-creme/60 leading-relaxed">
                        Votre guide de voyage ultime et annuaire touristique immersif au Maroc. Découvrez les plus beaux riads, tables et expériences.
                    </p>
                </div>

                <!-- Navigation Links -->
                <div>
                    <h4 class="text-creme font-semibold text-sm uppercase tracking-wider mb-4">Explorer</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="index.html#destinations" class="hover:text-vert transition">Destinations</a></li>
                        <li><a href="stays.html" class="hover:text-vert transition">Stays & Riads</a></li>
                        <li><a href="index.html#restaurants" class="hover:text-vert transition">Restaurants</a></li>
                        <li><a href="index.html#experiences" class="hover:text-vert transition">Experiences</a></li>
                    </ul>
                </div>

                <!-- Resources -->
                <div>
                    <h4 class="text-creme font-semibold text-sm uppercase tracking-wider mb-4">Informations</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="guide.html" class="hover:text-vert transition">Guide Pratique</a></li>
                        <li><a href="contact.html" class="hover:text-vert transition">Contact & Partenariats</a></li>
                    </ul>
                </div>

                <!-- Social / Community -->
                <div>
                    <h4 class="text-creme font-semibold text-sm uppercase tracking-wider mb-4">Suivez-nous</h4>
                    <p class="text-sm text-creme/60 mb-4">Rejoignez notre communauté de voyageurs sur notre chaîne YouTube.</p>
                    <a href="https://youtube.com/@moroccotripmap" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-vert text-creme px-4 py-2 rounded-xl text-sm font-semibold hover:bg-vert/90 transition shadow-sm">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        <span>@moroccotripmap</span>
                    </a>
                </div>
            </div>

            <!-- Copyright -->
            <div class="border-t border-sable/15 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-creme/50">
                <p>&copy; 2026 MoroccoTripMap. Tous droits réservés.</p>
                <p class="mt-2 sm:mt-0">Conçu avec passion pour les amoureux du Maroc.</p>
            </div>
        </div>
    </footer>
    `;
});
