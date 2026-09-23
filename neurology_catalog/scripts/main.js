document.addEventListener('DOMContentLoaded', () => {
    // Створюємо елемент пошуку динамічно в секції фільтрів
    const filtersSection = document.getElementById('filters');
    
    if (filtersSection) {
        const searchWrapper = document.div || document.createElement('div');
        searchWrapper.className = 'search-box';
        searchWrapper.style.marginTop = '15px';
        
        searchWrapper.innerHTML = `
            <input type="text" id="searchInput" placeholder="Шукати захворювання або код..." style="padding: 8px 12px; width: 100%; max-width: 300px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;">
        `;
        filtersSection.appendChild(searchWrapper);

        // Логіка фільтрації карток у реальному часі
        const searchInput = document.getElementById('searchInput');
        const cards = document.querySelectorAll('.card');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            cards.forEach(card => {
                const textContent = card.textContent.toLowerCase();
                if (textContent.includes(query)) {
                    card.style.display = 'flex'; // або ''; залежить від твого CSS (grid/flex)
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Додаємо невеликий ефект підсвічування карток при наведенні або кліку
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.transition = 'transform 0.2s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});