document.addEventListener('alpine:init', () => {
    Alpine.store('postsStore', {
        posts: [],
        postForm: { texto: '', tipo: 'texto', contenido_url: '' },

        async load() {
            try {
                const response = await fetch(`http://localhost:9000/api/posts/`);
                this.posts = await response.json();
            } catch (e) { 
                console.error(e); 
            }
        },

        async addPost() {
            const auth = Alpine.store('authStore');
            if (!auth.isAuthenticated) return;

            const payload = { 
                ...this.postForm, 
                user_id: auth.currentUser._id 
            };

            try {
                const response = await fetch(`http://localhost:9000/api/posts/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (response.ok) {
                    this.postForm = { texto: '', tipo: 'texto', contenido_url: '' };
                    this.load();
                }
            } catch (e) { 
                console.error(e); 
            }
        },

        async deletePost(id) {
            if (!confirm('🗑️ ¿Eliminar post?')) return;
            await fetch(`http://localhost:9000/api/posts/${id}`, { method: 'DELETE' });
            this.posts = this.posts.filter(p => p._id !== id);
        }
    });
});