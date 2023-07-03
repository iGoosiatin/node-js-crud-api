class UnknownArgumentError extends Error {
  constructor(argument: string) {
    super(`Unknown argument provided: ${argument}`);
  }
}

type knownArgument = 'cluster';
type argumentValue = string | number | boolean;

const APP_CONFIG: { [key in knownArgument]: argumentValue } = {
  cluster: false,
};

const isKnownArgument = (argument: string | undefined): argument is knownArgument => {
  if (argument && Object.keys(APP_CONFIG).indexOf(argument) > -1) {
    return true;
  }
  return false;
};

process.argv.slice(2).forEach((rawArg) => {
  if (!rawArg.startsWith('--')) {
    throw new UnknownArgumentError(rawArg);
  }

  const [argName, argValue] = rawArg.replace('--', '').split('=');

  if (isKnownArgument(argName)) {
    if (!argValue) {
      APP_CONFIG[argName] = true;
      return;
    }

    if (argValue === 'false') {
      APP_CONFIG[argName] = false;
      return;
    }

    if (!isNaN(Number(argValue))) {
      APP_CONFIG[argName] = Number(argValue);
      return;
    }

    APP_CONFIG[argName] = argValue;
  } else {
    throw new UnknownArgumentError(rawArg);
  }
});

export default APP_CONFIG;
