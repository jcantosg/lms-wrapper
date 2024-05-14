export enum OrderTypes {
  ASC = 'ASC',
  DESC = 'DESC',
  NONE = 'NONE',
}

export const OrderByDefault = 'updatedAt';

export class Order {
  constructor(
    public readonly orderBy: string,
    public readonly orderType: OrderTypes = OrderTypes.NONE,
    public readonly orderNested: boolean = false,
  ) {}

  public hasOrderType() {
    return this.orderType !== OrderTypes.NONE;
  }

  public hasOrderBy() {
    return this.orderBy !== '';
  }

  public hasOrderNested() {
    return this.orderNested;
  }
}
