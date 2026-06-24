import React from 'react';

import ArchiveRoomPage from '../../components/ArchiveRoom/ArchiveRoomPage';
import {
  YinaSection,
} from '../../components/ArchiveRoom/FullstackSection';

export default function ArchiveRoomYina() {
  return (
    <ArchiveRoomPage activeSection="yina">
      {(archiveRoomProps) => (
        <YinaSection {...archiveRoomProps} />
      )}
    </ArchiveRoomPage>
  );
}
