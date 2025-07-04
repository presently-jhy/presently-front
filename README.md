# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Presently - 선물, 기념일, 더 완벽하게

Presently는 선물과 기념일을 관리하는 웹 애플리케이션입니다.

## 🎨 디자인 시스템

### CSS 변수 기반 디자인 시스템

-   **색상**: Primary, Secondary, Success, Error, Warning, Info 색상 팔레트
-   **간격**: xs, sm, md, lg, xl, 2xl, 3xl 스페이싱 시스템
-   **타이포그래피**: 폰트 크기, 굵기, 행간 일관성
-   **그림자**: sm, md, lg, xl 그림자 시스템
-   **반응형**: 모바일, 태블릿, 데스크탑 대응
-   **다크모드**: 자동 다크모드 지원

### 공통 컴포넌트

#### Button 컴포넌트

-   **Variants**: primary, secondary, outline, ghost, danger, success
-   **Sizes**: small, medium, large
-   **States**: disabled, loading
-   **Features**: fullWidth, 애니메이션 효과

#### Input 컴포넌트

-   **Features**: label, error, helperText, required
-   **Sizes**: small, medium, large
-   **States**: disabled, error
-   **Accessibility**: 포커스 스타일, aria 속성

#### Modal 컴포넌트

-   **Sizes**: small, medium, large, full
-   **Features**: backdrop blur, ESC 키 닫기, 오버레이 클릭 닫기
-   **Accessibility**: aria-modal, 키보드 네비게이션

#### Toast 알림 시스템

-   **Types**: success, error, warning, info
-   **Features**: 자동 사라짐, 수동 닫기, 애니메이션
-   **Context**: 전역 상태 관리

#### EmptyState 컴포넌트

-   **Icons**: package, calendar, gift, users, search
-   **Sizes**: small, medium, large
-   **Features**: 커스텀 액션 버튼

#### ErrorState 컴포넌트

-   **Features**: 재시도 버튼, 에러 메시지
-   **Sizes**: small, medium, large

## 🚀 주요 기능

-   **이벤트 관리**: 생일, 기념일 등 이벤트 등록 및 관리
-   **선물 관리**: 선물 아이디어 등록 및 추적
-   **펀딩**: 이벤트별 펀딩 기능
-   **통계**: 이벤트 및 선물 통계 시각화
-   **친구 초대**: 이벤트 공유 및 친구 초대
-   **반응형 디자인**: 모든 디바이스에서 최적화된 경험

## 🛠 기술 스택

-   **Frontend**: React 19, Vite
-   **Styling**: CSS Modules, CSS Variables
-   **Animation**: Framer Motion
-   **Icons**: Lucide React
-   **Backend**: Supabase
-   **Routing**: React Router DOM
-   **State Management**: React Context

## 📱 컴포넌트 사용법

### Button 사용 예시

```jsx
import { Button } from './components';

<Button variant="primary" size="medium" onClick={handleClick}>
    클릭하세요
</Button>;
```

### Input 사용 예시

```jsx
import { Input } from './components';

<Input label="이메일" placeholder="이메일을 입력하세요" required error={emailError} />;
```

### Toast 사용 예시

```jsx
import { useToast } from './context/ToastContext';

const { showSuccess, showError } = useToast();

showSuccess('성공적으로 처리되었습니다!');
showError('오류가 발생했습니다.');
```

## 🎯 컴포넌트 쇼케이스

새로 추가된 컴포넌트들을 확인하려면 `/showcase` 경로로 이동하세요.

## 🔧 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 번들 분석
npm run build:analyze

# 린트 검사
npm run lint
```

## 📁 프로젝트 구조

```
src/
├── components/          # 공통 컴포넌트
│   ├── Button/         # 버튼 컴포넌트
│   ├── Input/          # 입력 컴포넌트
│   ├── Modal/          # 모달 컴포넌트
│   ├── Toast/          # 토스트 알림
│   ├── EmptyState/     # 빈 상태 컴포넌트
│   └── ErrorState/     # 에러 상태 컴포넌트
├── context/            # React Context
│   ├── AuthContext.jsx # 인증 컨텍스트
│   └── ToastContext.jsx # 토스트 컨텍스트
├── pages/              # 페이지 컴포넌트
├── global.css          # 전역 스타일 및 CSS 변수
└── router.jsx          # 라우팅 설정
```

## 🎨 디자인 가이드라인

### 색상 팔레트

-   **Primary**: #6366f1 (인디고)
-   **Secondary**: #f59e0b (앰버)
-   **Success**: #10b981 (에메랄드)
-   **Error**: #ef4444 (레드)
-   **Warning**: #f59e0b (앰버)
-   **Info**: #3b82f6 (블루)

### 간격 시스템

-   **xs**: 0.25rem (4px)
-   **sm**: 0.5rem (8px)
-   **md**: 1rem (16px)
-   **lg**: 1.5rem (24px)
-   **xl**: 2rem (32px)
-   **2xl**: 3rem (48px)
-   **3xl**: 4rem (64px)

### 타이포그래피

-   **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
-   **Font Sizes**: xs(12px), sm(14px), base(16px), lg(18px), xl(20px), 2xl(24px), 3xl(30px), 4xl(36px)
-   **Font Weights**: normal(400), medium(500), semibold(600), bold(700)

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
