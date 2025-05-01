import { TypeID } from "typeid-js";
import type { auth } from "../lib/auth";

export type ApiContext = {
  Variables: {
    user:
      | (Omit<typeof auth.$Infer.Session.user, "id"> & {
          id: TypeID<"user">;
        })
      | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};
