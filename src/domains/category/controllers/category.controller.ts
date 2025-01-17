import { Inject, Service } from "typedi";
import BaseController from "@/common/abstract/base-controller.abstract";
import { NextFunction, Request, Response } from 'express';
import CategoryService from "../services/category.service";
import { ValidationError } from "@/common/exceptions/app.errors";
import { logger } from "@/common/utils/logger";
import { Mapper } from "@/common/services/mapper";
import { CreateCategoryDTO, ResponseCategoryDTO, UpdateCategoryDTO } from "../dtos/category.dto";
import { validateOrReject } from "class-validator";
import { CATEGORY_TYPE } from "@/config/enum_control";
import { CreateSubCategoryDTO, ResponseSubCategoryDTO, UpdateSubCategoryDTO } from "../dtos/subcategory.dto";
import { SubCategoryService } from "../services/subcategory.service";

@Service()
export class CategoryController extends BaseController {

    constructor(@Inject(() => CategoryService) private CategoryService: CategoryService,
        @Inject(() => SubCategoryService) private SubCategoryService: SubCategoryService,) {
        super();
    }

    // 카테고리 및 세부 카테고리 생성
    public create_category = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received create_category request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            const category_type = req.body.type;

            // 그냥 카테고리냐 세부 카테고리냐
            switch (category_type) {
                case CATEGORY_TYPE.MAIN:

                    const createCategoryDTO = Mapper.fromPlainToDTO(req.body, CreateCategoryDTO);
                    logger.info('req.body change CreateCategoryDTO');
                    // DTO 유효성 검사
                    logger.info(`processing validate data check`);
                    await validateOrReject(createCategoryDTO)
                        .catch(() => { throw new ValidationError("요청 데이터가 유효하지 않습니다."); });

                    const new_category = await this.CategoryService.createCategory(createCategoryDTO)

                    const responseCategoryDTO = Mapper.toDTO(new_category, ResponseCategoryDTO);
                    return {
                        status: 201,
                        message: "카테고리 생성",
                        data: responseCategoryDTO,
                    }

                case CATEGORY_TYPE.SUB:
                    logger.info('req.body change CreateSubCategoryDTO');
                    const createSubCategoryDTO = Mapper.fromPlainToDTO(req.body, CreateSubCategoryDTO);

                    // DTO 유효성 검사
                    logger.info(`processing validate data check`);
                    await validateOrReject(createSubCategoryDTO)
                        .catch(() => { throw new ValidationError("요청 데이터가 유효하지 않습니다."); });

                    const new_subcategory = await this.SubCategoryService.createSubCategory(createSubCategoryDTO)

                    const responseSubCategoryDTO = Mapper.toDTO(new_subcategory, ResponseSubCategoryDTO);
                    return {
                        status: 201,
                        message: "세부 카테고리 생성",
                        data: responseSubCategoryDTO,
                    }
                default:
                    throw new ValidationError(`카테고리 타입이 잘못되었습니다: ${category_type}`);
            }

        })
    }

    // 카테고리 및 세부 카테고리 수정
    public update_category = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received update_category request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            const category_type = req.body.type;
            const { id } = req.body;
            switch (category_type) {
                case CATEGORY_TYPE.MAIN:
                    logger.info('req.body change updateCategoryDTO');
                    const updateCategoryDTO = Mapper.fromPlainToDTO(req.body, UpdateCategoryDTO);

                    // DTO 유효성 검사
                    logger.info(`processing validate data check`);
                    await validateOrReject(updateCategoryDTO)
                        .catch(() => { throw new ValidationError("요청 데이터가 유효하지 않습니다."); });

                    const updated_category = await this.CategoryService.updateCategorybyID(id, updateCategoryDTO);

                    const responseCategoryDTO = Mapper.toDTO(updated_category, ResponseCategoryDTO);
                    return {
                        status: 200,
                        message: "카테고리 수정",
                        data: responseCategoryDTO,
                    }

                case CATEGORY_TYPE.SUB:
                    logger.info('req.body change updateSubCategoryDTO');
                    const updateSubCategoryDTO = Mapper.fromPlainToDTO(req.body, UpdateSubCategoryDTO);

                    // DTO 유효성 검사
                    logger.info(`processing validate data check`);
                    await validateOrReject(updateSubCategoryDTO)
                        .catch(() => { throw new ValidationError("요청 데이터가 유효하지 않습니다."); });

                    const updated_subcategory = await this.SubCategoryService.updateSubCategory(id, updateSubCategoryDTO);

                    const responseSubCategoryDTO = Mapper.toDTO(updated_subcategory, ResponseSubCategoryDTO);
                    return {
                        status: 200,
                        message: "세부 카테고리 수정",
                        data: responseSubCategoryDTO,
                    }

                default:
                    throw new ValidationError(`카테고리 타입이 잘못되었습니다: ${category_type}`);
            }
        })
    }

    // 카테고리 및 세부 카테고리 전체 조회 (하루 한번은 조회함)
    public find_all_category = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received find_all_category request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const category_type = req.params.type;
            switch (category_type) {
                case CATEGORY_TYPE.MAIN:

                    const found_categories = await this.CategoryService.findAllCategory();

                    const responseCategoryDTOs = Mapper.toDTOList(found_categories, ResponseCategoryDTO);
                    return {
                        status: 200,
                        mesaage: "카테고리 전부 조회",
                        data: responseCategoryDTOs,
                    }
                case CATEGORY_TYPE.SUB:

                    const found_subcategories = await this.SubCategoryService.findAllSubCategory();

                    const responseSubCategoryDTOs = Mapper.toDTOList(found_subcategories, ResponseSubCategoryDTO);
                    return {
                        status: 200,
                        message: "세부 카테고리 전부 조회",
                        data: responseSubCategoryDTOs,
                    }

                default:
                    throw new ValidationError(`카테고리 타입이 잘못되었습니다: ${category_type}`);
            }
        })
    }

    // 카테고리 및 세부 카테고리 한개 조회 
    public find_one_category = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received find_one_category request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const { category_type, id } = req.params;
            switch (category_type) {
                case CATEGORY_TYPE.MAIN:

                    const found_category = await this.CategoryService.findOneCategorybyID(parseInt(id));

                    const responseCategoryDTO = found_category
                        ? Mapper.toDTO(found_category, ResponseCategoryDTO)
                        : null;

                    return {
                        status: 200,
                        message: "카테고리 한개 조회",
                        data: responseCategoryDTO,
                    }
                case CATEGORY_TYPE.SUB:

                    const found_subcategory = await this.SubCategoryService.findOneSubCategory(parseInt(id));

                    const responseSubCategoryDTO = found_subcategory
                        ? Mapper.toDTO(found_subcategory, ResponseSubCategoryDTO)
                        : null;

                    return {
                        status: 200,
                        message: "세부 카테고리 한개 조회",
                        data: responseSubCategoryDTO,
                    }
                default:
                    throw new ValidationError(`카테고리 타입이 잘못되었습니다: ${category_type}`);
            }
        })
    }

    // 카테고리 및 세부 카테고리 삭제
    public delete_category = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received delete_category request');
            logger.debug(`Request params: ${JSON.stringify(req.params)}`);

            const { id, category_type } = req.params;
            switch (category_type) {
                case CATEGORY_TYPE.MAIN:

                    const deleted_category = await this.CategoryService.deleteCategorybyID(parseInt(id));

                    return {
                        status: 200,
                        message: "카테고리 삭제",
                        data: !!deleted_category,
                    }

                case CATEGORY_TYPE.SUB:

                    const deleted_subcategory = await this.SubCategoryService.deleteSubCategory(parseInt(id));

                    return {
                        status: 200,
                        message: "세부 카테고리 삭제",
                        data: !!deleted_subcategory,
                    }

                default:
                    throw new ValidationError(`카테고리 타입이 잘못되었습니다: ${category_type}`);
            }
        })
    }

}