document.addEventListener('alpine:init', () => {
    Alpine.store('rigsStore', {
        rigs: [],
        rigForm: {
            titulo: '',
            descripcion: '',
            imagen_principal_url: '',
            componentes: [],
            rendimiento: {
                fps: '',
                temp_cpu: '',
                temp_gpu: '',
                consumo: '',
                benchmark: '',
                precio_total: ''
            }
        },
        isEditing: false,
        currentRigId: null,

        async load() {
            try {
                const response = await fetch(`http://localhost:9000/api/rigs/`);
                this.rigs = await response.json();
            } catch (e) { 
                console.error('Error cargando rigs:', e);
                alert('❌ Error al cargar los rigs'); 
            }
        },

        addComponent() {
            this.rigForm.componentes.push({
                tipo: '',
                modelo: ''
            });
        },

        removeComponent(index) {
            this.rigForm.componentes.splice(index, 1);
        },

        async saveRig() {
            const auth = Alpine.store('authStore');
            if (!auth.isAuthenticated) {
                return alert("⚠️ Inicia sesión primero");
            }

            // Validar título
            if (!this.rigForm.titulo.trim()) {
                return alert("⚠️ El título es obligatorio");
            }

            // Limpiar componentes vacíos
            const componentesValidos = this.rigForm.componentes.filter(
                c => c.tipo && c.modelo
            );

            // Limpiar rendimiento (solo enviar valores que tengan datos)
            const rendimientoLimpio = {};
            Object.keys(this.rigForm.rendimiento).forEach(key => {
                const valor = this.rigForm.rendimiento[key];
                if (valor !== '' && valor !== null && valor !== undefined) {
                    rendimientoLimpio[key] = parseFloat(valor);
                }
            });

            const payload = {
                titulo: this.rigForm.titulo,
                descripcion: this.rigForm.descripcion,
                imagen_principal_url: this.rigForm.imagen_principal_url,
                componentes: componentesValidos,
                rendimiento: rendimientoLimpio,
                user_id: auth.currentUser._id
            };

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
                    alert(this.isEditing ? '✅ Rig actualizado exitosamente!' : '✅ Rig creado exitosamente!');
                    this.resetForm();
                    this.load();
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                } else {
                    const error = await response.json();
                    alert('❌ Error al guardar: ' + (error.message || 'Error desconocido'));
                }
            } catch (e) { 
                console.error('Error guardando rig:', e);
                alert('❌ Error de conexión con el servidor');
            }
        },

        async deleteRig(id) {
            if (!confirm('🗑️ ¿Estás seguro de eliminar este Rig? Esta acción no se puede deshacer.')) return;
            
            try {
                const response = await fetch(`http://localhost:9000/api/rigs/${id}`, { 
                    method: 'DELETE' 
                });
                
                if (response.ok) {
                    this.rigs = this.rigs.filter(r => r._id !== id);
                    alert('✅ Rig eliminado correctamente');
                } else {
                    alert('❌ Error al eliminar el rig');
                }
            } catch (e) { 
                console.error('Error eliminando rig:', e);
                alert('❌ Error de conexión');
            }
        },

        prepareEdit(rig) {
            this.rigForm = { 
                titulo: rig.titulo || '', 
                descripcion: rig.descripcion || '',
                imagen_principal_url: rig.imagen_principal_url || '',
                componentes: rig.componentes ? JSON.parse(JSON.stringify(rig.componentes)) : [],
                rendimiento: {
                    fps: rig.rendimiento?.fps || '',
                    temp_cpu: rig.rendimiento?.temp_cpu || '',
                    temp_gpu: rig.rendimiento?.temp_gpu || '',
                    consumo: rig.rendimiento?.consumo || '',
                    benchmark: rig.rendimiento?.benchmark || '',
                    precio_total: rig.rendimiento?.precio_total || ''
                }
            };
            this.currentRigId = rig._id;
            this.isEditing = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        resetForm() {
            this.rigForm = {
                titulo: '',
                descripcion: '',
                imagen_principal_url: '',
                componentes: [],
                rendimiento: {
                    fps: '',
                    temp_cpu: '',
                    temp_gpu: '',
                    consumo: '',
                    benchmark: '',
                    precio_total: ''
                }
            };
            this.isEditing = false;
            this.currentRigId = null;
        }
    });
});