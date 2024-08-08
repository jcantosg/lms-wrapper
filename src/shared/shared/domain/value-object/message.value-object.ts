import { ValueObject } from '#/sga/shared/domain/value-object/value-object';

interface MessageValue {
  subject: string;
  shortDescription: string;
  body: string;
}

export class Message extends ValueObject<MessageValue> {
  constructor(props: MessageValue) {
    super(props);
  }

  get subject(): string {
    return this.value.subject;
  }

  get shortDescription(): string {
    return this.value.shortDescription;
  }

  get body(): string {
    return this.value.body;
  }
}
