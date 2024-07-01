import { EdaeUserRepository } from '#edae-user/domain/repository/edae-user.repository';
import { EdaeUserGetter } from '#edae-user/domain/service/edae-user-getter.service';
import { EdaeUserBusinessUnitChecker } from '#edae-user/domain/service/edae-user-business-unitChecker.service';
import { EdaeUserPasswordGenerator } from '#edae-user/domain/service/edae-user-password-generator.service';

const edaeUserGetter = {
  provide: EdaeUserGetter,
  useFactory: (edaeUserRepository: EdaeUserRepository) => {
    return new EdaeUserGetter(edaeUserRepository);
  },
  inject: [EdaeUserRepository],
};

export const services = [
  edaeUserGetter,
  EdaeUserBusinessUnitChecker,
  EdaeUserPasswordGenerator,
];
