import { NotFoundException } from '#shared/domain/exception/not-found.exception';

export class BlockRelationNotFoundException extends NotFoundException {
  constructor() {
    super('sga.block-relation.not-found');
  }
}
