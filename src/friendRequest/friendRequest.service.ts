import { Injectable } from '@nestjs/common';
import { CreateFriendRequestInput } from './friendRequest.types';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest } from './friendRequest.schema';
import { Model, PipelineStage } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { FriendRequestPaginationInput } from 'src/common.types';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequest>,
    private readonly userService: UsersService,
  ) {}
  //TODO make a friend request
  async create(
    id: string,
    currentUserName: string,
    input: CreateFriendRequestInput,
  ) {
    if (!input) {
      throw new Error('No input found');
    }

    const foundFriend = await this.userService.findOneById(input.requestedToId);

    const friendRequest = await new this.friendRequestModel({
      requesterId: id,
      requestedToName: foundFriend.name,
      requesterName: currentUserName,
      ...input,
    });

    return friendRequest.save();
  }

  async searchFriendRequest(id: string, input: FriendRequestPaginationInput) {
    const { limit, page } = input;

    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new Error('User not found');
    }

    const aggregate: PipelineStage[] = [];

    const match: PipelineStage.Match = {
      $match: {
        requesterId: id,
      },
    };

    aggregate.push(match);

    const facet: PipelineStage.Facet = {
      $facet: {
        meta: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
            $addFields: {
              page,
              limit,
            },
          },
        ],
        docs: [
          {
            $skip: limit * (page - 1),
          },
          {
            $limit: limit,
          },
        ],
      },
    };

    aggregate.push(facet);

    const result = await this.friendRequestModel.aggregate(aggregate).exec();

    const item = result[0].docs;
    const meta = result[0].meta[0];

    return { item, meta };
  }
}
