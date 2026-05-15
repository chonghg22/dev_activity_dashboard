# Dev Activity Dashboard

`Dev Activity Dashboard`는 `Dev Activity Hub` 데이터를 Vercel 서버에서 직접 PostgreSQL로 조회해 시각화하는 Next.js 16 기반 포트폴리오 대시보드다.

## Local Path

- 로컬 프로젝트 경로: `/Users/jack/project/portfolio-activity-dashboard`
- GitHub 원격: `https://github.com/chonghg22/dev_activity_dashboard.git`

## Environment Variables

`.env.local`

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=require
# 또는 아래 개별 값 사용
SUPABASE_DB_HOST=<host>
SUPABASE_DB_PORT=6543
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USERNAME=<user>
SUPABASE_DB_PASSWORD=<password>
APP_DB_SCHEMA=dev_activity_hub
```

- `DATABASE_URL` 또는 `SUPABASE_DB_*` 조합 중 하나만 설정하면 된다.
- 브라우저로 내려가는 값이 아니므로 `NEXT_PUBLIC_*` 접두사는 사용하지 않는다.

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
- 서버 컴포넌트가 DB를 직접 조회하므로 공개 API나 CORS 설정은 필요하지 않다.

## Vercel Deploy Checklist

1. GitHub 레포 `dev_activity_dashboard`를 Vercel에 연결
2. Root Directory를 현재 프로젝트 기준으로 설정
3. Environment Variable `DATABASE_URL` 또는 `SUPABASE_DB_*` 추가
4. `APP_DB_SCHEMA=dev_activity_hub` 확인
5. 배포 후 메인/프로젝트/타임라인 페이지 응답 확인

## Current Routes

- `/`
- `/projects`
- `/projects/[slug]`
- `/timeline`

## Notes

- DB 접속 정보가 없거나 접근할 수 없으면 메인 페이지는 fallback UI를 보여주고, 목록/상세 페이지는 빈 데이터 또는 `not found`로 보일 수 있다.
- 주간 리뷰 페이지 `/weekly`는 아직 구현 전이다.
