import { timeStamp } from 'console';
import mongoose from 'mongoose'
import { number } from 'yargs'

const Accomodations = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        maxGuests: {
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true
        },

    }

);

export default mongoose.model('accomodation', Accomodations)