const express = require("express");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://saikumar170325:Zb1lVWtuF13of4Wv@movieapi.wsrpipr.mongodb.net/?retryWrites=true&w=majority&appName=movieapi",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const movieSchema = new mongoose.Schema({
  name: String,
  img: String,
  summary: String,
});

const Movie = mongoose.model("Movie", movieSchema);

const initialMovies = [
  {
    name: "Harry Potter and the Order of the Phoenix",
    img: "https://bit.ly/2IcnSwz",
    summary:
      "Harry Potter and Dumbledore's warning about the return of Lord Voldemort is not heeded by the wizard authorities who, in turn, look to undermine Dumbledore's authority at Hogwarts and discredit Harry.",
  },
  {
    name: "The Lord of the Rings: The Fellowship of the Ring",
    img: "https://bit.ly/2tC1Lcg",
    summary:
      "A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed.",
  },
  {
    name: "Avengers: Endgame",
    img: "https://bit.ly/2Pzczlb",
    summary:
      "Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America, and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet and the universe.",
  },
];

const seedDB = async () => {
  try {
    const existingMovies = await Movie.find();
    if (existingMovies.length === 0) {
      await Movie.insertMany(initialMovies);
      console.log("Initial movies inserted");
    } else {
      console.log("Movies collection already contains data");
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

const app = express();
app.use(express.json());

app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/movies", async (req, res) => {
  const movie = new Movie(req.body);
  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/movies/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/movies/:id", async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const server = app.listen(3000, () => {
  console.log("Server started on port 3000");
});

server.once("listening", seedDB);
