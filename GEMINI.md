# GEMINI.md

## 프로젝트 개요 (Project Overview)
- **프로젝트 명**: 마이링크 (MyLink)
- **목적**: 크리에이터와 개인을 위한 직관적이고 가벼운 '멀티 링크 랜딩 페이지' 구축 서비스.
- **핵심 가치**: 복잡한 기능을 배제한 본질적인 '정보 연결'과 사용자 친화적인 '인라인 편집' 인터페이스 제공.
- **주요 기술 스택**:
  - **Framework**: Next.js 16.1.7 (App Router, Turbopack)
  - **Library**: React 19
  - **Language**: TypeScript
  - **Styling**: Tailwind CSS 4, shadcn/ui
  - **Theme**: next-themes (다크 모드 지원, 'D' 키 단축키 포함)

## 빌드 및 실행 (Building and Running)
- **개발 서버 실행**: `npm run dev` (Turbopack 사용)
- **프로덕션 빌드**: `npm run build`
- **프로덕션 서버 시작**: `npm run start`
- **린트 체크**: `npm run lint`
- **코드 포맷팅**: `npm run format`
- **타입 체크**: `npm run typecheck`

## 개발 컨벤션 (Development Conventions)
- **UI 컴포넌트**: `shadcn/ui`를 기본으로 사용하며, `components/ui` 디렉토리에 위치합니다.
- **스타일링**: Tailwind CSS 4를 사용하며, 클래스 병합 시 `lib/utils.ts`의 `cn()` 유틸리티 함수를 사용합니다.
- **인라인 편집 (Inline Editing)**: 사용자가 자신의 페이지에서 텍스트를 직접 클릭하여 수정할 수 있는 방식을 지향합니다 (PRD 참조).
- **폰트**: Geist 및 Geist Mono 폰트가 설정되어 있으며, 각각 `--font-sans`와 `--font-mono` 변수로 사용 가능합니다.
- **테마**: `next-themes`를 통한 시스템 테마 감지 및 수동 전환을 지원합니다. 'D' 키를 눌러 다크/라이트 모드를 토글할 수 있습니다.

## 주요 문서 (Key Documentation)
- **PRD**: `docs/PRD.md` (제품 기능 정의서)
- **사용자 시나리오**: `docs/UserScenario.md`
- **와이어프레임**: `docs/Wireframe.md`

## 향후 작업 (TODO)
- Google OAuth 로그인 연동
- 인라인 편집이 가능한 프로필 및 링크 컴포넌트 구현
- 닉네임 기반 동적 라우팅 설정
- NoSQL 기반 데이터베이스 모델링 및 연동
