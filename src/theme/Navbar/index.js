import React from 'react';
import Navbar from '@theme-original/Navbar';

import ArchiveProtocol from '../../components/ArchiveProtocol';

export default function NavbarWrapper(props) {
  return (
    <>
      <Navbar {...props} />
      <ArchiveProtocol />
    </>
  );
}
