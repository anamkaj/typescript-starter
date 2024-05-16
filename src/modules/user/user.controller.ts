import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { UserDto } from './dto/dto'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/registration')
  @HttpCode(200)
  async newUser(@Body() data: UserDto) {
    console.log(data)
    return this.userService.newUser(data)
  }

  @Get('/userProfile')
  @HttpCode(200)
  async userProfile(@Query() data: { email: string }) {
    const { email } = data
    return await this.userService.userProfile(email)
  }
}
