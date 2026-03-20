import PocketBase from 'pocketbase';
import { Collection, CollectionField, RecordModel } from '@/lib/types';

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
                    system: false
                },
                {
                    name: 'updated',
                    type: 'autodate',
                    onCreate: true,
                    onUpdate: true,
                    system: false
                }
            ]
        };
        const result = await pb.collections.create(augmentedData);
        return result as unknown as Collection;
    },

    async updateCollection(pb: PocketBase, collectionId: string, data: { name?: string, fields?: CollectionField[] }): Promise<Collection> {
        const current = await pb.collections.getOne(collectionId);
        if (!current) throw new Error('Colección no encontrada');

        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.fields) {
            const systemFields = (current.fields as any[]).filter(f =>
                f.system || ['created', 'updated'].includes(f.name)
            );
            updateData.fields = [...data.fields, ...systemFields];
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
    }
};


