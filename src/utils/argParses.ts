const KNOWN_AGRUMENTS = ['--cluster'];

export const parseArguments = (args: string[]) => {
  const parsedArguments = new Map<string, string | boolean>();

  args.forEach((arg) => {
    if (!arg.startsWith('--')) {
      return;
    }
    const [argName, argValue] = arg.split('=');
    if (argName && KNOWN_AGRUMENTS.indexOf(argName) >= 0) {
      parsedArguments.set(arg.slice(2), argValue || true);
    }
  });

  return parsedArguments;
};
