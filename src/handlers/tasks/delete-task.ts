import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logEvent } from '../../utils/logger';
import { handleError } from '../../utils/handleError';
import { TasksRepository } from '../../repositories/tasks-repository';
import { TasksService } from '../../services/tasks-service';
import { Responder } from '../../utils/responder';
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

        await tasksService.deleteTask(taskId, user.id);

        return Responder.OK({
            message: `Task with id ${taskId} deleted`,
        });
    } catch (err: unknown) {
        return handleError(err);
    }
};
