import { v1 as uuidV1 } from 'uuid';
import { Task, TaskBody, TasksQueryFilter, TaskView } from '../interfaces/Task';
import { Repository } from '../interfaces/Repository';

export class TasksService {
    private readonly repository: Repository<Task, TasksQueryFilter>;

    constructor(repository: Repository<Task, TasksQueryFilter>) {
        this.repository = repository;
    }

    async createTask(body: TaskBody, owner: string) {
        const task: Task = {
            id: uuidV1(),
            description: body.description,
            completed: body.completed,
            owner,
        };

        await this.repository.create(task);

        return task;
    }

    async getTasks(filter: TasksQueryFilter) {
        return this.repository.read(filter);
    }

    async getTaskById(id: string, owner: string) {
        return this.repository.readOne({ id, owner });
    }

    async updateTask(id: string, owner: string, body: TaskBody): Promise<TaskView> {
        const task: Task = {
            id,
            description: body.description,
            completed: body.completed,
            owner,
        };

        await this.repository.update(task);

        return task;
    }

    async deleteTask(id: string, owner: string) {
        return this.repository.delete({ id, owner });
    }
}
