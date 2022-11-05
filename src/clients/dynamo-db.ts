import DynamoDB from 'aws-sdk/clients/dynamodb';

export class Db {
    private static instance: DynamoDB.DocumentClient;

    private constructor() {}

    static getInstance() {
        if (!this.instance) {
            this.instance = new DynamoDB.DocumentClient({
                region: 'eu-west-2',
            });
        }

        return this.instance;
    }
}
