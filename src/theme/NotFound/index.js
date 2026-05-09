import React from 'react';

import { PageMetadata } from '@docusaurus/theme-common';


import NotFoundContent from '@theme/NotFound/Content';

export default function Index() {

  return (
    <>
      <PageMetadata title="404 :: ROUTE_NOT_FOUND" />

        <NotFoundContent />
    </>
  );
}