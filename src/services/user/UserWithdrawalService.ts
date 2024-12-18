// import { UserService } from "./UserService"


// export class UserWithdrawalService {
//     constructor(
//         private useService: UserService,
//     ) { }

//     //자체 회원 탈퇴
//     // • 회원탈퇴를 누르면 본인인증 후
//     // • 통합 회원 탈퇴 인지 자체 탈퇴인지 선택
//     // • 통합 회원 탈퇴 시 user 테이블을 없앰
//     // • 자체 회원 탈퇴 시 user_id password를 null로 바꾸고 deleted at을 시간 저장함

//     public async withdrawal(delete_type:string,id:string): Promise<boolean> {
//         if(delete_type === "all"){
//             await this.useService.deleteUserbyID
//         }

//     }
//     //소셜 회원 탈퇴
//     //• 회원탈퇴를 누르면 본인인증 후
//     //• 통합 회원 탈퇴 인지 소셜 탈퇴인지 선택
//     //•통합 회원 탈퇴시 user 테이블 및 socialuser테이블을 없앰
//     //     •소셜 회원 탈퇴시
//     // •social_user의 user_id를 기억해놓음
//     // •해당 social(provider)의 social_user를 탈퇴 시킴
//     // •social_user의 user_id가 0 or null이고 user테이블의 id의 user_id가 null이면 (해당 회원이 소셜 아이디 1개 밖에 없는 경우)
//     // •user 계정도 삭제시킴.
//     // •그 외의 경우( 자체 회원이나 다른 소셜이 있는 경우) 냅둠.

//     public async witdrawlSocial() {

//     }


// }

// export default UserWithdrawalService;