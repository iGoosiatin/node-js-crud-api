import 'dotenv/config';
import SimpleCrudServer from './src/server';
import APP_ARGS from './src/utils/processArguments';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const server = new SimpleCrudServer(port, { cluster: !!APP_ARGS.get('cluster') });

server.start();
