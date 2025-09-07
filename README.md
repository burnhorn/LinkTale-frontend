# LinkTale: AI Agent 동화책 제작 프로젝트
![Generated Image September 05, 2025 - 3_50PM](https://github.com/user-attachments/assets/f6b5e795-2073-419d-aac5-10b37c6660d4)

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?logo=svelte&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

> LinkTale은 SvelteKit으로 구축된 AI 기반 인터랙티브 스토리텔링 플랫폼입니다. 사용자는 AI와 상호작용하며 동화를 만들고 완성된 이야기를 관리하며 다른 사용자와 공유할 수 있습니다.

---

## 개요 (프론트엔드 버전)


### 프로젝트 실행 데모 (GIF)
![Lintale_demo](https://github.com/user-attachments/assets/84b5c587-fac1-4a97-8322-f632aefb3cf1)

### 주요 기능 스크린샷 (Key Feature Screenshots)

#### 1. 사용자

##### 1.1. 3단 뷰: 메인 창작 화면
<img width="1839" height="889" alt="03" src="https://github.com/user-attachments/assets/960bd09a-21c9-4511-a6e5-0e9ccc6d946d" />


##### 1.2. 캔버스: 이미지 수정 화면
<img width="1829" height="877" alt="07" src="https://github.com/user-attachments/assets/9a84d672-93af-411f-9625-f199abdec37c" />


##### 1.3. 기타: 구성요소

###### 1. 나의 책장
<img width="1823" height="873" alt="12" src="https://github.com/user-attachments/assets/a6094e98-73d8-4aeb-8b48-f80f0eed64d9" />

###### 1. 세계관 도감
<img width="1823" height="887" alt="13" src="https://github.com/user-attachments/assets/4db12b2b-903d-4d0a-85f9-8079c5955d5f" />

###### 3. 모험가의 광장
<img width="1815" height="883" alt="14" src="https://github.com/user-attachments/assets/606ef31d-a643-494c-afbf-3ca21fa666a8" />


#### 2. 관리자

##### 2.1. 대시보드
<img width="1831" height="879" alt="15" src="https://github.com/user-attachments/assets/72403965-8eac-4d8b-bbdc-ecf6e491c925" />

##### 2.2. 사용자 관리
<img width="1847" height="883" alt="16" src="https://github.com/user-attachments/assets/492a4cfd-2282-482d-8854-4fca656107e4" />

##### 2.3. 콘텐츠 분석
<img width="1825" height="873" alt="17" src="https://github.com/user-attachments/assets/3e666977-a007-4839-9c1a-d2c633d69c88" />

##### 2.4. 수익 분석
<img width="1825" height="879" alt="18" src="https://github.com/user-attachments/assets/16ce2f04-279b-436e-a41b-a52a19248cbc" />


---

## 목차 (Index)

1.  [프로젝트 소개 (About The Project)](#1-프로젝트-소개-about-the-project)
2.  [주요 기능 (Features)](#2-주요-기능-features)
3.  [아키텍처 (Architecture)](#3-아키텍처-architecture)
4.  [기술 스택 및 사용 이유 (Tech Stack & Why)](#4-기술-스택-및-사용-이유-tech-stack--why)
5.  [프로젝트 구조 (Project Structure)](#5-프로젝트-구조-project-structure)
6.  [설치 및 실행 (Getting Started)](#6-설치-및-실행-getting-started)
7.  [향후 개선 계획 (Future Work)](#7-향후-개선-계획-future-work)

---

## 1. 프로젝트 소개 (About The Project)

LinkTale은 사용자가 AI 창작 과정에 직접 참여하는 경험을 제공하는 인터랙티브 스토리텔링 플랫폼입니다. 이 프로젝트는 사용자가 AI와 대화하며 스토리를 만들고 완성된 이야기를 책장 형태로 관리하며 PDF 저장으로 완성되는 몰입감 높은 웹 애플리케이션의 구현을 담당합니다.

*   **개발 목표:** 백엔드 LinkTale 에이전트 시스템과 유기적으로 연동하여 복잡한 AI 생성 과정을 사용자 친화적이고 직관적인 UI/UX로 제공하는 것을 목표로 합니다.
*   **핵심 가치:** 실시간 상호작용, 개인화된 콘텐츠 관리 그리고 원활한 사용자 경험을 통해 창작의 즐거움을 극대화합니다.

---

## 2. 주요 기능 (Features)

### 사용자 기능
*   **랜딩 페이지**: 서비스의 특징, FAQ, 가격 정책 등을 소개하는 정적 페이지.
*   **사용자 인증**: 회원가입 및 로그인을 위한 모달(Modal) 기반 인증 시스템.
*   **라이브 스테이지**: AI와 실시간 상호작용하는 웹소켓 기반 채팅 시스템.
*   **스토리 리더**: AI와 함께 창작한 스토리를 읽고 삽화도 볼 수 있는 뷰어.
*   **나만의 책장 (Bookshelf)**: 사용자가 생성하고 저장한 스토리들을 책장 형태로 시각화하여 관리.
*   **백과사전 (Encyclopedia)**: 스토리 진행 중 등장한 키워드나 개념을 모아보는 기능.
*   **모험가의 광장 (AdventurePlaza)**: 사용자가 다른 사람들의 새로운 스토리를 보면서 자신만의 스토리의 영감을 얻을 수 있는 광장.

### 관리자 기능
*   **관리자 대시보드**: 서비스의 주요 지표(총 사용자, 매출, 콘텐츠 수)를 시각화.
*   **사용자/콘텐츠 관리**: 가입된 사용자 목록 및 생성된 콘텐츠를 관리.
*   **수익 분석**: 기간별 매출 데이터를 차트와 통계로 확인.

---

## 3. 아키텍처 (Architecture)

본 프로젝트는 SvelteKit의 서버 데이터 로딩(SSR)과 클라이언트 상태 관리를 조합하여 효율적인 데이터 흐름과 뛰어난 사용자 경험을 제공합니다.

### **3.1 데이터 흐름**

*   **서버 사이드 데이터 로딩:** 관리자 대시보드와 같이 보안 및 초기 데이터 로딩이 중요한 페이지는 SvelteKit의 `load` 함수를 통해 서버에서 데이터를 미리 렌더링합니다. 이 통신은 서버 간(`apiService.server.ts`)에 일어나므로 클라이언트에 민감한 정보가 노출되지 않습니다.
*   **클라이언트 사이드 상태 관리:** 사용자 인증 정보, 실시간 채팅 내용 등 동적인 상태는 Svelte Store(`authStore.ts`, `stores.ts`)를 통해 전역적으로 관리됩니다. 이를 통해 단일 진실 공급원(SSOT) 원칙을 준수하고 컴포넌트 간 데이터 불일치를 방지합니다.

### **3.2 주요 디자인 패턴 및 기법**

*   **라우트 그룹 `(group)`:** `(app)`, `(admin)`처럼 URL에 영향을 주지 않는 디렉토리 그룹을 활용하여 역할별(사용자/관리자) 공통 레이아웃을 효율적으로 적용합니다.
*   **서비스 계층 (Service Layer):** API 통신 로직을 `apiService`로 중앙화하여 컴포넌트와 데이터 로직을 명확하게 분리합니다.
*   **프록시 패턴 (Proxy Pattern):** 개발 환경에서 `vite.config.ts`의 프록시 설정을 통해 백엔드 API 요청 시 발생하는 CORS 문제를 해결합니다.

---

## 4. 기술 스택 및 사용 이유 (Tech Stack & Why)

| 기술 분류 | 기술 스택 | 선택 이유 |
| :--- | :--- | :--- |
| **Framework** | **SvelteKit** | 뛰어난 성능과 개발 경험을 제공합니다. 파일 시스템 기반 라우팅과 서버/클라이언트 코드의 유연한 통합이 실시간 상호작용 애플리케이션에 적합했습니다. |
| **Language** | **TypeScript** | 대규모 애플리케이션에서 코드의 안정성과 유지보수성을 높여주며 `Zod` 등과 연계하여 타입 안정성을 강화할 수 있습니다. |
| **State Mgmt** | **Svelte Stores** | 프레임워크에 내장된 가볍고 반응적인 상태 관리 도구입니다. 별도의 라이브러리 없이도 중앙화된 상태 관리가 용이합니다. |
| **Data Viz** | **Chart.js** | 관리자 대시보드의 매출 분석 등 다양한 데이터를 시각화하는 데 유연하고 널리 사용되는 라이브러리입니다. |


---

## 5. 프로젝트 구조 (Project Structure)
```
/src
├── lib/             # 재사용 로직, 컴포넌트, 유틸리티
│ ├── components/    # 기능별 공용 컴포넌트 (관리자, 앱, 랜딩)
│ ├── server/        # 서버 전용 로직 (apiService.server.ts)
│ └── stores/        # Svelte 전역 스토어
│ └── apiService.ts  # 클라이언트 사이드 API 통신
│ └── stores.ts      # 전역 상태 관리 (UI, 데이터 등)
│ └── authStore.ts   # 인증 관련 상태 관리 (사용자 정보, 토큰)
└── routes/          # 파일 시스템 기반 라우팅
├── (app)/           # 인증된 사용자용 앱 그룹
├── admin/           # 관리자용 대시보드 그룹
└── api/             # API 엔드포인트
└── chat/            # 대화 로그 프록시 라우터
└── export/          # PDF 생성 프록시 라우터
└── scenes/          # 삽화 생성 프록시 라우터
└── token/           # 로그인/회원가입 프록시 라우터
```

## 5.1. 핵심 컴포넌트 역할

- **`LiveStageSidebar.svelte`**: 사용자가 AI와 직접 상호작용하는 메인 인터페이스입니다. 이 컴포넌트는 사용자의 상태(HUD), 퀘스트, AI와의 채팅 내역을 표시하며 텍스트와 버튼을 통해 AI에게 명령을 내리는 입력창을 포함합니다.
- **`ChatMessageItem.svelte`**: 채팅 UI에서 각 메시지(사용자, AI, 시스템)를 표시하는 컴포넌트입니다.
- **`lib/stores.ts`**: 이 프로젝트의 중앙 데이터 허브이자 두뇌입니다. 
    - Svelte의 Store를 활용하여 애플리케이션의 모든 동적 상태(채팅 내역, 오디오 상태, 장면 정보 등)를 관리하는 단일 진실 공급원(SSOT) 역할을 합니다.
- **`lib/apiService.ts`**: 애플리케이션의 중추 신경계이자 유일한 백엔드 통신 계층입니다.
    - WebSocket 연결 및 실시간 이벤트 처리, HTTP API(로그인, 회원가입, 이미지 수정 등) 요청 등 모든 외부 통신을 전담합니다.

---

## 6. 설치 및 실행 (Getting Started)

### **1. 저장소 복제**
```bash
git clone https://github.com/burnhorn/LinkTale-frontend.git
cd LinkTale-frontend
```

### **2. 의존성 설치**
```bash
npm install
```

### **3. 환경 변수 설정**
```bash
.env.example 파일을 복사하여 .env 파일을 생성하고, 백엔드 API 서버 주소 등 필요한 환경 변수를 입력합니다.
```

### **4. 애플리케이션 실행**
```bash
npm run dev
```

서버가 정상적으로 실행되면 http://localhost:5173 에서 애플리케이션을 확인할 수 있습니다.


## 7. 향후 개선 계획 (Future Work)
*   **타입 관리 개선**: Zod를 도입하여 런타임 유효성 검사를 강화하고 백엔드 API 명세로부터 타입을 자동 생성하여 프론트-백엔드 간 타입 불일치 문제를 원천적으로 해결할 계획입니다.
*   **상태 관리 리팩토링**: 기능이 복잡해짐에 따라 chatStore.ts, storyStore.ts 등 기능 단위로 스토어 파일을 분리하여 코드의 응집도와 유지보수성을 높일 것입니다.
*   **테스트 커버리지 확대**: vitest를 도입하여 스토어, 서비스 로직 등 핵심 기능에 대한 단위/통합 테스트를 작성하여 코드 변경에 대한 안정성을 확보합니다.
*   **UI 컴포넌트 라이브러리화**: src/lib/components를 Storybook 등과 연계하여 독립적인 디자인 시스템으로 발전시켜 UI의 일관성과 재사용성을 극대화합니다.
*   **전역 에러 처리 및 로깅**: hooks.server.ts의 handleError를 활용하여 전역 에러 처리 로직을 구현하고 Sentry와 같은 로깅 서비스를 연동하여 프로덕션 환경의 문제를 신속하게 추적하고 대응할 것입니다.


---

## 라이선스 (License)
이 프로젝트는 **LinkTale 커스텀 라이선스**에 따라 배포됩니다.

본 라이선스는 코드의 자유로운 사용, 복제, 수정 및 배포를 허용합니다. 
단, 한 가지 중요한 제한 사항이 있습니다: 이 프로젝트의 핵심 기능을 사용하여 **경쟁적인 호스팅 서비스(SaaS)를 제공하는 것은 금지됩니다.**

자세한 내용은 프로젝트 루트의 `LICENSE` 파일을 참고해주세요.

[![License](https://img.shields.io/badge/License-Source%20Available%20(Non--compete)-blue.svg)](./LICENSE)

## 연락처 (Contact)

[![Email](https://img.shields.io/badge/Email-jk.bruteforce@gmail.com-blue?style=flat-square&logo=gmail)](mailto:jk.bruteforce@gmail.com)
