document.addEventListener('alpine:init', () => {
    Alpine.store('usersStore', {
        users: [],
        userForm: {
            username: '',
            email: '',
            password_hash: '', 
            role: 'user',
            bio: ''
        },

        async load() {
            try {
                const response = await fetch(`http://localhost:9000/api/users/`);
                this.users = await response.json();
            } catch (error) {
                console.error("Error cargando usuarios:", error);
            }
        },

        async registerUser() {
            try {
                const response = await fetch(`http://localhost:9000/api/users/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.userForm)
                });
                
                if (response.ok) {
                    alert('✅ ¡Usuario registrado con éxito!');
                    this.userForm = { username: '', email: '', password_hash: '', role: 'user', bio: '' };
                    window.location.href = 'login.html';
                } else {
                    alert('❌ Error al registrar usuario');
                }
            } catch (error) {
                console.error("Error:", error);
            }
        },

        async deleteUser(id) {
            const auth = Alpine.store('authStore');
            
            if (!auth.isAdmin() && auth.currentUser._id !== id) {
                return alert("⛔ No tienes permiso para eliminar este usuario");
            }

            if (!confirm('🗑️ ¿Estás seguro de eliminar este usuario?')) return;
            
            try {
                await fetch(`http://localhost:9000/api/users/${id}`, { method: 'DELETE' });
                this.users = this.users.filter(u => u._id !== id);
                
                if (auth.currentUser._id === id) {
                    auth.logout();
                }
                
            } catch (error) {
                console.error("Error eliminando usuario:", error);
            }
        }
    });
});