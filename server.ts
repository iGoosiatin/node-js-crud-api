import 'dotenv/config';
import { createServer } from 'http';

const port = process.env.PORT;

const server = createServer();

server.listen(port);
