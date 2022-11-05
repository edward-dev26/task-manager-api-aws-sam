export interface Task {
    id: string;
    description: string;
    completed: boolean;
    owner?: string;
}

export interface TaskView {
    id: string;
    description: string;
    completed: boolean;
}

export interface TaskBody {
    description: string;
    completed: boolean;
    owner: string;
}

export interface TasksQueryFilter {
    id?: string;
    owner?: string;
}
