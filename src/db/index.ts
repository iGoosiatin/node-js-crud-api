import cluster from 'cluster';

import InMemoryDatabase from './inMemoryDatabase';
import ClusterDatabase, { DatabaseInquiryMessage } from './clusterDatabase';
import { IDatabase } from './database';

const Database = cluster.isPrimary ? InMemoryDatabase : ClusterDatabase;

export default Database;
export { DatabaseInquiryMessage, IDatabase };
