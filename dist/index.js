"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// async function main() {
//     try {
//         // 데이터 소스 초기화
//         await AppDataSource.initialize();
//         const userRepository = AppDataSource.getRepository(User);
//         // 새 사용자 생성
//         const newUser = userRepository.create({
//             firstName: "John",
//             lastName: "Doe",
//             isActive: true,
//         });
//         // 새 사용자 저장
//         await userRepository.save(newUser);
//         console.log("User has been saved.");
//     } catch (error) {
//         console.error("DB_ERROR: ", error);
//     } finally {
//         // 연결 닫기
//         await AppDataSource.destroy();
//     }
// }
// main();
