import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoomType } from 'src/constants';
import { v4 } from 'uuid';
@Schema({ timestamps: true })
@ObjectType()
export class ChatRoom {
  @Field()
  @Prop({ required: true, default: v4 })
  id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  ownerId: string;

  @Field()
  @Prop({ required: false, default: RoomType.GROUP })
  roomType: string;

  @Field(() => [String])
  @Prop({ required: false })
  media_image_url: string[];

  @Field(() => [String])
  @Prop({ required: false })
  media_videoes_url: string[];

  @Field(() => [String])
  @Prop({ required: false })
  media_file_url: string[];
}
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
