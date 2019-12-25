const formidable = require("formidable");
const _ = require("lodash");
const BookHouseProduct = require("../models/bookhouseproductmodel");

const filesystem = require("fs");

exports.findProductById = (request, response, next, id) => {
  BookHouseProduct.findById(id)
    .populate("bookhousecategory")
    .exec((error, bookhouseproduct) => {
      if (error || !bookhouseproduct) {
        return response.status(400).json({
          error: "No Product"
        });
      }
      request.bookhouseproduct = bookhouseproduct;
      next();
    });
};

exports.removeProduct = (request, response) => {
  let bookhouseproduct = request.bookhouseproduct;
  bookhouseproduct.remove((error, deletedProduct) => {
    if (error) {
      return response.status(400).json({
        error: "No Product"
      });
    }
    response.json({ deletedProduct, message: "Product has been deleted" });
  });
};

exports.getsingleProduct = (request, response) => {
  request.bookhouseproduct.image = undefined;
  return response.json(request.bookhouseproduct);
};
exports.createProduct = (request, response) => {
  console.log("Inside create Product");
  let formdata = new formidable.IncomingForm();
  console.log("Heloo" + formdata);
  formdata.keepExtensions = true;
  formdata.parse(request, (error, fields, files) => {
    console.log("Inside");
    if (error) {
      return response.status(400).json({
        error: "Error uploading Image"
      });
    }
    let bookhouseproduct = new BookHouseProduct(fields);
    console.log(JSON.stringify(bookhouseproduct));
    if (files.image) {
      console.log("Hello");
      if (files.image.size > 2000000) {
        return response.status(400).json({
          error: "The image size should be less than 2 MB"
        });
      }
      const {
        bookname,
        bookdescription,
        author,
        price,
        quantity,
        bookhousecategory,
        image,
        deliverable,
        imageurl
      } = fields;
      if (
        !bookname ||
        !bookdescription ||
        !author ||
        !price ||
        !quantity ||
        !bookhousecategory ||
        !deliverable ||
        !imageurl
      ) {
        console.log("bookname" + bookname);
        console.log("bookdescription" + bookdescription);
        console.log("author" + author);
        console.log("price" + price);
        console.log("quantity" + quantity);
        console.log("bookhousecategory" + bookhousecategory);
        //console.log("image" + image.size);
        console.log("deliverable" + deliverable);

        return response.status(400).json({
          error: "Fields are mandatory"
        });
      }

      bookhouseproduct.image.data = filesystem.readFileSync(files.image.path);
      bookhouseproduct.image.contentType = files.image.type;
      console.log("book" + JSON.stringify(bookhouseproduct));
    }
    bookhouseproduct.save((error, data) => {
      if (error) {
        return response.status(400).json({
          error: "Error saving Product"
        });
      }
      response.json({ data });
    });
  });
};

exports.updateProduct = (request, response) => {
  let formdata = new formidable.IncomingForm();
  formdata.keepExtensions = true;
  formdata.parse(request, (error, fields, files) => {
    if (error) {
      return response.status(400).json({
        error: "Error uploading Image"
      });
    }
    let bookhouseproduct = request.bookhouseproduct;
    bookhouseproduct = _.extend(bookhouseproduct, fields);
    if (files.image) {
      if (files.image.size > 2000000) {
        return response.status(400).json({
          error: "The image size should be less than 2 MB"
        });
      }
      const {
        bookname,
        bookdescription,
        author,
        price,
        quantity,
        bookhousecategory,
        image,
        deliverable,
        imageurl
      } = fields;
      if (
        !bookname ||
        !bookdescription ||
        !author ||
        !price ||
        !quantity ||
        !bookhousecategory ||
        !deliverable ||
        !imageurl
      ) {
        console.log("bookname" + bookname);
        console.log("bookdescription" + bookdescription);
        console.log("author" + author);
        console.log("price" + price);
        console.log("quantity" + quantity);
        console.log("bookhousecategory" + bookhousecategory);
        //console.log("image" + image.size);
        console.log("deliverable" + deliverable);
      }

      bookhouseproduct.image.data = filesystem.readFileSync(files.image.path);
      bookhouseproduct.image.contentType = files.image.type;
    }
    bookhouseproduct.save((error, data) => {
      if (error) {
        return response.status(400).json({
          error: "Error saving Product"
        });
      }
      response.json({ data });
    });
  });
};

//mostpurchased and New Product
//mostPurchased =/products?sortBy=mostPurchased$order=desc&limit=6
//newProduct = /products?sortBy=createdAt$order=desc&limit=6
//allProduct =/products

exports.fetchAllProductDetails = (request, response) => {
  let sortOrder = request.query.order ? request.query.order : "asc";
  let sortBy = request.query.sortBy ? request.query.sortBy : "_id";
  let limit = request.query.limit ? parseInt(request.query.limit) : 6;
  BookHouseProduct.find()
    .select("-image")
    .populate("bookhousecategory")
    .sort([[sortBy, sortOrder]])
    .limit(limit)
    .exec((error, bookhouseproducts) => {
      if (error) {
        return response.status(400).json({
          error: "Product not available"
        });
      }
      response.send(bookhouseproducts);
    });
};

exports.fetchAllRelatedProductDetails = (request, response) => {
  let limit = request.query.limit ? parseInt(request.query.limit) : 6;

  BookHouseProduct.find({
    _id: { $ne: request.bookhouseproduct },
    bookhousecategory: request.bookhouseproduct.bookhousecategory
  })
    .select("-image")
    .limit(limit)
    .populate("bookhousecategory", "_id bookname")
    .exec((err, relatedproducts) => {
      if (err) {
        return response.status(400).json({
          error: "Related Products not found"
        });
      }
      response.json(relatedproducts);
    });
};

exports.findCategoriesToProduct = (request, response) => {
  BookHouseProduct.distinct("bookhousecategory", {}, (err, categories) => {
    if (err) {
      console.log(err);
      return response.status(400).json({
        error: err
      });
    }
    response.json(categories);
  });
};

exports.loadProductImage = (request, response, next) => {
  if (request.bookhouseproduct.image.data) {
    response.set("Content-Type", request.bookhouseproduct.image.contentType);
    return response.send(request.bookhouseproduct.image.data);
  }
  next();
};

exports.ProductSearch = (request, response) => {
  let sortOrder = request.query.order ? request.query.order : "asc";
  let sortBy = request.query.sortBy ? request.query.sortBy : "_id";
  let limit = request.query.limit ? parseInt(request.query.limit) : 6;
  let skip = parseInt(request.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in request.body.filters) {
    if (request.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: request.body.filters[key][0],
          $lte: request.body.filters[key][1]
        };
      } else {
        findArgs[key] = request.body.filters[key];
        console.log("Find ardgs" + findArgs[key]);
      }
    }
  }

  BookHouseProduct.find(findArgs)
    .select("-image")
    .populate("bookhousecategory")
    .sort([[sortBy, sortOrder]])
    .skip(skip)
    .limit(limit)
    .exec((error, data) => {
      if (error) {
        return response.status(400).json({
          error: "Products not found"
        });
      }
      response.json({
        size: data.length,
        data
      });
    });
};

exports.decreaseInventory = (req, res, next) => {
  console.log("Inside decreaseInventory");
  let bulkOps = req.body.order.bookhouseproducts.map(item => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.count, mostPurchased: +item.count } }
      }
    };
  });

  BookHouseProduct.bulkWrite(bulkOps, {}, (error, bookhouseproducts) => {
    if (error) {
      return res.status(400).json({
        error: "Could not update product"
      });
    }
    next();
  });
};

exports.listAuthorSearch = (req, res) => {
  // create query object to hold search value and category value
  const query = {};
  // assign search value to query.name
  if (req.query.searchauthor) {
    query.author = { $regex: req.query.searchauthor, $options: "i" };
    // assigne category value to query.category
    if (req.query.bookhousecategory && req.query.bookhousecategory != "All") {
      query.bookhousecategory = req.query.bookhousecategory;
    }
    // find the product based on query object with 2 properties
    // search and category
    BookHouseProduct.find(query, (err, bookhouseproducts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(bookhouseproducts);
    }).select("-image");
  }
};
exports.listSearch = (req, res) => {
  // create query object to hold search value and category value
  const query = {};
  // assign search value to query.name
  if (req.query.search) {
    query.bookname = { $regex: req.query.search, $options: "i" };
    // assigne category value to query.category
    if (req.query.bookhousecategory && req.query.bookhousecategory != "All") {
      query.bookhousecategory = req.query.bookhousecategory;
    }
    // find the product based on query object with 2 properties
    // search and category
    BookHouseProduct.find(query, (err, bookhouseproducts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.json(bookhouseproducts);
    }).select("-image");
  }
};
