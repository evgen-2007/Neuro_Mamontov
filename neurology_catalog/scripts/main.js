document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm"); 

    if (contactForm) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Зупиняємо стандартну перезавантаження сторінки

            // Збираємо дані відповідно до того, що чекає python-сервер
            const formData = {
                name: document.getElementById("name").value,       // id поля імені
                email: document.getElementById("email").value,     // id поля email
                message: document.getElementById("message").value, // id поля повідомлення
                date: new Date().toISOString()                     // поточна дата
            };

            //хмарна адреса бекенду на Render
            const BACKEND_URL = "https://neuro-mamontov.onrender.com";

            try {
                // Звертаємося чітко на ваш маршрут /api/report
                const response = await fetch(`${BACKEND_URL}/api/report`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Повідомлення успішно надіслано!");
                    contactForm.reset(); // Очищуємо поля форми
                } else {
                    alert("Помилка: " + (result.message || "Спробуйте пізніше."));
                }
            } catch (error) {
                console.error("Помилка мережі:", error);
                alert("Не вдалося зв'язатися з сервером. Перевірте підключення.");
            }
        });
    }
});
