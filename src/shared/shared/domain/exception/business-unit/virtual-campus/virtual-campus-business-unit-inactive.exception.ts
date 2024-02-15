import { ForbiddenException } from '#shared/domain/exception/forbidden.exception';

export class VirtualCampusBusinessUnitInactiveException extends ForbiddenException {
  constructor() {
    super('sga.virtual-campus.business-unit-inactive');
  }
}
