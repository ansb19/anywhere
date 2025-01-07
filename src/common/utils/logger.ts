// src/common/utils/logger.ts
import { EnvConfig } from "@/config/env-config";
import Container from "typedi";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const config = Container.get(EnvConfig);
const logDirectory = path.resolve("logs");

const dailyRotateFileTransport = new DailyRotateFile({
    dirname: logDirectory, // 로그 파일 저장 디렉터리
    filename: "application-%DATE%.log", // 로그 파일 이름 패턴
    datePattern: "YYYY-MM-DD",  // 날짜 패턴
    zippedArchive: true, // 로그 파일 압축 여부
    maxSize: "20m", // 파일 당 최대 크기 (20MB)
    maxFiles: "14d"// 보관 기간 (최근 14일간의 로그 유지)
})

// 한국 시간 포맷 적용
const koreanTimeFormat = format.combine(
    format.timestamp({
        format: () => new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    }),
    format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

export const logger = createLogger({
    level: config.NODE_ENV === "production" ? "error" : "debug", // 로그 레벨 설정
    format: koreanTimeFormat,
    transports: [
        new transports.Console(), // 콘솔에 출력
        dailyRotateFileTransport,
    ],
});


