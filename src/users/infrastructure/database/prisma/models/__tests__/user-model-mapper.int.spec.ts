import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { PrismaClient, User } from "@prisma/client";
import { execSync } from "node:child_process"
import { UserModelMapper } from "../user-model-mapper";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { ValidationError } from "@/shared/errors/validation-error";

// Esse é um teste de integração, então queremos usar o schema real de testes no banco
// Por isso, não usamos as configs padrão do Jest, e sim o .env.test

describe('User model mapper int tests ', () => {
  let prismaService: PrismaClient;
  let props;

  beforeAll(async () => {
    // Antes de todos os testes, aplicamos as migrações no banco de testes
    // Isso garante que as tabelas existam mesmo se for um banco novo/resetado
    execSync('npx dotenv-cli -e .env.test  -- npx prisma migrate deploy');

    prismaService = new PrismaService();

    // Dados base usados para criar um usuário no banco
    props = {
      id: 'f74f8fdc-2fb4-4fce-bd61-fb580541f81d',
      name: 'Jane Doe',
      email: "a@gmail.com",
      password: '1234',
      createdAt: new Date(),
    }
  });

  afterAll(async () => {
    // Após todos os testes, limpamos a tabela de usuários
    // Isso evita acúmulo de dados entre execuções de teste
    await prismaService.user.deleteMany();
    await prismaService.$disconnect();
  });

  it("should return userEntity", async () => {
    // Cria um usuário no banco com os dados definidos
    const user = await prismaService.user.create({ data: props });

    // Usa o mapper para converter o usuário do banco em uma entidade de domínio
    const SUT = UserModelMapper.toEntity(user);

    // Verifica se o resultado é uma instância de UserEntity e se os dados batem
    expect(SUT.toJson()).toStrictEqual(props)
    expect(SUT).toBeInstanceOf(UserEntity)
  });

  it('Should throw error when does not convert user to UserEntity', async () => {
    // Força um usuário inválido (com name null) para testar validação
    const user: User = Object.assign(props, { name: null });

    // Espera que o mapper lance um erro de validação ao tentar mapear
    expect(() => UserModelMapper.toEntity(user)).toThrow(new ValidationError('An entity not be loaded'))
  });
});
