// ./graphql/resolvers.js
import path from 'path';
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

const resolversArray = loadFilesSync(path.join(__dirname), { extensions: ['js', 'ts'] });

const resolversIndex = mergeResolvers(resolversArray);

export default resolversIndex;