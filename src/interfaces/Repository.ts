export interface Repository<Type, Filter = Record<string, unknown>> {
    read(filter: Filter): Promise<Type[]>;

    readOne(filter: Filter): Promise<Type | null>;

    create(entity: Type): Promise<void>;

    update(entity: Type): Promise<void>;

    delete(filter: Filter): Promise<void>;
}
