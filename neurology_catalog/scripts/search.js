document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    // База даних усіх захворювань та кодів для пошуку по всьому сайту
    const searchDatabase = [
        { title: "Ішемічний інсульт (Інфаркт мозку)", code: "8A00-8A0Z", url: "cerebrovascular/ischemic-stroke.html", category: "Цереброваскулярні захворювання" },
        { title: "Транзиторна ішемічна атака (ТІА)", code: "8A20-8A2Z", url: "cerebrovascular/tia.html", category: "Цереброваскулярні захворювання" },
        { title: "Внутрішньомозковий крововилив", code: "8A40-8A4Z", url: "cerebrovascular/intracerebral-hemorrhage.html", category: "Цереброваскулярні захворювання" },
        { title: "Субарахноїдальний крововилив", code: "8A60-8A6Z", url: "cerebrovascular/subarachnoid-hemorrhage.html", category: "Цереброваскулярні захворювання" },
        { title: "Інші нетравматичні крововиливи", code: "8A80-8A8Z", url: "cerebrovascular/other-hemorrhages.html", category: "Цереброваскулярні захворювання" },
        { title: "Хронічна ішемія мозку", code: "8B00-8B0Z", url: "cerebrovascular/chronic-cerebral-ischemia.html", category: "Цереброваскулярні захворювання" },
        { title: "Церебральний атеросклероз", code: "8B20-8B2Z", url: "cerebrovascular/cerebral-atherosclerosis.html", category: "Цереброваскулярні захворювання" },
        { title: "Гіпертензивна енцефалопатія", code: "8B40-8B4Z", url: "cerebrovascular/hypertensive-encephalopathy.html", category: "Цереброваскулярні захворювання" },
        { title: "Аневризми та мальформації судин мозку", code: "8B60-8B6Z", url: "cerebrovascular/unruptured-aneurysms.html", category: "Цереброваскулярні захворювання" },
        { title: "Тромбоз венозних синусів мозку", code: "8B80-8B8Z", url: "cerebrovascular/venous-sinus-thrombosis.html", category: "Цереброваскулярні захворювання" },
        { title: "Судинна деменція", code: "8B90-8B9Z", url: "cerebrovascular/vascular-dementia.html", category: "Цереброваскулярні захворювання" }
    ];

    // Створюємо контейнер для результатів випадаючого списку
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'searchResultsDropdown';
    resultsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        width: 320px;
        max-height: 350px;
        overflow-y: auto;
        background: #ffffff;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: none;
        margin-top: 5px;
        padding: 8px 0;
        color: #1e293b;
        font-size: 14px;
        text-align: left;
    `;
    
    // Робимо батьківський елемент пошуку відносним для позиціонування випадайки
    const searchWrapper = searchInput.parentElement;
    searchWrapper.style.position = 'relative';
    searchWrapper.appendChild(resultsContainer);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            resultsContainer.style.display = 'none';
            return;
        }

        // Шукаємо збіги за назвою або кодом МКХ-11
        const matches = searchDatabase.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.code.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            resultsContainer.innerHTML = matches.map(item => `
                <a href="${item.url}" style="display: block; padding: 10px 15px; text-decoration: none; color: inherit; border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                    <div style="font-weight: 600; color: #1e3a8a; margin-bottom: 3px;">${item.title}</div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #64748b;">
                        <span>Код: ${item.code}</span>
                        <span style="color: #0369a1;">${item.category}</span>
                    </div>
                </a>
            `).join('');
            resultsContainer.style.display = 'block';
        } else {
            resultsContainer.innerHTML = `<div style="padding: 12px 15px; color: #64748b; text-align: center;">Нічого не знайдено</div>`;
            resultsContainer.style.display = 'block';
        }
    });

    // Закриваємо випадайку при кліку за межами пошуку
    document.addEventListener('click', (e) => {
        if (!searchWrapper.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
});