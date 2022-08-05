import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type UserDocument = User & Document;


@Schema({ timestamps: { createdAt: "created_at" } })
export class User {
    @Prop({ required: true, trim: true, maxlength: 50  })
    name: string

    @Prop({ required: true, trim: true, unique: true })
    email: string

    @Prop({ required: true, unique: true })
    phone: string 

    @Prop({ min: 20, max: 100, required: true })
    age?: number

    @Prop({ enum: ["male", "female"] })
    gender?: string 

    @Prop({ required: true })
    password: string 

    @Prop({ default: false })
    isTrusted: boolean 

    @Prop({ default: false })
    isVerified: boolean 

    @Prop({ default : "aws-url" })
    img: string 
    
    @Prop()
    token: string 

    @Prop()
    customer_token: string 

    @Prop()
    account_id: string 

    // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] })
    // chats: Room[]

}

export const UserSchema = SchemaFactory.createForClass(User)
