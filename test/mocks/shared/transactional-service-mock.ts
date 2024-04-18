import { TransactionalService } from '#shared/domain/service/transactional-service.service';

export class TransactionalServiceMock extends TransactionalService {
  execute = jest.fn();
}
