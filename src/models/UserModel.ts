import mongoose, { Document, Schema } from "mongoose"

export interface UserModel extends Document {
    email: string
    password: string
    companyName: string
}

export const UserSchema = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        companyName: { type: String, required: true }
    },
    { timestamps: { createdAt: true, updatedAt: true }, versionKey: false }
)

export const UserModel = mongoose.model<UserModel>("User", UserSchema)
