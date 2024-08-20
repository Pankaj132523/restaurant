document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    async function handleLogin(isAdmin) {
        const email = document.getElementById('email-login').value;
        const password = document.getElementById('password-login').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.accessToken);
                // Redirect based on role
                if (isAdmin) {
                    window.location.href = '/managerestaurant'; // Redirect to admin page
                } else {
                    window.location.href = '/home'; // Redirect to home page
                }
            } else {
                // Handle different status codes
                if (response.status === 401) {
                    alert('Unauthorized: Incorrect email or password.');
                } else {
                    alert(data.message || 'Login failed');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login. Please try again later.');
        }
    }

    document.getElementById('user-login').addEventListener('click', (e) => {
        e.preventDefault();
        handleLogin(false);
    });

    document.getElementById('admin-login').addEventListener('click', (e) => {
        e.preventDefault();
        handleLogin(true);
    });

    document.getElementById('signup').addEventListener('submit', async function (e) {
        e.preventDefault();

        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email-signup').value;
        const password = document.getElementById('password-signup').value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstname, lastname, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Sign up successful');
                window.location.href = '/home'; // Redirect to home page after signup
            } else {
                alert(data.message || 'Sign up failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during sign up. Please try again later.');
        }
    });
});
