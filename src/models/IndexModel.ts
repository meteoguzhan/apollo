import mongoose, { Document, Schema, Types } from "mongoose"
import moment from "moment"

export interface IndexModel extends Document {
    date: string
    indexValue: number
    userId: Types.ObjectId
}

export const IndexSchema = new Schema(
    {
        date: {
            type: String,
            required: true,
            validate: {
                validator: (date: string) => moment(date, "YYYY-MM-DD", true).isValid(),
                message: "Invalid date format"
            }
        },
        indexValue: { type: Number, required: true },
        userId: { type: Types.ObjectId, ref: "User", required: true }
    },
    { versionKey: false }
)

export const IndexModel = mongoose.model<IndexModel>("Index", IndexSchema)
