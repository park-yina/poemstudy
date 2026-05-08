import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '실시간 랭킹 시스템 운영',

    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,

    description: (
      <>
        약 30개 매장에서 사용된 스트리밍 플랫폼을 운영하며
        SSE 기반 실시간 랭킹 시스템과 인증 구조를 설계했습니다.
      </>
    ),

    tags: ['Spring Boot', 'Flask', 'AWS', 'SSE'],
  },

  {
    title: '운영 중심 관리자 시스템 구축',

    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,

    description: (
      <>
        운영 KPI, 권한 분리, 매장 상태 관리 등을 고려한
        통합 관리자 시스템을 설계하고 구축했습니다.
      </>
    ),

    tags: ['MyBatis', 'JWT', 'Docker', 'MySQL'],
  },

  {
    title: 'IoT / Device 구조 설계',

    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,

    description: (
      <>
        타일 상태 및 LED 제어를 위한
        실시간 장비 통신 구조와 프로토콜을 설계했습니다.
      </>
    ),

    tags: ['IoT', 'MQTT', 'WebRTC', 'Protocol'],
  },
];

function Feature({Svg, title, description, tags}) {
  return (
    <div className={clsx('col col--4', styles.featureCardWrapper)}>
      <div className={styles.featureCard}>

        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>

        <div className={clsx('text--center', styles.featureContent)}>

          <Heading as="h3" className={styles.featureTitle}>
            {title}
          </Heading>

          <p className={styles.featureDescription}>
            {description}
          </p>

          <div className={styles.featureTags}>
            {tags.map((tag, idx) => (
              <span key={idx} className={styles.featureTag}>
                {tag}
              </span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>

      <div className="container">

        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>
            PROJECTS
          </span>

          <Heading as="h2" className={styles.sectionTitle}>
            운영과 구조 중심의 프로젝트들
          </Heading>

          <p className={styles.sectionDescription}>
            단순 기능 구현보다 실제 운영 환경에서의 문제 해결과
            구조 설계를 중요하게 생각합니다.
          </p>
        </div>

        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>

      </div>

    </section>
  );
}