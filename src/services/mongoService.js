/**
 * MongoDB Service Layer
 * Provides an abstraction layer for MongoDB operations
 * Can be used as an alternative to Supabase
 */

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI;
const USE_MONGODB = import.meta.env.VITE_USE_MONGODB === 'true';

// MongoDB Atlas Data API configuration
const MONGODB_API_URL = MONGODB_URI ? `${MONGODB_URI}/action` : null;

const getMongoHeaders = () => ({
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
});

/**
 * Execute a MongoDB operation via Data API
 */
const executeMongoOperation = async (collection, action, payload) => {
  if (!MONGODB_API_URL) {
    throw new Error('MongoDB URI not configured');
  }

  const response = await fetch(MONGODB_API_URL, {
    method: 'POST',
    headers: getMongoHeaders(),
    body: JSON.stringify({
      collection,
      database: 'ghostwriter',
      dataSource: 'ghostwriter-cluster',
      ...payload,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MongoDB operation failed: ${error}`);
  }

  return response.json();
};

/**
 * MongoDB CRUD Operations
 */
export const mongoService = {
  isConfigured: USE_MONGODB && !!MONGODB_URI,

  // Create a document
  async create(collection, document) {
    const result = await executeMongoOperation(collection, 'insertOne', {
      document: {
        ...document,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    return { id: result.insertedId, ...document };
  },

  // Read documents with filter
  async findMany(collection, filter = {}) {
    const result = await executeMongoOperation(collection, 'find', {
      filter,
    });
    return result.documents || [];
  },

  // Read single document
  async findOne(collection, filter) {
    const result = await executeMongoOperation(collection, 'findOne', {
      filter,
    });
    return result.document;
  },

  // Update document
  async updateOne(collection, filter, update) {
    const result = await executeMongoOperation(collection, 'updateOne', {
      filter,
      update: {
        $set: {
          ...update,
          updatedAt: new Date().toISOString(),
        },
      },
    });
    return result.modifiedCount > 0;
  },

  // Delete document
  async deleteOne(collection, filter) {
    const result = await executeMongoOperation(collection, 'deleteOne', {
      filter,
    });
    return result.deletedCount > 0;
  },

  // Aggregate documents
  async aggregate(collection, pipeline) {
    const result = await executeMongoOperation(collection, 'aggregate', {
      pipeline,
    });
    return result.documents || [];
  },
};

export default mongoService;