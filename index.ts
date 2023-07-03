import 'dotenv/config';
import ApiServer from './src/apiServer';
import ClusteredApiServer from './src/cluster';
import APP_CONFIG from './src/utils/appConfig';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const isClusterMode = !!APP_CONFIG.cluster;

const app = isClusterMode ? new ClusteredApiServer(port) : new ApiServer(port);

app.start();
