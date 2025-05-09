import { DynamicModule, Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class DatabaseModule {
  static forTest(prismaService: PrismaService): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'prismaService',
          useFactory: () => prismaService as PrismaService
        }
      ]
    }
  }
}