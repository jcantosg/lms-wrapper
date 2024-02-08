export class File {
  constructor(
    protected readonly _directory: string,
    protected readonly _fileName: string,
    protected readonly _content: Buffer,
    protected readonly _contentType?: string,
  ) {}

  get directory(): string {
    return this._directory;
  }

  get contentType(): string | undefined {
    return this._contentType;
  }

  get fileName(): string {
    return this._fileName;
  }

  get content(): Buffer {
    return this._content;
  }
}
