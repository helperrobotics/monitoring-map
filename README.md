## 모니터링 확인용 맵

서빙 로봇의 **맵 이미지와 노드 정보를 모니터링하기 위한 웹 뷰어**입니다.  
운영 환경에서는 CloudFront를 통해 배포되어, 로봇 운영/관제 시에 빠르게 맵 상태를 확인할 수 있도록 돕습니다.

실제 배포 예시 도메인:  
[`https://d2dmdwvwj99a8x.cloudfront.net/`](https://d2dmdwvwj99a8x.cloudfront.net/)

---

### 주요 기능

- **맵 ID를 기반으로 한 맵 이미지 조회**
  - URL 쿼리 파라미터 `mapId`를 이용해 특정 맵을 조회합니다.
  - 예: `?mapId=2`, `?mapId=2,5,19`
- **여러 맵 동시 표시**
  - `mapId=2,5,6` 처럼 쉼표(,)로 구분된 여러 ID를 한 번에 표시할 수 있습니다.
- **허용된 맵 ID 검증**
  - 코드 상에서 허용된 ID만 로딩합니다: `['2', '5', '6', '19', '909']`
  - 잘못된 ID는 오류 메시지로 안내됩니다.
- **S3 기반 맵 이미지 로딩**
  - `https://hprobot-bucket.s3.ap-northeast-2.amazonaws.com/map_images/map-background-{mapId}-monitoring.png` 형태의 이미지를 불러옵니다.
- **에러 메시지 출력**
  - `mapId`가 없는 경우
  - 유효하지 않은 `mapId`가 포함된 경우
  - 이미지 로드에 실패한 경우

---

### 기술 스택

- **언어**: TypeScript
- **번들/빌드**: `tsc` (TypeScript 컴파일러)
- **패키지 매니저**: `pnpm`
- **호스팅**: 정적 호스팅(S3 + CloudFront 등) 가정

---

### 프로젝트 구조 (요약)

- `index.html`  
  - 진입 HTML 파일  
  - `#map-images`, `#error-message` 컨테이너를 제공하고 `./dist/main.js`를 로드합니다.
- `src/main.ts`  
  - URL 쿼리 파라미터에서 `mapId`를 읽어 맵 이미지를 생성/표시하는 핵심 로직입니다.
- `style.css`  
  - 기본 레이아웃 및 스타일 정의.
- `tsconfig.json`  
  - `src`를 입력, `dist`를 출력으로 하는 TypeScript 컴파일 설정.

---

### 로컬 개발 / 빌드

#### 1. 요구 사항

- Node.js `>= 18`
- `pnpm` (예: `pnpm@10.13.1`)

#### 2. 의존성 설치

```bash
pnpm install
```

#### 3. 빌드

```bash
pnpm build
```

빌드가 성공하면, TypeScript 소스(`src/main.ts`)가 JavaScript로 컴파일되어 `dist/main.js`가 생성됩니다.

#### 4. 정적 서버로 확인하기 (예시)

아래와 같이 간단한 정적 서버를 띄워서 `index.html`을 확인할 수 있습니다. (도구는 선호에 따라 자유)

```bash
# 예: npx serve 를 사용하는 경우
npx serve .
```

브라우저에서 아래와 같이 접속해 테스트할 수 있습니다.

- `http://localhost:3000/index.html?mapId=2`
- `http://localhost:3000/index.html?mapId=2,5,19`

---

### 사용 방법 (URL 파라미터 규칙)

- **단일 맵**:  
  - `...?mapId=2`
- **여러 맵 동시 조회**:  
  - `...?mapId=2,5,6`
- **허용된 맵 ID**:  
  - 현재 코드 상 허용된 ID는 `2, 5, 6, 19, 909` 입니다.
  - 이 외의 ID는 `유효하지 않은 맵 ID`로 에러 메시지가 출력됩니다.

#### 에러 케이스

- `mapId` 파라미터 자체가 없는 경우
  - 화면 상단에 `맵 ID가 제공되지 않았습니다.` 메시지가 표시되고, 스크립트에서 에러를 발생시킵니다.
- `mapId`에 허용되지 않은 ID가 포함된 경우
  - 예: `?mapId=1,2,999`
  - `유효하지 않은 맵 ID: 1, 999` 와 같은 안내가 표시됩니다.
- 이미지 로드 실패
  - S3에 이미지가 없거나 네트워크 오류 시
  - `맵 ID {id}의 이미지를 불러올 수 없습니다.` 메시지가 표시됩니다.


