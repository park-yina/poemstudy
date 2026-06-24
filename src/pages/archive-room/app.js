import React from 'react';

import ArchiveRoomPage from '../../components/ArchiveRoom/ArchiveRoomPage';
import {
  AppSection,
} from '../../components/ArchiveRoom/FullstackSection';

export default function ArchiveRoomApp() {
  return (
    <ArchiveRoomPage activeSection="app">
      {(archiveRoomProps) => (
        <AppSection {...archiveRoomProps} />
      )}
    </ArchiveRoomPage>
  );
}
