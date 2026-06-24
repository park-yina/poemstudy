import React from 'react';

import ArchiveRoomPage from '../../components/ArchiveRoom/ArchiveRoomPage';
import FullstackSection from '../../components/ArchiveRoom/FullstackSection';

export default function ArchiveRoom() {
  return (
    <ArchiveRoomPage activeSection="fullstack">
      {(archiveRoomProps) => (
        <FullstackSection {...archiveRoomProps} />
      )}
    </ArchiveRoomPage>
  );
}
