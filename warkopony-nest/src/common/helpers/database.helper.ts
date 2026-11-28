
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class databaseHelper {
    constructor(private readonly prisma: PrismaService) {}

    async searchTable(
        tableVar: Uncapitalize<Prisma.ModelName>,
        method: 'findUnique' | 'findFirst' | 'findMany' = 'findFirst',
        column?: string,
        value?: string | number,
    ) {
        const model = (this.prisma as any)[tableVar];

        if (!model) {
            throw new BadRequestException(
                `Table "${tableVar}" not found`,
            );
        }

        const hasColumn = column !== undefined;
        const hasValue = value !== undefined;

        if (hasColumn !== hasValue) {
            throw new BadRequestException(
                'Column and value must be provided together',
            );
        }

        if (method === 'findUnique' && !hasColumn) {
            throw new BadRequestException(
                'findUnique requires column and value',
            );
        }

        if (hasColumn && !column.trim()) {
            throw new BadRequestException('Column cannot be empty');
        }

        const args = hasColumn
            ? { where: { [column]: value } }
            : {};

        return model[method](args);
    }
}
