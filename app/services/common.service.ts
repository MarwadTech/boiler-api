import { ApiError } from "@libs/responses";
import { Model, ModelStatic } from "sequelize";

/**
 * Define type for CRUD operations
 */
type Operations = "fetch" | "update" | "delete";

/**
 * Define options interface for service methods
 */
export interface Options {
  throwError?: boolean; // Whether to throw an error if operation fails
  operation?: Operations; // The type of operation being performed
  scope?: string; //scope for the data retrival
}

/**
 * Generic CommonService class
 */
export class CommonService<T extends Model> {
  protected model: ModelStatic<T>;

  /**
   * Constructor to initialize the model.
   * @param model - The Sequelize model to be used.
   */
  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  /**
   * Method to create a new record.
   * @param payload - The data to be used for creating the record.
   * @returns Promise - The created record.
   */
  protected create = async (payload: any): Promise<T> => {
    return this.model.create(payload);
  };

  /**
   * Method to retrieve a record by ID.
   * @param id - The ID of the record to retrieve.
   * @param options - Additional options such as whether to throw an error if record not found.
   * @returns Promise - The found record or null if not found.
   */
  protected getById = async (id: string, options?: Options): Promise<T | null> => {
    const row = await this.model.findByPk(id);
    // If record not found and throwError is true, throw an error
    if (!row && options?.throwError)
      throw new ApiError(404, `Failed to ${options?.operation || "fetch"} ${this.model.name.toLocaleLowerCase()}`, [{ field: "id", message: `${this.model.name} not found by id ${id}` }]);
    return row; // Return the found row or null
  };

  /**
   * Method to update a record by ID.
   * @param id - The ID of the record to update.
   * @param payload - The data to be used for updating the record.
   * @param options - Additional options such as whether to throw an error if record not found.
   * @returns Promise - The updated record or null if not found.
   */
  protected updateById = async (id: string, payload: any, options?: Options): Promise<T | null> => {
    const row = await this.getById(id, { ...options, operation: "update" });
    // If row found, update it with payload; otherwise, return null
    return row?.update(payload) || null;
  };

  /**
   * Method to delete a record by ID.
   * @param id - The ID of the record to delete.
   * @param options - Additional options such as whether to throw an error if record not found.
   * @returns Promise - The deleted record or null if not found.
   */
  protected deleteById = async (id: string, options?: Options): Promise<T | null> => {
    const row = await this.getById(id, { ...options, operation: "delete" });
    // If row found, delete it; otherwise, return null
    await row?.destroy();
    return row;
  };

  /**
   * Method to retrieve a single record based on filter criteria.
   * @param filter - The filter criteria to be used for finding the record.
   * @param options - Additional options such as whether to throw an error if record not found.
   * @returns Promise - The found record or null if not found.
   */
  protected get = async (filter: any, options?: Options): Promise<T | null> => {
    if (options?.scope) {
      var row = await this.model.scope(options.scope).findOne({ where: filter });
    } else {
      row = await this.model.findOne({ where: filter });
    }
    // If record not found and throwError is true, throw an error
    if (!row && options?.throwError) throw new ApiError(404, `${this.model.name} not found`);
    return row; // Return the found row or null
  };
}
