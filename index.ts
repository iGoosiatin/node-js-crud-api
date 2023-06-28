import 'dotenv/config';
import SimpleCrudServer from './src/server';

const port = process.env.PORT;

const server = new SimpleCrudServer(port);

server.start();
