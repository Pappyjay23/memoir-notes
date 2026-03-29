import mongoose from "mongoose";

const Schema = mongoose.Schema;

const noteSchema = new Schema(
	{
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
