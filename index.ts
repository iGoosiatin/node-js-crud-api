import 'dotenv/config';
import SimpleCrudServer from './src/server';

const port = process.env.PORT || 4000;

const server = new SimpleCrudServer(port);

server.start();
