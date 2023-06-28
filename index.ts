import 'dotenv/config';
import SimpleCrudServer from './src/server';

const port = process.env.PORT as unknown as number;

const server = new SimpleCrudServer(port);

server.start();
