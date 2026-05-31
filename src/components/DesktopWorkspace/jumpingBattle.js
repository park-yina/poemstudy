import { sseFolder } from './sse';
import {searchFolder} from './search';
import {cacheFolder} from './cache';
import {listenerFolder} from './listener';
export const jumpingBattleWorkspace = {
  docsManifestKey: 'jumpingbattle',

  folders: [

    sseFolder,
    cacheFolder,
   listenerFolder,
    // signedUrlFolder,
    searchFolder,
    // bootstrapFolder,

  ],
};
