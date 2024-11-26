"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 장소 생성
router.post('/place/create');
// 모든 장소 출력
router.get('/place/list');
//해당 페이지의 장소 출력
router.get('/place/list/scroll');
//해당 태그 관련 출력
router.get('/place/list/tag');
//해당 키워드 관련 출력
router.get('/place/list/keyword');
//해당 카테고리 관련 출력
router.get('/place/list/category');
//해당 유저의 장소 리스트 출력
router.get('/place/list/user');
//해당 장소 수정
router.put('/place/update');
// 해당 장소 삭제
router.delete('/place/delete');
// 해당 장소의 즐겨찾기 추가
router.post('/place/favorite/create');
// 해당 장소의 즐겨찾기 조회(출력)
router.get('/place/favorite/find');
// 해당 장소의 즐겨찾기 삭제
router.delete('/place/favorite/delete');
//해당 장소의 리뷰 작성
router.post('/place/review/create');
// 해당 장소의 리뷰 수정
router.put('/place/review/update');
// 해당 장소의 리뷰 삭제
router.delete('/place/review/delete');
// 해당 장소의 리뷰 출력
router.get('/place/review/find');
