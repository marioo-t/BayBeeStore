document.addEventListener('DOMContentLoaded', async () => {
    const api = window.BayBeeCatalog;
    const rootPrefix = api.getRootPrefix();
    const categorySlug = document.body?.dataset?.category || 'style';
    const grid = document.getElementById('productsGrid');
    const filters = document.getElementById('filtersBar');
    const noProducts = document.getElementById('noProducts');
    const sortSelect = document.getElementById('sortProducts');

    let allProducts = [];
    let activeFilter = 'all';
    let activeSort = 'featured';

    function sortProducts(products) {
        const cloned = [...products];
        switch (activeSort) {
            case 'price-low':
                cloned.sort((a, b) => Number(a.price) - Number(b.price));
                break;
            case 'price-high':
                cloned.sort((a, b) => Number(b.price) - Number(a.price));
                break;
            case 'name':
                cloned.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }
        return cloned;
    }

    function renderGrid() {
        const filtered = allProducts.filter((product) => activeFilter === 'all' || product.subcategory === activeFilter);
        const finalProducts = sortProducts(filtered);
        grid.innerHTML = finalProducts.map((product) => api.renderProductCard(product, { rootPrefix })).join('');
        noProducts.classList.toggle('hidden', finalProducts.length > 0);
    }

    function renderFilters(subcategories) {
        const buttons = ['<button type="button" class="filter-btn px-6 py-2 bg-brandYellow text-brandDeepDark rounded-lg font-semibold" data-filter="all">All Products</button>']
            .concat(subcategories.map((subcategory) => `
                <button type="button" class="filter-btn px-6 py-2 bg-brandDark rounded-lg hover:bg-brandYellow hover:text-brandDeepDark transition-colors font-semibold" data-filter="${api.escapeHtml(subcategory)}">${api.escapeHtml(subcategory.replace(/-/g, ' '))}</button>
            `));
        filters.innerHTML = buttons.join('');

        filters.querySelectorAll('.filter-btn').forEach((button) => {
            button.addEventListener('click', () => {
                activeFilter = button.dataset.filter || 'all';
                filters.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('bg-brandYellow', 'text-brandDeepDark'));
                button.classList.add('bg-brandYellow', 'text-brandDeepDark');
                renderGrid();
            });
        });
    }

    try {
        const catalog = await api.loadCatalog(rootPrefix);
        const categoryMeta = api.getCategoryMeta(catalog, categorySlug);
        allProducts = api.getProductsByCategory(catalog, categorySlug);

        document.getElementById('categoryTitle').textContent = categoryMeta?.name || categorySlug;
        document.getElementById('categoryDescription').textContent = categoryMeta?.description || 'Category ready to be fed from the catalog JSON.';
        document.getElementById('categoryCount').textContent = `${allProducts.length} Products`;
        document.title = `${categoryMeta?.name || categorySlug} | Bay Bee Store`;

        const badges = categoryMeta?.heroBadges || [];
        const badgesContainer = document.getElementById('categoryBadges');
        badgesContainer.innerHTML = badges.map((badge, index) => `
            <span class="px-4 py-2 ${index === 0 ? 'bg-brandYellow/20 text-brandYellow' : 'bg-white/10 text-white'} rounded-full text-sm font-semibold">${api.escapeHtml(badge)}</span>
        `).join('');

        renderFilters([...new Set(allProducts.map((product) => product.subcategory).filter(Boolean))]);
        renderGrid();

        sortSelect?.addEventListener('change', (event) => {
            activeSort = event.target.value;
            renderGrid();
        });
    } catch (error) {
        console.error(error);
        grid.innerHTML = `<p class="text-center col-span-full text-gray-400">${api.escapeHtml(error.message)}</p>`;
    }
});
