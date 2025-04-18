import { numericValidator } from "../../search/api/controller.js";
import { getTopLikedRecipes } from "../db.js";

export const getTrendingRecipes = (req, res) => {
  if (!numericValidator(req.params.n)) {
    return res
      .status(400)
      .json({ error: "Invalid query for trending recipes." });
  }

  getTopLikedRecipes(req.params.n)
    .then((recipes) => {
      const filteredRecipes = recipes.map(
        ({ _id, image, title, likes, summary }) => ({
          id: _id.toString(),
          image,
          title,
          likes,
          summary,
        }),
      );
      res.status(200).json({ results: filteredRecipes });
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
