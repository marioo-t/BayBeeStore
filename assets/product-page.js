document.addEventListener('DOMContentLoaded', async () => {
    const api = window.BayBeeCatalog;
    const rootPrefix = api.getRootPrefix();
    const slug = document.body?.dataset?.productSlug || new URLSearchParams(window.location.search).get('slug');

    const state = {
        product: null,
        selectedSize: '',
        selectedColor: '',
        quantity: 1,
    };

    const elements = {
        pageTitle: document.getElementById('pageTitle'),
        breadcrumbCategoryLink: document.getElementById('breadcrumbCategoryLink'),
        breadcrumbCategoryName: document.getElementById('breadcrumbCategoryName'),
        breadcrumbProductName: document.getElementById('breadcrumbProductName'),
        productName: document.getElementById('productName'),
        productBadge: document.getElementById('productBadge'),
        productPrice: document.getElementById('productPrice'),
        productDescription: document.getElementById('productDescription'),
        mainImage: document.getElementById('mainImage'),
        thumbnailGallery: document.getElementById('thumbnailGallery'),
        sizeWrapper: document.getElementById('sizeSelectorWrapper'),
        sizeSelector: document.getElementById('sizeSelector'),
        colorWrapper: document.getElementById('colorSelectorWrapper'),
        colorSelector: document.getElementById('colorSelector'),
        quantityInput: document.getElementById('quantity'),
        productDetailsList: document.getElementById('productDetailsList'),
        sectionsWrapper: document.getElementById('dynamicSectionsWrapper'),
        sections: document.getElementById('dynamicSections'),
        relatedGrid: document.getElementById('relatedProductsGrid'),
        message: document.getElementById('productMessage'),
        buyNowButton: document.getElementById('buyNowButton'),
        addToCartButton: document.getElementById('addToCartButton'),
    };

    function showMessage(text) {
        if (!elements.message) return;
        elements.message.textContent = text;
        elements.message.classList.remove('hidden');
        clearTimeout(showMessage.timeoutId);
        showMessage.timeoutId = setTimeout(() => {
            elements.message.classList.add('hidden');
        }, 3000);
    }

    function setMainImage(src, alt) {
        elements.mainImage.src = src;
        elements.mainImage.alt = alt || state.product?.name || 'Product image';
    }

    function renderImages(product) {
        const images = (product.images && product.images.length ? product.images : ['images/feature.jpg'])
            .map((path) => api.resolvePath(path, rootPrefix));

        setMainImage(images[0], product.name);
        elements.thumbnailGallery.innerHTML = images.map((image, index) => `
            <button type="button" class="thumbnail-btn bg-brandDark rounded-lg overflow-hidden hover:ring-2 hover:ring-brandYellow transition-all aspect-square ${index === 0 ? 'ring-2 ring-brandYellow' : ''}" data-index="${index}">
                <img src="${image}" alt="${api.escapeHtml(product.name)} image ${index + 1}" class="w-full h-full object-cover" onerror="this.src='${api.resolvePath('images/feature.jpg', rootPrefix)}'" />
            </button>
        `).join('');

        elements.thumbnailGallery.querySelectorAll('.thumbnail-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const index = Number(button.dataset.index || 0);
                setMainImage(images[index], product.name);
                elements.thumbnailGallery.querySelectorAll('.thumbnail-btn').forEach((thumb) => thumb.classList.remove('ring-2', 'ring-brandYellow'));
                button.classList.add('ring-2', 'ring-brandYellow');
            });
        });
    }

    function renderSizes(product) {
        const sizes = Array.isArray(product.sizes) ? product.sizes.filter(Boolean) : [];
        if (!sizes.length) {
            elements.sizeWrapper.classList.add('hidden');
            return;
        }

        elements.sizeWrapper.classList.remove('hidden');
        elements.sizeSelector.innerHTML = sizes.map((size) => `
            <button type="button" class="size-btn px-5 py-3 border border-white/20 rounded-lg hover:border-brandYellow hover:bg-brandYellow hover:text-brandDeepDark transition-colors font-semibold" data-size="${api.escapeHtml(size)}">${api.escapeHtml(size)}</button>
        `).join('');

        elements.sizeSelector.querySelectorAll('.size-btn').forEach((button) => {
            button.addEventListener('click', () => {
                state.selectedSize = button.dataset.size || '';
                elements.sizeSelector.querySelectorAll('.size-btn').forEach((item) => item.classList.remove('bg-brandYellow', 'text-brandDeepDark', 'border-brandYellow'));
                button.classList.add('bg-brandYellow', 'text-brandDeepDark', 'border-brandYellow');
            });
        });
    }

    function renderColors(product) {
        const colors = Array.isArray(product.colors) ? product.colors.filter((item) => item && item.name) : [];
        if (!colors.length) {
            elements.colorWrapper.classList.add('hidden');
            return;
        }

        elements.colorWrapper.classList.remove('hidden');
        elements.colorSelector.innerHTML = colors.map((color) => `
            <button type="button" class="color-btn w-12 h-12 rounded-full border-2 border-white/20 hover:border-brandYellow transition-all" data-color="${api.escapeHtml(color.name)}" style="background:${api.escapeHtml(color.hex || '#ffffff')}" title="${api.escapeHtml(color.name)}"></button>
        `).join('');

        elements.colorSelector.querySelectorAll('.color-btn').forEach((button) => {
            button.addEventListener('click', () => {
                state.selectedColor = button.dataset.color || '';
                elements.colorSelector.querySelectorAll('.color-btn').forEach((item) => item.classList.remove('ring-2', 'ring-brandYellow'));
                button.classList.add('ring-2', 'ring-brandYellow');
            });
        });
    }

    function renderDetails(product) {
        const details = [
            ['Material', product.material],
            ['Made in', product.country],
            ['Care', product.care],
            ['SKU', product.sku],
        ].filter(([, value]) => Boolean(value));

        elements.productDetailsList.innerHTML = details.map(([label, value]) => `
            <li class="flex"><span class="text-brandYellow mr-2">•</span><span><strong>${api.escapeHtml(label)}:</strong> ${api.escapeHtml(value)}</span></li>
        `).join('');
    }

    function renderSections(product) {
        const sections = Array.isArray(product.sections) ? product.sections : [];
        if (!sections.length) {
            elements.sectionsWrapper.classList.add('hidden');
            return;
        }

        elements.sectionsWrapper.classList.remove('hidden');
        elements.sections.innerHTML = sections.map((section) => {
            const title = section.title ? `<h3 class="text-2xl md:text-3xl font-bold mb-6">${api.escapeHtml(section.title)}</h3>` : '';

            if (section.type === 'cards') {
                const items = (section.items || []).map((item) => `
                    <article class="bg-brandGrey rounded-2xl p-6 border border-white/10">
                        <h4 class="text-lg font-bold mb-3 text-brandYellow">${api.escapeHtml(item.title || '')}</h4>
                        <p class="text-gray-300 leading-relaxed">${api.escapeHtml(item.text || '')}</p>
                    </article>
                `).join('');

                return `
                    <section class="mb-12">
                        ${title}
                        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${items}</div>
                    </section>
                `;
            }

            if (section.type === 'bullets') {
                const items = (section.items || []).map((item) => `<li class="flex items-start gap-3"><span class="text-brandYellow mt-1">•</span><span class="text-gray-300">${api.escapeHtml(item)}</span></li>`).join('');
                return `
                    <section class="mb-12 bg-brandGrey rounded-2xl p-8 border border-white/10">
                        ${title}
                        <ul class="space-y-4">${items}</ul>
                    </section>
                `;
            }

            if (section.type === 'faq') {
                const items = (section.items || []).map((item) => `
                    <details class="bg-brandGrey rounded-2xl p-6 border border-white/10 group">
                        <summary class="cursor-pointer font-bold text-lg list-none flex items-center justify-between gap-4">
                            <span>${api.escapeHtml(item.q || '')}</span>
                            <span class="text-brandYellow">+</span>
                        </summary>
                        <p class="text-gray-300 leading-relaxed mt-4">${api.escapeHtml(item.a || '')}</p>
                    </details>
                `).join('');
                return `
                    <section class="mb-12">
                        ${title}
                        <div class="space-y-4">${items}</div>
                    </section>
                `;
            }

            const paragraphs = (section.paragraphs || []).map((paragraph) => `<p class="text-gray-300 leading-relaxed mb-4">${api.escapeHtml(paragraph)}</p>`).join('');
            return `
                <section class="mb-12 bg-brandGrey rounded-2xl p-8 border border-white/10">
                    ${title}
                    ${paragraphs}
                </section>
            `;
        }).join('');
    }

    function renderRelatedProducts(catalog, product) {
        const relatedProducts = api.getProductsByCategory(catalog, product.category)
            .filter((item) => item.slug !== product.slug)
            .slice(0, 4);

        elements.relatedGrid.innerHTML = relatedProducts.length
            ? relatedProducts.map((item) => api.renderProductCard(item, { rootPrefix })).join('')
            : '<p class="text-gray-400 col-span-full text-center">No related products available yet.</p>';
    }

    function validateSelections() {
        if (!state.product) return false;
        if ((state.product.sizes || []).length && !state.selectedSize) {
            showMessage('Please select a size.');
            return false;
        }
        if ((state.product.colors || []).length && !state.selectedColor) {
            showMessage('Please select a color.');
            return false;
        }
        return true;
    }

    function bindQuantityControls() {
        document.getElementById('increaseQty')?.addEventListener('click', () => {
            state.quantity += 1;
            elements.quantityInput.value = state.quantity;
        });

        document.getElementById('decreaseQty')?.addEventListener('click', () => {
            state.quantity = Math.max(1, state.quantity - 1);
            elements.quantityInput.value = state.quantity;
        });
    }

    function bindActionButtons() {
        elements.addToCartButton?.addEventListener('click', () => {
            if (!validateSelections()) return;
            showMessage(`Added ${state.quantity} × ${state.product.name} to cart.`);
        });

        elements.buyNowButton?.addEventListener('click', () => {
            if (!validateSelections()) return;
            showMessage(`Buy now flow ready for ${state.product.name}.`);
        });
    }

    try {
        const catalog = await api.loadCatalog(rootPrefix);
        const product = api.findProductBySlug(catalog, slug);

        if (!product) {
            document.getElementById('productPageContent').innerHTML = '<div class="max-w-3xl mx-auto py-24 text-center"><h1 class="text-4xl font-bold mb-4">Product not found</h1><p class="text-gray-400">Check the slug in the HTML wrapper or add the product to data/products.json.</p></div>';
            return;
        }

        state.product = product;
        elements.pageTitle.textContent = `${product.name} | Bay Bee Store`;
        document.title = `${product.name} | Bay Bee Store`;
        elements.productName.textContent = product.name;
        elements.breadcrumbProductName.textContent = product.name;
        elements.productPrice.textContent = api.formatPrice(product.price, product.currency);
        elements.productDescription.textContent = product.description || product.shortDescription || '';
        elements.breadcrumbCategoryName.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
        elements.breadcrumbCategoryLink.href = api.resolvePath(`categories/${product.category}.html`, rootPrefix);

        if (product.badge) {
            elements.productBadge.textContent = product.badge;
            elements.productBadge.classList.remove('hidden');
        }

        renderImages(product);
        renderSizes(product);
        renderColors(product);
        renderDetails(product);
        renderSections(product);
        renderRelatedProducts(catalog, product);
        bindQuantityControls();
        bindActionButtons();
    } catch (error) {
        console.error(error);
        document.getElementById('productPageContent').innerHTML = `<div class="max-w-3xl mx-auto py-24 text-center"><h1 class="text-4xl font-bold mb-4">Catalog error</h1><p class="text-gray-400">${api.escapeHtml(error.message)}</p></div>`;
    }
});
