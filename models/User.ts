import { FieldProps } from "https://deno.land/x/denodb@v1.0.18/lib/data-types.ts";
import { FieldMatchingTable } from "https://deno.land/x/denodb@v1.0.18/lib/model.ts";
import { DataTypes, Model } from "../utils/deps.ts";

const name: FieldProps = {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
};

const password: FieldProps = {
    type: DataTypes.STRING,
    allowNull: false
};
export class User extends Model {
    static table = "users";

    static timestamps = true;

    static fields = {
        _id: {
            primaryKey: true
        },
        name,
        password
    }
}