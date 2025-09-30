import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getParameters } from '../utils/parameterStore.js';

export const dynamoClient = new DynamoDBClient({ region: "ap-southeast-2" });
export const TABLE_NAME = process.env.DYNAMO_TABLE;

// Keep the existing config for backward compatibility
const REGION = process.env.AWS_REGION || 'ap-southeast-2';
let configPromise;

export async function loadDynamoConfig() {
  if (!configPromise) {
    configPromise = (async () => {
      try {
        const params = await getParameters([
          'dynamoTable',
          'dynamoOwnerIndex'
        ]);

        return {
          REGION,
          TABLE: params.dynamoTable,
          OWNER_INDEX: params.dynamoOwnerIndex
        };
      } catch (error) {
        console.error('❌ Failed to load DynamoDB configuration from Parameter Store:', error.message);
        throw error;
      }
    })();
  }
  return configPromise;
}
