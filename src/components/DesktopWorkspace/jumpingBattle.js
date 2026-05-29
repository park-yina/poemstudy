import { sseFolder } from './sse';
import {searchFolder} from './search';
import {cacheFolder} from './cache';
export const jumpingBattleWorkspace = {
  docsManifestKey: 'jumpingbattle',

  folders: [

    sseFolder,
    cacheFolder,
    // listenerFolder,
    // signedUrlFolder,
    searchFolder,
    // bootstrapFolder,

  ],
};
