import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getParameters } from '../utils/parameterStore.js';

const REGION = process.env.AWS_REGION || 'ap-southeast-2';
export const dynamoClient = new DynamoDBClient({ region: REGION });
export const TABLE_NAME = process.env.DYNAMO_TABLE;
export const OWNER_INDEX = process.env.DYNAMO_OWNER_INDEX;

let configPromise;
let resolvedConfig;

function buildFallbackConfig() {
  return {
    REGION,
    TABLE: TABLE_NAME,
    OWNER_INDEX: OWNER_INDEX
  };
}

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
        const fallback = buildFallbackConfig();
        if (fallback.TABLE) {
          console.warn('⚠️  Falling back to environment-based DynamoDB configuration:', error.message);
          return fallback;
        }

        console.error('❌ Failed to load DynamoDB configuration from Parameter Store:', error.message);
        throw error;
      }
    })();
  }
  return configPromise;
}

export async function resolveDynamoConfig() {
  if (!resolvedConfig) {
    try {
      resolvedConfig = await loadDynamoConfig();
    } catch (error) {
      const fallback = buildFallbackConfig();
      if (!fallback.TABLE) {
        throw error;
      }
      resolvedConfig = fallback;
    }
  }

  return resolvedConfig;
}
