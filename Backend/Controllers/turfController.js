import axios from "axios";
import ExpressError from "../utils/ExpressError.js";

export const showTurfs = async (req, res, next) => {
  try {
    const { lat, lon, radius = 1000 } = req.query;
    if (!lat || !lon) {
      throw new ExpressError(400, "Latitude and Longitude are required");
    }

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const radiusNum = Math.max(
      100,
      Math.min(50000, parseInt(radius, 10) || 1000)
    );

    const query = `
  [out:json][timeout:25];
  (
    node["leisure"="pitch"](around:${radiusNum},${latNum},${lonNum});
    way["leisure"="pitch"](around:${radiusNum},${latNum},${lonNum});
    relation["leisure"="pitch"](around:${radiusNum},${latNum},${lonNum});
    node["leisure"="sports_centre"](around:${radiusNum},${latNum},${lonNum});
    way["leisure"="sports_centre"](around:${radiusNum},${latNum},${lonNum});
    relation["leisure"="sports_centre"](around:${radiusNum},${latNum},${lonNum});
  );
  out center;
`;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      query
    )}`;

    const response = await axios.get(url, {
      timeout: 30000,
    });

    const elements = response.data?.elements || [];

    const turfs = elements
      .map((item) => {
        const latVal = item.lat ?? item.center?.lat;
        const lonVal = item.lon ?? item.center?.lon;
        let turfName = "Unnamed Turf";
        if (item.tags?.name) {
          turfName = item.tags.name;
        } else if (item.tags?.sport) {
          turfName = `${
            item.tags.sport.charAt(0).toUpperCase() + item.tags.sport.slice(1)
          } Turf`;
        } else if (item.tags?.leisure === "pitch") {
          turfName = "Sports Pitch";
        } else if (item.tags?.leisure === "sports_centre") {
          turfName = "Sports Centre";
        }
        return {
          id: `${item.type}/${item.id}`,
          osm_id: item.id,
          osm_type: item.type,
          name: turfName,
          type: item.tags?.sport || item.tags?.leisure || "General",
          lat: latVal != null ? parseFloat(latVal) : null,
          lon: lonVal != null ? parseFloat(lonVal) : null,
        };
      })
      .filter((t) => t.lat != null && t.lon != null);

    res.json({ turfs });
  } catch (err) {
    next(err);
  }
};
