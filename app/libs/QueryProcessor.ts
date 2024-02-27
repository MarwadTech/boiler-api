interface QueryObj {
  [key: string]: any;
}

export default class QueryProcessor {
  model: any;
  queryObj: QueryObj;
  include?: any;
  where: QueryObj | undefined;
  order: any;
  attributes: string[] | undefined;
  offset: number | undefined;
  limit: number | undefined;

  constructor(model: any, queryObj: QueryObj, include?: any) {
    this.model = model;
    this.queryObj = queryObj;
    this.include = include;
    this.where = undefined;
    this.order = [];
    this.attributes = undefined;
    this.offset = undefined;
    this.limit = undefined;
  }

  filter(): this {
    const where = { ...this.queryObj };

    const excludedFields = ["page", "sort", "limit", "fields", "include"];
    excludedFields.forEach((el) => delete where[el]);

    this.where = where;

    return this;
  }

  sort(): this {
    if (this.queryObj.sort) {
      this.order = this.queryObj.sort.split(",").map((item: string) => {
        return item.startsWith("-") ? [item.slice(1), "DESC"] : [item, "ASC"];
      });
    } else {
      this.order = [["created_at", "DESC"]];
    }

    return this;
  }

  limitFields(): this {
    if (this.queryObj.fields) {
      this.attributes = this.queryObj.fields.split(",");
    }

    return this;
  }

  paginate(): this {
    const page = parseInt(this.queryObj.page, 10) || 1;
    const limit = parseInt(this.queryObj.limit, 10) || 10;
    const offset = (page - 1) * limit;

    this.offset = offset;
    this.limit = limit;

    return this;
  }

  async execute(): Promise<{ meta: any; list: any[] }> {
    const { model, where, order, attributes, offset, limit, include } = this;

    const result = await model.findAndCountAll({
      where,
      order,
      attributes,
      offset,
      limit,
      include,
      distinct: true,
    });

    const meta = {
      page_size: limit,
      total: result.count,
      current_page: offset! / limit! + 1,
      last_page: offset! / limit!,
      total_pages: Math.ceil(result.count / limit!),
    };

    return {
      meta,
      list: result.rows,
    };
  }
}
