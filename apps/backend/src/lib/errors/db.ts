import { DatabaseError } from "pg";
import { BaseError, UnknownError } from "./generic";
import { DatabaseErrorCode } from "./codes";

export class EntityNotFoundError extends BaseError {
  constructor(entity = "Record", id = "unknown") {
    super(
      `${entity} with id ${id} not found`,
      DatabaseErrorCode.ENTITY_NOT_FOUND,
    );
  }
}

export class DatabaseConnectionError extends BaseError {
  constructor(message = "Failed to connect to database") {
    super(message, DatabaseErrorCode.CONNECTION_ERROR);
  }
}

export class QuerySyntaxError extends BaseError {
  constructor(message = "Invalid query syntax") {
    super(message, DatabaseErrorCode.QUERY_SYNTAX_ERROR);
  }
}

export class UniqueConstraintError extends BaseError {
  constructor(message = "Record with this value already exists") {
    super(message, DatabaseErrorCode.UNIQUE_CONSTRAINT_ERROR);
  }
}

export class ForeignKeyConstraintError extends BaseError {
  constructor(message = "Invalid reference to non-existent record") {
    super(message, DatabaseErrorCode.FOREIGN_KEY_ERROR);
  }
}

export class TransactionError extends BaseError {
  constructor(message = "Failed to complete transaction") {
    super(message, DatabaseErrorCode.TRANSACTION_ERROR);
  }
}

export class DatabaseAuthError extends BaseError {
  constructor(message = "Database authentication failed") {
    super(message, DatabaseErrorCode.AUTH_ERROR);
  }
}

export class PermissionError extends BaseError {
  constructor(message = "Permission denied") {
    super(message, DatabaseErrorCode.PERMISSION_ERROR);
  }
}

export class DatabaseTimeoutError extends BaseError {
  constructor(message = "Operation timed out") {
    super(message, DatabaseErrorCode.TIMEOUT_ERROR);
  }
}

export class BatchOperationError extends BaseError {
  constructor(message = "Batch operation partially failed") {
    super(message, DatabaseErrorCode.BATCH_ERROR);
  }
}

export class InsertError extends BaseError {
  constructor(message = "Failed to insert record") {
    super(message, DatabaseErrorCode.INSERT_ERROR);
  }
}

export class UpdateError extends BaseError {
  constructor(message = "Failed to update record") {
    super(message, DatabaseErrorCode.UPDATE_ERROR);
  }
}

export class NotNullError extends BaseError {
  constructor(message = "Value cannot be null") {
    super(message, DatabaseErrorCode.NOT_NULL_ERROR);
  }
}

/**
 * Maps PostgreSQL/Drizzle ORM errors to our custom error classes
 *
 * @param error The original error from Drizzle/Postgres
 * @returns A mapped custom error
 */
export function mapDrizzleError(
  error: DatabaseError | Error | undefined | null | unknown,
): BaseError {
  // Handle null or undefined errors
  if (
    !error ||
    !(error instanceof DatabaseError) ||
    !(error instanceof Error)
  ) {
    console.error(error);
    return new UnknownError("Unknown database error");
  }

  const errMsg = error.message || "";
  const errCode = "code" in error ? error.code : "";

  // Handle "not found" errors
  if (errMsg.includes("no rows returned") || errMsg.includes("not found")) {
    return new EntityNotFoundError("Entity", "unknown");
  }

  // PostgreSQL error codes mapping
  // See: https://www.postgresql.org/docs/current/errcodes-appendix.html
  switch (errCode) {
    // Connection errors
    case "08000": // connection_exception
    case "08003": // connection_does_not_exist
    case "08006": // connection_failure
    case "08001": // sqlclient_unable_to_establish_sqlconnection
    case "08004": // sqlserver_rejected_establishment_of_sqlconnection
      return new DatabaseConnectionError(errMsg);

    // Authentication errors
    case "28000": // invalid_authorization_specification
    case "28P01": // invalid_password
      return new DatabaseAuthError(errMsg);

    // Constraint violations
    case "23505": // unique_violation
      return new UniqueConstraintError(errMsg);

    case "23503": // foreign_key_violation
      return new ForeignKeyConstraintError(errMsg);

    case "23502": // not_null_violation
      return new NotNullError(errMsg);

    // Query syntax errors
    case "42601": // syntax_error
    case "42P01": // undefined_table
    case "42703": // undefined_column
      return new QuerySyntaxError(errMsg);

    // Transaction errors
    case "25P02": // in_failed_sql_transaction
    case "40001": // serialization_failure
    case "40P01": // deadlock_detected
      return new TransactionError(errMsg);

    // Permission errors
    case "42501": // insufficient_privilege
      return new PermissionError(errMsg);

    // Timeout errors
    case "57014": // query_canceled
    case "57P01": // admin_shutdown
    case "57P02": // crash_shutdown
    case "57P03": // cannot_connect_now
      return new DatabaseTimeoutError(errMsg);

    // Default: return the original error with improved context
    default:
      if (error instanceof BaseError) {
        return error;
      }
      if (error instanceof Error) {
        return new UnknownError(`Database error: ${error.message}`);
      }
      return new UnknownError(`Unknown database error: ${String(error)}`);
  }
}
