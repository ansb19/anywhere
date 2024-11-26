"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Favorite = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Place_1 = require("./Place");
let Favorite = class Favorite {
    favorite_id = 0;
    nickname = '';
    place_id = 0;
    created_at;
    user;
    place;
};
exports.Favorite = Favorite;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Favorite.prototype, "favorite_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Favorite.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Favorite.prototype, "place_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Favorite.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.favorites),
    (0, typeorm_1.JoinColumn)({ name: 'user_favorite_nickname' }),
    __metadata("design:type", User_1.User)
], Favorite.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Place_1.Place, (place) => place.favorites),
    (0, typeorm_1.JoinColumn)({ name: 'place_favorite_place_id' }),
    __metadata("design:type", Place_1.Place)
], Favorite.prototype, "place", void 0);
exports.Favorite = Favorite = __decorate([
    (0, typeorm_1.Entity)('FAVORITE')
], Favorite);
