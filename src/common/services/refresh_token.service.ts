
import { SocialUser } from "@/domains/user/entities/social-user.entity";
import SocialUserService from "@/domains/user/services/social-user.service";
import { Inject, Service } from "typedi";
import { AddDate } from "../utils/formatter";
import KakaoClient from "@/api/kakao.client";
import { UnauthorizedError } from "../exceptions/app.errors";
import { logger } from "../utils/logger";

@Service()
export class RefreshTokenService {
    private social_users: SocialUser[] = [];
    constructor(
        @Inject(() => SocialUserService) private socialUserService: SocialUserService,
        @Inject(() => KakaoClient) private kakaoClient: KakaoClient,
    ) { }

    /**
     * 자동 토큰 갱신 메서드
     */
    public async auto_refresh_token(): Promise<void> {
        logger.info("Starting auto refresh token process...");

        // 모든 소셜 유저 조회
        this.social_users = await this.socialUserService.findAll();
        logger.info(`Total social users found: ${this.social_users.length}`);

        const target_date = AddDate(new Date(), 1);

        // 갱신 대상 사용자 필터링
        const expiring_users = this.social_users.filter(
            user => new Date(user.refresh_token_expires_at) <= target_date
        );

        logger.info(`Total users eligible for token refresh: ${expiring_users.length}`);

        // 병렬로 갱신 처리
        const results = await Promise.allSettled(
            expiring_users.map(user =>
                this.manual_refresh_token(
                    target_date,
                    new Date(user.refresh_token_expires_at),
                    user.refresh_token,
                    user.id
                )
            )
        );

        // 결과 로그
        const succeeded = results.filter(result => result.status === "fulfilled").length;
        const failed = results.filter(result => result.status === "rejected").length;

        logger.info(`Token refresh completed: ${succeeded} users succeeded`);
        if (failed > 0) {
            logger.warn(`Token refresh failed: ${failed} users failed`);
        }
    }

    /**
     * 수동 토큰 갱신 메서드
     */
    public async manual_refresh_token(target_date: Date, stored_date: Date, refresh_token: string, social_user_id: number): Promise<void> {

        if (target_date > stored_date) {
            logger.info(`Refreshing token for user ID: ${social_user_id}`);
            try {
                //카카오 토큰 갱신
                const data = await this.kakaoClient.refresh_token(refresh_token);

                //소셜 유저 토큰 정보 업데이트
                await this.socialUserService.updateSocialUserByID(social_user_id, {
                    refresh_token: data.refresh_token,
                    refresh_token_expires_at: AddDate(new Date(), 0, 0, 0, 0, data.refresh_token_expires_in)
                });

                logger.info(`Token refresh successful for user ID: ${social_user_id}`);
            } catch (error) {
                throw new UnauthorizedError("토큰 갱신 실패");
            }
        }
        else {
            logger.debug(`Token for user ID: ${social_user_id} does not require refresh.`);
        }
    }

}