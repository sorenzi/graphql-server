import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { UserRoles } from '../modules/user/constants';

export class AddRoleToUser1625090926104 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'role',
        type: 'enum',
        enum: UserRoles,
        isNullable: true
      })
    );
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'role');
  }
}
// typeorm migration:generate -n 1625090926104-AddRoleToUser
