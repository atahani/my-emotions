import { Kind, ValueNode } from 'graphql';
import { Scalar, CustomScalar } from '@nestjs/graphql';

@Scalar('Date', type => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: string): Date {
    // value from the client
    return new Date(value); 
  }

  serialize(value: Date): string {
    // value sent to the client
    return new Date(value).toISOString(); 
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  }
}