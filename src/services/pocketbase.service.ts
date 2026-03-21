import PocketBase from 'pocketbase';
import { Collection, CollectionField, RecordModel } from '@/lib/types';

// Campos del sistema de PocketBase que NUNCA hay que mandar en un update
// ya que lanzan errores de validación si están presentes en el array 'fields'.
// Usamos minúsculas para comparaciones insensibles al caso.
export const POCKETBASE_SYSTEM_FIELDS = [
    'id', 'username', 'tokenkey', 'password', 'email', 
    'emailvisibility', 'verified', 'created', 'updated'
];

/**
 * Servicio para interactuar con una instancia específica de PocketBase.
 * Diseñado para ser stateless y recibir la instancia de PB como argumento.
 */
export const ProjectService = {
    // --- Gestión de Colecciones ---

    async getCollections(pb: PocketBase): Promise<Collection[]> {
        const result = await pb.collections.getFullList({ sort: 'name' });
        // Filtrar del lado del cliente como veníamos haciendo
        return result.filter((c: any) =>
            !c.name.startsWith('_') && (c.type === 'base' || c.type === 'auth')
        ) as unknown as Collection[];
    },

    async createCollection(pb: PocketBase, data: { name: string, type?: string, fields: CollectionField[] }): Promise<Collection> {
        // En creación de base collections nos gusta asegurar created/updated
        // aunque PocketBase ya los cree. Lo dejamos por ahora.
        const augmentedData = {
            ...data,
            type: data.type || 'base',
            fields: [
                ...data.fields,
                {
                    name: 'created',
                    type: 'autodate',
                    onCreate: true,
                    onUpdate: false,
                    system: true
                },
                {
                    name: 'updated',
                    type: 'autodate',
                    onCreate: true,
                    onUpdate: true,
                    system: true
                }
            ]
        };
        const result = await pb.collections.create(augmentedData);
        return result as unknown as Collection;
    },

    async updateCollection(pb: PocketBase, collectionId: string, data: any): Promise<Collection> {
        // Validación previa de existencia
        const current = await pb.collections.getOne(collectionId).catch(() => null);
        if (!current) throw new Error('Colección no encontrada');

        const isAuth = current.type === 'auth';
        const updateData: any = { ...data };
        
        if (data.fields) {
            // Filtrado INTELIGENTE: 
            // 1. id, created y updated son sistema en TODAS las colecciones.
            // 2. username, email, password, etc. solo son sistema en colecciones auth.
            updateData.fields = (data.fields as any[]).filter(f => {
                const fieldName = f.name.toLowerCase();
                const alwaysSystem = ['id', 'created', 'updated'].includes(fieldName);
                const authSystem = isAuth && POCKETBASE_SYSTEM_FIELDS.includes(fieldName);
                
                return !alwaysSystem && !authSystem;
            });
        }

        const result = await pb.collections.update(collectionId, updateData);
        return result as unknown as Collection;
    },

    async deleteCollection(pb: PocketBase, collectionId: string): Promise<void> {
        await pb.collections.delete(collectionId);
    },

    // --- Gestión de Registros ---

    async getRecords(
        pb: PocketBase,
        collectionName: string,
        page = 1,
        perPage = 20,
        options: { filter?: string, sort?: string } = {}
    ): Promise<{ items: RecordModel[], totalItems: number }> {
        // Lógica defensiva para el sort que agregamos antes
        const collection = await pb.collections.getOne(collectionName).catch(() => null);
        const hasCreated = collection?.fields?.some((f: any) => f.name === 'created');

        const finalOptions = {
            ...options,
            ...(hasCreated && !options.sort ? { sort: '-created' } : {})
        };

        const result = await pb.collection(collectionName).getList(page, perPage, finalOptions);
        return {
            items: result.items as unknown as RecordModel[],
            totalItems: result.totalItems
        };
    },

    async createRecord(pb: PocketBase, collectionName: string, data: any): Promise<RecordModel> {
        const result = await pb.collection(collectionName).create(data);
        return result as unknown as RecordModel;
    },

    async updateRecord(pb: PocketBase, collectionName: string, id: string, data: any): Promise<RecordModel> {
        const result = await pb.collection(collectionName).update(id, data);
        return result as unknown as RecordModel;
    },

    async deleteRecord(pb: PocketBase, collectionName: string, id: string): Promise<void> {
        await pb.collection(collectionName).delete(id);
    },

    // --- Utilidades y Helpers ---

    async getRecord(pb: PocketBase, collectionName: string, id: string, options: any = {}): Promise<RecordModel> {
        const result = await pb.collection(collectionName).getOne(id, options);
        return result as unknown as RecordModel;
    },

    async getFirstRecord(pb: PocketBase, collectionName: string, filter: string, options: any = {}): Promise<RecordModel> {
        const result = await pb.collection(collectionName).getFirstListItem(filter, options);
        return result as unknown as RecordModel;
    },

    async healthCheck(pb: PocketBase): Promise<{ code: number, message: string }> {
        return await pb.health.check();
    },

    getFileUrl(pb: PocketBase, record: any, filename: string, options: any = {}): string {
        return pb.files.getURL(record, filename, options);
    },

    // --- Gestión de Auth & Proveedores ---

    async getAuthMethods(pb: PocketBase, collectionName = 'users'): Promise<any> {
        return await pb.collection(collectionName).listAuthMethods();
    },

    async updateSettings(pb: PocketBase, settings: any): Promise<any> {
        return await pb.settings.update(settings);
    },

    async getSettings(pb: PocketBase): Promise<any> {
        return await pb.settings.getAll();
    },

    async testSmtp(pb: PocketBase, email: string): Promise<void> {
        await pb.send("/api/settings/test/email", {
            method: "POST",
            body: { email }
        });
    }
};


