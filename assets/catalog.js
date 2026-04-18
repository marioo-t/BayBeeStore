(function () {
    function getRootPrefix() {
        return document.body?.dataset?.rootPrefix || '';
    }

    async function loadCatalog(rootPrefix = '') {
        const response = await fetch(`${rootPrefix}data/products.json`);
        if (!response.ok) {
            throw new Error(`Could not load catalog JSON: ${response.status}`);
        }
        return response.json();
    }

    function resolvePath(path, rootPrefix = '') {
        if (!path) return '';
        if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
        return `${rootPrefix}${String(path).replace(/^\/+/, '')}`;
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatPrice(value, currency = 'USD') {
        const amount = Number(value || 0);
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
                minimumFractionDigits: 2,
            }).format(amount);
        } catch (error) {
            return `$${amount.toFixed(2)}`;
        }
    }

    function findProductBySlug(catalog, slug) {
        return catalog?.products?.find((product) => product.slug === slug) || null;
    }

    function getProductsByCategory(catalog, category) {
        return (catalog?.products || []).filter((product) => product.category === category);
    }

    function getCategoryMeta(catalog, category) {
        return catalog?.categories?.[category] || null;
    }

    function renderProductCard(product, options = {}) {
        const rootPrefix = options.rootPrefix || '';
        const price = formatPrice(product.price, product.currency);
        const href = resolvePath(product.pagePath, rootPrefix);
        const image = resolvePath((product.images && product.images[0]) || 'images/feature.jpg', rootPrefix);
        const badge = product.badge
            ? `<span class="absolute top-4 right-4 px-3 py-1 bg-brandYellow text-brandDeepDark text-xs font-bold rounded-full">${escapeHtml(product.badge)}</span>`
            : '';

        return `
            <a href="${href}" class="product-card group" data-category="${escapeHtml(product.subcategory || 'all')}" data-price="${escapeHtml(product.price)}" data-name="${escapeHtml(product.name)}">
                <div class="bg-brandDark rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] h-full">
                    <div class="aspect-square overflow-hidden bg-brandGrey relative">
                        <img src="${image}" alt="${escapeHtml(product.name)}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.src='${resolvePath('images/feature.jpg', rootPrefix)}'" />
                        ${badge}
                    </div>
                    <div class="p-6 flex flex-col h-[210px]">
                        <div>
                            <p class="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">${escapeHtml(product.subcategory || product.category)}</p>
                            <h3 class="text-lg font-bold text-white mb-2 group-hover:text-brandYellow transition-colors">${escapeHtml(product.name)}</h3>
                            <p class="text-gray-400 text-sm mb-4 line-clamp-3">${escapeHtml(product.shortDescription || '')}</p>
                        </div>
                        <div class="mt-auto flex justify-between items-center gap-3">
                            <span class="text-2xl font-bold text-brandYellow">${price}</span>
                            <span class="px-4 py-2 bg-brandYellow text-brandDeepDark font-semibold rounded-lg">View</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    window.BayBeeCatalog = {
        getRootPrefix,
        loadCatalog,
        resolvePath,
        escapeHtml,
        formatPrice,
        findProductBySlug,
        getProductsByCategory,
        getCategoryMeta,
        renderProductCard,
    };
})();
