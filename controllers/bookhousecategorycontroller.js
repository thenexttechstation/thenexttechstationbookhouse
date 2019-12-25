const BookHouseCategory = require("../models/bookhousecategorymodel");

exports.createCategory = (request, response) => {
  const bookhousecategory = new BookHouseCategory(request.body);
  bookhousecategory.save((error, bookhousecategorydata) => {
    if (error) {
      return response.status(400).json({
        error: "Error saving Category"
      });
    }
    response.json({ bookhousecategory });
  });
};

exports.updateCategory = (request, response) => {
  const bookhousecategory = request.bookhousecategory;
  bookhousecategory.categoryname = request.body.categoryname;
  bookhousecategory.save((error, bookhousecategoryupdateddata) => {
    if (error) {
      return response.status(400).json({
        error: "Error updating Category"
      });
    }
    response.json({ bookhousecategoryupdateddata });
  });
};
exports.removeCategory = (request, response) => {
  const bookhousecategory = request.bookhousecategory;
  bookhousecategory.remove((error, bookhousecategorydeletedcategory) => {
    if (error) {
      return response.status(400).json({
        error: "Error deleting Category"
      });
    }
    response.json({ message: "Category deleted succesfully" });
  });
};
exports.fetchAllCategoryDetails = (request, response) => {
  BookHouseCategory.find().exec((error, data) => {
    if (error) {
      return response.status(400).json({
        error: "Error fetching Category"
      });
    }
    response.json(data);
  });
};

exports.findCategoryById = (request, response, next, id) => {
  BookHouseCategory.findById(id).exec((error, bookhousecategory) => {
    if (error || !bookhousecategory) {
      return response.status(400).json({
        error: "No Category"
      });
    }
    request.bookhousecategory = bookhousecategory;
    next();
  });
};

exports.getsingleCategory = (request, response) => {
  return response.json(request.bookhousecategory);
};
