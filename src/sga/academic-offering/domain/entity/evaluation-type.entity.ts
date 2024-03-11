import { BaseEntity } from '#shared/domain/entity/base.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class EvaluationType extends BaseEntity {
  private constructor(
    id: string,
    private _name: string,
    private _percentageVirtualCampus: number,
    private _percentageAttendance: number,
    private _percentageProject: number,
    private _isPassed: boolean,
    private _businessUnits: BusinessUnit[],
    createdAt: Date,
    updateAt: Date,
  ) {
    super(id, createdAt, updateAt);
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get percentageVirtualCampus(): number {
    return this._percentageVirtualCampus;
  }

  public set percentageVirtualCampus(value: number) {
    this._percentageVirtualCampus = value;
  }

  public get percentageAttendance(): number {
    return this._percentageAttendance;
  }

  public set percentageAttendance(value: number) {
    this._percentageAttendance = value;
  }

  public get percentageProject(): number {
    return this._percentageProject;
  }

  public set percentageProject(value: number) {
    this._percentageProject = value;
  }

  public get isPassed(): boolean {
    return this._isPassed;
  }

  public set isPassed(value: boolean) {
    this._isPassed = value;
  }

  public get businessUnits(): BusinessUnit[] {
    return this._businessUnits;
  }

  public set businessUnits(value: BusinessUnit[]) {
    this._businessUnits = value;
  }

  static create(
    id: string,
    name: string,
    percentageVirtualCampus: number,
    percentageAttendance: number,
    percentageProject: number,
    isPassed: boolean,
    businessUnits: BusinessUnit[],
  ): EvaluationType {
    return new EvaluationType(
      id,
      name,
      percentageVirtualCampus,
      percentageAttendance,
      percentageProject,
      isPassed,
      businessUnits,
      new Date(),
      new Date(),
    );
  }
}
