export interface TransactionParams {}

export abstract class TransactionalService {
  abstract execute(params: TransactionParams): Promise<void>;
}
