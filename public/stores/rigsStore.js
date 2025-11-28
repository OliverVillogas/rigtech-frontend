document.addEventListener('alpine:init', () => {
    Alpine.store('rigsStore', {
        rigs: [],
        rigForm: {
            titulo: '',
            descripcion: '',
            imagen_principal_url: '',
            componentes: []
        },
        isEditing: false,
        currentRigId: null,

        async load() {
            try {
                const response = await fetch(`http://localhost:9000/api/rigs/`);
                this.rigs = await response.json();
            } catch (e) { 
                console.error(e); 
            }
        },

        async saveRig() {
            const auth = Alpine.store('authStore');
            if (!auth.isAuthenticated) {
                return alert("⚠️ Inicia sesión primero");
            }

            const payload = { ...this.rigForm, user_id: auth.currentUser._id };

            try {
                let response;
                if (this.isEditing) {
                    response = await fetch(`http://localhost:9000/api/rigs/${this.currentRigId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                } else {
                    response = await fetch(`http://localhost:9000/api/rigs/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                }

                if (response.ok) {
                    alert(this.isEditing ? '✅ Actualizado!' : '✅ Creado!');
                    this.resetForm();
                    this.load();
                } else {
                    alert('❌ Error al guardar');
                }
            } catch (e) { 
                console.error(e); 
            }
        },

        async deleteRig(id) {
            if (!confirm('🗑️ ¿Borrar este Rig?')) return;
            try {
                await fetch(`http://localhost:9000/api/rigs/${id}`, { method: 'DELETE' });
                this.rigs = this.rigs.filter(r => r._id !== id);
            } catch (e) { 
                console.error(e); 
            }
        },

        prepareEdit(rig) {
            this.rigForm = { 
                titulo: rig.titulo, 
                descripcion: rig.descripcion,
                imagen_principal_url: rig.imagen_principal_url,
                componentes: rig.componentes || []
            };
            this.currentRigId = rig._id;
            this.isEditing = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        resetForm() {
            this.rigForm = { titulo: '', descripcion: '', imagen_principal_url: '', componentes: [] };
            this.isEditing = false;
            this.currentRigId = null;
        }
    });
});