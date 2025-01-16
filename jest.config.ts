import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Node.js 환경에서 테스트 실행
  rootDir: './src', // 소스 파일이 있는 디렉토리
  moduleFileExtensions: ['ts', 'js'], // 테스트할 파일 확장자
  testMatch: ['**/__tests__/**/*.test.ts'], // 테스트 파일 경로 패턴
};

export default config;
