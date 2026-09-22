document.addEventListener("DOMContentLoaded", function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    const currentPath = window.location.pathname;
    const isStays = currentPath.includes('stays.html');
    const isDestinations = currentPath.includes('destinations.html');
    const isRestaurants = currentPath.includes('restaurants.html');
    const isExperiences = currentPath.includes('experiences.html');
    const isGuide = currentPath.includes('guide.html');
    const isContact = currentPath.includes('contact.html');

    // Helper pour générer les classes CSS actives desktop
    const getLinkClass = (isActive) => {
        return isActive ? "text-vert font-bold transition" : "text-sombre/80 hover:text-vert transition";
    };

    // Helper pour les liens mobiles (flex avec SVG)
    const getMobileLinkClass = (isActive) => {
        return isActive ? "flex items-center gap-3 py-2.5 px-3 rounded-xl bg-vert/10 text-vert font-bold transition" : "flex items-center gap-3 py-2.5 px-3 rounded-xl text-sombre/80 hover:bg-vert/5 hover:text-vert transition";
    };

    headerPlaceholder.innerHTML = `
    <header class="sticky top-0 z-50 bg-creme/90 backdrop-blur-md border-b border-sable/10 transition-all">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <!-- Logo -->
            <a class="flex items-center gap-3 group shrink-0" href="index.html">
                <img alt="MoroccoTripMap Logo" class="h-12 sm:h-14 w-auto object-contain" src="images/logo.webp"/>
                <div class="hidden sm:flex flex-col">
                    <span class="text-2xl font-bold tracking-tight text-sombre leading-none group-hover:text-vert transition">Morocco<span class="text-vert">TripMap</span></span>
                </div>
            </a>
            
            <!-- Desktop Nav -->
            <nav class="hidden lg:flex items-center gap-6 text-sm font-medium">
                <a class="${getLinkClass(isDestinations)}" href="index.html#destinations">Destinations</a>
                <a class="${getLinkClass(isStays)}" href="stays.html">Stays</a>
                <a class="${getLinkClass(isRestaurants)}" href="index.html#restaurants">Restaurants</a>
                <a class="${getLinkClass(isExperiences)}" href="index.html#experiences">Experiences</a>
                <a class="${getLinkClass(isGuide)}" href="guide.html">Guide Pratique</a>
                <a class="${getLinkClass(isContact)}" href="contact.html">Contact</a>
            </nav>

            <!-- CTA Desktop ou Bouton Mobile -->
            <div class="flex items-center gap-3">
                <a href="stays.html" class="hidden sm:inline-flex bg-vert text-creme px-4 py-2 rounded-xl text-xs font-semibold hover:bg-vert/90 transition shadow-sm">
                    Explorer les Riads
                </a>
                <!-- Menu Mobile Button -->
                <button aria-label="Toggle mobile menu" class="lg:hidden bg-white p-2.5 rounded-xl border border-sable/20 text-sombre hover:text-vert transition flex items-center justify-center shadow-sm" id="mobile-menu-button" type="button">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                </button>
            </div>
        </div>

        <!-- Mobile Menu Drawer -->
        <div class="hidden lg:hidden absolute top-20 left-0 w-full bg-creme/98 backdrop-blur-lg border-b border-sable/15 shadow-xl px-6 py-6 transition-all" id="mobile-menu">
            <nav class="flex flex-col gap-2 text-base font-medium">
                <!-- Destinations -->
                <a class="${getMobileLinkClass(isDestinations)}" href="index.html#destinations">
                    <svg class="w-5 h-5 text-vert shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>Destinations</span>
                </a>
                <!-- Stays -->
                <a class="${getMobileLinkClass(isStays)}" href="stays.html">
                    <svg class="w-5 h-5 text-vert shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    <span>Stays & Riads</span>
                </a>
                <!-- Restaurants -->
                <a class="${getMobileLinkClass(isRestaurants)}" href="index.html#restaurants">
                    <svg class="w-5 h-5 text-vert shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    <span>Restaurants</span>
                </a>
                <!-- Experiences -->
                <a class="${getMobileLinkClass(isExperiences)}" href="index.html#experiences">
                    <svg class="w-5 h-5 text-vert shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Experiences</span>
                </a>
                <!-- Guide Pratique -->
                <a class="${getMobileLinkClass(isGuide)}" href="guide.html">
                    <svg class="w-5 h-5 text-vert shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    <span>Guide Pratique</span>
                </a>
                <!-- Contact -->
                <a class="${getMobileLinkClass(isContact)}" href="contact.html">
                    <svg class="w-5 h-5 text-vert shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <span>Contact</span>
                </a>
                
                <div class="pt-4 mt-2 border-t border-sable/15">
                    <a href="stays.html" class="block text-center w-full bg-vert text-creme py-3 rounded-xl font-semibold text-sm hover:bg-vert/90 transition shadow-md">
                        Explorer les Riads
                    </a>
                </div>
            </nav>
        </div>
    </header>
    `;

    // Logique d'ouverture / fermeture fluide du menu mobile
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        // Fermer le menu si on clique en dehors
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
});
