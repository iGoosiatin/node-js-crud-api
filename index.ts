import 'dotenv/config';
import SimpleCrudServer from './src/server';
import { parseArguments } from './src/utils/argParses';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const appArgs = parseArguments(process.argv.slice(2));

const server = new SimpleCrudServer(port, { cluster: !!appArgs.get('cluster') });

server.start();
