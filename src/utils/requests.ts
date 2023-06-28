import { IncomingMessage } from 'http';

export const getParsedRequestData = <T>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => (body += chunk.toString()));
    req.on('error', reject);
    req.on('end', () => {
      // TODO: need to handle JSON.parse error
      const parsedData = JSON.parse(body);
      resolve(parsedData);
    });
  });
};
