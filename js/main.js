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

// Push GA/GTM-friendly interaction events into the site's fixed dataLayer format.
const pushTrackingEvent = (action, extraFields = {}) => {
    if (!action) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'click-ga',
        eventCategory: '廣宣頁點擊',
        eventLabel: '',
        eventAction: action,
        ...extraFields,
    });
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

// Smooth-scroll to an in-page section while keeping it clear of the fixed header.
const scrollToSectionWithHeaderOffset = (targetSelector) => {
    const targetSection = document.querySelector(targetSelector);

    if (!targetSection) return;

    const headerElement = document.querySelector('#header');
    const shouldApplyHeaderOffset = window.innerWidth < 992;
    const headerHeight = shouldApplyHeaderOffset && headerElement ? headerElement.offsetHeight : 0;
    const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth',
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
                event.preventDefault();
                pushTrackingEvent('PPA_Banner點擊', {
                    linkType: linkElement.id === 'bannerLinkMobile' ? 'mobile' : 'desktop',
                });
                scrollToSectionWithHeaderOffset(bannerData.href);
            };
        } else {
            linkElement.onclick = () => {
                pushTrackingEvent('PPA_Banner點擊', {
                    linkType: linkElement.id === 'bannerLinkMobile' ? 'mobile' : 'desktop',
                    href: bannerData.href || '',
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
            <a href="${item.href}" class="news-card">
                <img src="${item.image.src}" class="img-fluid" alt="${item.image.alt}">
            </a>
        </div>
    `).join('');

    newsSwiperWrapper.querySelectorAll('.news-card').forEach((linkElement, index) => {
        const item = newsData.items[index];

        linkElement.addEventListener('click', () => {
            pushTrackingEvent('PPA_活動卡片點擊', {
                cardTitle: item?.image?.alt || `最新活動 ${index + 1}`,
            });
        });
    });
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
        featuredSectionLink.onclick = () => {
            pushTrackingEvent('PPA_課程清單點擊');
        };
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

    featuredSwiperWrapper.querySelectorAll('.featured-card').forEach((linkElement, index) => {
        const item = featuredData.items[index];

        linkElement.addEventListener('click', () => {
            pushTrackingEvent('PPA_精選內容點擊', {
                cardTitle: item?.title || `精選內容 ${index + 1}`,
                timelineKey: item?.timelineKey || '',
            });
        });
    });
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

    authorSwiperWrapper.querySelectorAll('.author-card').forEach((linkElement, index) => {
        const item = authorData.items[index];

        linkElement.addEventListener('click', () => {
            pushTrackingEvent('PPA_講師卡片點擊', {
                cardTitle: item?.name || `講師 ${index + 1}`,
                projectId: item?.projectId || '',
            });
        });
    });
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

    chtSwiperWrapper.querySelectorAll('.cht-card').forEach((cardElement, index) => {
        const item = chtData.items[index];

        cardElement.dataset.trackAction = `PPA_${item?.title || `方案${index + 1}`}訂閱點擊`;
        cardElement.dataset.trackPlanName = item?.title || `方案 ${index + 1}`;
        cardElement.dataset.trackHref = item?.href || '';
    });
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

            pushTrackingEvent(cardElement.dataset.trackAction || 'PPA_方案訂閱點擊', {
                planName: cardElement.dataset.trackPlanName || '',
                href: cardElement.dataset.trackHref || '',
            });

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

// Add lightweight entrance animations for key sections and cards.
const setupMotionEffects = () => {
    if (!window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.documentElement.classList.add('js-motion');

    const registerMotion = (selector, className) => {
        document.querySelectorAll(selector).forEach((element) => {
            element.classList.add(className);
        });
    };

    registerMotion('#bannerLink, #bannerLinkMobile', 'motion-scale-in');
    registerMotion(
        '#newsSection .section-title, #featuredSection .section-title, #authorSection .section-title, #chtSection .section-title, #plusSection .section-title, #processSection .section-title, #qaSection .section-title',
        'motion-fade-up',
    );
    registerMotion('#authorSection .author-p, #authorSection .author-desc, #processSection img, #qaSection .qa-load-more', 'motion-fade-up');

    document.querySelectorAll(
        '#newsSection .swiper, #featuredSection .swiper, #authorSection .swiper, #chtSection .swiper, #plusSection .swiper',
    ).forEach((element) => {
        element.classList.add('motion-stagger-group');
    });

    document.querySelectorAll(
        '#newsSection .swiper-slide, #featuredSection .swiper-slide, #authorSection .swiper-slide, #chtSection .swiper-slide, #plusSection .swiper-slide, #qaSection .qa-item',
    ).forEach((element, index) => {
        element.classList.add('motion-stagger-item');
        element.style.setProperty('--motion-order', String(index % 6));
    });

    requestAnimationFrame(() => {
        document.querySelectorAll('.motion-scale-in').forEach((element) => {
            element.classList.add('is-visible');
        });
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            if (entry.target.classList.contains('motion-stagger-group')) {
                entry.target.querySelectorAll('.motion-stagger-item').forEach((itemElement) => {
                    itemElement.classList.add('is-visible');
                });
                currentObserver.unobserve(entry.target);
                return;
            }

            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.36,
        rootMargin: '0px 0px -18% 0px',
    });

    document.querySelectorAll('.motion-fade-up, .motion-stagger-group, #qaSection .motion-stagger-item').forEach((element) => {
        observer.observe(element);
    });
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

// Static FAQ tracking keeps working even when the markup is written directly in HTML.
const setupQaTracking = () => {
    const qaAccordion = document.querySelector('#accordionExample');

    if (!qaAccordion) return;

    qaAccordion.querySelectorAll('.accordion-button').forEach((buttonElement, index) => {
        const questionLabel = (buttonElement.textContent || '').trim();

        buttonElement.addEventListener('click', () => {
            const willExpand = buttonElement.classList.contains('collapsed');

            if (!willExpand) return;

            pushTrackingEvent('PPA_FAQ展開', {
                faqQuestion: questionLabel || `FAQ ${index + 1}`,
            });
        });
    });
};

// Bottom fixed CTA renderer.
const renderFixedPlus = (fixedPlusData) => {
    const fixedPlusLink = document.querySelector('#fixedPlusLink');

    if (!fixedPlusLink) return;

    fixedPlusLink.href = fixedPlusData.href;
    fixedPlusLink.textContent = fixedPlusData.text;
    fixedPlusLink.onclick = () => {
        pushTrackingEvent('PPA_固定CTA點擊', {
            ctaText: fixedPlusData.text || 'PPA Plus 帳戶啟用/查詢',
            href: fixedPlusData.href || '',
        });
    };
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
    0: { slidesPerView: 2.2, spaceBetween: 20 },
    640: { slidesPerView: 2.2, spaceBetween: 20 },
    768: { slidesPerView: 2.2, spaceBetween: 20 },
    1024: { slidesPerView: 3.2, spaceBetween: 20 },
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
    let lastScrollY = window.scrollY;

    const updateFixedPlusState = () => {
        if (!fixedPlus || !fixedPlusPlaceholder) return;

        const fixedPlusHeight = fixedPlus.offsetHeight;
        const placeholderBottom = fixedPlusPlaceholder.getBoundingClientRect().bottom;
        const shouldDock = placeholderBottom <= window.innerHeight;
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        const shouldHide = currentScrollY > 40 && scrollDelta < -6;
        const shouldShow = scrollDelta > 6;

        fixedPlusPlaceholder.style.height = `${fixedPlusHeight}px`;
        fixedPlus.classList.toggle('is-docked', shouldDock);
        if (shouldHide) {
            fixedPlus.classList.add('is-hidden');
        } else if (shouldShow) {
            fixedPlus.classList.remove('is-hidden');
        }

        lastScrollY = currentScrollY;
    };

    updateFixedPlusState();
    window.addEventListener('scroll', updateFixedPlusState, { passive: true });
    window.addEventListener('resize', updateFixedPlusState);

    return updateFixedPlusState;
};

// Configure "load more" behavior for the FAQ section.
const setupQaLoadMore = (onAfterExpand) => {
    const qaItems = Array.from(document.querySelectorAll('.qa-accordion .qa-item'));
    const qaLoadMoreBtn = document.querySelector('#qaLoadMoreBtn');
    const qaLoadMore = document.querySelector('.qa-load-more');
    const qaAccordion = document.querySelector('#accordionExample');
    const initialVisibleQaCount = Number(qaAccordion?.dataset.initialVisibleCount || 5);
    const qaBatchSize = Number(qaAccordion?.dataset.batchSize || 2);
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
            pushTrackingEvent('PPA_FAQ載入更多', {
                revealedCount: nextItems.length,
            });
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
        renderProcessSection(sections.process ?? {});
        renderFixedPlus(fixedPlus);
        renderFooter(footer);
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
    setupQaTracking();
    setupQaLoadMore(updateFixedPlusState);
    applyExternalLinkTargets();
    setupMotionEffects();
};

await initPage();
