import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { USER_NOT_FOUND } from './users.constants';


export interface IAnswerMsg {
  status: number;
  message: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>) { }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const saltRounds = 10;
    const dublicatexUser = await this.repository.findOne({ email: dto.email })
    if (dublicatexUser) {
      throw new HttpException('Пользователь с такой почтой уже существует', 400)
    }
    dto.password = await hash(dto.password, saltRounds)
    return this.repository.save(dto);
  }

  findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.repository.findOne(id);

    if (!user) {
      throw new HttpException(USER_NOT_FOUND, 404)
    }

    return user
  }

  async findByName(name: string): Promise<UserEntity[]> {
    const users = await this.repository.find({
      where: {
        name
      }
    })

    if (!users.length) {
      throw new HttpException('Пользователей с таким именем не существует', 404)
    }

    return users
  }

  async update(id: number, dto: UpdateUserDto): Promise<IAnswerMsg> {
    const result = await this.repository.update(id, dto)
    if (result.affected === 0) {
      throw new HttpException(USER_NOT_FOUND, 404);
    }

    return {
      status: 1,
      message: 'Пользователь изменен'
    }
  }

  async remove(id: number): Promise<IAnswerMsg> {
    const result = await this.repository.softDelete(id);

    if (result.affected === 0) {
      throw new HttpException(USER_NOT_FOUND, 404);
    }

    return {
      status: 1,
      message: 'Пользователь удален'
    }
  }
}
