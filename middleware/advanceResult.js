const advanceResult = (Model, populate) => async (req, res, next) => {
  let query;

  //copy query params
  let reqQuery = { ...req.query };
  // Fields To exclude from query,& later execute down in Bootcamp model.
  const removeFields = ['select', 'sort', 'limit', 'page', 'populate'];
  removeFields.forEach((param) => delete reqQuery[param]);

  //Convert to String & Create operators gt,gte,lte,lt
  let queryStr = JSON.stringify(reqQuery).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  query = Model.find(JSON.parse(queryStr));
  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    console.log('fields', fields);
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  if (populate) populate.forEach((po) => (query = query.populate(po)));

  // if (req.query.populate) {
  //   let populate = req.query.populate;
  //   populate = populate.split(',').join(' ');
  //   query = query.populate(populate);
  // }
  /*
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100; //Page Size
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  let pagination = { page };
  const totalDocs = await Model.countDocuments(JSON.parse(queryStr));

  // if (totalDocs > skip) {
  //   query = query.skip(skip).limit(limit);
  // }

  pagination.totalPages = Math.ceil(totalDocs / limit);
  const startIndex = (page - 1) * limit;

  const lastIndex = page * limit;

  if (lastIndex < totalDocs) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //Pagination end
*/
  const Results = await query;
  res.advanceResults = {
    success: true,
    count: Results.length,
    data: Results,
  };
  next();
  //Final Query To Execute
  // .populate('courses'); //Add Select Query Dynamically
  // .populate({ path: 'courses', select: 'title' });
};
module.exports = advanceResult;
