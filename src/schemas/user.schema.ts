import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
    _id: Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    password: string;

    @Prop({
        default: ""
    })
    picture: string;

    @Prop({
        default: 0
    })
    point: number;

    @Prop({
        default: false
    })
    isPremium: boolean;

    @Prop()
    username: string;

    @Prop()
    email: string;

    @Prop({
        type: [String],
        enum: Role,
        default: [Role.USER]
    })
    role: Role[];

}
export const UserSchema = SchemaFactory.createForClass(User);