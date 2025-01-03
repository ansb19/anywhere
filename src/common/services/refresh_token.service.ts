
import { SocialUser } from "@/domains/user/entities/social-user.entity";
import SocialUserService from "@/domains/user/services/social-user.service";
import { Inject, Service } from "typedi";
import { AddDate } from "../utils/formatter";
import KakaoClient from "@/api/kakao.client";
import { UnauthorizedError } from "../exceptions/app.errors";

@Service()
export class RefreshTokenService {
    private social_users: SocialUser[] = [];
    constructor(
        @Inject(() => SocialUserService) private socialUserService: SocialUserService,
        @Inject(() => KakaoClient) private kakaoClient: KakaoClient,
    ) { }

    public async auto_refresh_token(): Promise<void> {
        this.social_users = await this.socialUserService.findAll();

        const target_date = AddDate(new Date(), 1);

        const expiring_users = this.social_users.filter(
            user => new Date(user.refresh_token_expires_at) <= target_date
        );

        console.log(`갱신 대상 사용자 수: ${expiring_users.length}`);

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

        console.log(`토큰 갱신 완료: ${succeeded}명`);
        console.error(`갱신 실패: ${failed}명`);
    }

    public async manual_refresh_token(target_date: Date, stored_date: Date, refresh_token: string, social_user_id: number): Promise<void> {

        if (target_date > stored_date) {
            try {
                const data = await this.kakaoClient.refresh_token(refresh_token);
                await this.socialUserService.updateSocialUserByID(social_user_id, {
                    refresh_token: data.refresh_token,
                    refresh_token_expires_at: AddDate(new Date(), 0, 0, 0, 0, data.refresh_token_expires_in)
                });
                console.log(`사용자 ${social_user_id}: 토큰 갱신 성공`);
            } catch (error) {
                console.error("토큰 갱신 실패: ", error);
                throw new UnauthorizedError("토큰 갱신 실패");
            }

        }
    }

}