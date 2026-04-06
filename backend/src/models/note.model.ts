import mongoose from "mongoose";

const Schema = mongoose.Schema;

const noteSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		tag: {
			type: String,
		},
		pinned: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
