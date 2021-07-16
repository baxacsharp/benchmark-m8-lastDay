import supertest from 'supertest'
import server from '../server'

import mongoose from "mongoose"
import dotenv from "dotenv"
import { response } from "express";

dotenv.config()
const request = supertest(server)



describe("Testing suite #1", () => {

    beforeAll(done => {
        // jest.setTimeout(90 * 1000)
        {
            process.env.ATLAS_TEST_URL &&
                mongoose
                    .connect(process.env.ATLAS_TEST_URL, { useNewUrlParser: true })
                    .then(() => {
                        console.log("Connected to Atlas")
                        done()
                    })
        }
    })

    it("should test that true is true", () => {
        expect(true).toBe(true);
    })



    // GET all /accomodations
    it("should test that the route is retourning all avalibale accomodations", async () => {

        const response = await request.get("/accomodations")
        expect(response.status).toBe(200)


    })
    // POST  /accomodations

    const validAccomodation = {
        name: "new accomodation",
        description: "new decription",
        maxGuests: 2,
        city: "London"
    }
    const invalidAccomodation = {
        name: "Iam invalid"
    }
    it("should test that we can POST a new accomodation", async () => {
        const response = await request.post("/accomodations").send(validAccomodation)

        expect(response.status).toBe(201)
        expect(typeof response.body._id).toBe("string")

    })
    it("should test if one of the required fields are missing", async () => {
        const newResponse = await request.post("/accomodations").send(invalidAccomodation)
        expect(newResponse.status).toBe(400)
    })

    // GET single /accomodations/:id

    it("should test that we can GET a single accomodation with the given id", async () => {
        const newAccomodations = await request.post("/accomodations").send(validAccomodation)

        const { _id } = newAccomodations.body
        const response = await request.get(`/accomodations/${_id}`)

        expect(response.status).toBe(200)
        expect(response.body.name).toBe(validAccomodation.name)

    })


    it("should test that we can DELETE a user with a given id", async () => {
        const newUserResponse = await request.post("/accomodations").send(validAccomodation)
        const { _id } = newUserResponse.body
        const response = await request.del(`/accomodations/${_id}`)
        expect(response.status).toBe(204)
        const getResponse = await request.get(`/users/${_id}`)
        expect(getResponse.status).toBe(404)


    })

    // PUT /accomodations/:id
    const newAccomodation = {
        name: "new name",
        description: "new descr",
        maxGuests: 2,
        city: "Paris"
    }
    it("should test that we can update one single accomodation with id", async () => {

        const accomodation = await request.post("/accomodations").send(validAccomodation)
        const response = await request.put(`/accomodations/${accomodation.body._id}`).send(newAccomodation)
        expect(response.status).toBe(204)
    })


    afterAll(done => {
        mongoose.connection.dropDatabase().then(() => {
            mongoose.connection.close().then(done)
        })
    })
    it("should test if one of the fields are missing then,it should allow to edit the data", async () => {
        const accomodation = await request.post("/accomodations").send(validAccomodation)
        const response = await request.put(`/accomodations/${accomodation.body._id}`).send(invalidAccomodation)
        expect(response.status).toBe(400)
    })
})
