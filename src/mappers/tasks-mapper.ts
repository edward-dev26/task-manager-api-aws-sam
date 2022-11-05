import { Task, TaskView } from '../interfaces/Task';

export class TasksMapper {
    static mapToView(task: Task): TaskView {
        return {
            id: task.id,
            description: task.description,
            completed: task.completed,
        };
    }

    static mapListToView(tasks: Task[]): TaskView[] {
        return tasks.map(TasksMapper.mapToView);
    }
}
