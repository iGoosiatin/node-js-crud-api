import { IncomingMessage } from 'http';

export const getParsedRequestData = <T>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => (body += chunk.toString()));
    req.on('error', reject);
    req.on('end', () => {
      try {
        const parsedData = JSON.parse(body);
        resolve(parsedData);
      } catch {
        reject('');
      }
    });
  });
};

export const getParamFromUrl = (req: IncomingMessage): string => {
  const { url } = req;
  if (url) {
    const param = url.split('/').pop();
    if (param) {
      return param;
    }
  }
  throw new Error('Unable to get param');
};
