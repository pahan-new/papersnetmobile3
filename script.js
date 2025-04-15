// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & Data ---
    const papersData = [ 
        { year: "2022", subject: "accounting", medium: "english", title: "GCE A/L Accounting 2022", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2022", subject: "economics", medium: "english", title: "GCE A/L Economics 2022", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2022", subject: "accounting", medium: "sinhala", title: "GCE A/L ගිණුම්කරණය 2022", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2021", subject: "ict", medium: "english", title: "GCE A/L ICT 2021", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2021", subject: "bs", medium: "tamil", title: "GCE A/L வணிகக் கல்வி 2021", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2021", subject: "economics", medium: "sinhala", title: "GCE A/L ආර්ථික විද්‍යාව 2021", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2020", subject: "accounting", medium: "english", title: "GCE A/L Accounting 2020", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2020", subject: "ict", medium: "english", title: "GCE A/L ICT 2020", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2020", subject: "bs", medium: "sinhala", title: "GCE A/L ව්‍යාපාර අධ්‍යයනය 2020", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2019", subject: "economics", medium: "tamil", title: "GCE A/L பொருளியல் 2019", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2019", subject: "ict", medium: "sinhala", title: "GCE A/L තොරතුරු තාක්ෂණය 2019", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
    ];

    const defaultSectionId = 'home-section';

    // --- DOM Elements ---
    const yearFilter = document.getElementById('year-filter');
    const subjectFilter = document.getElementById('subject-filter');
    const mediumFilter = document.getElementById('medium-filter');
    const papersGrid = document.getElementById('papers-grid');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const loadingIndicator = document.getElementById('loading-indicator');

    // UI Controls
    const filterToggleBtn = document.getElementById('filter-toggle');
    const filterFormContent = document.querySelector('.filter-form-content');

    // Section Nav
    const mainSections = document.querySelectorAll('.main-section');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const goToPapersButton = document.querySelector('.go-to-papers-btn');

    // --- Initial State ---
    let currentFilters = { year: "", subject: "", medium: "" };

    // --- Utility Functions ---
    const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);
    const isValidLink = (link) => link && link !== "#";

    // --- Populate Filters ---
    function populateFilters() {
        const years = [...new Set(papersData.map(p => p.year))].sort((a, b) => b - a);
        const subjects = [...new Set(papersData.map(p => p.subject))].sort();
        const mediums = [...new Set(papersData.map(p => p.medium))].sort();
        populateSelect(yearFilter, years, "All Years");
        populateSelect(subjectFilter, subjects, "All Subjects");
        populateSelect(mediumFilter, mediums, "All Mediums");
    }

    function populateSelect(selectElement, options, defaultText) {
        if (!selectElement) return;
        selectElement.innerHTML = `<option value="">${defaultText}</option>`;
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = capitalize(option);
            selectElement.appendChild(opt);
        });
    }

    // --- Filtering Logic ---
    function applyCurrentFilters() {
        if (!loadingIndicator || !papersGrid) return;

        loadingIndicator.style.display = 'block';
        papersGrid.innerHTML = '';

        setTimeout(() => {
            const filteredPapers = papersData.filter(paper =>
                (currentFilters.year === "" || paper.year === currentFilters.year) &&
                (currentFilters.subject === "" || paper.subject === currentFilters.subject) &&
                (currentFilters.medium === "" || paper.medium === currentFilters.medium)
            );

            loadingIndicator.style.display = 'none';

            if (filteredPapers.length > 0) {
                filteredPapers.forEach(paper => papersGrid.appendChild(createPaperCard(paper)));
            } else {
                papersGrid.innerHTML = '<p class="no-results-message"><i class="fas fa-exclamation-circle"></i> No papers found matching criteria.</p>';
            }
        }, 300);
    }

    function updateFiltersFromUI() {
        currentFilters.year = yearFilter?.value || "";
        currentFilters.subject = subjectFilter?.value || "";
        currentFilters.medium = mediumFilter?.value || "";
        applyCurrentFilters();
    }

    function resetAllFilters() {
        currentFilters = { year: "", subject: "", medium: "" };
        if (yearFilter) yearFilter.value = "";
        if (subjectFilter) subjectFilter.value = "";
        if (mediumFilter) mediumFilter.value = "";
        if (papersGrid) papersGrid.innerHTML = ""; // Clear grid — do not show "Show All"
    }

    // --- Card Generation ---
    function createPaperCard(paper) {
        const card = document.createElement('div');
        card.classList.add('paper-card');
        const paperLinkValid = isValidLink(paper.paperLink);
        const markingLinkValid = isValidLink(paper.markingSchemeLink);
        const previewLinkValid = isValidLink(paper.previewLink);
        card.innerHTML = `
            <h3>${paper.title}</h3>
            <div class="meta">
                <span class="year"><i class="fas fa-calendar-alt"></i> ${paper.year}</span>
                <span class="subject"><i class="fas fa-book"></i> ${capitalize(paper.subject)}</span>
                <span class="medium"><i class="fas fa-language"></i> ${capitalize(paper.medium)}</span>
            </div>
            <div class="actions">
                <a href="${paperLinkValid ? paper.paperLink : '#'}" target="_blank" class="download-link ${!paperLinkValid ? 'disabled' : ''}"><i class="fas fa-download"></i> Paper</a>
                <a href="${markingLinkValid ? paper.markingSchemeLink : '#'}" target="_blank" class="marking-scheme-link ${!markingLinkValid ? 'disabled' : ''}"><i class="fas fa-check-circle"></i> Marking</a>
                <a href="${previewLinkValid ? paper.previewLink : '#'}" target="_blank" class="preview-link ${!previewLinkValid ? 'disabled' : ''}"><i class="fas fa-eye"></i> Preview</a>
            </div>`;
        card.querySelectorAll('a.disabled').forEach(link => {
            link.addEventListener('click', e => e.preventDefault());
        });
        return card;
    }

    // --- Section Handling ---
    function switchSection(targetId) {
        mainSections.forEach(section => section.classList.remove('active'));
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.warn(`Section "${targetId}" not found.`);
            document.getElementById(defaultSectionId)?.classList.add('active');
        }
        bottomNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.target === targetId) {
                item.classList.add('active');
            }
        });
    }

    // --- Initialization ---
    function init() {
        populateFilters();
        switchSection(defaultSectionId);

        applyFiltersBtn?.addEventListener('click', updateFiltersFromUI);
        resetFiltersBtn?.addEventListener('click', resetAllFilters);

        filterToggleBtn?.addEventListener('click', () => {
            filterToggleBtn.classList.toggle('active');
            filterFormContent?.classList.toggle('active');
        });

        bottomNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.dataset.target;
                if (targetId) switchSection(targetId);
            });
        });

        goToPapersButton?.addEventListener('click', () => {
            switchSection('papers-section');
        });
    }

    // Run init
    init();
});
