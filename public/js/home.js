document.addEventListener('DOMContentLoaded', () => {
    const dishesContainer = document.getElementById('dishes-container');
    const ordersContainer = document.getElementById('orders-container');

    // Function to handle token refresh
    const refreshToken = async () => {
        try {
            const response = await fetch('/api/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                }
            });

            if (response.ok) {
                const { accessToken } = await response.json();
                localStorage.setItem('token', accessToken);
                return accessToken;
            } else {
                throw new Error('Refresh token failed');
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            // Redirect to login if refresh fails
            window.location.href = '/';
        }
    };

    // Function to make API requests with token refresh logic
    const fetchWithRefresh = async (url, options = {}) => {
        try {
            let response = await fetch(url, options);
            if (response.status === 403) {
                // Token might be expired, attempt to refresh it
                const newToken = await refreshToken();
                // Retry the original request with the new token
                options.headers['Authorization'] = `Bearer ${newToken}`;
                response = await fetch(url, options);
            }
            return response;
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    };

    // Function to fetch and display dishes
    async function loadDishes() {
        try {
            const response = await fetchWithRefresh('/api/dishes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const dishes = await response.json();
            if (response.ok) {
                dishesContainer.innerHTML = dishes.map(dish => `
                    <div class="dish">
                        <h3>${dish.dishname}</h3>
                        <p>Quantity: ${dish.quantity}</p>
                        <button onclick="orderDish('${dish._id}')">Order</button>
                    </div>
                `).join('');
            } else {
                dishesContainer.innerHTML = '<p>No dishes available.</p>';
            }
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    }

    // Function to fetch and display user orders
    async function loadOrders() {
        try {
            const response = await fetchWithRefresh('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const orders = await response.json();
            if (response.ok) {
                ordersContainer.innerHTML = orders.map(order => `
                    <div class="order">
                        <p>Dish: ${order.item}</p>
                        <p>Ordered By: ${order.orderedBy}</p>
                    </div>
                `).join('');
            } else {
                ordersContainer.innerHTML = '<p>No orders placed.</p>';
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    // Function to handle placing an order
    window.orderDish = async function(dishId) {
        try {
            const response = await fetchWithRefresh('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ id: dishId })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Order placed successfully!');
                loadDishes();  // Reload dishes to update quantity
                loadOrders();  // Reload orders to show new order
            } else {
                alert(result.message || 'Order failed');
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    }

    // Initial load
    loadDishes();
    loadOrders();
});
