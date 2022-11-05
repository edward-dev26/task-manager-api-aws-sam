import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logEvent } from '../../utils/logger';
import { handleError } from '../../utils/handleError';
import { TasksService } from '../../services/tasks-service';
import { TaskBody, TaskView } from '../../interfaces/Task';
import { EventParser } from '../../utils/event-parser';
import { TasksRepository } from '../../repositories/tasks-repository';
import { TasksMapper } from '../../mappers/tasks-mapper';
import { Responder } from '../../utils/responder';

const repository = new TasksRepository();
const tasksService = new TasksService(repository);

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    logEvent(event);

    try {
        const body = EventParser.parseBody<TaskBody>(event);
        const user = EventParser.parseCurrentUser(event);

        if (!body || !user) {
            return Responder.BadRequest({
                message: 'Bad request',
            });
        }

        const task = await tasksService.createTask(body, user.id);
        const response = TasksMapper.mapToView(task);

        return Responder.Created<TaskView>(response);
    } catch (err: unknown) {
        return handleError(err);
    }
};
