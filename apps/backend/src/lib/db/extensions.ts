import { customType } from 'drizzle-orm/pg-core';
import { TypeID } from 'typeid-js';

/**
 * This is a custom type for TypeID objects that allows them to be used in Drizzle.
 * It serializes the TypeID to a string and deserializes it back to a TypeID.
 *
 * NOTE: Due to the way the admin portal uses the DB result, using
 * the TypeID object directly will not work, so we use strings for now, might change this in the future.
 *
 * @param name The name of the column.
 * @param prefix The prefix of the TypeID.
 * @returns A custom type for TypeID objects.
 */
export const typeId = <TPrefix extends string>(name: string, prefix: TPrefix) =>
  customType<{
    data: string;
    driverData: string;
  }>({
    dataType() {
      return 'text';
    },
    toDriver(value: TypeID<TPrefix> | string): string {
      return value.toString();
    },
    fromDriver(value: string): string {
      return TypeID.fromString(value, prefix).toString();
    },
  })(name);
