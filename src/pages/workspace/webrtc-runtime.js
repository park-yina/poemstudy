import Layout from '@theme/Layout';
import {useHistory} from '@docusaurus/router';

import DesktopWorkspace from '../../components/DesktopWorkspace';
import styles from '../workspace.module.css';

export default function WebrtcRuntimeWorkspace() {
  const history = useHistory();

  return (
    <Layout
      title="webrtc-runtime Workspace"
      description="webrtc-runtime archive folder workspace"
      noFooter
      noNavbar
    >
      <main className={styles.workspacePage}>
        <div className={styles.workspaceShell}>
          <DesktopWorkspace
            initialWorkspaceSlug="webrtc-runtime"
            onBoot={() => {
              history.push('/');
            }}
          />
        </div>
      </main>
    </Layout>
  );
}
