import { sseFolder } from './sse';
import {searchFolder} from './search';
export const jumpingBattleWorkspace = {
  docsManifestKey: 'jumpingbattle',

  folders: [

    sseFolder,
    //cacheFolder,
    // listenerFolder,
    // signedUrlFolder,
    searchFolder,
    // bootstrapFolder,

  ],
};
