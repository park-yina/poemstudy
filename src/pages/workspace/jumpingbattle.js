import Layout from '@theme/Layout';
import {useHistory} from '@docusaurus/router';

import DesktopWorkspace from '../../components/DesktopWorkspace';
import styles from '../workspace.module.css';

export default function JumpingbattleWorkspace() {
  const history = useHistory();

  return (
    <Layout
      title="jumpingbattle Workspace"
      description="jumpingbattle archive folder workspace"
      noFooter
      noNavbar
    >
      <main className={styles.workspacePage}>
        <div className={styles.workspaceShell}>
          <DesktopWorkspace
            initialWorkspaceSlug="jumpingbattle"
            onBoot={() => {
              history.push('/');
            }}
          />
        </div>
      </main>
    </Layout>
  );
}
