import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatroomRepository } from '#shared/domain/repository/chatroom.repository';
import { chatroomSchema } from '#shared/infrastructure/config/schema/chatroom.schema';
import { Chatroom } from '#shared/domain/entity/chatroom.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

@Injectable()
export class ChatroomPostgresRepository
  extends TypeOrmRepository<Chatroom>
  implements ChatroomRepository
{
  constructor(
    @InjectRepository(chatroomSchema)
    private readonly repository: Repository<Chatroom>,
  ) {
    super();
  }

  async save(chatroom: Chatroom): Promise<void> {
    await this.repository.save({
      id: chatroom.id,
      chatroomId: chatroom.chatroomId,
      student: chatroom.student,
      teacher: chatroom.teacher,
      internalGroup: chatroom.internalGroup,
      createdAt: chatroom.createdAt,
      updatedAt: chatroom.updatedAt,
    });
  }

  async saveBatch(chatrooms: Chatroom[]): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .insert()
      .into(Chatroom)
      .values(chatrooms)
      .orIgnore()
      .execute();
  }

  async getByStudent(studentId: string): Promise<Chatroom[]> {
    return this.repository.find({
      where: {
        student: {
          id: studentId,
        },
      },
      relations: {
        internalGroup: {
          subject: true,
        },
        teacher: true,
        student: true,
      },
    });
  }

  async getByEdaeUserAndFBIds(
    edaeUser: EdaeUser,
    fbChatrommIds: string[],
  ): Promise<Chatroom[]> {
    return this.repository.find({
      where: {
        teacher: {
          id: edaeUser.id,
        },
        chatroomId: In(fbChatrommIds),
      },
      relations: {
        internalGroup: {
          subject: true,
        },
        teacher: true,
        student: true,
      },
    });
  }

  async existsByStudentAndTeacherAndInternalGroup(
    studentId: string,
    teacherId: string,
    internalGroupId: string,
  ): Promise<boolean> {
    const chatroom = await this.repository.findOne({
      where: {
        student: {
          id: studentId,
        },
        teacher: {
          id: teacherId,
        },
        internalGroup: {
          id: internalGroupId,
        },
      },
    });

    return !!chatroom;
  }

  async get(id: string): Promise<Chatroom | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        internalGroup: {
          subject: true,
        },
        teacher: true,
        student: true,
      },
    });
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.internalGroup`,
      'internalGroup',
    );
    queryBuilder.leftJoinAndSelect('chatroom.teacher', 'teacher');
    queryBuilder.leftJoinAndSelect('chatroom.student', 'student');
    queryBuilder.leftJoinAndSelect('internalGroup.subject', 'chatroom_subject');
    queryBuilder.leftJoinAndSelect(
      'internalGroup.academicProgram',
      'academicProgram',
    );
    queryBuilder.leftJoinAndSelect(
      'internalGroup.teachers',
      'internalGroup_teachers',
    );
    queryBuilder.leftJoinAndSelect('academicProgram.title', 'chatroom_title');
    queryBuilder.leftJoinAndSelect(
      'academicProgram.businessUnit',
      'chatroom_businessUnit',
    );
    queryBuilder.leftJoinAndSelect(
      'internalGroup.academicPeriod',
      'chatroom_academicPeriod',
    );

    return queryBuilder;
  }

  async matching(criteria: Criteria): Promise<Chatroom[]> {
    const aliasQuery = 'chatroom';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);

    let criteriaToQueryBuilder = await this.convertCriteriaToQueryBuilder(
      criteria,
      queryBuilder,
      'enrollment',
    );

    if (criteria.page !== null && criteria.limit !== null) {
      criteriaToQueryBuilder = criteriaToQueryBuilder.applyPagination(
        criteria,
        queryBuilder,
      );
    }

    if (criteria.order !== null) {
      criteriaToQueryBuilder.applyOrder(criteria, queryBuilder, aliasQuery);
    }

    return await this.getMany(queryBuilder);
  }
}
