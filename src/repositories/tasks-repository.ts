import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Repository } from '../interfaces/Repository';
import { Task, TasksQueryFilter } from '../interfaces/Task';
import { Db } from '../clients/dynamo-db';

export class TasksRepository implements Repository<Task, TasksQueryFilter> {
    private db = Db.getInstance();
    private readonly TableName = 'Tasks';

    async create(task: Task) {
        await this.db
            .put({
                TableName: this.TableName,
                Item: this.getTask(task),
            })
            .promise();
    }

    private getTask(body: Task) {
        const { id, description, completed, owner } = body;

        return {
            Id: id,
            Description: description,
            Completed: completed,
            Owner: owner,
        };
    }

    async read(filter: TasksQueryFilter) {
        const params = this.getQueryParams(filter);
        const { Items } = await this.db.query(params).promise();

        return Items?.map(this.mapToTask).filter(Boolean) as Task[];
    }

    private getQueryParams(filter: TasksQueryFilter): DynamoDB.DocumentClient.QueryInput {
        const { owner } = filter;

        return {
            TableName: this.TableName,
            ExpressionAttributeValues: {
                ':owner': owner,
            },
            ExpressionAttributeNames: {
                '#Owner': 'Owner',
            },
            KeyConditionExpression: '#Owner = :owner',
            ProjectionExpression: 'Id, Description, Completed',
        };
    }

    async readOne(filter: TasksQueryFilter) {
        const { Item } = await this.db
            .get({
                TableName: this.TableName,
                Key: {
                    Id: filter.id,
                    Owner: filter.owner,
                },
            })
            .promise();

        if (!Item) {
            return null;
        }

        return this.mapToTask(Item);
    }

    private mapToTask(item: DynamoDB.DocumentClient.AttributeMap): Task | null {
        const id = item['Id'];
        const description = item['Description'];
        const completed = item['Completed'];
        const owner = item['Owner'];

        if (!id || !description || completed === undefined) {
            return null;
        }

        return {
            id,
            description,
            completed,
            owner,
        };
    }

    async update(entity: Task) {
        const params = this.getUpdateParams(entity);

        await this.db.update(params).promise();
    }

    private getUpdateParams(entity: Task): DynamoDB.DocumentClient.UpdateItemInput {
        return {
            TableName: this.TableName,
            Key: {
                Id: entity.id,
                Owner: entity.owner,
            },
            UpdateExpression: 'set #Description = :description, #Completed = :completed',
            ExpressionAttributeNames: {
                '#Description': 'Description',
                '#Completed': 'Completed',
            },
            ExpressionAttributeValues: {
                ':description': entity.description,
                ':completed': entity.completed,
            },
        };
    }

    async delete(filter: TasksQueryFilter) {
        await this.db
            .delete({
                TableName: this.TableName,
                Key: {
                    Id: filter.id,
                    Owner: filter.owner,
                },
            })
            .promise();
    }
}
