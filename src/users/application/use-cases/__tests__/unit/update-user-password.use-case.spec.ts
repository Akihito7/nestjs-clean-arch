import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { IHashProvider } from '@/shared/application/providers/hash.provider'
import { UpdateUserPassword } from '../../update-user-password.use-case'
import { BcryptjsHashProvider } from '@/users/application/providers/bcryptjs-hash.provider'
import { NotFoundError } from '@/shared/errors/not-found-error'
import { userDateBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { InvalidPasswordError } from '@/shared/errors/invalid-password-error'

describe('UpdatePasswordUseCase unit tests', () => {
  let sut: UpdateUserPassword.UseCase
  let repository: UserInMemoryRepository
  let hashProvider: IHashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new UpdateUserPassword.UseCase(repository, hashProvider)
  })

  it('Should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({
        id: 'fakeId',
        newPassword: 'test password',
        oldPassword: 'old password',
      }),
    ).rejects.toThrow(new NotFoundError(`Entity with this fakeId not found.`))
  })

  it('Should throws error when old password not provided', async () => {
    const entity = new UserEntity(userDateBuilder())
    repository.items = [entity]
    await expect(() =>
      sut.execute({
        id: entity.id!,
        newPassword: 'test password',
        oldPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )
  })

  it('Should throws error when new password not provided', async () => {
    const entity = new UserEntity(userDateBuilder({ password: '1234' }))
    repository.items = [entity]
    await expect(() =>
      sut.execute({
        id: entity.id!,
        newPassword: '',
        oldPassword: '1234',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password is required'),
    )
  })

  it('Should throws error when new old password does not match', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(userDateBuilder({ password: hashPassword }))
    repository.items = [entity]
    await expect(() =>
      sut.execute({
        id: entity.id!,
        newPassword: '4567',
        oldPassword: '123456',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password does not match'))
  })

  it('Should update a password', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const spyUpdate = jest.spyOn(repository, 'update')
    const items = [new UserEntity(userDateBuilder({ password: hashPassword }))]
    repository.items = items

    const result = await sut.execute({
      id: items[0].id!,
      newPassword: '4567',
      oldPassword: '1234',
    })

    const checkNewPassword = await hashProvider.compare(
      '4567',
      result.password,
    )
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(checkNewPassword).toBeTruthy()
  })
})