import Layout from '@theme/Layout';
import {useHistory} from '@docusaurus/router';

import DesktopWorkspace from '../../components/DesktopWorkspace';
import styles from '../workspace.module.css';

export default function FakejumpingWorkspace() {
  const history = useHistory();

  return (
    <Layout
      title="fakejumping Workspace"
      description="fakejumping archive folder workspace"
      noFooter
      noNavbar
    >
      <main className={styles.workspacePage}>
        <div className={styles.workspaceShell}>
          <DesktopWorkspace
            initialWorkspaceSlug="fakejumping"
            onBoot={() => {
              history.push('/');
            }}
          />
        </div>
      </main>
    </Layout>
  );
}
