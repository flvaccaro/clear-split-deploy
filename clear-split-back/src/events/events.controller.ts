import { Body, Controller, Get, Post, UseGuards, Req, Param, Delete, Patch } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService, private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: { title: string }, @Req() req) {
    return this.eventsService.create({
      title: body.title,
      date: new Date().toLocaleDateString('en-GB'),
      createdBy: req.user.sub,
      participants: [req.user.sub],
    });
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.eventsService.deleteById(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/participants')
  async getParticipants(@Param('id') id: string) {
    const event = await this.eventsService.findById(id);
    return this.usersService.findManyByIds(event.participants);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/participants')
  async joinEvent(@Param('id') id: string, @Req() req) {
    return this.eventsService.addParticipant(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/settlement')
  async getSettlement(@Param('id') eventId: string) {
    return this.eventsService.calculateSettlement(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Req() req, @Body() body: { title: string }) {
    return this.eventsService.updateEvent(id, req.user.sub, body.title);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/finalize')
  finalize(@Param('id') id: string, @Req() req) {
    return this.eventsService.finalizeEvent(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/reopen')
  reopen(@Param('id') id: string, @Req() req) {
    return this.eventsService.reopenEvent(id, req.user.sub);
  }
}
