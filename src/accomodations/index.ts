import express, { response } from "express"
import Accomodations from "../schema/accomodationSchema"

const accomodationsRouter = express.Router()

accomodationsRouter.get('/', async (req, res) => {
    const accomodation = await Accomodations.find()

    res.status(200).send(accomodation)
})
accomodationsRouter.get("/destinations", async (req, res) => {
    const cities = await Accomodations.find({ city: 1 })
    res.status(200).send(cities)
})
accomodationsRouter.post("/", async (req, res) => {
    const { name, description, maxGuests, city } = req.body
    if (!name || !description || !maxGuests || !city) {
        res.status(400).send({ message: "INVALID_ACCOMODATION" })
        return
    }
    const newAccomodation = new Accomodations({ name, description, maxGuests, city })

    await newAccomodation.save()

    res.status(201).send(newAccomodation)
})



accomodationsRouter.get("/:id", async (req, res) => {
    const accomodation = await Accomodations.findById(req.params.id)
    if (!accomodation) {
        res.status(404).send()
        return
    } else {
        res.status(200).send(accomodation)
    }

})
accomodationsRouter.delete("/:id", async (req, res) => {
    const deletedAccomodations = await Accomodations.findByIdAndDelete({ _id: req.params.id })
    if (!deletedAccomodations) {
        res.status(404).send()
        return
    } else {
        res.status(204).send(deletedAccomodations)
    }


})
accomodationsRouter.put("/:id", async (req, res) => {
    const { name, description, maxGuests, city } = req.body
    if (!name || !description || !maxGuests || !city) {
        res.status(400).send({ message: "INVALID_ACCOMODATION" })
        return
    }
    const updatedAccomodations = await Accomodations.findByIdAndUpdate(
        req.params.id, req.body
    )
    res.status(204).send(updatedAccomodations)

})



export default accomodationsRouter;