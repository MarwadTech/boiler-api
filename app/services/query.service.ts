import { Query } from "@models";
import { CommonService } from "./common.service";
import { QueryProcessor } from "@libs";

export class QueryService extends CommonService<Query> {
  constructor() {
    super(Query);
  }
}
