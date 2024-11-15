"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/user/sign');
router.get('/user/update/nickname');
router.get('/user/place/find');
router.delete('/user/place/delete');
router.put('/user/place/update');
