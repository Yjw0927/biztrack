function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function openSidebar() {
    var side = document.getElementById('sidebar');
    side.style.display = (side.style.display === "block") ? "none" : "block";
}
function closeSidebar() {
    document.getElementById('sidebar').style.display = 'none';
}
function openForm() {
    var form = document.getElementById("order-form");
    form.style.display = (form.style.display === "block") ? "none" : "block";
}
function closeForm() {
    document.getElementById("order-form").style.display = "none";
}

let orders = [];

window.onload = function () {
    const storedOrders = localStorage.getItem("bizTrackOrders");
    if (storedOrders) {
        orders = JSON.parse(storedOrders);
    } else {
        orders = [
            { orderID: "1001", orderDate: "2024-01-05", itemName: "Baseball caps", itemPrice: 25.00, qtyBought: 2, shipping: 2.50, taxes: 9.00, orderTotal: 61.50, orderStatus: "Pending" },
            { orderID: "1002", orderDate: "2024-03-05", itemName: "Water bottles", itemPrice: 17.00, qtyBought: 3, shipping: 3.50, taxes: 6.00, orderTotal: 60.50, orderStatus: "Processing" },
            { orderID: "1003", orderDate: "2024-02-05", itemName: "Tote bags", itemPrice: 20.00, qtyBought: 4, shipping: 2.50, taxes: 2.00, orderTotal: 84.50, orderStatus: "Shipped" },
            { orderID: "1004", orderDate: "2023-01-05", itemName: "Canvas prints", itemPrice: 55.00, qtyBought: 1, shipping: 2.50, taxes: 19.00, orderTotal: 76.50, orderStatus: "Delivered" },
            { orderID: "1005", orderDate: "2024-01-15", itemName: "Beanies", itemPrice: 15.00, qtyBought: 2, shipping: 3.90, taxes: 4.00, orderTotal: 37.90, orderStatus: "Pending" }
        ];
        localStorage.setItem("bizTrackOrders", JSON.stringify(orders));
    }
    renderOrders(orders);
}

function addOrUpdate(event) {
    let type = document.getElementById("submitBtn").textContent;
    // 简单的判断：如果是英文 Add 或中文 添加，都算新增
    if (type === 'Add' || type === '添加') {
        newOrder(event);
    } else {
        const orderID = document.getElementById("order-id").value;
        updateOrder(orderID);
    }
}

function newOrder(event) {
    event.preventDefault();
    const order = {
        orderID: document.getElementById("order-id").value,
        orderDate: document.getElementById("order-date").value,
        itemName: document.getElementById("item-name").value,
        itemPrice: parseFloat(document.getElementById("item-price").value),
        qtyBought: parseInt(document.getElementById("qty-bought").value),
        shipping: parseFloat(document.getElementById("shipping").value),
        taxes: parseFloat(document.getElementById("taxes").value),
        orderTotal: 0, // 稍后计算
        orderStatus: document.getElementById("order-status").value,
    };
    order.orderTotal = (order.itemPrice * order.qtyBought) + order.shipping + order.taxes;

    if (isDuplicateID(order.orderID, null)) {
        alert("Order ID already exists.");
        return;
    }

    orders.push(order);
    renderOrders(orders);
    localStorage.setItem("bizTrackOrders", JSON.stringify(orders));
    document.getElementById("order-form").reset();
}

function renderOrders(orders) {
    const orderTableBody = document.getElementById("tableBody");
    orderTableBody.innerHTML = "";
    const statusMap = { "Pending": "pending", "Processing": "processing", "Shipped": "shipped", "Delivered": "delivered" };
    
    // 获取翻译函数，如果没加载就用默认值
    const t = window.t || ((k) => k);

    orders.forEach(order => {
        const row = document.createElement("tr");
        row.className = "order-row";
        // 存储数据用于排序
        row.dataset.orderID = order.orderID;
        row.dataset.itemName = order.itemName;
        row.dataset.orderStatus = order.orderStatus;
        // ... 其他 dataset ...

        // 状态翻译：直接查 orders.status.pending 这种 key
        let statusText = t('orders.status.' + order.orderStatus.toLowerCase());
        // 如果翻译失败（返回了 key），则显示原文
        if (statusText.includes('.')) statusText = order.orderStatus;

        row.innerHTML = `
            <td>${escapeHTML(order.orderID)}</td>
            <td>${escapeHTML(order.orderDate)}</td>
            <td>${escapeHTML(order.itemName)}</td>
            <td>$${order.itemPrice.toFixed(2)}</td>
            <td>${order.qtyBought}</td>
            <td>$${order.shipping.toFixed(2)}</td>
            <td>$${order.taxes.toFixed(2)}</td>
            <td class="order-total">$${order.orderTotal.toFixed(2)}</td>
            <td>
                <div class="status ${statusMap[order.orderStatus] || ''}">
                    <span>${statusText}</span>
                </div>
            </td>
            <td class="action">
                <i title="Edit" onclick="editRow('${order.orderID}')" class="edit-icon fa-solid fa-pen-to-square"></i>
                <i onclick="deleteOrder('${order.orderID}')" class="delete-icon fas fa-trash-alt"></i>
            </td>
        `;
        orderTableBody.appendChild(row);
    });
    displayRevenue();
}

function displayRevenue() {
    const total = orders.reduce((sum, o) => sum + o.orderTotal, 0);
    const t = window.t || ((k) => k);
    document.getElementById("total-revenue").innerHTML = `<span>${t('orders.revenueLabel')}: $${total.toFixed(2)}</span>`;
}

function editRow(id) {
    const order = orders.find(o => o.orderID === id);
    if(!order) return;
    document.getElementById("order-id").value = order.orderID;
    document.getElementById("order-date").value = order.orderDate;
    document.getElementById("item-name").value = order.itemName;
    document.getElementById("item-price").value = order.itemPrice;
    document.getElementById("qty-bought").value = order.qtyBought;
    document.getElementById("shipping").value = order.shipping;
    document.getElementById("taxes").value = order.taxes;
    document.getElementById("order-total").value = order.orderTotal;
    document.getElementById("order-status").value = order.orderStatus;
    
    const t = window.t || ((k) => k);
    document.getElementById("submitBtn").textContent = t('orders.form.update');
    document.getElementById("order-form").style.display = "block";
}

function deleteOrder(id) {
    orders = orders.filter(o => o.orderID !== id);
    localStorage.setItem("bizTrackOrders", JSON.stringify(orders));
    renderOrders(orders);
}

function updateOrder(id) {
    const index = orders.findIndex(o => o.orderID === id);
    if (index === -1) return;
    
    orders[index] = {
        orderID: document.getElementById("order-id").value,
        orderDate: document.getElementById("order-date").value,
        itemName: document.getElementById("item-name").value,
        itemPrice: parseFloat(document.getElementById("item-price").value),
        qtyBought: parseInt(document.getElementById("qty-bought").value),
        shipping: parseFloat(document.getElementById("shipping").value),
        taxes: parseFloat(document.getElementById("taxes").value),
        orderTotal: 0,
        orderStatus: document.getElementById("order-status").value
    };
    orders[index].orderTotal = (orders[index].itemPrice * orders[index].qtyBought) + orders[index].shipping + orders[index].taxes;
    
    localStorage.setItem("bizTrackOrders", JSON.stringify(orders));
    renderOrders(orders);
    document.getElementById("order-form").reset();
    document.getElementById("submitBtn").textContent = window.t ? window.t('orders.form.submit') : 'Add';
}

function isDuplicateID(id, currentID) {
    return orders.some(o => o.orderID === id && o.orderID !== currentID);
}

// ... (sortTable, search, export 等功能保持不变) ...
function sortTable(column) {
    const tbody = document.getElementById("tableBody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const isNumeric = ["itemPrice", "qtyBought", "shipping", "taxes", "orderTotal"].includes(column);
    rows.sort((a, b) => {
        let aVal = a.dataset[column] || a.cells[getColumnIndex(column)].innerText; // fallback if dataset missing
        let bVal = b.dataset[column] || b.cells[getColumnIndex(column)].innerText;
        // 简单处理：这里假设 dataset 都有
        let aComp = isNumeric ? parseFloat(a.dataset[column]) : a.dataset[column];
        let bComp = isNumeric ? parseFloat(b.dataset[column]) : b.dataset[column];
        return (typeof aComp === 'string') ? aComp.localeCompare(bComp) : aComp - bComp;
    });
    rows.forEach(r => tbody.appendChild(r));
}
function getColumnIndex(colName) {
    const map = {'orderID':0, 'orderDate':1, 'itemName':2, 'itemPrice':3, 'qtyBought':4, 'shipping':5, 'taxes':6, 'orderTotal':7, 'orderStatus':8};
    return map[colName] || 0;
}

document.getElementById("searchInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") performSearch();
});
function performSearch() {
    const term = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll(".order-row").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(term) ? "table-row" : "none";
    });
}
function exportToCSV() {
    // ... (保持原样)
    const csvContent = "data:text/csv;charset=utf-8," + "Order ID,Date,Item,Price,Qty,Shipping,Taxes,Total,Status\n" 
        + orders.map(o => `${o.orderID},${o.orderDate},${o.itemName},${o.itemPrice},${o.qtyBought},${o.shipping},${o.taxes},${o.orderTotal},${o.orderStatus}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "biztrack_orders.csv");
    document.body.appendChild(link);
    link.click();
}
