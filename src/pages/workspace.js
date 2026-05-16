import Layout from '@theme/Layout';
import {useHistory} from '@docusaurus/router';

import DesktopWorkspace from '../components/DesktopWorkspace';
import styles from './workspace.module.css';

export default function Workspace() {
  const history = useHistory();

  return (
    <Layout
      title="Archive Workspace"
      description="Independent archive runtime workspace"
      noFooter
      noNavbar
    >
      <main className={styles.workspacePage}>
        <div className={styles.workspaceShell}>
          <DesktopWorkspace
            onBoot={() => {
              history.push('/');
            }}
          />
        </div>
      </main>
    </Layout>
  );
}
