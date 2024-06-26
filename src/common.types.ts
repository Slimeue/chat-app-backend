import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field({ nullable: true, defaultValue: 1 })
  page?: number;

  @Field({ nullable: true, defaultValue: 10 })
  limit?: number;
}

@InputType()
export class ChatRoomPaginationInput extends PaginationInput {
  @Field({ nullable: true })
  userId?: string;
}

@InputType()
export class FriendRequestPaginationInput extends PaginationInput {
  @Field({ nullable: true })
  userId?: string;
}

@InputType()
export class FriendPaginationInput extends PaginationInput {
  @Field({ nullable: true })
  userId?: string;
}

@InputType()
export class MessagePaginationInput extends PaginationInput {
  @Field()
  receiverId: string;
}

@ObjectType('Meta')
export class Meta {
  @Field()
  total: number;

  @Field()
  page: number;

  @Field()
  limit: number;
}

export type UploadFile = {
  url: string;
  fileName: string;
  mimetype?: string;
};
