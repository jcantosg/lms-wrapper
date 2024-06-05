import { BaseEntity } from '#shared/domain/entity/base.entity';
import { CRMImportStatus } from '#shared/domain/enum/crm-import-status.enum';
import { ImportData } from '#shared/infrastructure/service/exceljs-file-parser.service';

export class CRMImport extends BaseEntity {
  private constructor(
    id: string,
    private _status: CRMImportStatus,
    private _contactId: string | null,
    private _leadId: string | null,
    private _data: ImportData | null,
    private _fileName: string,
    private _errorMessage: string | null,
  ) {
    super(id, new Date(), new Date());
  }

  public get status(): CRMImportStatus {
    return this._status;
  }

  public set status(value: CRMImportStatus) {
    this._status = value;
  }

  public get contactId(): string | null {
    return this._contactId;
  }

  public set contactId(value: string | null) {
    this._contactId = value;
  }

  public get leadId(): string | null {
    return this._leadId;
  }

  public set leadId(value: string | null) {
    this._leadId = value;
  }

  public get data(): ImportData | null {
    return this._data;
  }

  public set data(value: ImportData | null) {
    this._data = value;
  }

  public get fileName(): string {
    return this._fileName;
  }

  public set fileName(value: string) {
    this._fileName = value;
  }

  public get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set errorMessage(value: string | null) {
    this._errorMessage = value;
  }

  static create(
    id: string,
    contactId: string | null,
    leadId: string | null,
    data: ImportData | null,
    fileName: string,
  ): CRMImport {
    return new CRMImport(
      id,
      CRMImportStatus.CREATED,
      contactId,
      leadId,
      data,
      fileName,
      null,
    );
  }

  update(
    status: CRMImportStatus,
    contactId: string | null,
    leadId: string | null,
    data: ImportData | null,
    errorMesage: string | null,
  ) {
    this._status = status;
    this._contactId = contactId;
    this._leadId = leadId;
    this._data = data;
    this._errorMessage = errorMesage;
    this.updatedAt = new Date();
  }
}
