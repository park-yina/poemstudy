import clsx from 'clsx';

import Layout from '@theme/Layout';


import styles from './index.module.css';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

/* ========================================
   Hero Slides
======================================== */

const slides = [
  {
    category: 'REAL-TIME SYSTEM',

    title: '실시간 랭킹 시스템 운영',

    description:
      '30개 매장에서 사용된 스트리밍 플랫폼을 운영하며 SSE 기반 실시간 구조와 인증 흐름을 설계했습니다.',

    tags: ['Spring Boot', 'Flask', 'AWS', 'SSE'],
  },

  {
    category: 'ADMIN SYSTEM',

    title: '운영 중심 관리자 시스템 구축',

    description:
      '운영 KPI와 권한 분리, 매장 상태 관리 등을 고려한 통합 관리자 시스템을 설계했습니다.',

    tags: ['MyBatis', 'JWT', 'Docker', 'MySQL'],
  },

  {
    category: 'IOT / DEVICE',

    title: '실시간 장비 통신 구조 설계',

    description:
      '타일 상태 및 LED 제어를 위한 장비 통신 구조와 프로토콜을 설계했습니다.',

    tags: ['IoT', 'MQTT', 'WebRTC'],
  },
];

/* ========================================
   Hero
======================================== */

function HomepageHeader() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>

      <div className="container">

        <Swiper
          modules={[Autoplay, Pagination]}

          slidesPerView={1}

          spaceBetween={30}

          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}

          pagination={{
            clickable: true,
          }}

          loop={true}

          className={styles.heroSwiper}
        >

          {slides.map((slide, idx) => (

            <SwiperSlide key={idx}>

              <div className={styles.heroCard}>

                <span className={styles.heroCategory}>
                  {slide.category}
                </span>

                <h1 className={styles.heroTitle}>
                  {slide.title}
                </h1>

                <p className={styles.heroDescription}>
                  {slide.description}
                </p>

                <div className={styles.heroTags}>

                  {slide.tags.map((tag, i) => (

                    <span
                      key={i}
                      className={styles.heroTag}
                    >
                      {tag}
                    </span>

                  ))}

                </div>

              </div>

            </SwiperSlide>

          ))}

        </Swiper>

      </div>

    </header>
  );
}

/* ========================================
   Page
======================================== */

export default function Home() {
  return (
    <Layout
      title="Luda Log"
      description="운영과 구조 중심의 개발 기록">

      <HomepageHeader />

      <main>


      </main>

    </Layout>
  );
}