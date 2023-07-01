import 'dotenv/config';
import ApiServer from './src/apiServer';
import ClusteredApiServer from './src/cluster';
import APP_ARGS from './src/utils/processArguments';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const isClusterMode = !!APP_ARGS.get('cluster');

const app = isClusterMode ? new ClusteredApiServer(port) : new ApiServer(port);

app.start();
