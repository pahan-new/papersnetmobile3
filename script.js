// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & Data ---
    const papersData = [ // REPLACE with your actual paper data source
        { year: "2022", subject: "accounting", medium: "english", title: "GCE A/L Accounting 2022", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2022", subject: "economics", medium: "english", title: "GCE A/L Economics 2022", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2022", subject: "accounting", medium: "sinhala", title: "GCE A/L ගිණුම්කරණය 2022", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2021", subject: "ict", medium: "english", title: "GCE A/L ICT 2021", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2021", subject: "bs", medium: "tamil", title: "GCE A/L வணிகக் கல்வி 2021", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2021", subject: "economics", medium: "sinhala", title: "GCE A/L ආර්ථික විද්‍යාව 2021", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2020", subject: "accounting", medium: "english", title: "GCE A/L Accounting 2020", paperLink: "https://drive.google.com/file/d/1VUGE26jnTojIjBsuZc0Coq7uSdmYa2KV/view?usp=sharing", markingSchemeLink: "https://drive.google.com/file/d/1VUGE26jnTojIjBsuZc0Coq7uSdmYa2KV/view?usp=sharing", previewLink: "https://drive.google.com/file/d/1VUGE26jnTojIjBsuZc0Coq7uSdmYa2KV/view?usp=sharing" },
        { year: "2020", subject: "ict", medium: "english", title: "GCE A/L ICT 2020", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2020", subject: "bs", medium: "sinhala", title: "GCE A/L ව්‍යාපාර අධ්‍යයනය 2020", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2019", subject: "economics", medium: "tamil", title: "GCE A/L பொருளியல் 2019", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
        { year: "2019", subject: "ict", medium: "sinhala", title: "GCE A/L තොරතුරු තාක්ෂණය 2019", paperLink: "#", markingSchemeLink: "#", previewLink: "#" },
    ];
    const defaultSectionId = 'home-section'; // Start on Home

    // --- DOM Elements ---
    const yearFilter = document.getElementById('year-filter');
    const subjectFilter = document.getElementById('subject-filter');
    const mediumFilter = document.getElementById('medium-filter');
    const papersGrid = document.getElementById('papers-grid');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const loadingIndicator = document.getElementById('loading-indicator');
    const filterToggleBtn = document.getElementById('filter-toggle');
    const filterFormContent = document.querySelector('.filter-form-content');

    // Navigation Elements
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    const navCloseBtn = document.getElementById('nav-close-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const navOverlay = document.getElementById('nav-overlay');

    // More Options Menu Elements
    const moreOptionsBtn = document.getElementById('more-options-toggle-btn');
    const moreOptionsMenu = document.getElementById('more-options-menu');
    const menuItems = document.querySelectorAll('.menu-item');

    // Modal Elements
    const modalOverlay = document.getElementById('modal-overlay');
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('[data-modal-close]');

    // Feedback Form Elements
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackStatus = document.getElementById('feedback-status');
    const modalFeedbackStatus = document.getElementById('modal-feedback-status');

    // Section Switching Elements
    const mainSections = document.querySelectorAll('.main-section');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    const goToPapersButton = document.querySelector('.go-to-papers-btn');


    // --- Initial State ---
    let currentFilters = { year: "", subject: "", medium: "" };

    // --- Utility Functions ---
    const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);
    const isValidLink = (link) => link && link !== '#';

    // --- Filter Functions ---
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
            opt.value = option; opt.textContent = capitalize(option); selectElement.appendChild(opt);
        });
    }

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
                const initialMsg = papersGrid.querySelector('.no-results-message'); initialMsg?.remove();
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
        // Reset grid to initial message without applying filters immediately
        if (papersGrid) {
             papersGrid.innerHTML = '<p class="no-results-message">Use filters to find papers or <a href="#" id="show-all-papers">show all</a>.</p>';
        }
        // Optional: close filter accordion if open
        // filterToggleBtn?.classList.remove('active');
        // filterFormContent?.classList.remove('active');
    }

    // --- UI Creation Functions ---
    function createPaperCard(paper) {
        const card = document.createElement('div'); card.classList.add('paper-card');
        const paperLinkValid = isValidLink(paper.paperLink); const markingLinkValid = isValidLink(paper.markingSchemeLink); const previewLinkValid = isValidLink(paper.previewLink);
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
        card.querySelectorAll('a.disabled').forEach(link => { link.addEventListener('click', (e) => e.preventDefault()); });
        return card;
    }

    // --- Side Navigation Functions ---
    function openMobileNav() {
        mobileNav?.classList.add('active'); navOverlay?.classList.add('active'); document.body.style.overflow = 'hidden';
    }
    function closeMobileNav() {
        mobileNav?.classList.remove('active'); navOverlay?.classList.remove('active'); document.body.style.overflow = '';
    }

    // --- More Options Menu Functions ---
    function toggleMoreOptions() { moreOptionsMenu?.classList.toggle('active'); }
    function closeMoreOptions() { moreOptionsMenu?.classList.remove('active'); }

    // --- Modal Functions ---
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal || !modalOverlay) return;
        modal.classList.add('active'); modalOverlay.classList.add('active'); document.body.style.overflow = 'hidden';
    }
    function closeModal(modal) {
        if (!modal || !modalOverlay) return;
        modal.classList.remove('active');
        const anyModalActive = document.querySelector('.modal.active');
        if (!anyModalActive) { modalOverlay.classList.remove('active'); document.body.style.overflow = ''; }
    }

    // --- Feedback Form Handling ---
    function handleFeedbackSubmit(event) {
        event.preventDefault(); const formData = new FormData(feedbackForm);
        console.log('Feedback submitted:', Object.fromEntries(formData)); // Log data
        const submitBtn = feedbackForm.querySelector('button[type="submit"]'); if (submitBtn) submitBtn.disabled = true;
        setTimeout(() => { // Simulate submission
            const isSuccess = Math.random() > 0.2;
            displayFeedbackStatus( isSuccess ? 'Feedback sent successfully! Thank you.' : 'Failed to send feedback. Please try again.', isSuccess ? 'success' : 'error', true ); // Show in modal
            if (isSuccess) feedbackForm.reset(); if (submitBtn) submitBtn.disabled = false;
        }, 1000);
    }
    function displayFeedbackStatus(message, type = 'success', showInModal = false) {
        const targetStatusElement = showInModal ? modalFeedbackStatus : feedbackStatus;
        if (!targetStatusElement) { alert(`${type.toUpperCase()}: ${message}`); return; };
        targetStatusElement.textContent = message; targetStatusElement.className = `form-message ${type}`; targetStatusElement.style.display = 'block';
        if (showInModal) { const modalId = targetStatusElement.closest('.modal')?.id || 'info-modal'; openModal(modalId); }
        // else { targetStatusElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }

    // --- Section Switching Function ---
    function switchSection(targetId) {
        mainSections.forEach(section => { section.classList.remove('active'); });
        const targetSection = document.getElementById(targetId);
        if (targetSection) { targetSection.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        else { console.warn(`Target section "${targetId}" not found.`); document.getElementById(defaultSectionId)?.classList.add('active'); targetId = defaultSectionId; } // Fallback
        bottomNavItems.forEach(item => { item.classList.remove('active'); if (item.dataset.target === targetId) { item.classList.add('active'); } });
    }

    // --- Initialization ---
    function init() {
        populateFilters(); // Populate filter dropdowns
        switchSection(defaultSectionId); // Show initial section

        // Event Listeners
        filterToggleBtn?.addEventListener('click', () => { filterToggleBtn.classList.toggle('active'); filterFormContent?.classList.toggle('active'); });
        applyFiltersBtn?.addEventListener('click', updateFiltersFromUI);
        resetFiltersBtn?.addEventListener('click', resetAllFilters);
        papersGrid?.addEventListener('click', (e) => { if (e.target && e.target.id === 'show-all-papers') { e.preventDefault(); applyCurrentFilters(); } }); // Show all applies empty filters

        navToggleBtn?.addEventListener('click', openMobileNav);
        navCloseBtn?.addEventListener('click', closeMobileNav);
        navOverlay?.addEventListener('click', closeMobileNav);

        moreOptionsBtn?.addEventListener('click', (e) => { e.stopPropagation(); toggleMoreOptions(); });
        window.addEventListener('click', (e) => { if (moreOptionsBtn && !moreOptionsBtn.contains(e.target) && moreOptionsMenu && !moreOptionsMenu.contains(e.target)) { closeMoreOptions(); } });
        menuItems.forEach(item => { // Side-nav and overflow menu items
            item.addEventListener('click', (e) => {
                const action = item.dataset.action; console.log('Menu Action:', action);
                if (action === 'about') { switchSection('contact-section'); } // Switch to contact section
                else if (action === 'settings') { alert('Settings action!'); } // Placeholder action
                else if (action === 'share') { alert('Share action!'); } // Placeholder action
                else if (action === 'logout') { alert('Logout action!'); } // Placeholder action
                closeMobileNav(); closeMoreOptions();
            });
        });

        openModalButtons.forEach(button => { button.addEventListener('click', () => { const modalId = button.dataset.modalTarget; if(modalId) openModal(modalId); }); });
        closeModalButtons.forEach(button => { button.addEventListener('click', () => { const modal = button.closest('.modal'); if(modal) closeModal(modal); }); });
        modalOverlay?.addEventListener('click', () => { const activeModal = document.querySelector('.modal.active'); if(activeModal) closeModal(activeModal); });

        feedbackForm?.addEventListener('submit', handleFeedbackSubmit);

        bottomNavItems.forEach(item => { item.addEventListener('click', () => { const targetId = item.dataset.target; if (targetId) { switchSection(targetId); } }); });
        goToPapersButton?.addEventListener('click', () => { switchSection('papers-section'); });
    }

    // --- Run Initialization ---
    init();
});