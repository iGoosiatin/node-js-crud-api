type knownArgument = 'cluster';

const KNOWN_AGRUMENTS = new Set<knownArgument>(['cluster']);
const APP_ARGS = new Map<knownArgument, string>();

const isKnownArgument = (argument: string): argument is knownArgument => {
  if (KNOWN_AGRUMENTS.has(argument as knownArgument)) {
    return true;
  }
  return false;
};

class UnknownArgumentError extends Error {
  constructor(argument: string) {
    super(`Unknown argument provided: ${argument}`);
  }
}

process.argv.slice(2).forEach((rawArg) => {
  if (!rawArg.startsWith('--')) {
    throw new UnknownArgumentError(rawArg);
  }

  const [argName, argValue] = rawArg.replace('--', '').split('=');

  if (argName && isKnownArgument(argName)) {
    // TODO: booleans are tricky, think about improvement
    APP_ARGS.set(argName, argValue || 'true');
  } else {
    throw new UnknownArgumentError(rawArg);
  }
});

export default APP_ARGS;
