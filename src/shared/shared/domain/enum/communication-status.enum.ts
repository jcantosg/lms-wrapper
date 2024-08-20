export enum CommunicationStatus {
  DRAFT = 'draft',
  SENT = 'sent',
}

export const getAllCommunicationStatuses = (): CommunicationStatus[] =>
  Object.values(CommunicationStatus);
