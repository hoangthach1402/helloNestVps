import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }
  async findOne(id: number): Promise<Role | null> {
    return await this.roleRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Role | null> {
    return await this.roleRepository.findOne({ where: { name } });
  }

  async initializeDefaultRoles(): Promise<void> {
    const adminRole = await this.findByName('admin');
    if (!adminRole) {
      await this.create({ name: 'admin', description: 'Administrator role' });
    }

    const userRole = await this.findByName('user');
    if (!userRole) {
      await this.create({ name: 'user', description: 'Regular user role' });
    }
  }
}
