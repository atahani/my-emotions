import { ObjectType } from '@nestjs/graphql'

import { EmotionView } from '@my-emotions/types'

import PaginatedResponse from './paginated'

@ObjectType()
export class PaginatedEmotionView extends PaginatedResponse(EmotionView) {}
