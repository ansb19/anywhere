"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = (0, express_1.Router)();
// 사용자가 처음이면 회원가입 기존에 있으면 로그인
router.post('/sign', UserController_1.default.createUser);
// 닉네임을 변경
router.put('/update/nickname', UserController_1.default.updateUser);
router.get('/find/nickname', UserController_1.default.getUserByNickname);
router.delete('/delete/nickname', UserController_1.default.deleteUser);
router.get('/test', UserController_1.default.test);
// 유저의 등록한 장소 조회
router.get('/place/find');
// 유저의 등록한 장소 삭제
router.delete('/place/delete');
// 유저의 등록한 장소 수정
router.put('/place/update');
exports.default = router;
