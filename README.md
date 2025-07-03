## 기술
### Node.js : 서버 
### Express : 라우터 구성
### MySQL : 회원 데이터 저장
### bcrypt : 비밀번호 암호화
### dotenv : 환경 변수 관리

## 구현
### 1. 기본 프로젝트 구조 만들기 - 디렉토리 구성
### 2. MySQL 테이블 설계 및 생성
### 3. 서버 실행 및 DB 연결 설정
### 4. 회원가입 기능
### 5. Postman으로 API test
### 6. 로그인
### 7. JWT token 인증
### 8. 내 정보 확인
### 9. 채팅방 생성
### 10. 채팅방 목록 조회

## 소스 코드

### index.js : 서버의 진입점 (main file)으로서 전체 웹 서버의 초기화, 라우팅 연결, 기본 테스트 담당
#### 1. express app 생성
#### 2. 미들웨어 등록 
#### 3. 라우터 (/api/auth) 연결
#### 4. DB 연결 테스트용 / endpoint 제공
#### 5. 서버 실행

### config/db.js : MySQL 연결 객체 생성 / 모든 DB 작업의 연결 통로로서 각 controller에서 이걸 import하여 SQL query 수행
#### 1. .env 파일로부터 DB 정보 불러오기
#### 2. mysql2/promise 모듈로 connection pool 생성
#### 3. 다른 파일에서 DB query 수행 가능하도록 module.exports

### routes/auth.js : 사용자 인증 관련 API 경로 처리
#### 1. exporess.Router()로 별도 라우터 생성
#### 2. /register, /login 경로에 각각 authController 함수 연결
#### -> /api/auth/register, /api/auth/login 경로 정의하여 요청 들어오면 해당 controller 함수 실행

### controllers/auth.js : 회원가입 & 로그인 로직 담당
#### 1. 회원가입 : req.body에서 사용자 정보 받아 유저 중복 여부 확인한다. 비밀번호를 해싱하여 password_hash 컬럼에 저장하고 새 유저 insert query 실행
#### 2. 로그인 : DB에서 해당 username이 존재하는지 검색하고 bcrypt로 비밀번호 비교한다. 성공 시 JWT token을 생성하여 클라이언트에 전달한다.

### .env file 
#### 1. 민감 정보 보관
#### 2. 비밀번호나 토큰 키와 같이 중요한 정보는 코드에 직접 입력하지 않고 .env에 따로 뺴서 관리
