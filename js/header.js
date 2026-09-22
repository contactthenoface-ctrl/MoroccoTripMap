document.addEventListener("DOMContentLoaded", function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    // Détecte la page active pour styliser le lien dans le menu
    const currentPath = window.location.pathname;
    const isStays = currentPath.includes('stays.html');

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
            <nav class="hidden md:flex items-center gap-8 text-base font-medium text-sombre/80">
                <a class="hover:text-vert transition" href="index.html#destinations">Destinations</a>
                <a class="${isStays ? 'text-vert font-bold' : 'hover:text-vert'} transition" href="stays.html">Stays</a>
                <a class="hover:text-vert transition" href="index.html#restaurants">Restaurants</a>
                <a class="hover:text-vert transition" href="index.html#experiences">Experiences</a>
            </nav>
            <!-- Menu Mobile Button -->
            <div class="flex items-center gap-2">
                <button aria-label="Toggle mobile menu" class="md:hidden bg-white p-2 rounded-xl border border-sable/20 text-sombre hover:text-vert transition flex items-center justify-center" id="mobile-menu-button" type="button">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                </button>
            </div>
        </div>
        <!-- Mobile Menu Drawer -->
        <div class="hidden md:hidden absolute top-20 left-0 w-full bg-creme/95 backdrop-blur-md border-b border-sable/15 shadow-lg px-6 py-6 transition-all" id="mobile-menu">
            <nav class="flex flex-col gap-4 text-base font-medium text-sombre/80">
                <a class="hover:text-vert transition py-1" href="index.html#destinations">Destinations</a>
                <a class="${isStays ? 'text-vert font-bold' : 'hover:text-vert'} transition py-1" href="stays.html">Stays</a>
                <a class="hover:text-vert transition py-1" href="index.html#restaurants">Restaurants</a>
                <a class="hover:text-vert transition py-1" href="index.html#experiences">Experiences</a>
            </nav>
        </div>
    </header>
    `;

    // Logique interactive du menu burger
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});
