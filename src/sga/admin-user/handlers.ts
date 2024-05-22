import { CreateRefreshTokenHandler } from '#admin-user/application/create-refresh-token/create-refresh-token.handler';
import { ExpireRefreshTokenHandler } from '#admin-user/application/expire-refresh-token/expire-refresh-token.handler';
import { GetAdminUserHandler } from '#admin-user/application/get-admin-user/get-admin-user.handler';
import { RegisterAdminUserHandler } from '#admin-user/application/register-admin-user/register-admin-user.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { GetUserRolesHandler } from './application/get-user-roles/get-user-roles.handler';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { GetIdentityDocumentTypesHandler } from './application/get-identity-document-types/get-document-types.handler';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';
import { AdminUserPasswordGenerator } from '#admin-user/domain/service/admin-user-password-generator.service';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';
import { SearchAdminUsersHandler } from '#admin-user/application/search-admin-users/search-admin-users.handler';
import { GetAllAdminUsersHandler } from '#admin-user/application/get-all-admin-users/get-all-admin-users.handler';
import { DeleteAdminUserHandler } from '#admin-user/application/delete-admin-user/delete-admin-user.handler';
import { AdminUserBusinessUnitsChecker } from '#admin-user/domain/service/admin-user-business-units.checker.service';
import { GetAdminUserDetailHandler } from '#admin-user/application/get-admin-user-detail/get-admin-user-detail.handler';
import { EditAdminUserHandler } from '#admin-user/application/edit-admin-user/edit-admin-user.handler';
import { RemoveBusinessUnitFromAdminUserHandler } from '#admin-user/application/remove-business-unit-from-admin-user/remove-business-unit-from-admin-user.handler';
import { AddBusinessUnitsToAdminUserHandler } from '#admin-user/application/add-business-units-to-admin-user/add-business-units-to-admin-user.handler';
import { GenerateRecoveryPasswordTokenHandler } from '#admin-user/application/generate-recovery-password-token/generate-recovery-password-token.handler';
import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { ConfigService } from '@nestjs/config';
import { UpdatePasswordHandler } from '#admin-user/application/update-password/update-password.handler';
import { RecoveryPasswordTokenGetter } from '#admin-user/domain/service/recovery-password-token-getter.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { EditProfileHandler } from '#admin-user/application/edit-profile/edit-profile.handler';
import { ChangePasswordHandler } from '#admin-user/application/change-password/change-password.handler';
import { PasswordFormatChecker } from '#admin-user/domain/service/password-format-checker.service';
import { PasswordChecker } from '#admin-user/domain/service/password-checker.service';

const getIdentityDocumentTypesHandler = {
  provide: GetIdentityDocumentTypesHandler,
  useFactory: () => {
    return new GetIdentityDocumentTypesHandler();
  },
};

const getRolesHandler = {
  provide: GetUserRolesHandler,
  useFactory: () => {
    return new GetUserRolesHandler();
  },
};

const getAdminUserHandler = {
  provide: GetAdminUserHandler,
  useFactory: (adminUserGetter: AdminUserGetter) => {
    return new GetAdminUserHandler(adminUserGetter);
  },
  inject: [AdminUserGetter],
};

const registerUserHandler = {
  provide: RegisterAdminUserHandler,
  useFactory: (
    adminUserRepository: AdminUserRepository,
    businessUnitGetter: BusinessUnitGetter,
    imageUploader: ImageUploader,
    eventDispatcher: EventDispatcher,
    passwordGenerator: AdminUserPasswordGenerator,
    adminUserRolesChecker: AdminUserRolesChecker,
  ) => {
    return new RegisterAdminUserHandler(
      adminUserRepository,
      businessUnitGetter,
      imageUploader,
      eventDispatcher,
      passwordGenerator,
      adminUserRolesChecker,
    );
  },
  inject: [
    AdminUserRepository,
    BusinessUnitGetter,
    ImageUploader,
    EventDispatcher,
    AdminUserPasswordGenerator,
    AdminUserRolesChecker,
  ],
};

const createRefreshTokenHandler = {
  provide: CreateRefreshTokenHandler,
  useFactory: (
    adminUserGetter: AdminUserGetter,
    codeRepository: RefreshTokenRepository,
  ) => {
    return new CreateRefreshTokenHandler(adminUserGetter, codeRepository);
  },
  inject: [AdminUserGetter, RefreshTokenRepository],
};

const expireRefreshTokenHandler = {
  provide: ExpireRefreshTokenHandler,
  useFactory: (
    adminUserGetter: AdminUserGetter,
    codeRepository: RefreshTokenRepository,
  ) => {
    return new ExpireRefreshTokenHandler(adminUserGetter, codeRepository);
  },
  inject: [AdminUserGetter, RefreshTokenRepository],
};

const searchAdminUsersHandler = {
  provide: SearchAdminUsersHandler,
  useFactory: (adminUserRepository: AdminUserRepository) => {
    return new SearchAdminUsersHandler(adminUserRepository);
  },
  inject: [AdminUserRepository],
};

const getAllAdminUsersHandler = {
  provide: GetAllAdminUsersHandler,
  useFactory: (adminUserRepository: AdminUserRepository) => {
    return new GetAllAdminUsersHandler(adminUserRepository);
  },
  inject: [AdminUserRepository],
};

const deleteAdminUserHandler = {
  provide: DeleteAdminUserHandler,
  useFactory: (
    adminUserRepository: AdminUserRepository,
    adminUserGetter: AdminUserGetter,
    adminUserRolesChecker: AdminUserRolesChecker,
    adminUserBusinessUnitsChecker: AdminUserBusinessUnitsChecker,
  ) => {
    return new DeleteAdminUserHandler(
      adminUserRepository,
      adminUserGetter,
      adminUserRolesChecker,
      adminUserBusinessUnitsChecker,
    );
  },
  inject: [
    AdminUserRepository,
    AdminUserGetter,
    AdminUserRolesChecker,
    AdminUserBusinessUnitsChecker,
  ],
};

const getAdminUserDetailHandler = {
  provide: GetAdminUserDetailHandler,
  useFactory: (
    adminUserGetter: AdminUserGetter,
    adminUserRolesChecker: AdminUserRolesChecker,
  ) => {
    return new GetAdminUserDetailHandler(
      adminUserGetter,
      adminUserRolesChecker,
    );
  },
  inject: [AdminUserGetter, AdminUserRolesChecker],
};

const editAdminUserHandler = {
  provide: EditAdminUserHandler,
  useFactory: (
    adminUserRepository: AdminUserRepository,
    adminUserGetterService: AdminUserGetter,
    adminUserRolesChecker: AdminUserRolesChecker,
    imageUploader: ImageUploader,
  ) => {
    return new EditAdminUserHandler(
      adminUserRepository,
      adminUserGetterService,
      adminUserRolesChecker,
      imageUploader,
    );
  },
  inject: [
    AdminUserRepository,
    AdminUserGetter,
    AdminUserRolesChecker,
    ImageUploader,
  ],
};

const addBusinessUnitsToAdminUserHandler = {
  provide: AddBusinessUnitsToAdminUserHandler,
  useFactory: (
    adminUserRepository: AdminUserRepository,
    adminUserGetter: AdminUserGetter,
    adminUserRolesChecker: AdminUserRolesChecker,
    businessUnitGetter: BusinessUnitGetter,
  ) => {
    return new AddBusinessUnitsToAdminUserHandler(
      adminUserRepository,
      adminUserGetter,
      adminUserRolesChecker,
      businessUnitGetter,
    );
  },
  inject: [
    AdminUserRepository,
    AdminUserGetter,
    AdminUserRolesChecker,
    BusinessUnitGetter,
  ],
};

const removeBusinessUnitFromAdminUserHandler = {
  provide: RemoveBusinessUnitFromAdminUserHandler,
  useFactory: (
    adminUserRepository: AdminUserRepository,
    adminUserGetterService: AdminUserGetter,
    adminUserRolesChecker: AdminUserRolesChecker,
    businessUnitGetter: BusinessUnitGetter,
  ) => {
    return new RemoveBusinessUnitFromAdminUserHandler(
      adminUserRepository,
      adminUserGetterService,
      adminUserRolesChecker,
      businessUnitGetter,
    );
  },
  inject: [
    AdminUserRepository,
    AdminUserGetter,
    AdminUserRolesChecker,
    BusinessUnitGetter,
  ],
};

const generateRecoveryPasswordTokenHandler = {
  provide: GenerateRecoveryPasswordTokenHandler,
  useFactory: (
    adminUserGetter: AdminUserGetter,
    recoveryPasswordTokenRepository: RecoveryPasswordTokenRepository,
    jwtTokenGenerator: JwtTokenGenerator,
    eventDispatcher: EventDispatcher,
    configService: ConfigService,
  ) => {
    return new GenerateRecoveryPasswordTokenHandler(
      adminUserGetter,
      recoveryPasswordTokenRepository,
      jwtTokenGenerator,
      eventDispatcher,
      configService.get<number>('RECOVERY_TOKEN_TTL')!,
    );
  },
  inject: [
    AdminUserGetter,
    RecoveryPasswordTokenRepository,
    JwtTokenGenerator,
    EventDispatcher,
    ConfigService,
  ],
};

const updatePasswordHandler = {
  provide: UpdatePasswordHandler,
  useFactory: (
    adminUserGetter: AdminUserGetter,
    adminUserRepository: AdminUserRepository,
    recoveryPasswordTokenRepository: RecoveryPasswordTokenRepository,
    recoveryPasswordTokenGetter: RecoveryPasswordTokenGetter,
    jwtService: JwtService,
    passwordEncoder: PasswordEncoder,
  ) => {
    return new UpdatePasswordHandler(
      adminUserGetter,
      adminUserRepository,
      recoveryPasswordTokenRepository,
      recoveryPasswordTokenGetter,
      jwtService,
      passwordEncoder,
    );
  },
  inject: [
    AdminUserGetter,
    AdminUserRepository,
    RecoveryPasswordTokenRepository,
    RecoveryPasswordTokenGetter,
    JwtService,
    PasswordEncoder,
  ],
};

const editProfileHandler = {
  provide: EditProfileHandler,
  useFactory: (
    repository: AdminUserRepository,
    imageUploader: ImageUploader,
  ): EditProfileHandler => new EditProfileHandler(repository, imageUploader),
  inject: [AdminUserRepository, ImageUploader],
};

const changePasswordHandler = {
  provide: ChangePasswordHandler,
  useFactory: (
    repository: AdminUserRepository,
    passwordEncoder: PasswordEncoder,
    passwordChecker: PasswordChecker,
    passwordFormatChecker: PasswordFormatChecker,
  ): ChangePasswordHandler =>
    new ChangePasswordHandler(
      repository,
      passwordEncoder,
      passwordChecker,
      passwordFormatChecker,
    ),
  inject: [
    AdminUserRepository,
    PasswordEncoder,
    PasswordChecker,
    PasswordFormatChecker,
  ],
};

export const handlers = [
  registerUserHandler,
  createRefreshTokenHandler,
  expireRefreshTokenHandler,
  getAdminUserHandler,
  getIdentityDocumentTypesHandler,
  getRolesHandler,
  searchAdminUsersHandler,
  getAllAdminUsersHandler,
  getAdminUserDetailHandler,
  deleteAdminUserHandler,
  editAdminUserHandler,
  addBusinessUnitsToAdminUserHandler,
  removeBusinessUnitFromAdminUserHandler,
  generateRecoveryPasswordTokenHandler,
  updatePasswordHandler,
  editProfileHandler,
  changePasswordHandler,
];
