import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { logEvent } from '../../utils/logger';
import { TaskView } from '../../interfaces/Task';
import { handleError } from '../../utils/handleError';
import { EventParser } from '../../utils/event-parser';
import { TasksRepository } from '../../repositories/tasks-repository';
import { TasksService } from '../../services/tasks-service';
import { Responder } from '../../utils/responder';
import { TasksMapper } from '../../mappers/tasks-mapper';

const repository = new TasksRepository();
const tasksService = new TasksService(repository);

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    logEvent(event);

    try {
        const user = EventParser.parseCurrentUser(event);

        if (!user) {
            return Responder.BadRequest({
                message: 'Failed to identify current user',
            });
        }

        const tasks = await tasksService.getTasks({ owner: user.id });
        const response = TasksMapper.mapListToView(tasks);

        return Responder.OK<TaskView[]>(response);
    } catch (err: unknown) {
        return handleError(err);
    }
};
