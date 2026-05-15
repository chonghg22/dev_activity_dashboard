# Dev Activity Dashboard

`Dev Activity Dashboard`는 `Dev Activity Hub` 백엔드의 공개 API를 시각화하는 Next.js 16 기반 포트폴리오 대시보드다.

## Local Path

- 로컬 프로젝트 경로: `/Users/jack/project/portfolio-activity-dashboard`
- GitHub 원격: `https://github.com/chonghg22/dev_activity_dashboard.git`

## Environment Variables

`.env.local`

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

- 로컬 개발: `http://localhost:8080`
- 배포 환경: 공개로 접근 가능한 백엔드 API 도메인으로 교체

## Local Development

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 연다.

## Production Build

```bash
npm run build
npm run start
```

- 현재 레이아웃은 외부 Google Fonts 의존성을 제거해 네트워크가 제한된 환경에서도 빌드 가능하도록 정리했다.
- 백엔드 CORS 에는 대시보드 origin 이 허용되어 있어야 한다.

## Vercel Deploy Checklist

1. GitHub 레포 `dev_activity_dashboard`를 Vercel에 연결
2. Root Directory를 현재 프로젝트 기준으로 설정
3. Environment Variable `NEXT_PUBLIC_API_BASE_URL` 추가
4. 백엔드에 `APP_CORS_ALLOWED_ORIGIN_1=https://<your-vercel-domain>` 설정
5. 배포 후 메인/프로젝트/타임라인 페이지 응답 확인

## Current Routes

- `/`
- `/projects`
- `/projects/[slug]`
- `/timeline`

## Notes

- 공개 API가 비어 있거나 연결되지 않으면 일부 페이지는 fallback UI를 보여준다.
- 주간 리뷰 페이지 `/weekly`는 아직 구현 전이다.
