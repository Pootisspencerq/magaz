document.addEventListener("DOMContentLoaded", async () => {
    const token = window.VilkaAuth?.getToken?.();
    const list = document.getElementById("ordersList");
    const loading = document.getElementById("ordersLoading");
    const empty = document.getElementById("ordersEmpty");
    const error = document.getElementById("ordersError");
    const count = document.getElementById("ordersCount");
    if (!list) return;
    if (!token) return;
    try {
        const response = await fetch("http://127.0.0.1:8000/api/orders/", { headers: { "Authorization": `Token ${token}` } });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Не вдалося завантажити замовлення.");
        loading?.classList.add("d-none");
        count.textContent = Array.isArray(data) ? data.length : 0;
        if (!data.length) { empty?.classList.remove("d-none"); return; }
        data.forEach(order => {
            const col = document.createElement("div"); col.className = "col-12 col-lg-6";
            const card = document.createElement("div"); card.className = "card h-100 shadow-sm";
            const items = (order.items || []).map(i => `${i.product_name} × ${i.quantity}`).join(", ");
            card.innerHTML = `<div class="card-body"><div class="d-flex justify-content-between gap-3"><h3 class="h5 mb-1">${order.order_number}</h3><span class="badge bg-secondary">${order.status}</span></div><p class="text-muted small mb-2">${new Date(order.created_at).toLocaleString("uk-UA")}</p><p class="mb-2">${items}</p><strong>${Number(order.total_price).toLocaleString("uk-UA")} грн</strong></div>`;
            col.appendChild(card); list.appendChild(col);
        });
    } catch (e) {
        loading?.classList.add("d-none"); error.textContent = e.message; error.classList.remove("d-none");
    }
});
