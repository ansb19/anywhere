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
exports.Place = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Category_1 = require("./Category");
const Charge_1 = require("./Charge");
const Favorite_1 = require("./Favorite");
const Review_1 = require("./Review");
let Place = class Place {
    place_id = 0;
    place_name = '';
    nickname = '';
    lat = 0.0;
    lon = 0.0;
    category_id = 0;
    created_at;
    //db에 없음
    updated_at;
    //db에 없음
    deleted_at;
    start_date;
    end_date;
    photo_s3_url = '';
    charge_id = 0;
    comment = '';
    tag = '';
    exist_count = 0;
    non_exist_count = 0;
    owner = false; // 제보자 false 작성자 true
    user;
    category;
    charge;
    favorites;
    reviews;
};
exports.Place = Place;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Place.prototype, "place_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 40 }),
    __metadata("design:type", String)
], Place.prototype, "place_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Place.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double' }),
    __metadata("design:type", Number)
], Place.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double' }),
    __metadata("design:type", Number)
], Place.prototype, "lon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint' }),
    __metadata("design:type", Number)
], Place.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Place.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
    //db에 없음
    ,
    __metadata("design:type", Date)
], Place.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp without time zone', nullable: true })
    //db에 없음
    ,
    __metadata("design:type", Date)
], Place.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp without time zone' }),
    __metadata("design:type", Date)
], Place.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp without time zone' }),
    __metadata("design:type", Date)
], Place.prototype, "end_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, array: true }),
    __metadata("design:type", String)
], Place.prototype, "photo_s3_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint' }),
    __metadata("design:type", Number)
], Place.prototype, "charge_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 1000 }),
    __metadata("design:type", String)
], Place.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, array: true }),
    __metadata("design:type", String)
], Place.prototype, "tag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Place.prototype, "exist_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Place.prototype, "non_exist_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], Place.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.places),
    (0, typeorm_1.JoinColumn)(({ name: 'user_place_nickname' })),
    __metadata("design:type", User_1.User)
], Place.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category_1.Category, (category) => category.places),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", Category_1.Category)
], Place.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Charge_1.Charge, (charge) => charge.places),
    (0, typeorm_1.JoinColumn)({ name: 'charge_id' }),
    __metadata("design:type", Charge_1.Charge)
], Place.prototype, "charge", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Favorite_1.Favorite, (favorite) => favorite.place),
    __metadata("design:type", Array)
], Place.prototype, "favorites", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Review_1.Review, (review) => review.place),
    __metadata("design:type", Array)
], Place.prototype, "reviews", void 0);
exports.Place = Place = __decorate([
    (0, typeorm_1.Entity)('PLACE')
], Place);
