import { v4 as uuidv4 } from 'uuid';
import { UUIDGeneratorService } from '#shared/domain/service/uuid-service';

export class UUIDv4GeneratorService implements UUIDGeneratorService {
  generate(): string {
    return uuidv4();
  }
}
