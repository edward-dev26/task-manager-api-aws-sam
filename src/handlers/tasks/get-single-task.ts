import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logEvent } from '../../utils/logger';
import { handleError } from '../../utils/handleError';
import { Responder } from '../../utils/responder';
import { TasksRepository } from '../../repositories/tasks-repository';
import { TasksService } from '../../services/tasks-service';
import { TasksMapper } from '../../mappers/tasks-mapper';
import { TaskView } from '../../interfaces/Task';
import { EventParser } from '../../utils/event-parser';

const repository = new TasksRepository();
const tasksService = new TasksService(repository);

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    logEvent(event);

    try {
        const taskId = event.pathParameters?.taskId;
        const user = EventParser.parseCurrentUser(event);

        if (!taskId || !user) {
            return Responder.BadRequest({
                message: 'Bad request',
            });
        }

        const task = await tasksService.getTaskById(taskId, user.id);

        if (!task) {
            return Responder.NotFound({
                message: 'Task not found',
            });
        }

        const response = TasksMapper.mapToView(task);

        return Responder.OK<TaskView>(response);
    } catch (err: unknown) {
        return handleError(err);
    }
};
