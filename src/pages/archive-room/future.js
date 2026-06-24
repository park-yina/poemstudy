import React from 'react';

import ArchiveRoomPage from '../../components/ArchiveRoom/ArchiveRoomPage';
import {
  FutureSection,
} from '../../components/ArchiveRoom/FullstackSection';

export default function ArchiveRoomFuture() {
  return (
    <ArchiveRoomPage activeSection="future">
      {(archiveRoomProps) => (
        <FutureSection {...archiveRoomProps} />
      )}
    </ArchiveRoomPage>
  );
}
