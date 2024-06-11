import { BaseEntity } from '#shared/domain/entity/base.entity';
import { AccessQualification } from '#shared/domain/enum/access-qualification.enum';
import { StudentGender } from '#shared/domain/enum/student-gender.enum';
import { StudentStatus } from '#shared/domain/enum/student-status.enum';
import { StudentOrigin } from '#shared/domain/enum/student-origin.enum.';
import { Country } from '#shared/domain/entity/country.entity';
import {
  IdentityDocument,
  IdentityDocumentValues,
} from '#/sga/shared/domain/value-object/identity-document';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { LmsStudent } from '#/lms-wrapper/domain/entity/lms-student';

export const DEFAULT_PASSWORD = 'Universa3€';

export class Student extends BaseEntity {
  private constructor(
    id: string,
    private _name: string,
    private _surname: string,
    private _surname2: string,
    private _email: string,
    private _universaeEmail: string,
    private _status: StudentStatus,
    private _isActive: boolean,
    private _origin: StudentOrigin,
    private _createdBy: AdminUser,
    private _updatedBy: AdminUser,
    private _avatar: string | null,
    private _birthDate: Date | null,
    private _gender: StudentGender | null,
    private _country: Country | null,
    private _citizenship: Country | null,
    private _identityDocument: IdentityDocument | null,
    private _socialSecurityNumber: string | null,
    private _crmId: string | null,
    private _accessQualification: AccessQualification | null,
    private _niaIdalu: string | null,
    private _phone: string | null,
    private _contactCountry: Country | null,
    private _state: string | null,
    private _city: string | null,
    private _address: string | null,
    private _guardianName: string | null,
    private _guardianSurname: string | null,
    private _guardianEmail: string | null,
    private _guardianPhone: string | null,
    private _academicRecords: AcademicRecord[],
    private _password: string | null,
    private _lmsStudent: LmsStudent | null,
  ) {
    super(id, new Date(), new Date());
  }

  public get lmsStudent(): LmsStudent | null {
    return this._lmsStudent;
  }

  public set lmsStudent(value: LmsStudent | null) {
    this._lmsStudent = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get surname(): string {
    return this._surname;
  }

  public set surname(value: string) {
    this._surname = value;
  }

  public get surname2(): string {
    return this._surname2;
  }

  public set surname2(value: string) {
    this._surname2 = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get universaeEmail(): string {
    return this._universaeEmail;
  }

  public set universaeEmail(value: string) {
    this._universaeEmail = value;
  }

  public get avatar(): string | null {
    return this._avatar;
  }

  public set avatar(value: string | null) {
    this._avatar = value;
  }

  public get birthDate(): Date | null {
    return this._birthDate;
  }

  public set birthDate(value: Date | null) {
    this._birthDate = value;
  }

  public get gender(): StudentGender | null {
    return this._gender;
  }

  public set gender(value: StudentGender | null) {
    this._gender = value;
  }

  public get country(): Country | null {
    return this._country;
  }

  public set country(value: Country | null) {
    this._country = value;
  }

  public get citizenship(): Country | null {
    return this._citizenship;
  }

  public set citizenship(value: Country | null) {
    this._citizenship = value;
  }

  public get identityDocument(): IdentityDocument | null {
    return this._identityDocument;
  }

  public set identityDocument(value: IdentityDocument | null) {
    this._identityDocument = value;
  }

  public get socialSecurityNumber(): string | null {
    return this._socialSecurityNumber;
  }

  public set socialSecurityNumber(value: string | null) {
    this._socialSecurityNumber = value;
  }

  public get status(): StudentStatus {
    return this._status;
  }

  public set status(value: StudentStatus) {
    this._status = value;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public set isActive(value: boolean) {
    this._isActive = value;
  }

  public get origin(): StudentOrigin {
    return this._origin;
  }

  public set origin(value: StudentOrigin) {
    this._origin = value;
  }

  public get crmId(): string | null {
    return this._crmId;
  }

  public set crmId(value: string | null) {
    this._crmId = value;
  }

  public get accessQualification(): AccessQualification | null {
    return this._accessQualification;
  }

  public set accessQualification(value: AccessQualification | null) {
    this._accessQualification = value;
  }

  public get niaIdalu(): string | null {
    return this._niaIdalu;
  }

  public set niaIdalu(value: string | null) {
    this._niaIdalu = value;
  }

  public get phone(): string | null {
    return this._phone;
  }

  public set phone(value: string | null) {
    this._phone = value;
  }

  public get contactCountry(): Country | null {
    return this._contactCountry;
  }

  public set contactCountry(value: Country | null) {
    this._contactCountry = value;
  }

  public get state(): string | null {
    return this._state;
  }

  public set state(value: string | null) {
    this._state = value;
  }

  public get city(): string | null {
    return this._city;
  }

  public set city(value: string | null) {
    this._city = value;
  }

  public get address(): string | null {
    return this._address;
  }

  public set address(value: string | null) {
    this._address = value;
  }

  public get guardianName(): string | null {
    return this._guardianName;
  }

  public set guardianName(value: string | null) {
    this._guardianName = value;
  }

  public get guardianSurname(): string | null {
    return this._guardianSurname;
  }

  public set guardianSurname(value: string | null) {
    this._guardianSurname = value;
  }

  public get guardianEmail(): string | null {
    return this._guardianEmail;
  }

  public set guardianEmail(value: string | null) {
    this._guardianEmail = value;
  }

  public get guardianPhone(): string | null {
    return this._guardianPhone;
  }

  public set guardianPhone(value: string | null) {
    this._guardianPhone = value;
  }

  public get createdBy(): AdminUser {
    return this._createdBy;
  }

  public set createdBy(value: AdminUser) {
    this._createdBy = value;
  }

  public get updatedBy(): AdminUser {
    return this._updatedBy;
  }

  public set updatedBy(value: AdminUser) {
    this._updatedBy = value;
  }

  public get academicRecords(): AcademicRecord[] {
    return this._academicRecords;
  }

  public set academicRecords(value: AcademicRecord[]) {
    this._academicRecords = value;
  }

  public get password(): string | null {
    return this._password;
  }

  public set password(value: string | null) {
    this._password = value;
  }

  static createFromSGA(
    id: string,
    name: string,
    surname: string,
    surname2: string,
    email: string,
    universaeEmail: string,
    user: AdminUser,
    password: string,
    lmsStudent: LmsStudent | null,
  ): Student {
    return new Student(
      id,
      name,
      surname,
      surname2,
      email,
      universaeEmail,
      StudentStatus.CREATED,
      true,
      StudentOrigin.SGA,
      user,
      user,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      [],
      password,
      lmsStudent,
    );
  }

  static createFromCRM(
    id: string,
    name: string,
    surname: string,
    surname2: string,
    email: string,
    password: string,
    universaeEmail: string,
    crmId: string,
    birthDate: Date | null,
    gender: StudentGender | null,
    country: Country | null,
    identityDocument: IdentityDocumentValues | null,
    nuss: string | null,
    phone: string | null,
    state: string | null,
    city: string | null,
    user: AdminUser,
    lmsStudent: LmsStudent | null,
  ) {
    return new Student(
      id,
      name,
      surname,
      surname2,
      email,
      universaeEmail,
      StudentStatus.CREATED,
      true,
      StudentOrigin.CRM,
      user,
      user,
      null,
      birthDate,
      gender,
      country,
      null,
      identityDocument ? new IdentityDocument(identityDocument) : null,
      nuss,
      crmId,
      null,
      null,
      phone,
      null,
      state,
      city,
      null,
      null,
      null,
      null,
      null,
      [],
      password,
      lmsStudent,
    );
  }

  update(
    name: string,
    surname: string,
    surname2: string,
    email: string,
    universaeEmail: string,
    isActive: boolean,
    user: AdminUser,
    avatar: string | null,
    birthDate: Date | null,
    gender: StudentGender | null,
    country: Country | null,
    citizenship: Country | null,
    identityDocument: IdentityDocumentValues | null,
    socialSecurityNumber: string | null,
    accessQualification: AccessQualification | null,
    niaIdalu: string | null,
    phone: string | null,
    contactCountry: Country | null,
    state: string | null,
    city: string | null,
    address: string | null,
    guardianName: string | null,
    guardianSurname: string | null,
    guardianEmail: string | null,
    guardianPhone: string | null,
    lmsStudent: LmsStudent | null,
  ) {
    this.name = name;
    this.surname = surname;
    this.surname2 = surname2;
    this.email = email;
    this.universaeEmail = universaeEmail;
    this.isActive = isActive;
    this.updatedBy = user;
    this.avatar = avatar;
    this.birthDate = birthDate;
    this.gender = gender;
    this.country = country;
    this.citizenship = citizenship;
    this.identityDocument = identityDocument
      ? new IdentityDocument(identityDocument)
      : null;
    this.socialSecurityNumber = socialSecurityNumber;
    this.accessQualification = accessQualification;
    this.niaIdalu = niaIdalu;
    this.phone = phone;
    this.contactCountry = contactCountry;
    this.state = state;
    this.city = city;
    this.address = address;
    this.guardianName = guardianName;
    this.guardianSurname = guardianSurname;
    this.guardianEmail = guardianEmail;
    this.guardianPhone = guardianPhone;
    if (lmsStudent) {
      this._lmsStudent = lmsStudent;
    }
  }

  public updateLMSStudent(lmsStudent: LmsStudent): void {
    this._lmsStudent = lmsStudent;
  }
}
