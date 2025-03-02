# hipter test

힙하게 벡터 저장소 테스트.

## Stacks

- Hono: HTTP API 서버.
- Kysely: 타입 안전한 쿼리 빌더.
- PostgreSQL + pgVector: 벡터 DB.
- [TEI](https://huggingface.co/docs/text-embeddings-inference/index): 임베딩, 리랭커 모델 서빙.

## Examples

### 문서 등록

```sh
curl -X 'POST' \
  'http://localhost:3000/api/doc' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{ "content": "인공지능은 의료, 금융, 교육 등 다양한 분야에서 활용될 수 있다." }'
```

### 문서 검색

#### 유사한 문서

단순히 임베딩 벡터의 유사도로 필터링.

```sh
curl -X 'POST' \
  'http://localhost:3000/api/doc-search/similar?content=AI를 어떻게 활용할 수 있을까? \
  -H 'accept: application/json'
```

```json
[
  {
    "id": 26,
    "content": "인공지능은 의료, 금융, 교육 등 다양한 분야에서 활용될 수 있다.",
    "score": 0.6347189385033964
  },
  {
    "id": 7,
    "content": "인공지능은 머신러닝과 딥러닝을 포함한 다양한 기술로 구성되어 있으며, 미래 산업에 큰 변화를 가져올 수 있다.",
    "score": 0.5480274884717169
  },
  {
    "id": 5,
    "content": "안녕하세요.",
    "score": 0.4767405390739441
  }
]
```

#### 답변이 되는 문서

임베딩 벡터의 유사도로 1차 검색 후 재순위화를 거쳐 2차 필터링.

```sh
curl -X 'POST' \
  'http://localhost:3000/api/doc-search/qna?question=AI를 어떻게 활용할 수 있을까? \
  -H 'accept: application/json'
```

```json
[
  {
    "id": 26,
    "content": "인공지능은 의료, 금융, 교육 등 다양한 분야에서 활용될 수 있다.",
    "score": 0.966156
  },
  {
    "id": 7,
    "content": "인공지능은 머신러닝과 딥러닝을 포함한 다양한 기술로 구성되어 있으며, 미래 산업에 큰 변화를 가져올 수 있다.",
    "score": 0.14878775
  },
  {
    "id": 6,
    "content": "안녕",
    "score": 0.000016187581
  }
]
```

## Development

1. 저장소를 Clone 후 `npm i` 명령으로 종속성을 설치한다.
2. `.env.template` 파일을 `.env`로 복사하고 내용을 적절히 수정한다.
3. `docker compose -f docker-compose.dev.yml up -d` 명령으로 DB, TEI 등을 실행한다.
4. `npm run dev` 명령으로 서버를 실행한다.
5. 웹 브라우저에서 서버의 `/api-doc` 경로로 접속하여 Swagger UI를 통해 테스트한다.
6. DB, TEI 종료하려면 `docker compose -f docker-compose.dev.yml down` 명령으로 컨테이너를 삭제한다.
