import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logEvent } from '../../utils/logger';
import { handleError } from '../../utils/handleError';
import { TasksRepository } from '../../repositories/tasks-repository';
import { TasksService } from '../../services/tasks-service';
import { EventParser } from '../../utils/event-parser';
import { TaskBody, TaskView } from '../../interfaces/Task';
import { Responder } from '../../utils/responder';
import { TasksMapper } from '../../mappers/tasks-mapper';

const repository = new TasksRepository();
const tasksService = new TasksService(repository);

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    logEvent(event);

    try {
        const taskId = event.pathParameters?.taskId;
        const user = EventParser.parseCurrentUser(event);
        const body = EventParser.parseBody<TaskBody>(event);

        if (!body || !taskId || !user) {
            return Responder.BadRequest({
                message: 'Bad request',
            });
        }

        const task = await tasksService.updateTask(taskId, user.id, body);
        const response = TasksMapper.mapToView(task);

        return Responder.OK<TaskView>(response);
    } catch (err: unknown) {
        return handleError(err);
    }
};
