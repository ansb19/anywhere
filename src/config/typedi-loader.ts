import { Container } from "typedi";
import { readdirSync } from "fs";
import { join } from "path";

export const autoRegisterServices = (directory: string) => {
    const files = readdirSync(directory);

    files.forEach((file) => {
        if (file.endsWith(".ts") || file.endsWith(".js")) {
            const filePath = join(directory, file);
            const importedModule = require(filePath);

            Object.values(importedModule).forEach((exportedItem: any) => {
                if (typeof exportedItem === "function" &&
                    exportedItem.prototype &&
                    Object.getPrototypeOf(exportedItem) !== Object
                ) {
                    Container.set(exportedItem, new exportedItem());
                }
            });
        }
    });
};
//대형 프로젝트가 아니므로 아직 사용안함.