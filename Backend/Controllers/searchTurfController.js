import axios from "axios";
import ExpressError from "../utils/ExpressError.js";

export const getTurfs = async (req, res, next) => {
  const { q, lat, lon } = req.query;
  if (!q) throw new ExpressError(400, "Search Querry required");
  try {
    const radius = 30000;

    const query = `
[out:json];
(
  node["leisure"="pitch"](around:${radius},${lat || 18.5204},${lon || 73.85});
  way["leisure"="pitch"](around:${radius},${lat || 18.5204},${lon || 73.85});
  relation["leisure"="pitch"](around:${radius},${lat || 18.5204},${
      lon || 73.85
    });
  node["leisure"="sports_centre"](around:${radius},${lat || 18.5204},${
      lon || 73.85
    });
  way["leisure"="sports_centre"](around:${radius},${lat || 18.5204},${
      lon || 73.85
    });
  relation["leisure"="sports_centre"](around:${radius},${lat || 18.5204},${
      lon || 73.85
    });
);
out center;
`;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      query
    )}`;

    const response = await axios.get(url);

    const turfs = response.data.elements.map((el) => {
      const latVal = el.lat ?? el.center?.lat;
      const lonVal = el.lon ?? el.center?.lon;
      let name = "Unknown Turf";

      if (el.tags?.name) {
        name = el.tags.name;
      } else if (el.tags?.sport) {
        name = `${
          el.tags.sport.charAt(0).toUpperCase() + el.tags.sport.slice(1)
        } Turf`;
      } else if (el.tags?.leisure === "pitch") {
        name = "Sports Pitch";
      } else if (el.tags?.leisure === "sports_centre") {
        name = "Sports Centre";
      }

      return {
        id: `${el.type}/${el.id}`,
        name,
        type: el.tags?.sport || el.tags?.leisure || "General",
        address:
          el.tags?.addr_full ||
          el.tags?.["addr:street"] ||
          el.tags?.["addr:place"] ||
          "Address not available",
        lat: latVal,
        lon: lonVal,
      };
    });

    const search = q.toLowerCase();
    const filteredTurfs = turfs.filter((turf) =>
      turf.name.toLowerCase().includes(search)
    );

    res.json({
      count: filteredTurfs.length,
      turfs: filteredTurfs.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
};
