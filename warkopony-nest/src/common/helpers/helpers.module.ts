import { Global, Module } from "@nestjs/common";
import { databaseHelper } from "./database.helper";
import { PrismaModule } from "../../prisma/prisma.module";
// import { databaseHelper } from "./database.helper";


@Global()
@Module({
    imports: [
        PrismaModule,
    ],
    providers: [
        databaseHelper,
    ],
    exports: [
        databaseHelper,
    ],
})
export class helpersModule{}