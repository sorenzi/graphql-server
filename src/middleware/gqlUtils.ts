import { IResolverHandler, ResolverHandlerMap, ResolverMap } from '.';

// Mapping resolver handlers by a generated identifier
export const generateHandlersMap = (handlers: IResolverHandler[]) => {
  const map: ResolverHandlerMap = {};
  handlers.forEach((handler) => {
    const id = generateHandlerIdentifier(handler.resolver);
    if (map[id]) {
      throw new Error(`Duplicate resolver detected: ${id}`);
    }
    map[id] = handler;
  });
  return map;
};

// Creating an identifer for each resolver handler based on the query operation (Query/Mutation/Subscription) and the handler function signature name
const generateHandlerIdentifier = (resolver: ResolverMap) => {
  const operationName = Object.keys(resolver)[0];
  if (!operationName) throw new Error('Resolver should have an operation name');

  const body = resolver[operationName];
  if (!body) throw new Error('Resolver should handler function');

  const name = Object.keys(body)[0];
  if (!name) throw new Error('Resolver function should have a name');

  const identifier = `${operationName}_${name}`.toLowerCase();
  return identifier;
};

// This function will extract the GQL query input (to be validated if needed using Joi later on)
export const extractInput = (query: any, key: string, variables: any) => {
  const args = (query.definitions[0] as any).selectionSet?.selections[0]
    .arguments;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const { name: argumentNameObj } = arg;
    if (argumentNameObj) {
      const { value: argumentKeyValue } = argumentNameObj;
      if (argumentKeyValue === key) {
        const { value: valueObj } = arg;
        const { kind: argumentValueKind } = valueObj;

        // checking if the argument is not a variable i.e 'StringValue' in which case we found what we needed
        if (valueObj && valueObj.block === false) {
          return valueObj.value;
        }

        // checking if the argument is a variable if so we get its name and return the value from the 'variables' object in the request body
        if (argumentValueKind === 'Variable' && variables) {
          const { name } = valueObj;
          if (name) {
            const { value } = name;
            if (value) {
              return variables[value];
            }
          }
        }
      }
    }
  }
};

// Extract identifer from GQL query object
export const extractIdentifier = (query: any) => {
  if (query) {
    try {
      const resolverName = (query.definitions[0] as any).selectionSet
        .selections[0].name.value;
      // ignoring introspection call
      if (resolverName === '__schema') {
        return null;
      }

      const { operation } = query.definitions[0] as any;
      return `${operation}_${resolverName}`.toLowerCase();
    } catch (err) {
      throw new Error(
        `Could not extract resolver identifier: ${JSON.stringify(err)}`
      );
    }
  }

  return null;
};
