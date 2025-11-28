document.addEventListener('alpine:init', () => {
    Alpine.store('authStore', {
        currentUser: null,
        isAuthenticated: false,

        init() {
            // Recuperar sesión de localStorage
            const savedUser = localStorage.getItem('rigtech_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                this.isAuthenticated = true;
            }
        },

        async login(username, password) {
            try {
                const response = await fetch(`http://localhost:9000/api/users/`);
                
                if (response.ok) {
                    const users = await response.json();
                    
                    const foundUser = users.find(u => 
                        u.username === username && 
                        u.password_hash === password
                    );

                    if (foundUser) {
                        this.currentUser = foundUser;
                        this.isAuthenticated = true;
                        localStorage.setItem('rigtech_user', JSON.stringify(foundUser));
                        return true;
                    } else {
                        alert('❌ Usuario o contraseña incorrectos');
                        return false;
                    }
                } else {
                    alert('❌ Error al conectar con el servidor');
                    return false;
                }
            } catch (error) {
                console.error('Error:', error);
                alert('❌ No se pudo conectar con el backend (puerto 9000)');
                return false;
            }
        },

        logout() {
            this.currentUser = null;
            this.isAuthenticated = false;
            localStorage.removeItem('rigtech_user');
            window.location.href = '/login.html';
        },

        requireLogin() {
            if (!this.isAuthenticated) {
                alert('⚠️ Debes iniciar sesión primero');
                window.location.href = '/login.html';
            }
        },

        redirectIfLoggedIn() {
            if (this.isAuthenticated) {
                window.location.href = '/index.html';
            }
        },

        isOwner(resourceUserId) {
            if (!this.currentUser || !resourceUserId) return false;
            const idToCheck = typeof resourceUserId === 'object' ? resourceUserId._id : resourceUserId;
            return this.currentUser._id === idToCheck;
        },

        isAdmin() {
            return this.currentUser && this.currentUser.role === 'administrator';
        }
    });
});