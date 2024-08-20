document.addEventListener('DOMContentLoaded', () => {
    const dishesContainer = document.getElementById('dishes-container');

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
                        <div>
                            <h3>${dish.dishname}</h3>
                            <p>Quantity: ${dish.quantity}</p>
                        </div>
                        <div>
                            <button onclick="updateQuantity('${dish._id}')">Update Quantity</button>
                            <button onclick="deleteDish('${dish._id}')">Delete Dish</button>
                        </div>
                    </div>
                `).join('');
            } else {
                dishesContainer.innerHTML = '<p>No dishes available.</p>';
            }
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    }

    // Add new dish
    document.getElementById('add-dish-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const dishname = document.getElementById('dishname').value;
        const quantity = document.getElementById('quantity').value;

        try {
            const response = await fetchWithRefresh('/api/dishes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ dishname, quantity })
            });
            const result = await response.json();
            if (response.ok) {
                alert('Dish added successfully!');
                loadDishes(); // Reload dishes to reflect changes
            } else {
                alert(result.message || 'Failed to add dish');
            }
        } catch (error) {
            console.error('Error adding dish:', error);
        }
    });

    // Update dish quantity
    window.updateQuantity = async function(dishId) {
        const newQuantity = prompt('Enter new quantity:');
        if (newQuantity !== null && !isNaN(newQuantity)) {
            try {
                const response = await fetchWithRefresh('/api/dishes', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ _id: dishId, quantity: parseInt(newQuantity) })
                });

                if (response.ok) {
                    alert('Dish quantity updated successfully!');
                    loadDishes();  // Reload dishes to reflect changes
                } else {
                    alert('Failed to update dish.');
                }
            } catch (error) {
                console.error('Error updating dish:', error);
            }
        }
    };

    // Delete a dish
    window.deleteDish = async function(dishId) {
        if (confirm('Are you sure you want to delete this dish?')) {
            try {
                const response = await fetchWithRefresh('/api/dishes', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ _id: dishId })
                });

                if (response.ok) {
                    alert('Dish deleted successfully!');
                    loadDishes();  // Reload dishes to reflect changes
                } else {
                    alert('Failed to delete dish.');
                }
            } catch (error) {
                console.error('Error deleting dish:', error);
            }
        }
    };

    // Initial load
    loadDishes();
});
