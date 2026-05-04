// Swiper is loaded globally from vendor/swiper-bundle.min.js.

// Shared Swiper defaults used across all sliders.
const sharedSwiperOptions = {
    loop: false,
    spaceBetween: 0,
};

// Fetch the full page schema from a single JSON source.
const fetchPageData = async (path) => {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
    }

    return response.json();
};

// Opening the HTML with file:// usually blocks fetch() for local JSON files.
// Fall back to the generated page-data.js file so PM can open cht.html directly.
const loadPageData = async () => {
    try {
        return await fetchPageData('../data/page.json');
    } catch (error) {
        console.warn('page.json fetch failed, switching to local page-data.js fallback.', error);
        const module = await import('./page-data.js');
        return module.default;
    }
};

// Open navigational links in a new tab while preserving in-page anchors.
const applyExternalLinkTargets = (root = document) => {
    const anchors = Array.from(root.querySelectorAll('a[href]'));

    anchors.forEach((anchorElement) => {
        const rawHref = (anchorElement.getAttribute('href') ?? '').trim();

        if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) {
            anchorElement.removeAttribute('target');
            anchorElement.removeAttribute('rel');
            return;
        }

        anchorElement.target = '_blank';
        anchorElement.rel = 'noopener noreferrer';
    });
};

// Reorder the main sections before the fixed CTA / footer area.
const applySectionOrder = (order = []) => {
    const wrapperBox = document.querySelector('.wrapper-box');
    const fixedPlusPlaceholder = document.querySelector('.fixed-plus-placeholder');

    if (!wrapperBox || !fixedPlusPlaceholder || !Array.isArray(order)) return;

    order.forEach((sectionKey) => {
        const sectionElement = document.querySelector(`#${sectionKey}Section`);

        if (sectionElement) {
            wrapperBox.insertBefore(sectionElement, fixedPlusPlaceholder);
        }
    });
};

// Guard against invalid or duplicated section keys in page.json.
const normalizeSectionOrder = (order = [], availableSections = {}) => {
    if (!Array.isArray(order)) return [];

    const seen = new Set();

    return order.filter((sectionKey) => {
        if (!availableSections[sectionKey]) {
            console.warn(`Unknown section key in order: ${sectionKey}`);
            return false;
        }

        if (seen.has(sectionKey)) {
            console.warn(`Duplicate section key ignored in order: ${sectionKey}`);
            return false;
        }

        seen.add(sectionKey);
        return true;
    });
};

// Alternate white / gray backgrounds based on the rendered section order.
const applyAlternatingSectionBackgrounds = (order = []) => {
    const alternatingSections = order.filter((sectionKey) => sectionKey !== 'banner');

    alternatingSections.forEach((sectionKey, index) => {
        const sectionElement = document.querySelector(`#${sectionKey}Section`);

        if (!sectionElement) return;

        sectionElement.classList.toggle('bg-gray', index % 2 === 1);
    });
};

// Banner renderer.
const renderBanner = (bannerData) => {
    const bannerLink = document.querySelector('#bannerLink');
    const bannerLinkMobile = document.querySelector('#bannerLinkMobile');
    const bannerPcImage = document.querySelector('#bannerPcImage');
    const bannerMobileImage = document.querySelector('#bannerMobileImage');
    const bannerLinks = [bannerLink, bannerLinkMobile].filter(Boolean);

    if (!bannerPcImage || !bannerMobileImage || bannerLinks.length === 0) return;

    bannerLinks.forEach((linkElement) => {
        linkElement.href = bannerData.href;
        linkElement.onclick = null;

        if (typeof bannerData.href === 'string' && bannerData.href.startsWith('#')) {
            linkElement.onclick = (event) => {
                const targetSection = document.querySelector(bannerData.href);

                if (!targetSection) return;

                event.preventDefault();
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            };
        }
    });

    bannerPcImage.src = bannerData.pcImage.src;
    bannerPcImage.alt = bannerData.pcImage.alt;
    bannerMobileImage.src = bannerData.mobileImage.src;
    bannerMobileImage.alt = bannerData.mobileImage.alt;
};

// News slider renderer.
const renderNewsSection = (newsData) => {
    const newsSectionTitle = document.querySelector('#newsSectionTitle');
    const newsSwiperWrapper = document.querySelector('#newsSwiperWrapper');

    if (newsSectionTitle) {
        newsSectionTitle.textContent = newsData.title;
    }

    if (!newsSwiperWrapper) return;

    newsSwiperWrapper.innerHTML = newsData.items.map((item) => `
        <div class="swiper-slide">
            <a href="${item.href}">
                <img src="${item.image.src}" class="img-fluid" alt="${item.image.alt}">
            </a>
        </div>
    `).join('');
};

// Featured slider renderer.
const renderFeaturedSection = (featuredData) => {
    const featuredSectionTitle = document.querySelector('#featuredSectionTitle');
    const featuredSectionLink = document.querySelector('#featuredSectionLink');
    const featuredSwiperWrapper = document.querySelector('#featuredSwiperWrapper');

    if (featuredSectionTitle) {
        featuredSectionTitle.textContent = featuredData.title;
    }

    if (featuredSectionLink) {
        featuredSectionLink.href = featuredData.link.href;
        featuredSectionLink.textContent = featuredData.link.text;
    }

    if (!featuredSwiperWrapper) return;

    featuredSwiperWrapper.innerHTML = featuredData.items.map((item) => `
        <div class="swiper-slide">
            <a href="${item.href}" class="featured-card">
                <div class="featured-img">
                    <img src="${item.image.src}" class="img-fluid" alt="${item.image.alt}">
                </div>
                <div class="featured-title">${item.title}</div>
            </a>
            <div class="featured-num">${item.views}</div>
        </div>
    `).join('');
};

// Author slider renderer.
const renderAuthorSection = (authorData) => {
    const authorSectionTitle = document.querySelector('#authorSectionTitle');
    const authorSectionLead = document.querySelector('#authorSectionLead');
    const authorSectionDesc = document.querySelector('#authorSectionDesc');
    const authorSwiperWrapper = document.querySelector('#authorSwiperWrapper');

    if (authorSectionTitle) {
        authorSectionTitle.textContent = authorData.title;
    }

    if (authorSectionLead) {
        authorSectionLead.textContent = authorData.lead;
    }

    if (authorSectionDesc) {
        authorSectionDesc.textContent = authorData.description;
    }

    if (!authorSwiperWrapper) return;

    authorSwiperWrapper.innerHTML = authorData.items.map((item) => `
        <div class="swiper-slide">
            <a href="${item.href}" class="author-card">
                <img src="${item.image.src}" class="img-fluid" alt="${item.image.alt}">
                <div class="author-info">
                    <div class="author-name">${item.name}</div>
                    <div class="author-type">${item.type}</div>
                </div>
            </a>
        </div>
    `).join('');
};

// CHT slider renderer.
const renderChtSection = (chtData) => {
    const chtSectionTitle = document.querySelector('#chtSectionTitle');
    const chtSwiperWrapper = document.querySelector('#chtSwiperWrapper');

    if (chtSectionTitle) {
        chtSectionTitle.textContent = chtData.title;
    }

    if (!chtSwiperWrapper) return;

    chtSwiperWrapper.innerHTML = chtData.items.map((item) => `
        <div class="swiper-slide">
            <a href="${item.href}" class="cht-card${item.variant ? ` ${item.variant}` : ''}" aria-pressed="false">
                <div class="cht-card-status" aria-hidden="true">已選擇</div>
                <div class="title">${item.title}</div>
                <div class="month">${item.monthPrice} <span>${item.monthUnit}</span></div>
                <div class="price">${item.yearPrice}</div>
                <span class="cht-card-cta">${item.buttonText}</span>
            </a>
        </div>
    `).join('');
};

// Make CHT cards selectable so mobile users can clearly see the chosen plan.
const setupChtCardSelection = () => {
    const chtCards = Array.from(document.querySelectorAll('.cht-card'));

    if (chtCards.length === 0) return;

    const clearSelection = () => {
        chtCards.forEach((cardElement) => {
            cardElement.classList.remove('is-selected');
            cardElement.setAttribute('aria-pressed', 'false');
        });
    };

    const selectCard = (targetCard) => {
        chtCards.forEach((cardElement) => {
            const isSelected = cardElement === targetCard;

            cardElement.classList.toggle('is-selected', isSelected);
            cardElement.setAttribute('aria-pressed', String(isSelected));
        });
    };

    chtCards.forEach((cardElement, index) => {
        cardElement.onclick = (event) => {
            const isSelected = cardElement.classList.contains('is-selected');
            const rawHref = cardElement.getAttribute('href') ?? '';
            const isPlaceholderLink = rawHref === '' || rawHref === '#' || rawHref.startsWith('javascript:');

            if (isPlaceholderLink) {
                event.preventDefault();
            }

            if (isSelected) {
                clearSelection();
                return;
            }

            selectCard(cardElement);
        };

        cardElement.onkeydown = (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;

            event.preventDefault();
            if (cardElement.classList.contains('is-selected')) {
                clearSelection();
                return;
            }

            selectCard(cardElement);
        };
    });
};

// Plus slider renderer.
const renderPlusSection = (plusData) => {
    const plusSectionTitle = document.querySelector('#plusSectionTitle');
    const plusSectionSubtitle = document.querySelector('#plusSectionSubtitle');
    const plusSwiperWrapper = document.querySelector('#plusSwiperWrapper');

    if (plusSectionTitle) {
        plusSectionTitle.childNodes[0].nodeValue = plusData.title;
    }

    if (plusSectionSubtitle) {
        plusSectionSubtitle.textContent = plusData.subtitle;
    }

    if (!plusSwiperWrapper) return;

    plusSwiperWrapper.innerHTML = plusData.items.map((item) => `
        <div class="swiper-slide">
            <div class="plus-card">
                <div class="plus-title">${item.title}</div>
                <div class="plus-desc">${item.description}</div>
                <div class="plus-img">
                    <img src="${item.image.src}" class="img-fluid" alt="${item.image.alt}">
                </div>
            </div>
        </div>
    `).join('');
};

// Process section renderer.
const renderProcessSection = (processData) => {
    const processSectionTitle = document.querySelector('#processSectionTitle');
    const processPcImage = document.querySelector('#processPcImage');
    const processMobileImage = document.querySelector('#processMobileImage');

    if (processSectionTitle) {
        processSectionTitle.textContent = processData.title;
    }

    if (processPcImage) {
        processPcImage.src = processData.pcImage.src;
        processPcImage.alt = processData.pcImage.alt;
    }

    if (processMobileImage) {
        processMobileImage.src = processData.mobileImage.src;
        processMobileImage.alt = processData.mobileImage.alt;
    }
};

// FAQ accordion renderer.
const renderQaSection = (qaData) => {
    const qaSectionTitle = document.querySelector('#qaSectionTitle');
    const qaAccordion = document.querySelector('#accordionExample');

    if (qaSectionTitle) {
        qaSectionTitle.textContent = qaData.title;
    }

    if (!qaAccordion) return;

    const renderRichParts = (parts = []) => parts.map((part) => {
        if (!part) return '';

        if (part.type === 'link') {
            return `<a href="${part.href}">${part.text}</a>`;
        }

        return part.text ?? '';
    }).join('');

    const renderQaBlock = (block) => {
        if (!block) return '';

        if (block.type === 'heading') {
            return `<p>${block.parts?.length ? renderRichParts(block.parts) : (block.text ?? '')}</p>`;
        }

        if (block.type === 'list') {
            const items = (block.items ?? []).map((item) => {
                const content = typeof item === 'string'
                    ? item
                    : (item.parts?.length ? renderRichParts(item.parts) : (item.text ?? ''));

                return `<li>${content}</li>`;
            }).join('');

            return `<ul>${items}</ul>`;
        }

        const prefix = block.prefix ? `<strong>${block.prefix}</strong>` : '';
        const content = block.parts?.length ? renderRichParts(block.parts) : (block.text ?? '');
        return `${prefix}<p>${content}</p>`;
    };

    qaAccordion.innerHTML = qaData.items.map((item, index) => {
        const collapseId = `qaCollapse${index + 1}`;
        const headingId = `qaHeading${index + 1}`;
        const isOpen = index === 0;
        const isHidden = index >= qaData.initialVisibleCount;
        const questionLabel = [item.questionNumber, item.questionPrefix, item.question]
            .filter(Boolean)
            .join(' ');
        const answerBlocks = item.answerBlocks?.length
            ? item.answerBlocks
            : [{
                type: 'paragraph',
                prefix: item.label,
                text: item.answer,
            }];

        return `
            <div class="accordion-item qa-item${isHidden ? ' qa-hidden' : ''}">
                <h2 class="accordion-header" id="${headingId}">
                    <button
                        class="accordion-button${isOpen ? '' : ' collapsed'}"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#${collapseId}"
                        aria-expanded="${isOpen ? 'true' : 'false'}"
                        aria-controls="${collapseId}"
                    >
                        ${questionLabel}
                    </button>
                </h2>
                <div
                    id="${collapseId}"
                    class="accordion-collapse collapse${isOpen ? ' show' : ''}"
                    aria-labelledby="${headingId}"
                    data-bs-parent="#accordionExample"
                >
                    <div class="accordion-body">
                        ${answerBlocks.map((block) => renderQaBlock(block)).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

// Bottom fixed CTA renderer.
const renderFixedPlus = (fixedPlusData) => {
    const fixedPlusLink = document.querySelector('#fixedPlusLink');

    if (!fixedPlusLink) return;

    fixedPlusLink.href = fixedPlusData.href;
    fixedPlusLink.textContent = fixedPlusData.text;
};

// Footer renderer.
const renderFooter = (footerData) => {
    const pageFooter = document.querySelector('#pageFooter');

    if (!pageFooter) return;

    if (footerData.height) {
        pageFooter.style.height = footerData.height;
    }

    pageFooter.textContent = footerData.text;
};

// Breakpoints for each slider section.
const newsBreakpoints = {
    0: { slidesPerView: 1.2, spaceBetween: 20 },
    640: { slidesPerView: 2, spaceBetween: 20 },
    768: { slidesPerView: 2.3, spaceBetween: 20 },
    1024: { slidesPerView: 3.4, spaceBetween: 20 },
};

const featuredBreakpoints = {
    0: { slidesPerView: 1.4, spaceBetween: 20 },
    640: { slidesPerView: 1.2, spaceBetween: 20 },
    768: { slidesPerView: 2.6, spaceBetween: 20 },
    1024: { slidesPerView: 4.4, spaceBetween: 20 },
};

const authorBreakpoints = {
    0: { slidesPerView: 1.8, spaceBetween: 20 },
    640: { slidesPerView: 2, spaceBetween: 20 },
    768: { slidesPerView: 2.3, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 20 },
};

const chtBreakpoints = {
    0: {
        slidesPerView: 1,
        spaceBetween: 20,
        grid: { rows: 3, fill: 'row' },
    },
    640: {
        slidesPerView: 2,
        spaceBetween: 20,
        grid: { rows: 1, fill: 'row' },
    },
    768: {
        slidesPerView: 2.2,
        spaceBetween: 20,
        grid: { rows: 1, fill: 'row' },
    },
    1024: {
        slidesPerView: 3,
        spaceBetween: 20,
        grid: { rows: 1, fill: 'row' },
    },
};

const plusBreakpoints = {
    0: {
        slidesPerView: 1.35,
        spaceBetween: 20,
        grid: { rows: 2, fill: 'row' },
    },
    640: {
        slidesPerView: 2,
        spaceBetween: 20,
        grid: { rows: 1, fill: 'row' },
    },
    768: {
        slidesPerView: 2.2,
        spaceBetween: 20,
        grid: { rows: 1, fill: 'row' },
    },
    1024: {
        slidesPerView: 4,
        spaceBetween: 20,
        grid: { rows: 1, fill: 'row' },
    },
};

// Create a Swiper instance within one section and bind its local controls.
const initSectionSwiper = (sectionId, swiperSelector, options = {}) => {
    const section = document.querySelector(sectionId);

    if (!section) return;

    const swiperElement = section.querySelector(swiperSelector);
    const prevButton = section.querySelector('.swiper-button-prev');
    const nextButton = section.querySelector('.swiper-button-next');
    const paginationElement = section.querySelector('.swiper-pagination');

    if (!swiperElement) return;

    const swiperConfig = {
        ...sharedSwiperOptions,
        ...options,
    };

    if (prevButton && nextButton) {
        swiperConfig.navigation = {
            prevEl: prevButton,
            nextEl: nextButton,
        };
    }

    if (swiperConfig.pagination && paginationElement) {
        swiperConfig.pagination = {
            ...swiperConfig.pagination,
            el: paginationElement,
        };
    }

    return new Swiper(swiperElement, swiperConfig);
};

// Keep the bottom fixed CTA from overlapping the footer area.
const setupFixedPlusBehavior = () => {
    const fixedPlus = document.querySelector('.fixed-plus');
    const fixedPlusPlaceholder = document.querySelector('.fixed-plus-placeholder');

    const updateFixedPlusState = () => {
        if (!fixedPlus || !fixedPlusPlaceholder) return;

        const fixedPlusHeight = fixedPlus.offsetHeight;
        const placeholderBottom = fixedPlusPlaceholder.getBoundingClientRect().bottom;
        const shouldDock = placeholderBottom <= window.innerHeight;

        fixedPlusPlaceholder.style.height = `${fixedPlusHeight}px`;
        fixedPlus.classList.toggle('is-docked', shouldDock);
        fixedPlus.style.transform = 'translateY(0)';
    };

    updateFixedPlusState();
    window.addEventListener('scroll', updateFixedPlusState, { passive: true });
    window.addEventListener('resize', updateFixedPlusState);

    return updateFixedPlusState;
};

// Configure "load more" behavior for the FAQ section.
const setupQaLoadMore = (qaConfig, onAfterExpand) => {
    const qaItems = Array.from(document.querySelectorAll('.qa-accordion .qa-item'));
    const qaLoadMoreBtn = document.querySelector('#qaLoadMoreBtn');
    const qaLoadMore = document.querySelector('.qa-load-more');
    const initialVisibleQaCount = qaConfig.initialVisibleCount;
    const qaBatchSize = qaConfig.batchSize;
    let qaVisibleCount = initialVisibleQaCount;

    const updateQaLoadMoreState = () => {
        const hasHiddenItems = qaVisibleCount < qaItems.length;

        if (qaLoadMore) {
            qaLoadMore.hidden = !hasHiddenItems;
        }
    };

    if (qaLoadMoreBtn && qaItems.length > initialVisibleQaCount) {
        qaLoadMoreBtn.addEventListener('click', () => {
            const nextItems = qaItems.slice(qaVisibleCount, qaVisibleCount + qaBatchSize);

            nextItems.forEach((item) => {
                item.classList.remove('qa-hidden');
            });

            qaVisibleCount += nextItems.length;
            updateQaLoadMoreState();

            requestAnimationFrame(() => {
                onAfterExpand?.();
            });
        });
    } else if (qaLoadMore) {
        qaLoadMore.hidden = true;
    }

    updateQaLoadMoreState();
};

// Main bootstrap sequence:
// 1. load page.json
// 2. render sections
// 3. initialize sliders / interactions
const initPage = async () => {
    let qaConfig = {
        initialVisibleCount: 3,
        batchSize: 2,
    };

    try {
        const pageData = await loadPageData();
        const { order = [], sections = {}, fixedPlus = {}, footer = {} } = pageData;
        const normalizedOrder = normalizeSectionOrder(order, sections);

        applySectionOrder(normalizedOrder);
        applyAlternatingSectionBackgrounds(normalizedOrder);

        renderBanner(sections.banner ?? {});
        renderNewsSection(sections.news ?? {});
        renderFeaturedSection(sections.featured ?? {});
        renderAuthorSection(sections.author ?? {});
        renderChtSection(sections.cht ?? {});
        renderPlusSection(sections.plus ?? {});
        renderProcessSection(sections.process ?? {});
        renderQaSection(sections.qa ?? {});
        renderFixedPlus(fixedPlus);
        renderFooter(footer);

        qaConfig = {
            initialVisibleCount: sections.qa?.initialVisibleCount ?? 3,
            batchSize: sections.qa?.batchSize ?? 2,
        };
    } catch (error) {
        console.error('Page data loading failed:', error);
    }

    initSectionSwiper('#news-plan-section', '.swiper-news', {
        breakpoints: newsBreakpoints,
    });

    initSectionSwiper('#featured-plan-section', '.swiper-featured', {
        breakpoints: featuredBreakpoints,
    });

    initSectionSwiper('#author-plan-section', '.swiper-author', {
        breakpoints: authorBreakpoints,
        pagination: {
            clickable: true,
        },
    });

    initSectionSwiper('#cht-plan-section', '.swiper-cht', {
        breakpoints: chtBreakpoints,
    });

    setupChtCardSelection();

    initSectionSwiper('#plus-plan-section', '.swiper-plus', {
        breakpoints: plusBreakpoints,
    });

    const updateFixedPlusState = setupFixedPlusBehavior();
    setupQaLoadMore(qaConfig, updateFixedPlusState);
    applyExternalLinkTargets();
};

await initPage();
