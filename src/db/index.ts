import cluster from 'cluster';

import ClusterDatabase, { DatabaseInquiryMessage } from './clusterDatabase';
import { IDatabase } from './database';
import InMemoryDatabase from './inMemoryDatabase';

const Database = cluster.isPrimary ? InMemoryDatabase : ClusterDatabase;

export default Database;
export { DatabaseInquiryMessage, IDatabase };
