import { EditProfileHandler } from '#admin-user/application/edit-profile/edit-profile.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { ImageUploader } from '#shared/domain/service/image-uploader.service';
import { EditProfileCommand } from '#admin-user/application/edit-profile/edit-profile.command';
import { getAnAdminUser } from '#test/entity-factory';
import { AdminUserMockRepository } from '#test/mocks/sga/adminUser/admin-user.mock-repository';
import { getImageUploaderMock } from '#test/service-factory';
import clearAllMocks = jest.clearAllMocks;

let handler: EditProfileHandler;
let repository: AdminUserRepository;
let imageUploader: ImageUploader;

let saveSpy: jest.SpyInstance;

const adminUser = getAnAdminUser();

const command = new EditProfileCommand(
  adminUser,
  'name',
  'surname',
  null,
  null,
);

describe('Edit Profile Handler Test', () => {
  beforeAll(async () => {
    repository = new AdminUserMockRepository();
    imageUploader = getImageUploaderMock();
    handler = new EditProfileHandler(repository, imageUploader);

    saveSpy = jest.spyOn(repository, 'save');
  });
  it('should update an admin user', async () => {
    await handler.handle(command);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: adminUser.id,
        _name: 'name',
        _surname: 'surname',
        _avatar: '',
        _surname2: null,
      }),
    );
  });

  afterAll(() => {
    clearAllMocks();
  });
});
