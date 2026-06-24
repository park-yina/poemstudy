import React from 'react';

import ArchiveRoomPage from '../../components/ArchiveRoom/ArchiveRoomPage';
import {
  BackendSection,
} from '../../components/ArchiveRoom/FullstackSection';

export default function ArchiveRoomBackend() {
  return (
    <ArchiveRoomPage activeSection="backend">
      {(archiveRoomProps) => (
        <BackendSection {...archiveRoomProps} />
      )}
    </ArchiveRoomPage>
  );
}
